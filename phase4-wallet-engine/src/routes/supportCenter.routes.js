import { Router } from 'express';
import {
  askSupportChatbot,
  getAnnouncementsForPopup,
  getCryptoStatusMatrix,
  getHelpCenterTopics,
  getSubmitCaseConfig,
  submitHelpFeedback,
  submitSupportCase
} from '../services/supportCenterService.js';
import { sendSuccess } from '../utils/response.js';

const router = Router();

const asBool = (value) => {
  const normalized = String(value || '')
    .trim()
    .toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
};

router.get('/support-center/help/topics', async (req, res, next) => {
  try {
    const payload = await getHelpCenterTopics(String(req.query.q || ''));
    return sendSuccess(res, 'Help center topics fetched', payload);
  } catch (error) {
    return next(error);
  }
});

router.get('/support-center/case/config', async (req, res, next) => {
  try {
    return sendSuccess(res, 'Submit case config fetched', getSubmitCaseConfig());
  } catch (error) {
    return next(error);
  }
});

router.post('/support-center/case/submit', async (req, res, next) => {
  try {
    const payload = await submitSupportCase(req.body || {});
    return sendSuccess(res, 'Support request submitted', payload, 201);
  } catch (error) {
    return next(error);
  }
});

router.post('/support-center/help/feedback', async (req, res, next) => {
  try {
    const payload = await submitHelpFeedback({
      articleId: req.body.article_id,
      userId: req.body.user_id,
      isHelpful: req.body.is_helpful
    });
    return sendSuccess(res, 'Feedback submitted', payload, 201);
  } catch (error) {
    return next(error);
  }
});

router.get('/support-center/crypto/status', async (req, res, next) => {
  try {
    const payload = await getCryptoStatusMatrix({
      search: String(req.query.search || ''),
      hideSuspended: asBool(req.query.hide_suspended),
      onlySuspended: asBool(req.query.only_suspended)
    });
    return sendSuccess(res, 'Crypto status fetched', payload);
  } catch (error) {
    return next(error);
  }
});

router.get('/support-center/announcements/active', async (req, res, next) => {
  try {
    const payload = await getAnnouncementsForPopup();
    return sendSuccess(res, 'Announcements fetched', payload);
  } catch (error) {
    return next(error);
  }
});

router.post('/support-center/chatbot/query', async (req, res, next) => {
  try {
    const payload = await askSupportChatbot(String(req.body.message || ''));
    return sendSuccess(res, 'Chatbot response generated', payload);
  } catch (error) {
    return next(error);
  }
});

export default router;

