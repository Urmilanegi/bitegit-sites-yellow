import { getAdminDashboardOverview } from '../services/adminDashboardService.js';
import { sendSuccess } from '../utils/response.js';

export const getAdminDashboardController = async (req, res, next) => {
  try {
    const overview = await getAdminDashboardOverview();
    return sendSuccess(res, 'Admin dashboard fetched', overview);
  } catch (error) {
    return next(error);
  }
};
