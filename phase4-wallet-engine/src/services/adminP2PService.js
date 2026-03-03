import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { AppError } from '../utils/appError.js';
import { updateUserSecurityState } from './adminUserService.js';
import { releaseEscrow } from './p2pService.js';
import { logAdminActivity } from './adminActivityLogService.js';

const parsePositiveId = (value, fieldName) => {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(`${fieldName} must be a positive integer`, 422);
  }
  return parsed;
};

export const disableP2PAd = async ({ adId, reason = '', adminId }) => {
  const normalizedAdId = parsePositiveId(adId, 'ad_id');

  const [result] = await sequelize.query(
    `UPDATE p2p_ads
     SET status = 'paused'
     WHERE id = :adId`,
    {
      type: QueryTypes.UPDATE,
      replacements: { adId: normalizedAdId }
    }
  );

  if (!result || (typeof result.affectedRows === 'number' && result.affectedRows === 0)) {
    throw new AppError('P2P ad not found', 404);
  }

  await logAdminActivity({
    adminId,
    action: 'p2p_disable_ad',
    targetId: normalizedAdId,
    metadata: {
      ad_id: normalizedAdId,
      reason: String(reason || '').trim() || null
    }
  });

  return {
    ad_id: normalizedAdId,
    status: 'paused'
  };
};

export const resolveP2PDispute = async ({ appealId = null, orderId = null, resolution = 'reject', suspendSeller = false, forceRelease = false, adminId }) => {
  const normalizedResolution = String(resolution || '').trim().toLowerCase();
  if (!['approve', 'reject', 'force_release'].includes(normalizedResolution)) {
    throw new AppError('resolution must be approve, reject, or force_release', 422);
  }

  let normalizedOrderId = null;
  if (orderId) {
    normalizedOrderId = parsePositiveId(orderId, 'order_id');
  }

  let normalizedAppealId = null;
  if (appealId) {
    normalizedAppealId = parsePositiveId(appealId, 'appeal_id');

    const appealRows = await sequelize.query(
      `SELECT order_id
       FROM p2p_appeals
       WHERE id = :appealId
       LIMIT 1`,
      {
        type: QueryTypes.SELECT,
        replacements: { appealId: normalizedAppealId }
      }
    );

    if (!appealRows?.[0]) {
      throw new AppError('P2P appeal not found', 404);
    }

    if (!normalizedOrderId) {
      normalizedOrderId = Number.parseInt(String(appealRows[0].order_id), 10);
    }
  }

  if (!normalizedOrderId) {
    throw new AppError('order_id or appeal_id is required', 422);
  }

  const orderRows = await sequelize.query(
    `SELECT id, seller_id, status
     FROM p2p_orders
     WHERE id = :orderId
     LIMIT 1`,
    {
      type: QueryTypes.SELECT,
      replacements: { orderId: normalizedOrderId }
    }
  );

  const order = orderRows?.[0] || null;
  if (!order) {
    throw new AppError('P2P order not found', 404);
  }

  const shouldForceRelease = forceRelease || normalizedResolution === 'force_release' || normalizedResolution === 'approve';

  let releaseResult = null;
  if (shouldForceRelease) {
    releaseResult = await releaseEscrow(normalizedOrderId);
  }

  if (normalizedAppealId) {
    await sequelize.query(
      `UPDATE p2p_appeals
       SET status = :status
       WHERE id = :appealId`,
      {
        type: QueryTypes.UPDATE,
        replacements: {
          appealId: normalizedAppealId,
          status: shouldForceRelease ? 'resolved' : 'rejected'
        }
      }
    );
  }

  if (suspendSeller) {
    await updateUserSecurityState({
      userId: order.seller_id,
      action: 'freeze',
      adminId
    });
  }

  await logAdminActivity({
    adminId,
    action: 'p2p_resolve_dispute',
    targetId: normalizedOrderId,
    metadata: {
      order_id: normalizedOrderId,
      appeal_id: normalizedAppealId,
      resolution: normalizedResolution,
      force_release: shouldForceRelease,
      suspend_seller: Boolean(suspendSeller)
    }
  });

  return {
    order_id: normalizedOrderId,
    appeal_id: normalizedAppealId,
    resolution: normalizedResolution,
    force_release: shouldForceRelease,
    suspended_seller: Boolean(suspendSeller),
    release_result: releaseResult
  };
};
