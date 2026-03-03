import { disableP2PAd, resolveP2PDispute } from '../services/adminP2PService.js';
import { sendSuccess } from '../utils/response.js';

export const disableP2PAdController = async (req, res, next) => {
  try {
    const result = await disableP2PAd({
      adId: req.body.ad_id,
      reason: req.body.reason,
      adminId: req.admin.id
    });

    return sendSuccess(res, 'P2P ad disabled', result);
  } catch (error) {
    return next(error);
  }
};

export const resolveP2PDisputeController = async (req, res, next) => {
  try {
    const result = await resolveP2PDispute({
      appealId: req.body.appeal_id,
      orderId: req.body.order_id,
      resolution: req.body.resolution,
      suspendSeller: req.body.suspend_seller,
      forceRelease: req.body.force_release,
      adminId: req.admin.id
    });

    return sendSuccess(res, 'P2P dispute resolved', result);
  } catch (error) {
    return next(error);
  }
};
