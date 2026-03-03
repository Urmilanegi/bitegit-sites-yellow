import { AdminSetting } from '../models/index.js';
import { Op } from 'sequelize';
import { AppError } from '../utils/appError.js';
import { logAdminActivity } from './adminActivityLogService.js';

const ALLOWED_SETTING_KEYS = new Set(['site_name', 'support_email', 'maintenance_mode', 'banner_message']);

const normalizeValue = (key, value) => {
  if (key === 'maintenance_mode') {
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    const normalized = String(value || '').trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) {
      return 'true';
    }
    return 'false';
  }
  return String(value ?? '').trim();
};

export const updateSystemSettings = async ({ settings = {}, adminId }) => {
  const entries = Object.entries(settings || {}).filter(([key]) => ALLOWED_SETTING_KEYS.has(key));
  if (!entries.length) {
    throw new AppError('No valid setting keys provided', 422);
  }

  const updated = [];
  for (const [key, rawValue] of entries) {
    const value = normalizeValue(key, rawValue);

    const [row] = await AdminSetting.findOrCreate({
      where: { key },
      defaults: {
        key,
        value,
        updated_by: adminId || null,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    row.value = value;
    row.updated_by = adminId || null;
    row.updated_at = new Date();
    await row.save();

    updated.push({ key: row.key, value: row.value });
  }

  await logAdminActivity({
    adminId,
    action: 'settings_update',
    targetId: 'settings',
    metadata: {
      updated_keys: updated.map((item) => item.key)
    }
  });

  return updated;
};

export const getSystemSettings = async () => {
  const rows = await AdminSetting.findAll({
    where: {
      key: {
        [Op.in]: [...ALLOWED_SETTING_KEYS]
      }
    },
    order: [['key', 'ASC']]
  });

  return rows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
};
