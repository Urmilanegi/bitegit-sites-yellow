import { AdminWalletConfig } from '../models/index.js';
import { AppError } from '../utils/appError.js';
import { validateTronAddress } from './tronService.js';
import { logAdminActivity } from './adminActivityLogService.js';

const normalizeWalletType = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (!['hot', 'cold'].includes(normalized)) {
    throw new AppError('wallet_type must be hot or cold', 422);
  }
  return normalized;
};

const sanitizeWalletResponse = (row) => ({
  id: row.id,
  wallet_type: row.wallet_type,
  address: row.address,
  label: row.label,
  is_active: Boolean(row.is_active),
  created_at: row.created_at,
  updated_at: row.updated_at
});

export const listWalletConfigs = async () => {
  const rows = await AdminWalletConfig.findAll({ order: [['id', 'DESC']] });
  return rows.map(sanitizeWalletResponse);
};

export const addWalletConfig = async ({ walletType, address, label = '', isActive = true, adminId }) => {
  const normalizedWalletType = normalizeWalletType(walletType);
  const normalizedAddress = String(address || '').trim();
  const normalizedLabel = String(label || '').trim();

  if (!normalizedAddress) {
    throw new AppError('address is required', 422);
  }

  if (!validateTronAddress(normalizedAddress)) {
    throw new AppError('Invalid TRON wallet address', 422);
  }

  const created = await AdminWalletConfig.create({
    wallet_type: normalizedWalletType,
    address: normalizedAddress,
    label: normalizedLabel || null,
    is_active: Boolean(isActive),
    created_at: new Date(),
    updated_at: new Date()
  });

  await logAdminActivity({
    adminId,
    action: 'wallet_add',
    targetId: created.id,
    metadata: {
      wallet_type: normalizedWalletType,
      address: normalizedAddress,
      label: normalizedLabel || null,
      is_active: Boolean(isActive)
    }
  });

  return sanitizeWalletResponse(created);
};

export const updateWalletConfig = async ({ id, walletType = undefined, address = undefined, label = undefined, isActive = undefined, adminId }) => {
  const walletId = Number.parseInt(String(id), 10);
  if (!Number.isInteger(walletId) || walletId <= 0) {
    throw new AppError('id must be a positive integer', 422);
  }

  const row = await AdminWalletConfig.findByPk(walletId);
  if (!row) {
    throw new AppError('Wallet config not found', 404);
  }

  if (walletType !== undefined) {
    row.wallet_type = normalizeWalletType(walletType);
  }

  if (address !== undefined) {
    const normalizedAddress = String(address || '').trim();
    if (!normalizedAddress || !validateTronAddress(normalizedAddress)) {
      throw new AppError('Invalid TRON wallet address', 422);
    }
    row.address = normalizedAddress;
  }

  if (label !== undefined) {
    row.label = String(label || '').trim() || null;
  }

  if (isActive !== undefined) {
    row.is_active = Boolean(isActive);
  }

  row.updated_at = new Date();
  await row.save();

  await logAdminActivity({
    adminId,
    action: 'wallet_update',
    targetId: row.id,
    metadata: {
      wallet_type: row.wallet_type,
      address: row.address,
      label: row.label,
      is_active: Boolean(row.is_active)
    }
  });

  return sanitizeWalletResponse(row);
};
