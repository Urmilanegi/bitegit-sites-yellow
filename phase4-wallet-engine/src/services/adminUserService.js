import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { User, UserSecurityFlag, Wallet } from '../models/index.js';
import { AppError } from '../utils/appError.js';
import { assertPositiveAmount, toDecimal, toDbValue } from '../utils/decimal.js';
import { hasColumn } from './adminSchemaService.js';
import { logAdminActivity } from './adminActivityLogService.js';

const normalizeUserId = (userId) => {
  const parsed = Number.parseInt(String(userId), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError('user_id must be a positive integer', 422);
  }
  return parsed;
};

const normalizeCoin = (coin) => String(coin || 'USDT').trim().toUpperCase() || 'USDT';

const ensureUserFlag = async (userId, transaction) => {
  const existing = await UserSecurityFlag.findOne({
    where: { user_id: userId },
    transaction,
    lock: transaction?.LOCK?.UPDATE
  });

  if (existing) {
    return existing;
  }

  return UserSecurityFlag.create(
    {
      user_id: userId,
      is_frozen: false,
      login_disabled: false,
      two_fa_reset_required: false,
      kyc_verified: false
    },
    { transaction }
  );
};

const updateUsersTableFlags = async ({ userId, isFrozen = null, loginDisabled = null, kycVerified = null }, transaction) => {
  const setParts = [];
  const replacements = { userId };

  if (isFrozen !== null && (await hasColumn('users', 'is_frozen'))) {
    setParts.push('is_frozen = :isFrozen');
    replacements.isFrozen = isFrozen ? 1 : 0;
  }

  if (loginDisabled !== null && (await hasColumn('users', 'is_active'))) {
    setParts.push('is_active = :isActive');
    replacements.isActive = loginDisabled ? 0 : 1;
  }

  if (kycVerified !== null && (await hasColumn('users', 'kyc_verified'))) {
    setParts.push('kyc_verified = :kycVerified');
    replacements.kycVerified = kycVerified ? 1 : 0;
  }

  if (!setParts.length) {
    return;
  }

  await sequelize.query(`UPDATE users SET ${setParts.join(', ')} WHERE id = :userId`, {
    type: QueryTypes.UPDATE,
    transaction,
    replacements
  });
};

export const listUsersWithBalances = async ({ search = '', limit = 50, offset = 0 } = {}) => {
  const normalizedLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);
  const normalizedOffset = Math.max(Number(offset) || 0, 0);
  const q = `%${String(search || '').trim().toLowerCase()}%`;

  return sequelize.query(
    `SELECT
       u.id,
       u.email,
       u.role,
       u.created_at,
       COALESCE(usf.is_frozen, 0) AS is_frozen,
       COALESCE(usf.login_disabled, 0) AS login_disabled,
       COALESCE(usf.two_fa_reset_required, 0) AS two_fa_reset_required,
       COALESCE(usf.kyc_verified, 0) AS kyc_verified,
       COALESCE(SUM(w.available_balance), 0) AS total_available_balance,
       COALESCE(SUM(w.locked_balance), 0) AS total_locked_balance
     FROM users u
     LEFT JOIN wallets w ON w.user_id = u.id
     LEFT JOIN user_security_flags usf ON usf.user_id = u.id
     WHERE (:search = '' OR LOWER(u.email) LIKE :q OR CAST(u.id AS CHAR) LIKE :q)
     GROUP BY u.id, u.email, u.role, u.created_at, usf.is_frozen, usf.login_disabled, usf.two_fa_reset_required, usf.kyc_verified
     ORDER BY u.id DESC
     LIMIT :limit OFFSET :offset`,
    {
      type: QueryTypes.SELECT,
      replacements: {
        search: String(search || '').trim(),
        q,
        limit: normalizedLimit,
        offset: normalizedOffset
      }
    }
  );
};

export const updateUserSecurityState = async ({ userId, action, adminId }) => {
  const normalizedUserId = normalizeUserId(userId);
  const normalizedAction = String(action || '').trim().toLowerCase();

  const allowed = ['freeze', 'unfreeze', 'disable_login', 'enable_login', 'reset_2fa'];
  if (!allowed.includes(normalizedAction)) {
    throw new AppError('Invalid action for users/freeze route', 422);
  }

  const result = await sequelize.transaction(async (transaction) => {
    const user = await User.findByPk(normalizedUserId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const userFlag = await ensureUserFlag(normalizedUserId, transaction);

    if (normalizedAction === 'freeze') {
      userFlag.is_frozen = true;
      await updateUsersTableFlags({ userId: normalizedUserId, isFrozen: true }, transaction);
    }

    if (normalizedAction === 'unfreeze') {
      userFlag.is_frozen = false;
      await updateUsersTableFlags({ userId: normalizedUserId, isFrozen: false }, transaction);
    }

    if (normalizedAction === 'disable_login') {
      userFlag.login_disabled = true;
      await updateUsersTableFlags({ userId: normalizedUserId, loginDisabled: true }, transaction);
    }

    if (normalizedAction === 'enable_login') {
      userFlag.login_disabled = false;
      await updateUsersTableFlags({ userId: normalizedUserId, loginDisabled: false }, transaction);
    }

    if (normalizedAction === 'reset_2fa') {
      userFlag.two_fa_reset_required = true;
    }

    userFlag.updated_at = new Date();
    await userFlag.save({ transaction });

    await logAdminActivity({
      adminId,
      action: `user_${normalizedAction}`,
      targetId: normalizedUserId,
      metadata: { user_id: normalizedUserId },
      transaction
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      is_frozen: Boolean(userFlag.is_frozen),
      login_disabled: Boolean(userFlag.login_disabled),
      two_fa_reset_required: Boolean(userFlag.two_fa_reset_required)
    };
  });

  return result;
};

export const adjustUserBalance = async ({ userId, coin = 'USDT', amount, type, adminId, reason = '' }) => {
  const normalizedUserId = normalizeUserId(userId);
  const normalizedCoin = normalizeCoin(coin);
  const normalizedType = String(type || '').trim().toLowerCase();

  if (!['credit', 'debit'].includes(normalizedType)) {
    throw new AppError('type must be credit or debit', 422);
  }

  const delta = assertPositiveAmount(amount, 'amount');

  return sequelize.transaction(async (transaction) => {
    const user = await User.findByPk(normalizedUserId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    let wallet = await Wallet.findOne({
      where: { user_id: normalizedUserId, coin: normalizedCoin },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!wallet) {
      wallet = await Wallet.create(
        {
          user_id: normalizedUserId,
          coin: normalizedCoin,
          available_balance: '0.00000000',
          locked_balance: '0.00000000'
        },
        { transaction }
      );
    }

    const current = toDecimal(wallet.available_balance);
    const next = normalizedType === 'credit' ? current.plus(delta) : current.minus(delta);

    if (next.lt(0)) {
      throw new AppError('Insufficient available balance', 422, {
        available_balance: wallet.available_balance,
        requested_amount: toDbValue(delta)
      });
    }

    wallet.available_balance = toDbValue(next);
    await wallet.save({ transaction });

    await logAdminActivity({
      adminId,
      action: `balance_${normalizedType}`,
      targetId: normalizedUserId,
      metadata: {
        user_id: normalizedUserId,
        coin: normalizedCoin,
        amount: toDbValue(delta),
        reason: String(reason || '').trim() || null
      },
      transaction
    });

    return {
      user_id: normalizedUserId,
      coin: normalizedCoin,
      available_balance: wallet.available_balance,
      locked_balance: wallet.locked_balance,
      adjustment_type: normalizedType,
      adjusted_amount: toDbValue(delta)
    };
  });
};

export const creditUserBalance = async (payload) => adjustUserBalance({ ...payload, type: 'credit' });

export const debitUserBalance = async (payload) => adjustUserBalance({ ...payload, type: 'debit' });

export const markUserKyc = async ({ userId, isVerified, transaction = null }) => {
  const normalizedUserId = normalizeUserId(userId);

  const doUpdate = async (tx) => {
    const userFlag = await ensureUserFlag(normalizedUserId, tx);
    userFlag.kyc_verified = Boolean(isVerified);
    userFlag.updated_at = new Date();
    await userFlag.save({ transaction: tx });

    await updateUsersTableFlags(
      {
        userId: normalizedUserId,
        kycVerified: Boolean(isVerified)
      },
      tx
    );

    return userFlag;
  };

  if (transaction) {
    return doUpdate(transaction);
  }

  return sequelize.transaction(async (tx) => doUpdate(tx));
};
