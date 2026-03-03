import {
  creditUserBalance,
  debitUserBalance,
  listUsersWithBalances,
  updateUserSecurityState
} from '../services/adminUserService.js';
import { sendSuccess } from '../utils/response.js';

export const listAdminUsersController = async (req, res, next) => {
  try {
    const users = await listUsersWithBalances({
      search: req.query.search || req.query.q || '',
      limit: req.query.limit,
      offset: req.query.offset
    });

    return sendSuccess(res, 'Users fetched', { users });
  } catch (error) {
    return next(error);
  }
};

export const freezeAdminUserController = async (req, res, next) => {
  try {
    const result = await updateUserSecurityState({
      userId: req.body.user_id,
      action: req.body.action,
      adminId: req.admin.id
    });

    return sendSuccess(res, 'User security state updated', { user: result });
  } catch (error) {
    return next(error);
  }
};

export const creditAdminUserController = async (req, res, next) => {
  try {
    const result = await creditUserBalance({
      userId: req.body.user_id,
      coin: req.body.coin || 'USDT',
      amount: req.body.amount,
      adminId: req.admin.id,
      reason: req.body.reason
    });

    return sendSuccess(res, 'Balance credited', result);
  } catch (error) {
    return next(error);
  }
};

export const debitAdminUserController = async (req, res, next) => {
  try {
    const result = await debitUserBalance({
      userId: req.body.user_id,
      coin: req.body.coin || 'USDT',
      amount: req.body.amount,
      adminId: req.admin.id,
      reason: req.body.reason
    });

    return sendSuccess(res, 'Balance debited', result);
  } catch (error) {
    return next(error);
  }
};
