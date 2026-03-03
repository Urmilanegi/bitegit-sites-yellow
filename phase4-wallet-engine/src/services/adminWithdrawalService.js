import { sequelize } from '../config/db.js';
import { AdminWithdrawControl, Wallet, Withdrawal, User } from '../models/index.js';
import { AppError } from '../utils/appError.js';
import { toDecimal, toDbValue } from '../utils/decimal.js';
import { approveWithdrawal } from './withdrawService.js';
import { logAdminActivity } from './adminActivityLogService.js';

const parsePositiveId = (value, fieldName) => {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(`${fieldName} must be a positive integer`, 422);
  }
  return parsed;
};

const parseNullableLimit = (value) => {
  if (value === null || value === undefined || String(value).trim() === '') {
    return null;
  }
  const d = toDecimal(value);
  if (!d.isFinite() || d.lte(0)) {
    throw new AppError('global_limit must be greater than 0', 422);
  }
  return toDbValue(d);
};

export const getWithdrawControl = async () => {
  const [control] = await AdminWithdrawControl.findOrCreate({
    where: { id: 1 },
    defaults: {
      id: 1,
      is_paused: false,
      global_limit: null,
      updated_at: new Date()
    }
  });

  return control;
};

export const updateWithdrawControl = async ({ isPaused = null, globalLimit = undefined, adminId }) => {
  const control = await getWithdrawControl();

  if (isPaused !== null) {
    control.is_paused = Boolean(isPaused);
  }

  if (globalLimit !== undefined) {
    control.global_limit = parseNullableLimit(globalLimit);
  }

  control.updated_by = adminId || null;
  control.updated_at = new Date();
  await control.save();

  await logAdminActivity({
    adminId,
    action: 'withdraw_control_update',
    targetId: control.id,
    metadata: {
      is_paused: Boolean(control.is_paused),
      global_limit: control.global_limit
    }
  });

  return control;
};

export const listPendingWithdrawals = async () => {
  return Withdrawal.findAll({
    where: { status: 'pending' },
    include: [{ model: User, attributes: ['id', 'email'] }],
    order: [['id', 'ASC']]
  });
};

const validateWithdrawalPolicy = async (withdrawal) => {
  const control = await getWithdrawControl();

  if (control.is_paused) {
    throw new AppError('Withdrawals are currently paused by admin control', 423);
  }

  if (control.global_limit !== null && control.global_limit !== undefined) {
    const limit = toDecimal(control.global_limit);
    const amount = toDecimal(withdrawal.amount);
    if (amount.gt(limit)) {
      throw new AppError('Withdrawal exceeds current global withdraw limit', 422, {
        requested_amount: withdrawal.amount,
        global_limit: control.global_limit
      });
    }
  }
};

export const approveWithdrawalByAdmin = async ({ withdrawalId, adminId }) => {
  const normalizedId = parsePositiveId(withdrawalId, 'withdrawal_id');

  const withdrawal = await Withdrawal.findByPk(normalizedId);
  if (!withdrawal) {
    throw new AppError('Withdrawal not found', 404);
  }

  await validateWithdrawalPolicy(withdrawal);

  const result = await approveWithdrawal(normalizedId);

  await logAdminActivity({
    adminId,
    action: 'withdraw_approve',
    targetId: normalizedId,
    metadata: {
      withdrawal_id: normalizedId,
      tx_hash: result?.withdrawal?.tx_hash || null,
      status: result?.withdrawal?.status || null
    }
  });

  return result;
};

export const rejectWithdrawalByAdmin = async ({ withdrawalId, adminId, rejectionReason = '' }) => {
  const normalizedId = parsePositiveId(withdrawalId, 'withdrawal_id');

  return sequelize.transaction(async (transaction) => {
    const withdrawal = await Withdrawal.findByPk(normalizedId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!withdrawal) {
      throw new AppError('Withdrawal not found', 404);
    }

    if (withdrawal.status !== 'pending') {
      throw new AppError('Withdrawal already processed', 409);
    }

    const wallet = await Wallet.findOne({
      where: { user_id: withdrawal.user_id, coin: withdrawal.coin },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!wallet) {
      throw new AppError('Wallet not found', 404);
    }

    const amount = toDecimal(withdrawal.amount);
    const locked = toDecimal(wallet.locked_balance);
    const available = toDecimal(wallet.available_balance);

    if (locked.lt(amount)) {
      throw new AppError('Insufficient locked balance for rejection rollback', 409);
    }

    const nextLocked = locked.minus(amount);
    const nextAvailable = available.plus(amount);

    wallet.locked_balance = toDbValue(nextLocked);
    wallet.available_balance = toDbValue(nextAvailable);
    await wallet.save({ transaction });

    withdrawal.status = 'rejected';
    withdrawal.tx_hash = null;
    await withdrawal.save({ transaction });

    await logAdminActivity({
      adminId,
      action: 'withdraw_reject',
      targetId: normalizedId,
      metadata: {
        withdrawal_id: normalizedId,
        reason: String(rejectionReason || '').trim() || null
      },
      transaction
    });

    return {
      withdrawal,
      wallet: {
        available_balance: wallet.available_balance,
        locked_balance: wallet.locked_balance
      }
    };
  });
};

// Example secure withdraw approval settlement logic using row locks and transaction boundaries.
export const exampleSecureWithdrawApprovalTransaction = async ({ withdrawalId, txHash }) => {
  const normalizedId = parsePositiveId(withdrawalId, 'withdrawal_id');
  const normalizedTxHash = String(txHash || '').trim();
  if (!normalizedTxHash) {
    throw new AppError('tx_hash is required', 422);
  }

  return sequelize.transaction(async (transaction) => {
    const withdrawal = await Withdrawal.findByPk(normalizedId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!withdrawal) {
      throw new AppError('Withdrawal not found', 404);
    }

    if (withdrawal.status !== 'pending') {
      throw new AppError('Withdrawal already processed', 409);
    }

    const wallet = await Wallet.findOne({
      where: { user_id: withdrawal.user_id, coin: withdrawal.coin },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!wallet) {
      throw new AppError('Wallet not found', 404);
    }

    const amount = toDecimal(withdrawal.amount);
    const locked = toDecimal(wallet.locked_balance);

    if (locked.lt(amount)) {
      throw new AppError('Insufficient locked balance', 409);
    }

    wallet.locked_balance = toDbValue(locked.minus(amount));
    await wallet.save({ transaction });

    withdrawal.status = 'approved';
    withdrawal.tx_hash = normalizedTxHash;
    await withdrawal.save({ transaction });

    return { withdrawal, wallet };
  });
};
