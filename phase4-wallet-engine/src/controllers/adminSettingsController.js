import { getSystemSettings, updateSystemSettings } from '../services/adminSettingsService.js';
import { sendSuccess } from '../utils/response.js';

export const updateSystemSettingsController = async (req, res, next) => {
  try {
    const updated = await updateSystemSettings({
      settings: req.body,
      adminId: req.admin.id
    });

    return sendSuccess(res, 'System settings updated', { updated });
  } catch (error) {
    return next(error);
  }
};

export const getSystemSettingsController = async (req, res, next) => {
  try {
    const settings = await getSystemSettings();
    return sendSuccess(res, 'System settings fetched', { settings });
  } catch (error) {
    return next(error);
  }
};
