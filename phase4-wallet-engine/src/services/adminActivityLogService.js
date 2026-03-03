import { AdminActivityLog } from '../models/index.js';

export const logAdminActivity = async ({ adminId, action, targetId = null, metadata = null, transaction = null }) => {
  if (!adminId || !action) {
    return null;
  }

  return AdminActivityLog.create(
    {
      admin_id: adminId,
      action: String(action).trim(),
      target_id: targetId === null || targetId === undefined ? null : String(targetId),
      metadata: metadata || null
    },
    transaction ? { transaction } : undefined
  );
};

export const safeLogAdminActivity = async (payload) => {
  try {
    return await logAdminActivity(payload);
  } catch {
    return null;
  }
};
