import { getTicketStats } from '../services/supportAnalyticsService.js';
import { sendSuccess } from '../utils/response.js';

export const getSupportAnalyticsController = async (req, res, next) => {
  try {
    const stats = await getTicketStats();
    return sendSuccess(res, 'Support analytics fetched', stats);
  } catch (error) {
    return next(error);
  }
};
