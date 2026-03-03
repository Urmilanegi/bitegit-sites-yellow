import { adminLogin, listAdmins } from '../services/adminAuthService.js';
import { sendSuccess } from '../utils/response.js';

export const loginAdminController = async (req, res, next) => {
  try {
    const result = await adminLogin(req.body.email, req.body.password);
    return sendSuccess(res, 'Admin login successful', result);
  } catch (error) {
    return next(error);
  }
};

export const listAdminsController = async (req, res, next) => {
  try {
    const admins = await listAdmins();
    return sendSuccess(res, 'Admins fetched', { admins });
  } catch (error) {
    return next(error);
  }
};
