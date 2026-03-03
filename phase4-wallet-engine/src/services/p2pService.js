import Decimal from 'decimal.js';
import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Wallet } from '../models/index.js';
import { AppError } from '../utils/appError.js';
import { assertPositiveAmount, toDecimal, toDbValue } from '../utils/decimal.js';

const SUPPORTED_COIN = 'USDT';
const ORDER_EXPIRY_MINUTES = Math.max(
  1,
  Number.parseInt(String(process.env.P2P_ORDER_EXPIRY_MINUTES || '15'), 10) || 15
);
const DB_LOCK_TIMEOUT_SECONDS = Math.max(
  1,
  Number.parseInt(String(process.env.P2P_DB_LOCK_TIMEOUT_SECONDS || '8'), 10) || 8
);
const CRON_BATCH_LIMIT = Math.max(
  1,
  Number.parseInt(String(process.env.P2P_CRON_BATCH_LIMIT || '100'), 10) || 100
);

const localLocks = new Set();

const parsePositiveInteger = (value, fieldName) => {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(`${fieldName} must be a positive integer`, 422);
  }
  return parsed;
};

const normalizeAdType = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized !== 'buy' && normalized !== 'sell') {
    throw new AppError('type must be either buy or sell', 422);
  }
  return normalized;
};

const readScalarFromRow = (row) => {
  if (!row || typeof row !== 'object') {
    return 0;
  }
  const first = Object.values(row)[0];
  const num = Number(first);
  return Number.isFinite(num) ? num : 0;
};

const acquireDbLock = async (lockKey, timeoutSeconds = DB_LOCK_TIMEOUT_SECONDS) => {
  const rows = await sequelize.query('SELECT GET_LOCK(:lockKey, :timeoutSeconds) AS lock_acquired', {
    type: QueryTypes.SELECT,
    replacements: { lockKey, timeoutSeconds }
  });
  return readScalarFromRow(rows?.[0]) === 1;
};

const releaseDbLock = async (lockKey) => {
  try {
    await sequelize.query('SELECT RELEASE_LOCK(:lockKey) AS lock_released', {
      type: QueryTypes.SELECT,
      replacements: { lockKey }
    });
  } catch {
    // Ignore release failures.
  }
};

const withOrderLock = async (orderId, action, callback) => {
  const lockKey = `p2p_order_${action}_${orderId}`;

  if (localLocks.has(lockKey)) {
    throw new AppError(`Order ${action} already in progress`, 409);
  }

  localLocks.add(lockKey);

  let dbLockAcquired = false;
  try {
    dbLockAcquired = await acquireDbLock(lockKey, DB_LOCK_TIMEOUT_SECONDS);
    if (!dbLockAcquired) {
      throw new AppError('Order is locked. Retry shortly.', 409);
    }

    return await callback();
  } finally {
    if (dbLockAcquired) {
      await releaseDbLock(lockKey);
    }
    localLocks.delete(lockKey);
  }
};

const fetchAdForUpdate = async (adId, transaction) => {
  const rows = await sequelize.query(
    `SELECT id, user_id, type, price, min_limit, max_limit, total_amount, available_amount, status
     FROM p2p_ads
     WHERE id = :adId
     LIMIT 1
     FOR UPDATE`,
    {
      type: QueryTypes.SELECT,
      transaction,
      replacements: { adId }
    }
  );

  return rows?.[0] || null;
};

const fetchOrderForUpdate = async (orderId, transaction) => {
  const rows = await sequelize.query(
    `SELECT id, ad_id, buyer_id, seller_id, amount, total_price, status, expires_at, created_at
     FROM p2p_orders
     WHERE id = :orderId
     LIMIT 1
     FOR UPDATE`,
    {
      type: QueryTypes.SELECT,
      transaction,
      replacements: { orderId }
    }
  );

  return rows?.[0] || null;
};

const fetchOrderById = async (orderId, transaction) => {
  const rows = await sequelize.query(
    `SELECT id, ad_id, buyer_id, seller_id, amount, total_price, status, expires_at, created_at
     FROM p2p_orders
     WHERE id = :orderId
     LIMIT 1`,
    {
      type: QueryTypes.SELECT,
      transaction,
      replacements: { orderId }
    }
  );

  return rows?.[0] || null;
};

const fetchAppealById = async (appealId, transaction) => {
  const rows = await sequelize.query(
    `SELECT id, order_id, raised_by, reason, status, created_at
     FROM p2p_appeals
     WHERE id = :appealId
     LIMIT 1`,
    {
      type: QueryTypes.SELECT,
      transaction,
      replacements: { appealId }
    }
  );

  return rows?.[0] || null;
};

const ensureWalletForUpdate = async (userId, transaction) => {
  let wallet = await Wallet.findOne({
    where: { user_id: userId, coin: SUPPORTED_COIN },
    transaction,
    lock: transaction.LOCK.UPDATE
  });

  if (!wallet) {
    await Wallet.create(
      {
        user_id: userId,
        coin: SUPPORTED_COIN,
        available_balance: '0.00000000',
        locked_balance: '0.00000000'
      },
      { transaction }
    );

    wallet = await Wallet.findOne({
      where: { user_id: userId, coin: SUPPORTED_COIN },
      transaction,
      lock: transaction.LOCK.UPDATE
    });
  }

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  return wallet;
};

const insertAndGetId = async (query, replacements, transaction) => {
  const [result] = await sequelize.query(query, {
    transaction,
    replacements
  });

  const insertId = Number(result?.insertId || result);
  if (!Number.isInteger(insertId) || insertId <= 0) {
    throw new AppError('Failed to create database record', 500);
  }

  return insertId;
};

const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60 * 1000);

const computeOrderParticipants = (ad, requesterId) => {
  const adOwnerId = parsePositiveInteger(ad.user_id, 'ad.user_id');

  if (ad.type === 'sell') {
    return {
      buyerId: requesterId,
      sellerId: adOwnerId
    };
  }

  return {
    buyerId: adOwnerId,
    sellerId: requesterId
  };
};

export const createAd = async (userId, data = {}) => {
  const normalizedUserId = parsePositiveInteger(userId, 'userId');
  const type = normalizeAdType(data.type);

  const price = assertPositiveAmount(data.price, 'price');
  const minLimit = assertPositiveAmount(data.min_limit, 'min_limit');
  const maxLimit = assertPositiveAmount(data.max_limit, 'max_limit');
  const totalAmount = assertPositiveAmount(data.total_amount, 'total_amount');

  if (maxLimit.lt(minLimit)) {
    throw new AppError('max_limit must be greater than or equal to min_limit', 422);
  }

  if (totalAmount.lt(minLimit) || totalAmount.lt(maxLimit)) {
    throw new AppError('total_amount must be greater than or equal to min_limit and max_limit', 422);
  }

  return sequelize.transaction(async (transaction) => {
    if (type === 'sell') {
      const wallet = await ensureWalletForUpdate(normalizedUserId, transaction);
      const sellerAvailable = toDecimal(wallet.available_balance);

      if (sellerAvailable.lt(totalAmount)) {
        throw new AppError('Insufficient seller balance to post this sell ad', 422, {
          available: wallet.available_balance,
          required: toDbValue(totalAmount)
        });
      }
    }

    const adId = await insertAndGetId(
      `INSERT INTO p2p_ads
         (user_id, type, price, min_limit, max_limit, total_amount, available_amount, status, created_at)
       VALUES
         (:userId, :type, :price, :minLimit, :maxLimit, :totalAmount, :availableAmount, 'active', NOW())`,
      {
        userId: normalizedUserId,
        type,
        price: toDbValue(price),
        minLimit: toDbValue(minLimit),
        maxLimit: toDbValue(maxLimit),
        totalAmount: toDbValue(totalAmount),
        availableAmount: toDbValue(totalAmount)
      },
      transaction
    );

    const rows = await sequelize.query(
      `SELECT id, user_id, type, price, min_limit, max_limit, total_amount, available_amount, status, created_at
       FROM p2p_ads
       WHERE id = :adId
       LIMIT 1`,
      {
        type: QueryTypes.SELECT,
        transaction,
        replacements: { adId }
      }
    );

    return rows?.[0] || null;
  });
};

export const createOrder = async (adId, buyerId, amount) => {
  const normalizedAdId = parsePositiveInteger(adId, 'adId');
  const requesterId = parsePositiveInteger(buyerId, 'buyerId');
  const orderAmount = assertPositiveAmount(amount, 'amount');

  return sequelize.transaction(async (transaction) => {
    const ad = await fetchAdForUpdate(normalizedAdId, transaction);
    if (!ad) {
      throw new AppError('P2P ad not found', 404);
    }

    if (String(ad.status || '').trim().toLowerCase() !== 'active') {
      throw new AppError('P2P ad is not active', 409);
    }

    const availableAmount = toDecimal(ad.available_amount);
    if (availableAmount.lt(orderAmount)) {
      throw new AppError('Ad available amount is insufficient', 422, {
        available_amount: ad.available_amount,
        requested_amount: toDbValue(orderAmount)
      });
    }

    const minLimit = toDecimal(ad.min_limit);
    const maxLimit = toDecimal(ad.max_limit);

    if (orderAmount.lt(minLimit) || orderAmount.gt(maxLimit)) {
      throw new AppError('amount must be within ad min_limit and max_limit', 422, {
        min_limit: ad.min_limit,
        max_limit: ad.max_limit,
        requested_amount: toDbValue(orderAmount)
      });
    }

    const participants = computeOrderParticipants(ad, requesterId);
    if (participants.buyerId === participants.sellerId) {
      throw new AppError('Self trading is not allowed', 422);
    }

    const sellerWallet = await ensureWalletForUpdate(participants.sellerId, transaction);

    const sellerAvailable = toDecimal(sellerWallet.available_balance);
    const sellerLocked = toDecimal(sellerWallet.locked_balance);

    if (sellerAvailable.lt(orderAmount)) {
      throw new AppError('Seller has insufficient available balance', 422, {
        seller_available: sellerWallet.available_balance,
        order_amount: toDbValue(orderAmount)
      });
    }

    const nextSellerAvailable = sellerAvailable.minus(orderAmount);
    const nextSellerLocked = sellerLocked.plus(orderAmount);

    if (nextSellerAvailable.lt(0) || nextSellerLocked.lt(0)) {
      throw new AppError('Invalid seller wallet state', 500);
    }

    sellerWallet.available_balance = toDbValue(nextSellerAvailable);
    sellerWallet.locked_balance = toDbValue(nextSellerLocked);
    await sellerWallet.save({ transaction });

    const nextAdAvailable = availableAmount.minus(orderAmount);
    const nextAdStatus = nextAdAvailable.eq(0) ? 'paused' : 'active';

    await sequelize.query(
      `UPDATE p2p_ads
       SET available_amount = :availableAmount,
           status = :status
       WHERE id = :adId`,
      {
        transaction,
        replacements: {
          adId: normalizedAdId,
          availableAmount: toDbValue(nextAdAvailable),
          status: nextAdStatus
        }
      }
    );

    const adPrice = toDecimal(ad.price);
    const totalPrice = orderAmount.mul(adPrice);
    const expiresAt = addMinutes(new Date(), ORDER_EXPIRY_MINUTES);

    const orderId = await insertAndGetId(
      `INSERT INTO p2p_orders
         (ad_id, buyer_id, seller_id, amount, total_price, status, expires_at, created_at)
       VALUES
         (:adId, :buyerId, :sellerId, :amount, :totalPrice, 'pending', :expiresAt, NOW())`,
      {
        adId: normalizedAdId,
        buyerId: participants.buyerId,
        sellerId: participants.sellerId,
        amount: toDbValue(orderAmount),
        totalPrice: toDbValue(totalPrice),
        expiresAt
      },
      transaction
    );

    const order = await fetchOrderById(orderId, transaction);

    return {
      order,
      ad: {
        id: normalizedAdId,
        available_amount: toDbValue(nextAdAvailable),
        status: nextAdStatus
      },
      seller_wallet: {
        user_id: participants.sellerId,
        available_balance: sellerWallet.available_balance,
        locked_balance: sellerWallet.locked_balance
      }
    };
  });
};

export const markAsPaid = async (orderId) => {
  const normalizedOrderId = parsePositiveInteger(orderId, 'orderId');

  return withOrderLock(normalizedOrderId, 'mark_paid', async () => {
    return sequelize.transaction(async (transaction) => {
      const order = await fetchOrderForUpdate(normalizedOrderId, transaction);
      if (!order) {
        throw new AppError('P2P order not found', 404);
      }

      const status = String(order.status || '').trim().toLowerCase();
      if (status !== 'pending') {
        throw new AppError('Only pending orders can be marked as paid', 409);
      }

      if (order.expires_at && new Date(order.expires_at).getTime() <= Date.now()) {
        throw new AppError('Order is expired and cannot be marked as paid', 409);
      }

      await sequelize.query(
        `UPDATE p2p_orders
         SET status = 'paid'
         WHERE id = :orderId AND status = 'pending'`,
        {
          transaction,
          replacements: { orderId: normalizedOrderId }
        }
      );

      const updatedOrder = await fetchOrderById(normalizedOrderId, transaction);
      return updatedOrder;
    });
  });
};

const cancelOrderInternal = async (orderId, allowStatuses = ['pending']) => {
  const normalizedOrderId = parsePositiveInteger(orderId, 'orderId');

  return withOrderLock(normalizedOrderId, 'cancel', async () => {
    return sequelize.transaction(async (transaction) => {
      const order = await fetchOrderForUpdate(normalizedOrderId, transaction);
      if (!order) {
        throw new AppError('P2P order not found', 404);
      }

      const status = String(order.status || '').trim().toLowerCase();

      if (status === 'cancelled') {
        return {
          order,
          already_cancelled: true
        };
      }

      if (status === 'released') {
        throw new AppError('Released order cannot be cancelled', 409);
      }

      if (!allowStatuses.includes(status)) {
        throw new AppError(`Order cannot be cancelled from status ${status}`, 409);
      }

      const amountDecimal = assertPositiveAmount(order.amount, 'amount');

      const sellerWallet = await ensureWalletForUpdate(Number(order.seller_id), transaction);
      const sellerAvailable = toDecimal(sellerWallet.available_balance);
      const sellerLocked = toDecimal(sellerWallet.locked_balance);

      if (sellerLocked.lt(amountDecimal)) {
        throw new AppError('Seller locked balance is insufficient to cancel order', 422, {
          seller_locked: sellerWallet.locked_balance,
          order_amount: toDbValue(amountDecimal)
        });
      }

      const nextSellerLocked = sellerLocked.minus(amountDecimal);
      const nextSellerAvailable = sellerAvailable.plus(amountDecimal);

      if (nextSellerLocked.lt(0) || nextSellerAvailable.lt(0)) {
        throw new AppError('Invalid seller wallet state', 500);
      }

      sellerWallet.locked_balance = toDbValue(nextSellerLocked);
      sellerWallet.available_balance = toDbValue(nextSellerAvailable);
      await sellerWallet.save({ transaction });

      await sequelize.query(
        `UPDATE p2p_orders
         SET status = 'cancelled'
         WHERE id = :orderId`,
        {
          transaction,
          replacements: { orderId: normalizedOrderId }
        }
      );

      const updatedOrder = await fetchOrderById(normalizedOrderId, transaction);
      return {
        order: updatedOrder,
        seller_wallet: {
          user_id: Number(order.seller_id),
          available_balance: sellerWallet.available_balance,
          locked_balance: sellerWallet.locked_balance
        }
      };
    });
  });
};

export const releaseEscrow = async (orderId) => {
  const normalizedOrderId = parsePositiveInteger(orderId, 'orderId');

  return withOrderLock(normalizedOrderId, 'release', async () => {
    return sequelize.transaction(async (transaction) => {
      const order = await fetchOrderForUpdate(normalizedOrderId, transaction);
      if (!order) {
        throw new AppError('P2P order not found', 404);
      }

      const status = String(order.status || '').trim().toLowerCase();
      if (status === 'released') {
        throw new AppError('Order already released', 409);
      }

      if (status !== 'paid') {
        throw new AppError('Only paid orders can be released', 409);
      }

      const amountDecimal = assertPositiveAmount(order.amount, 'amount');

      const sellerWallet = await ensureWalletForUpdate(Number(order.seller_id), transaction);
      const buyerWallet = await ensureWalletForUpdate(Number(order.buyer_id), transaction);

      const sellerLocked = toDecimal(sellerWallet.locked_balance);
      if (sellerLocked.lt(amountDecimal)) {
        throw new AppError('Seller locked balance is insufficient', 422, {
          seller_locked: sellerWallet.locked_balance,
          order_amount: toDbValue(amountDecimal)
        });
      }

      const buyerAvailable = toDecimal(buyerWallet.available_balance);

      const nextSellerLocked = sellerLocked.minus(amountDecimal);
      const nextBuyerAvailable = buyerAvailable.plus(amountDecimal);

      if (nextSellerLocked.lt(0) || nextBuyerAvailable.lt(0)) {
        throw new AppError('Invalid wallet state during release', 500);
      }

      sellerWallet.locked_balance = toDbValue(nextSellerLocked);
      buyerWallet.available_balance = toDbValue(nextBuyerAvailable);

      await sellerWallet.save({ transaction });
      await buyerWallet.save({ transaction });

      const [updateResult] = await sequelize.query(
        `UPDATE p2p_orders
         SET status = 'released'
         WHERE id = :orderId AND status = 'paid'`,
        {
          transaction,
          replacements: { orderId: normalizedOrderId }
        }
      );

      const affectedRows = Number(updateResult?.affectedRows || 0);
      if (affectedRows !== 1) {
        throw new AppError('Order release conflicted. Retry once.', 409);
      }

      const updatedOrder = await fetchOrderById(normalizedOrderId, transaction);

      return {
        order: updatedOrder,
        seller_wallet: {
          user_id: Number(order.seller_id),
          available_balance: sellerWallet.available_balance,
          locked_balance: sellerWallet.locked_balance
        },
        buyer_wallet: {
          user_id: Number(order.buyer_id),
          available_balance: buyerWallet.available_balance,
          locked_balance: buyerWallet.locked_balance
        }
      };
    });
  });
};

export const cancelOrder = async (orderId) => {
  return cancelOrderInternal(orderId, ['pending']);
};

export const raiseAppeal = async (orderId, userId, reason) => {
  const normalizedOrderId = parsePositiveInteger(orderId, 'orderId');
  const normalizedUserId = parsePositiveInteger(userId, 'userId');
  const normalizedReason = String(reason || '').trim();

  if (!normalizedReason) {
    throw new AppError('reason is required', 422);
  }

  return withOrderLock(normalizedOrderId, 'appeal', async () => {
    return sequelize.transaction(async (transaction) => {
      const order = await fetchOrderForUpdate(normalizedOrderId, transaction);
      if (!order) {
        throw new AppError('P2P order not found', 404);
      }

      const buyerId = Number(order.buyer_id);
      const sellerId = Number(order.seller_id);

      if (normalizedUserId !== buyerId && normalizedUserId !== sellerId) {
        throw new AppError('Only order participants can raise an appeal', 403);
      }

      const status = String(order.status || '').trim().toLowerCase();
      if (status === 'released' || status === 'cancelled') {
        throw new AppError('Appeal is not allowed for this order status', 409);
      }

      const existingAppealRows = await sequelize.query(
        `SELECT id
         FROM p2p_appeals
         WHERE order_id = :orderId
           AND status IN ('open', 'pending', 'under_review')
         LIMIT 1`,
        {
          type: QueryTypes.SELECT,
          transaction,
          replacements: { orderId: normalizedOrderId }
        }
      );

      if (existingAppealRows.length > 0) {
        throw new AppError('An active appeal already exists for this order', 409);
      }

      if (status !== 'appeal') {
        await sequelize.query(
          `UPDATE p2p_orders
           SET status = 'appeal'
           WHERE id = :orderId`,
          {
            transaction,
            replacements: { orderId: normalizedOrderId }
          }
        );
      }

      const appealId = await insertAndGetId(
        `INSERT INTO p2p_appeals
           (order_id, raised_by, reason, status, created_at)
         VALUES
           (:orderId, :raisedBy, :reason, 'open', NOW())`,
        {
          orderId: normalizedOrderId,
          raisedBy: normalizedUserId,
          reason: normalizedReason
        },
        transaction
      );

      const appeal = await fetchAppealById(appealId, transaction);
      const updatedOrder = await fetchOrderById(normalizedOrderId, transaction);

      return {
        order: updatedOrder,
        appeal
      };
    });
  });
};

export const cancelExpiredPendingOrders = async (limit = CRON_BATCH_LIMIT) => {
  const safeLimit = Math.max(1, Number.parseInt(String(limit), 10) || CRON_BATCH_LIMIT);

  const expiredRows = await sequelize.query(
    `SELECT id
     FROM p2p_orders
     WHERE status = 'pending'
       AND expires_at IS NOT NULL
       AND expires_at <= NOW()
     ORDER BY expires_at ASC
     LIMIT :limit`,
    {
      type: QueryTypes.SELECT,
      replacements: { limit: safeLimit }
    }
  );

  const results = [];

  for (const row of expiredRows) {
    const id = Number(row.id);
    if (!Number.isInteger(id) || id <= 0) {
      continue;
    }

    try {
      await cancelOrderInternal(id, ['pending']);
      results.push({ order_id: id, cancelled: true });
    } catch (error) {
      results.push({ order_id: id, cancelled: false, error: error.message });
    }
  }

  return {
    scanned: expiredRows.length,
    cancelled: results.filter((r) => r.cancelled).length,
    failed: results.filter((r) => !r.cancelled).length,
    results
  };
};

export default {
  createAd,
  createOrder,
  markAsPaid,
  releaseEscrow,
  cancelOrder,
  raiseAppeal,
  cancelExpiredPendingOrders
};
