import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { handleVoiceUpload } from '../middleware/voiceUpload.js';
import { createSession, getSessionHistory, sendMessage } from '../services/liveSupportService.js';
import { AppError } from '../utils/appError.js';
import { sendSuccess } from '../utils/response.js';

const router = Router();

const getSessionIdFromBody = (body) => {
  const rawValue = body?.session_id ?? body?.sessionId;
  const parsed = Number.parseInt(String(rawValue || 0), 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError('session_id is required', 422);
  }

  return parsed;
};

router.post('/support/start', requireAuth, async (req, res, next) => {
  try {
    const session = await createSession(req.user?.id);

    const initialMessage = String(req.body?.message || '').trim();
    let messages = [];

    if (initialMessage) {
      const payload = await sendMessage({
        sessionId: session.id,
        senderType: 'user',
        senderId: req.user?.id,
        message: initialMessage
      });
      messages = payload.messages;
    }

    return sendSuccess(
      res,
      'Support chat session created',
      {
        session,
        messages
      },
      201
    );
  } catch (error) {
    return next(error);
  }
});

router.post('/support/send', requireAuth, handleVoiceUpload('voice'), async (req, res, next) => {
  try {
    const sessionId = getSessionIdFromBody(req.body);
    const voiceUrl = req.file ? `/uploads/support_voice/${req.file.filename}` : null;

    const payload = await sendMessage({
      sessionId,
      senderType: 'user',
      senderId: req.user?.id,
      message: req.body?.message,
      voiceUrl
    });

    return sendSuccess(res, 'Support message sent', payload, 201);
  } catch (error) {
    return next(error);
  }
});

router.get('/support/history/:sessionId', requireAuth, async (req, res, next) => {
  try {
    const payload = await getSessionHistory({
      sessionId: req.params.sessionId,
      requesterType: 'user',
      requesterId: req.user?.id
    });

    return sendSuccess(res, 'Support chat history fetched', payload);
  } catch (error) {
    return next(error);
  }
});

export default router;
