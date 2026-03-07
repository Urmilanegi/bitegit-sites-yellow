import { Router } from 'express';
import { requireAdminAuth } from '../middleware/adminAuth.js';
import { requireAdminRoles } from '../middleware/adminRole.js';
import { handleVoiceUpload } from '../middleware/voiceUpload.js';
import {
  assignAdmin,
  closeSession,
  getActiveSupportRequests,
  getSessionHistory,
  getSupportDashboard,
  sendMessage
} from '../services/liveSupportService.js';
import { AppError } from '../utils/appError.js';
import { sendSuccess } from '../utils/response.js';

const router = Router();
const allowSupportAndSuper = requireAdminRoles('super_admin', 'support_admin');

const getSessionIdFromBody = (body) => {
  const rawValue = body?.session_id ?? body?.sessionId;
  const parsed = Number.parseInt(String(rawValue || 0), 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError('session_id is required', 422);
  }

  return parsed;
};

router.get('/admin/support/requests', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const dashboard = await getSupportDashboard();
    return sendSuccess(res, 'Support dashboard fetched', dashboard);
  } catch (error) {
    return next(error);
  }
});

router.get('/admin/support/history/:sessionId', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const payload = await getSessionHistory({
      sessionId: req.params.sessionId,
      requesterType: 'admin',
      requesterId: req.admin?.id
    });

    return sendSuccess(res, 'Support chat history fetched', payload);
  } catch (error) {
    return next(error);
  }
});

router.post('/admin/support/join', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const session = await assignAdmin(getSessionIdFromBody(req.body), req.admin?.id);

    return sendSuccess(res, 'Support chat assigned', {
      session
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/admin/support/reply', requireAdminAuth, allowSupportAndSuper, handleVoiceUpload('voice'), async (req, res, next) => {
  try {
    const sessionId = getSessionIdFromBody(req.body);
    const voiceUrl = req.file ? `/uploads/support_voice/${req.file.filename}` : null;

    const payload = await sendMessage({
      sessionId,
      senderType: 'admin',
      senderId: req.admin?.id,
      message: req.body?.message,
      voiceUrl
    });

    return sendSuccess(res, 'Support reply sent', payload, 201);
  } catch (error) {
    return next(error);
  }
});

router.post('/admin/support/close', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const session = await closeSession(getSessionIdFromBody(req.body), req.admin?.id);

    return sendSuccess(res, 'Support chat closed', {
      session
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/admin/support/requests/active', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const rows = await getActiveSupportRequests(100);
    return sendSuccess(res, 'Active support chats fetched', {
      active_chats: rows
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
