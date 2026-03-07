import { sequelize } from '../config/db.js';
import { AppError } from '../utils/appError.js';
import { SupportMessage, SupportTicket } from '../models/index.js';
import { getAIReply } from './aiSupportService.js';
import {
  sendEscalatedSupportAlert,
  sendNewSupportTicketAlert,
  sendTelegramAlert
} from './telegramSupportService.js';
import { notifyUser } from './pushNotificationService.js';

const DEFAULT_SUBJECT = 'General Support';

const ESCALATION_KEYWORDS = ['agent', 'human', 'urgent', 'escalate', 'complaint', 'fraud', 'stuck'];

const parsePositiveInt = (value, fieldName) => {
  const parsed = Number.parseInt(String(value || 0), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(`Invalid ${fieldName}`, 422);
  }
  return parsed;
};

const normalizeMessage = (value) => String(value || '').trim();

const shouldEscalate = (message) => {
  const normalized = normalizeMessage(message).toLowerCase();
  return ESCALATION_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const shapeTicket = (ticket) => ({
  id: ticket.id,
  user_id: ticket.user_id,
  subject: ticket.subject,
  status: ticket.status,
  is_escalated: Boolean(ticket.is_escalated),
  assigned_admin_id: ticket.assigned_admin_id,
  first_admin_response_at: ticket.first_admin_response_at,
  last_user_message_at: ticket.last_user_message_at,
  last_admin_message_at: ticket.last_admin_message_at,
  created_at: ticket.created_at,
  updated_at: ticket.updated_at
});

const shapeMessage = (message) => ({
  id: message.id,
  ticket_id: message.ticket_id,
  sender_type: message.sender_type,
  sender_id: message.sender_id,
  message: message.message,
  is_ai_generated: Boolean(message.is_ai_generated),
  created_at: message.created_at
});

const getUserTicket = async (ticketId, userId) => {
  const ticket = await SupportTicket.findOne({
    where: {
      id: ticketId,
      user_id: userId
    }
  });

  if (!ticket) {
    throw new AppError('Support ticket not found', 404);
  }

  return ticket;
};

const getTicketById = async (ticketId) => {
  const ticket = await SupportTicket.findByPk(ticketId);
  if (!ticket) {
    throw new AppError('Support ticket not found', 404);
  }
  return ticket;
};

const createBotReplyMessage = async ({ ticketId, transaction, replyText }) => {
  return SupportMessage.create(
    {
      ticket_id: ticketId,
      sender_type: 'bot',
      sender_id: null,
      message: replyText,
      is_ai_generated: true
    },
    { transaction }
  );
};

export const createSupportTicket = async ({ userId, subject, message }) => {
  const normalizedUserId = parsePositiveInt(userId, 'user_id');
  const normalizedMessage = normalizeMessage(message);

  if (!normalizedMessage) {
    throw new AppError('message is required', 422);
  }

  const normalizedSubject = normalizeMessage(subject) || DEFAULT_SUBJECT;
  const escalated = shouldEscalate(normalizedMessage);
  const botReply = await getAIReply(normalizedMessage);
  const now = new Date();

  const result = await sequelize.transaction(async (transaction) => {
    const ticket = await SupportTicket.create(
      {
        user_id: normalizedUserId,
        subject: normalizedSubject.slice(0, 255),
        status: 'open',
        is_escalated: escalated,
        last_user_message_at: now,
        updated_at: now
      },
      { transaction }
    );

    const userMessage = await SupportMessage.create(
      {
        ticket_id: ticket.id,
        sender_type: 'user',
        sender_id: normalizedUserId,
        message: normalizedMessage,
        is_ai_generated: false
      },
      { transaction }
    );

    const botMessage = await createBotReplyMessage({
      ticketId: ticket.id,
      transaction,
      replyText: botReply
    });

    return {
      ticket,
      userMessage,
      botMessage
    };
  });

  void sendNewSupportTicketAlert(result.ticket);

  if (escalated) {
    void sendEscalatedSupportAlert(result.ticket, 'Escalation keywords detected in first message');
  }

  return {
    ticket: shapeTicket(result.ticket),
    messages: [shapeMessage(result.userMessage), shapeMessage(result.botMessage)]
  };
};

export const addUserSupportMessage = async ({ ticketId, userId, message }) => {
  const normalizedTicketId = parsePositiveInt(ticketId, 'ticket_id');
  const normalizedUserId = parsePositiveInt(userId, 'user_id');
  const normalizedMessage = normalizeMessage(message);

  if (!normalizedMessage) {
    throw new AppError('message is required', 422);
  }

  const ticket = await getUserTicket(normalizedTicketId, normalizedUserId);
  if (ticket.status === 'closed') {
    throw new AppError('Ticket is already closed', 409);
  }

  const needsEscalation = shouldEscalate(normalizedMessage) && !ticket.is_escalated;
  const botReply = await getAIReply(normalizedMessage);
  const now = new Date();

  const result = await sequelize.transaction(async (transaction) => {
    const userMessage = await SupportMessage.create(
      {
        ticket_id: ticket.id,
        sender_type: 'user',
        sender_id: normalizedUserId,
        message: normalizedMessage,
        is_ai_generated: false
      },
      { transaction }
    );

    ticket.last_user_message_at = now;
    ticket.waiting_alert_sent_at = null;
    ticket.updated_at = now;

    if (needsEscalation) {
      ticket.is_escalated = true;
    }

    await ticket.save({ transaction });

    const botMessage = await createBotReplyMessage({
      ticketId: ticket.id,
      transaction,
      replyText: botReply
    });

    return {
      userMessage,
      botMessage
    };
  });

  if (needsEscalation) {
    void sendEscalatedSupportAlert(ticket, 'Escalation keywords detected in user follow-up message');
  }

  return {
    ticket: shapeTicket(ticket),
    messages: [shapeMessage(result.userMessage), shapeMessage(result.botMessage)]
  };
};

export const getSupportTicketMessages = async ({ ticketId, userId }) => {
  const normalizedTicketId = parsePositiveInt(ticketId, 'ticket_id');
  const normalizedUserId = parsePositiveInt(userId, 'user_id');

  const ticket = await getUserTicket(normalizedTicketId, normalizedUserId);
  const messages = await SupportMessage.findAll({
    where: {
      ticket_id: ticket.id
    },
    order: [['id', 'ASC']]
  });

  return {
    ticket: shapeTicket(ticket),
    messages: messages.map(shapeMessage)
  };
};

export const joinSupportTicket = async ({ ticketId, adminId }) => {
  const normalizedTicketId = parsePositiveInt(ticketId, 'ticket_id');
  const normalizedAdminId = parsePositiveInt(adminId, 'admin_id');

  const ticket = await getTicketById(normalizedTicketId);
  if (ticket.status === 'closed') {
    throw new AppError('Ticket is already closed', 409);
  }

  const now = new Date();

  ticket.status = 'in_progress';
  ticket.assigned_admin_id = normalizedAdminId;
  ticket.last_admin_message_at = now;
  ticket.updated_at = now;

  await ticket.save();

  await notifyUser(ticket.user_id, 'A support agent has joined your ticket.', {
    event: 'agent_joined',
    ticket_id: ticket.id
  });

  await sendTelegramAlert(`[SUPPORT][AGENT_JOINED] Ticket #${ticket.id} joined by admin ${normalizedAdminId}`);

  return shapeTicket(ticket);
};

export const replyToSupportTicket = async ({ ticketId, adminId, message }) => {
  const normalizedTicketId = parsePositiveInt(ticketId, 'ticket_id');
  const normalizedAdminId = parsePositiveInt(adminId, 'admin_id');
  const normalizedMessage = normalizeMessage(message);

  if (!normalizedMessage) {
    throw new AppError('message is required', 422);
  }

  const ticket = await getTicketById(normalizedTicketId);
  if (ticket.status === 'closed') {
    throw new AppError('Ticket is already closed', 409);
  }

  const now = new Date();

  const reply = await sequelize.transaction(async (transaction) => {
    const messageRow = await SupportMessage.create(
      {
        ticket_id: ticket.id,
        sender_type: 'admin',
        sender_id: normalizedAdminId,
        message: normalizedMessage,
        is_ai_generated: false
      },
      { transaction }
    );

    ticket.status = 'in_progress';
    ticket.assigned_admin_id = normalizedAdminId;
    ticket.last_admin_message_at = now;
    ticket.updated_at = now;

    if (!ticket.first_admin_response_at) {
      ticket.first_admin_response_at = now;
    }

    await ticket.save({ transaction });
    return messageRow;
  });

  await notifyUser(ticket.user_id, normalizedMessage, {
    event: 'agent_reply',
    ticket_id: ticket.id,
    admin_id: normalizedAdminId
  });

  return {
    ticket: shapeTicket(ticket),
    message: shapeMessage(reply)
  };
};

export const closeSupportTicket = async ({ ticketId, adminId, closingMessage }) => {
  const normalizedTicketId = parsePositiveInt(ticketId, 'ticket_id');
  const normalizedAdminId = parsePositiveInt(adminId, 'admin_id');
  const normalizedClosingMessage = normalizeMessage(closingMessage);

  const ticket = await getTicketById(normalizedTicketId);
  if (ticket.status === 'closed') {
    return {
      ticket: shapeTicket(ticket),
      message: null
    };
  }

  const now = new Date();

  const result = await sequelize.transaction(async (transaction) => {
    let closingMessageRow = null;

    if (normalizedClosingMessage) {
      closingMessageRow = await SupportMessage.create(
        {
          ticket_id: ticket.id,
          sender_type: 'admin',
          sender_id: normalizedAdminId,
          message: normalizedClosingMessage,
          is_ai_generated: false
        },
        { transaction }
      );
    }

    ticket.status = 'closed';
    ticket.assigned_admin_id = normalizedAdminId;
    ticket.last_admin_message_at = now;
    ticket.updated_at = now;

    if (!ticket.first_admin_response_at) {
      ticket.first_admin_response_at = now;
    }

    await ticket.save({ transaction });

    return {
      closingMessageRow
    };
  });

  await notifyUser(ticket.user_id, 'Your support ticket has been closed.', {
    event: 'ticket_closed',
    ticket_id: ticket.id,
    admin_id: normalizedAdminId
  });

  return {
    ticket: shapeTicket(ticket),
    message: result.closingMessageRow ? shapeMessage(result.closingMessageRow) : null
  };
};
