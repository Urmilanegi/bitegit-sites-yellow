import { AppError } from '../utils/appError.js';

export const requireAdminRoles = (...roles) => {
  const allowed = roles.map((role) => String(role || '').trim().toLowerCase()).filter(Boolean);

  return (req, res, next) => {
    if (!req.admin) {
      return next(new AppError('Admin authentication required', 401));
    }

    const roleName = String(req.admin.role_name || '').trim().toLowerCase();
    if (!roleName) {
      return next(new AppError('Admin role missing', 403));
    }

    if (allowed.length && !allowed.includes(roleName)) {
      return next(new AppError('Insufficient admin role permissions', 403));
    }

    return next();
  };
};
