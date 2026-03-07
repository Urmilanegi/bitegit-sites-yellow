import { Op } from 'sequelize';
import { sequelize } from '../config/db.js';
import { SupportChatMessage, SupportSession } from '../models/index.js';
import { AppError } from '../utils/appError.js';
import { generateAutoReply } from './aiSupportService.js';
import { notifyUser } from './pushNotificationService.js';
import { emitSupportEvent, SUPPORT_EVENTS } from './supportRealtimeBus.js';

const ACTIVE_SESSION_STATUSES = ['open', 'assigned'];
const VALID_SENDER_TYPES = new Set(['user', 'admin', 'ai']);

const parsePositiveInt = (value, fieldName) => {
  const parsed = Number.parseInt(String(value || 0), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(`Invalid ${fieldName}`, 422);
  }
  return parsed;
};

const normalizeText = (value) => String(value || '').trim();

const shapeSession = (session) => ({
  id: session.id,
  user_id: session.user_id,
  status: session.status,
  assigned_admin_id: session.assigned_admin_id,
  created_at: session.created_at,
  updated_at: session.updated_at
});

const shapeMessage = (message) => ({
  id: message.id,
  session_id: message.session_id,
  sender_type: message.sender_type,
  message: message.message,
  voice_url: message.voice_url,
  created_at: message.created_at
});

const getSessionById = async (sessionId) => {
  const session = await SupportSession.findByPk(sessionId);
  if (!session) {
    throw new AppError('Support session not found', 404);
  }
  return session;
};

const assertSessionAccess = (session, requesterType, requesterId) => {
  if (requesterType === 'user' && Number(session.user_id) !== Number(requesterId)) {
    throw new AppError('You are not allowed to access this support session', 403);
  }
};

const buildVoicePath = (voiceUrl) => {
  const value = normalizeText(voiceUrl);
  return value || null;
};

const shouldGenerateAIReply = (session, senderType) => {
  if (senderType !== 'user') {
    return false;
  }

  if (session.status === 'closed') {
    return false;
  }

  return !session.assigned_admin_id && session.status !== 'assigned';
};

const emitMessages = (messages) => {
  for (const message of messages) {
    emitSupportEvent(SUPPORT_EVENTS.CHAT_NEW_MESSAGE, {
      session_id: message.session_id,
      message
    });
  }
};

export const createSession = async (userId) => {
  const normalizedUserId = parsePositiveInt(userId, 'user_id');

  const session = await SupportSession.create({
    user_id: normalizedUserId,
    status: 'open',
    assigned_admin_id: null,
    created_at: new Date(),
    updated_at: new Date()
  });

  const shapedSession = shapeSession(session);

  emitSupportEvent(SUPPORT_EVENTS.NEW_SUPPORT_REQUEST, {
    session: shapedSession
  });

  emitSupportEvent(SUPPORT_EVENTS.CHAT_SESSION_CREATED, {
    session: shapedSession
  });

  return shapedSession;
};

export const sendMessage = async ({ sessionId, senderType, senderId = null, message, voiceUrl = null }) => {
  const normalizedSessionId = parsePositiveInt(sessionId, 'session_id');
  const normalizedSenderType = String(senderType || '').trim().toLowerCase();

  if (!VALID_SENDER_TYPES.has(normalizedSenderType)) {
    throw new AppError('Invalid sender_type', 422);
  }

  const normalizedMessage = normalizeText(message);
  const normalizedVoiceUrl = buildVoicePath(voiceUrl);

  if (!normalizedMessage && !normalizedVoiceUrl) {
    throw new AppError('message or voice file is required', 422);
  }

  const session = await getSessionById(normalizedSessionId);
  if (session.status === 'closed') {
    throw new AppError('Support session is already closed', 409);
  }

  if (normalizedSenderType === 'user') {
    const normalizedSenderId = parsePositiveInt(senderId, 'sender_id');
    if (Number(session.user_id) !== normalizedSenderId) {
      throw new AppError('You are not allowed to send messages in this support session', 403);
    }
  }

  let normalizedAdminId = null;
  if (normalizedSenderType === 'admin') {
    normalizedAdminId = parsePositiveInt(senderId, 'sender_id');
  }

  const now = new Date();
  const allowAIForMessage = shouldGenerateAIReply(session, normalizedSenderType);

  const { primaryMessage } = await sequelize.transaction(async (transaction) => {
    const insertedPrimaryMessage = await SupportChatMessage.create(
      {
        session_id: session.id,
        sender_type: normalizedSenderType,
        message: normalizedMessage || null,
        voice_url: normalizedVoiceUrl,
        created_at: now
      },
      { transaction }
    );

    if (normalizedSenderType === 'admin') {
      session.status = 'assigned';
      session.assigned_admin_id = normalizedAdminId;
    }

    session.updated_at = now;
    await session.save({ transaction });

    return {
      primaryMessage: insertedPrimaryMessage
    };
  });

  const insertedMessages = [primaryMessage];

  if (allowAIForMessage) {
    const refreshedSession = await getSessionById(session.id);

    if (shouldGenerateAIReply(refreshedSession, 'user')) {
      const prompt = normalizedMessage || 'User sent a voice message and needs help from support.';
      const aiReply = await generateAutoReply(prompt);
      const aiMessage = await SupportChatMessage.create({
        session_id: session.id,
        sender_type: 'ai',
        message: aiReply,
        voice_url: null,
        created_at: new Date()
      });

      refreshedSession.updated_at = new Date();
      await refreshedSession.save();
      insertedMessages.push(aiMessage);
    }
  }

  const refreshedSession = await getSessionById(session.id);
  const shapedSession = shapeSession(refreshedSession);
  const shapedMessages = insertedMessages.map(shapeMessage);

  if (normalizedSenderType === 'admin') {
    const notificationText =
      normalizedMessage || (normalizedVoiceUrl ? 'Support sent you a voice message.' : 'Support replied to your chat.');

    await notifyUser(session.user_id, notificationText, {
      event: 'support_admin_replied',
      session_id: session.id,
      sender_type: 'admin'
    });
  }

  emitMessages(shapedMessages);
  emitSupportEvent(SUPPORT_EVENTS.CHAT_SESSION_UPDATED, {
    session: shapedSession
  });

  return {
    session: shapedSession,
    messages: shapedMessages
  };
};

export const assignAdmin = async (sessionId, adminId) => {
  const normalizedSessionId = parsePositiveInt(sessionId, 'session_id');
  const normalizedAdminId = parsePositiveInt(adminId, 'admin_id');

  const session = await getSessionById(normalizedSessionId);
  if (session.status === 'closed') {
    throw new AppError('Support session is already closed', 409);
  }

  session.status = 'assigned';
  session.assigned_admin_id = normalizedAdminId;
  session.updated_at = new Date();
  await session.save();

  const shapedSession = shapeSession(session);

  await notifyUser(session.user_id, 'Support agent has joined your chat.', {
    event: 'support_admin_joined',
    session_id: session.id,
    admin_id: normalizedAdminId
  });

  emitSupportEvent(SUPPORT_EVENTS.CHAT_SESSION_UPDATED, {
    session: shapedSession
  });

  return shapedSession;
};

export const closeSession = async (sessionId, adminId = null) => {
  const normalizedSessionId = parsePositiveInt(sessionId, 'session_id');
  const normalizedAdminId =
    adminId === null || adminId === undefined ? null : parsePositiveInt(adminId, 'admin_id');

  const session = await getSessionById(normalizedSessionId);
  if (session.status !== 'closed') {
    session.status = 'closed';
    session.assigned_admin_id = normalizedAdminId || session.assigned_admin_id;
    session.updated_at = new Date();
    await session.save();
  }

  const shapedSession = shapeSession(session);

  await notifyUser(session.user_id, 'Your support chat has been closed.', {
    event: 'support_chat_closed',
    session_id: session.id,
    admin_id: normalizedAdminId
  });

  emitSupportEvent(SUPPORT_EVENTS.CHAT_SESSION_UPDATED, {
    session: shapedSession
  });

  return shapedSession;
};

export const getSessionHistory = async ({ sessionId, requesterType, requesterId }) => {
  const normalizedSessionId = parsePositiveInt(sessionId, 'session_id');
  const normalizedRequesterType = String(requesterType || '').trim().toLowerCase();

  if (!['user', 'admin'].includes(normalizedRequesterType)) {
    throw new AppError('Invalid requester_type', 422);
  }

  const session = await getSessionById(normalizedSessionId);
  if (normalizedRequesterType === 'user') {
    const normalizedRequesterId = parsePositiveInt(requesterId, 'requester_id');
    assertSessionAccess(session, 'user', normalizedRequesterId);
  }

  const messages = await SupportChatMessage.findAll({
    where: { session_id: session.id },
    order: [['id', 'ASC']]
  });

  return {
    session: shapeSession(session),
    messages: messages.map(shapeMessage)
  };
};

export const getActiveSupportRequests = async (limit = 100) => {
  const cappedLimit = Math.max(1, Math.min(Number.parseInt(String(limit || 100), 10) || 100, 300));

  const sessions = await SupportSession.findAll({
    where: {
      status: {
        [Op.in]: ACTIVE_SESSION_STATUSES
      }
    },
    order: [
      ['updated_at', 'DESC'],
      ['id', 'DESC']
    ],
    limit: cappedLimit
  });

  const sessionIds = sessions.map((session) => session.id);
  const latestMessagesBySession = new Map();

  if (sessionIds.length > 0) {
    const latestMessages = await SupportChatMessage.findAll({
      where: {
        session_id: {
          [Op.in]: sessionIds
        }
      },
      order: [['id', 'DESC']]
    });

    for (const message of latestMessages) {
      if (!latestMessagesBySession.has(message.session_id)) {
        latestMessagesBySession.set(message.session_id, message);
      }
    }
  }

  return sessions.map((session) => {
    const latestMessage = latestMessagesBySession.get(session.id);
    return {
      ...shapeSession(session),
      latest_message: latestMessage ? shapeMessage(latestMessage) : null
    };
  });
};

export const getSupportDashboard = async () => {
  const [totalSessions, openSessions, assignedSessions, closedSessions, activeChats] = await Promise.all([
    SupportSession.count(),
    SupportSession.count({ where: { status: 'open' } }),
    SupportSession.count({ where: { status: 'assigned' } }),
    SupportSession.count({ where: { status: 'closed' } }),
    getActiveSupportRequests(100)
  ]);

  return {
    total_sessions: Number(totalSessions || 0),
    open_sessions: Number(openSessions || 0),
    assigned_sessions: Number(assignedSessions || 0),
    closed_sessions: Number(closedSessions || 0),
    active_chats: activeChats
  };
};
