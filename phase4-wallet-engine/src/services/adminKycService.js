import { sequelize } from '../config/db.js';
import { KycRequest, User } from '../models/index.js';
import { AppError } from '../utils/appError.js';
import { logAdminActivity } from './adminActivityLogService.js';
import { markUserKyc } from './adminUserService.js';

const normalizeAction = (action) => String(action || '').trim().toLowerCase();

const parsePositiveId = (value, fieldName) => {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(`${fieldName} must be a positive integer`, 422);
  }
  return parsed;
};

export const getPendingKycRequests = async () => {
  return KycRequest.findAll({
    where: { status: 'pending' },
    include: [{ model: User, attributes: ['id', 'email'] }],
    order: [['id', 'ASC']]
  });
};

export const reviewKyc = async ({ kycId = null, userId = null, action, rejectionReason = '', adminId }) => {
  const normalizedAction = normalizeAction(action);
  if (!['approve', 'reject'].includes(normalizedAction)) {
    throw new AppError('action must be approve or reject', 422);
  }

  return sequelize.transaction(async (transaction) => {
    let kycRequest = null;

    if (kycId) {
      kycRequest = await KycRequest.findByPk(parsePositiveId(kycId, 'kyc_id'), {
        transaction,
        lock: transaction.LOCK.UPDATE
      });
    } else if (userId) {
      const normalizedUserId = parsePositiveId(userId, 'user_id');
      kycRequest = await KycRequest.findOne({
        where: { user_id: normalizedUserId, status: 'pending' },
        order: [['id', 'ASC']],
        transaction,
        lock: transaction.LOCK.UPDATE
      });
    } else {
      throw new AppError('kyc_id or user_id is required', 422);
    }

    if (!kycRequest) {
      throw new AppError('KYC request not found', 404);
    }

    if (kycRequest.status !== 'pending') {
      throw new AppError('KYC request already reviewed', 409);
    }

    if (normalizedAction === 'approve') {
      kycRequest.status = 'approved';
      kycRequest.rejection_reason = null;
      await markUserKyc({ userId: kycRequest.user_id, isVerified: true, transaction });

      await logAdminActivity({
        adminId,
        action: 'kyc_approve',
        targetId: kycRequest.user_id,
        metadata: { kyc_id: kycRequest.id, user_id: kycRequest.user_id },
        transaction
      });
    } else {
      const reason = String(rejectionReason || '').trim();
      if (!reason) {
        throw new AppError('rejection_reason is required on reject', 422);
      }

      kycRequest.status = 'rejected';
      kycRequest.rejection_reason = reason;
      await markUserKyc({ userId: kycRequest.user_id, isVerified: false, transaction });

      await logAdminActivity({
        adminId,
        action: 'kyc_reject',
        targetId: kycRequest.user_id,
        metadata: {
          kyc_id: kycRequest.id,
          user_id: kycRequest.user_id,
          rejection_reason: reason
        },
        transaction
      });
    }

    kycRequest.reviewed_by = adminId;
    kycRequest.updated_at = new Date();
    await kycRequest.save({ transaction });

    return kycRequest;
  });
};
