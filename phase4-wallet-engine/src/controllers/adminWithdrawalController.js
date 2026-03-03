import {
  approveWithdrawalByAdmin,
  getWithdrawControl,
  listPendingWithdrawals,
  rejectWithdrawalByAdmin,
  updateWithdrawControl
} from '../services/adminWithdrawalService.js';
import { sendSuccess } from '../utils/response.js';

export const getPendingWithdrawalsController = async (req, res, next) => {
  try {
    const withdrawals = await listPendingWithdrawals();
    return sendSuccess(res, 'Pending withdrawals fetched', { withdrawals });
  } catch (error) {
    return next(error);
  }
};

export const approveWithdrawalController = async (req, res, next) => {
  try {
    const result = await approveWithdrawalByAdmin({
      withdrawalId: req.body.withdrawal_id,
      adminId: req.admin.id
    });

    return sendSuccess(res, 'Withdrawal approved', result);
  } catch (error) {
    return next(error);
  }
};

export const rejectWithdrawalController = async (req, res, next) => {
  try {
    const result = await rejectWithdrawalByAdmin({
      withdrawalId: req.body.withdrawal_id,
      adminId: req.admin.id,
      rejectionReason: req.body.rejection_reason
    });

    return sendSuccess(res, 'Withdrawal rejected', result);
  } catch (error) {
    return next(error);
  }
};

export const updateWithdrawControlController = async (req, res, next) => {
  try {
    const result = await updateWithdrawControl({
      isPaused: req.body.is_paused,
      globalLimit: req.body.global_limit,
      adminId: req.admin.id
    });

    return sendSuccess(res, 'Withdrawal control updated', {
      is_paused: Boolean(result.is_paused),
      global_limit: result.global_limit,
      updated_at: result.updated_at
    });
  } catch (error) {
    return next(error);
  }
};

export const getWithdrawControlController = async (req, res, next) => {
  try {
    const result = await getWithdrawControl();
    return sendSuccess(res, 'Withdrawal control fetched', {
      is_paused: Boolean(result.is_paused),
      global_limit: result.global_limit,
      updated_at: result.updated_at
    });
  } catch (error) {
    return next(error);
  }
};
