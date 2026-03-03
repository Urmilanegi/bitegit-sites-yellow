import { getPendingKycRequests, reviewKyc } from '../services/adminKycService.js';
import { sendSuccess } from '../utils/response.js';

export const getPendingKycController = async (req, res, next) => {
  try {
    const requests = await getPendingKycRequests();
    return sendSuccess(res, 'Pending KYC requests fetched', { requests });
  } catch (error) {
    return next(error);
  }
};

export const reviewKycController = async (req, res, next) => {
  try {
    const result = await reviewKyc({
      kycId: req.body.kyc_id,
      userId: req.body.user_id,
      action: req.body.action,
      rejectionReason: req.body.rejection_reason,
      adminId: req.admin.id
    });

    return sendSuccess(res, 'KYC request reviewed', { request: result });
  } catch (error) {
    return next(error);
  }
};
