import jwt from 'jsonwebtoken';
import { verifyAdminToken, getAdminByPayload } from '../services/adminAuthService.js';
import { AppError } from '../utils/appError.js';
import { assignAdmin, closeSession, createSession, sendMessage } from '../services/liveSupportService.js';
import { SUPPORT_EVENTS, subscribeSupportEvent } from '../services/supportRealtimeBus.js';

const SUPPORT_ADMINS_ROOM = 'support:admins';

const getAck = (ack) => (typeof ack === 'function' ? ack : () => {});

const sessionRoom = (sessionId) => `support:session:${sessionId}`;
const userRoom = (userId) => `support:user:${userId}`;

const parsePositiveInt = (value, fieldName) => {
  const parsed = Number.parseInt(String(value || 0), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(`Invalid ${fieldName}`, 422);
  }
  return parsed;
};

const extractAuthToken = (socket) => {
  const fromHandshakeAuth = String(socket.handshake?.auth?.token || '').trim();
  if (fromHandshakeAuth) {
    return fromHandshakeAuth;
  }

  const fromHeader = String(socket.handshake?.headers?.authorization || '');
  if (fromHeader.startsWith('Bearer ')) {
    return fromHeader.slice(7);
  }

  return '';
};

const authenticateSupportSocket = async (socket) => {
  const requestedRole = String(socket.handshake?.auth?.role || socket.handshake?.query?.role || '')
    .trim()
    .toLowerCase();

  const token = extractAuthToken(socket);
  if (!token) {
    throw new AppError('Socket token missing', 401);
  }

  if (requestedRole === 'admin') {
    const payload = verifyAdminToken(token);
    if (payload?.scope !== 'admin') {
      throw new AppError('Invalid admin socket token scope', 401);
    }

    const admin = await getAdminByPayload(payload);
    return {
      role: 'admin',
      adminId: admin.id,
      userId: null
    };
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const userId = parsePositiveInt(payload?.id, 'user_id');

  return {
    role: 'user',
    userId,
    adminId: null
  };
};

const emitAckError = (ack, error) => {
  const message = error instanceof AppError ? error.message : 'Unexpected support socket error';
  getAck(ack)({ ok: false, error: message });
};

export const initSupportSocketServer = (io) => {
  io.use(async (socket, next) => {
    try {
      socket.data.supportAuth = await authenticateSupportSocket(socket);
      return next();
    } catch (error) {
      return next(error instanceof Error ? error : new Error('Socket authentication failed'));
    }
  });

  const unsubs = [
    subscribeSupportEvent(SUPPORT_EVENTS.NEW_SUPPORT_REQUEST, (payload) => {
      io.to(SUPPORT_ADMINS_ROOM).emit(SUPPORT_EVENTS.NEW_SUPPORT_REQUEST, payload);
    }),
    subscribeSupportEvent(SUPPORT_EVENTS.CHAT_SESSION_CREATED, (payload) => {
      const sessionId = payload?.session?.id;
      const userId = payload?.session?.user_id;

      if (sessionId) {
        io.to(sessionRoom(sessionId)).emit(SUPPORT_EVENTS.CHAT_SESSION_CREATED, payload);
      }
      if (userId) {
        io.to(userRoom(userId)).emit(SUPPORT_EVENTS.CHAT_SESSION_CREATED, payload);
      }
      io.to(SUPPORT_ADMINS_ROOM).emit(SUPPORT_EVENTS.CHAT_SESSION_CREATED, payload);
    }),
    subscribeSupportEvent(SUPPORT_EVENTS.CHAT_NEW_MESSAGE, (payload) => {
      const sessionId = payload?.session_id;
      if (!sessionId) {
        return;
      }

      io.to(sessionRoom(sessionId)).emit(SUPPORT_EVENTS.CHAT_NEW_MESSAGE, payload);
      io.to(SUPPORT_ADMINS_ROOM).emit(SUPPORT_EVENTS.CHAT_NEW_MESSAGE, payload);
    }),
    subscribeSupportEvent(SUPPORT_EVENTS.CHAT_SESSION_UPDATED, (payload) => {
      const sessionId = payload?.session?.id;
      const userId = payload?.session?.user_id;

      if (sessionId) {
        io.to(sessionRoom(sessionId)).emit(SUPPORT_EVENTS.CHAT_SESSION_UPDATED, payload);
      }
      if (userId) {
        io.to(userRoom(userId)).emit(SUPPORT_EVENTS.CHAT_SESSION_UPDATED, payload);
      }
      io.to(SUPPORT_ADMINS_ROOM).emit(SUPPORT_EVENTS.CHAT_SESSION_UPDATED, payload);
    })
  ];

  io.on('connection', (socket) => {
    const auth = socket.data.supportAuth || {};

    if (auth.role === 'admin') {
      socket.join(SUPPORT_ADMINS_ROOM);
    }

    if (auth.role === 'user' && auth.userId) {
      socket.join(userRoom(auth.userId));
    }

    socket.on('user:start_chat', async (payload = {}, ack) => {
      try {
        if (auth.role !== 'user') {
          throw new AppError('Only users can start support chat', 403);
        }

        const createdSession = await createSession(auth.userId);
        socket.join(sessionRoom(createdSession.id));

        let initialMessages = [];
        const initialText = String(payload?.message || '').trim();

        if (initialText) {
          const sent = await sendMessage({
            sessionId: createdSession.id,
            senderType: 'user',
            senderId: auth.userId,
            message: initialText
          });
          initialMessages = sent.messages;
        }

        getAck(ack)({
          ok: true,
          data: {
            session: createdSession,
            messages: initialMessages
          }
        });
      } catch (error) {
        emitAckError(ack, error);
      }
    });

    socket.on('user:send_message', async (payload = {}, ack) => {
      try {
        if (auth.role !== 'user') {
          throw new AppError('Only users can send support messages', 403);
        }

        const sessionId = parsePositiveInt(payload?.session_id ?? payload?.sessionId, 'session_id');
        socket.join(sessionRoom(sessionId));

        const result = await sendMessage({
          sessionId,
          senderType: 'user',
          senderId: auth.userId,
          message: payload?.message,
          voiceUrl: payload?.voice_url
        });

        getAck(ack)({ ok: true, data: result });
      } catch (error) {
        emitAckError(ack, error);
      }
    });

    socket.on('admin:join_chat', async (payload = {}, ack) => {
      try {
        if (auth.role !== 'admin') {
          throw new AppError('Only admins can join support chats', 403);
        }

        const sessionId = parsePositiveInt(payload?.session_id ?? payload?.sessionId, 'session_id');
        const session = await assignAdmin(sessionId, auth.adminId);
        socket.join(sessionRoom(session.id));

        getAck(ack)({ ok: true, data: { session } });
      } catch (error) {
        emitAckError(ack, error);
      }
    });

    socket.on('admin:send_message', async (payload = {}, ack) => {
      try {
        if (auth.role !== 'admin') {
          throw new AppError('Only admins can send support replies', 403);
        }

        const sessionId = parsePositiveInt(payload?.session_id ?? payload?.sessionId, 'session_id');
        socket.join(sessionRoom(sessionId));

        const result = await sendMessage({
          sessionId,
          senderType: 'admin',
          senderId: auth.adminId,
          message: payload?.message,
          voiceUrl: payload?.voice_url
        });

        getAck(ack)({ ok: true, data: result });
      } catch (error) {
        emitAckError(ack, error);
      }
    });

    socket.on('admin:close_chat', async (payload = {}, ack) => {
      try {
        if (auth.role !== 'admin') {
          throw new AppError('Only admins can close support chats', 403);
        }

        const sessionId = parsePositiveInt(payload?.session_id ?? payload?.sessionId, 'session_id');
        const session = await closeSession(sessionId, auth.adminId);

        getAck(ack)({
          ok: true,
          data: {
            session
          }
        });
      } catch (error) {
        emitAckError(ack, error);
      }
    });
  });

  return () => {
    for (const unsubscribe of unsubs) {
      try {
        unsubscribe();
      } catch {
        // no-op
      }
    }
  };
};
