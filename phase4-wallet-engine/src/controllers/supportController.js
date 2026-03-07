import { AppError } from '../utils/appError.js';
import { sendSuccess } from '../utils/response.js';
import {
  addUserSupportMessage,
  closeSupportTicket,
  createSupportTicket,
  getSupportTicketMessages,
  joinSupportTicket,
  replyToSupportTicket
} from '../services/supportService.js';

const parseTicketId = (value) => {
  const parsed = Number.parseInt(String(value || 0), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError('Invalid ticket_id', 422);
  }
  return parsed;
};

export const createSupportTicketController = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const payload = await createSupportTicket({
      userId,
      subject: req.body.subject,
      message: req.body.message
    });

    return sendSuccess(res, 'Support ticket created', payload, 201);
  } catch (error) {
    return next(error);
  }
};

export const sendSupportMessageController = async (req, res, next) => {
  try {
    const payload = await addUserSupportMessage({
      ticketId: parseTicketId(req.params.ticketId),
      userId: req.user?.id,
      message: req.body.message
    });

    return sendSuccess(res, 'Support message processed', payload);
  } catch (error) {
    return next(error);
  }
};

export const getSupportMessagesController = async (req, res, next) => {
  try {
    const payload = await getSupportTicketMessages({
      ticketId: parseTicketId(req.params.ticketId),
      userId: req.user?.id
    });

    return sendSuccess(res, 'Support messages fetched', payload);
  } catch (error) {
    return next(error);
  }
};

export const joinSupportTicketController = async (req, res, next) => {
  try {
    const ticket = await joinSupportTicket({
      ticketId: parseTicketId(req.params.ticketId),
      adminId: req.admin?.id
    });

    return sendSuccess(res, 'Support ticket joined', { ticket });
  } catch (error) {
    return next(error);
  }
};

export const replySupportTicketController = async (req, res, next) => {
  try {
    const payload = await replyToSupportTicket({
      ticketId: parseTicketId(req.params.ticketId),
      adminId: req.admin?.id,
      message: req.body.message
    });

    return sendSuccess(res, 'Support reply sent', payload);
  } catch (error) {
    return next(error);
  }
};

export const closeSupportTicketController = async (req, res, next) => {
  try {
    const payload = await closeSupportTicket({
      ticketId: parseTicketId(req.params.ticketId),
      adminId: req.admin?.id,
      closingMessage: req.body.message
    });

    return sendSuccess(res, 'Support ticket closed', payload);
  } catch (error) {
    return next(error);
  }
};
