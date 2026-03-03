import { AppError } from '../utils/appError.js';
import { getAdminByPayload, verifyAdminToken } from '../services/adminAuthService.js';

export const requireAdminAuth = async (req, res, next) => {
  try {
    const authHeader = String(req.headers.authorization || '');
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token) {
      throw new AppError('Admin authorization token missing', 401);
    }

    const payload = verifyAdminToken(token);
    if (payload.scope !== 'admin') {
      throw new AppError('Invalid admin token scope', 401);
    }

    const admin = await getAdminByPayload(payload);
    req.admin = admin;
    return next();
  } catch (error) {
    return next(error instanceof AppError ? error : new AppError('Invalid or expired admin token', 401));
  }
};
