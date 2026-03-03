import { AdminTradingPair } from '../models/index.js';
import { AppError } from '../utils/appError.js';
import { logAdminActivity } from './adminActivityLogService.js';

const normalizePairSymbol = (value) => {
  const symbol = String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!symbol || symbol.length < 6 || symbol.length > 20) {
    throw new AppError('pair_symbol is invalid', 422);
  }
  return symbol;
};

const normalizeFee = (value, fieldName) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0 || numeric > 1) {
    throw new AppError(`${fieldName} must be between 0 and 1`, 422);
  }
  return numeric.toFixed(6);
};

export const updateTradingPair = async ({ pairSymbol, makerFee, takerFee, isEnabled, isPaused, adminId }) => {
  const symbol = normalizePairSymbol(pairSymbol);

  const [row] = await AdminTradingPair.findOrCreate({
    where: { pair_symbol: symbol },
    defaults: {
      pair_symbol: symbol,
      maker_fee: makerFee !== undefined ? normalizeFee(makerFee, 'maker_fee') : '0.001000',
      taker_fee: takerFee !== undefined ? normalizeFee(takerFee, 'taker_fee') : '0.001000',
      is_enabled: isEnabled !== undefined ? Boolean(isEnabled) : true,
      is_paused: isPaused !== undefined ? Boolean(isPaused) : false,
      updated_by: adminId || null,
      updated_at: new Date()
    }
  });

  if (makerFee !== undefined) {
    row.maker_fee = normalizeFee(makerFee, 'maker_fee');
  }
  if (takerFee !== undefined) {
    row.taker_fee = normalizeFee(takerFee, 'taker_fee');
  }
  if (isEnabled !== undefined) {
    row.is_enabled = Boolean(isEnabled);
  }
  if (isPaused !== undefined) {
    row.is_paused = Boolean(isPaused);
  }

  row.updated_by = adminId || null;
  row.updated_at = new Date();
  await row.save();

  await logAdminActivity({
    adminId,
    action: 'trading_pair_update',
    targetId: symbol,
    metadata: {
      pair_symbol: symbol,
      maker_fee: row.maker_fee,
      taker_fee: row.taker_fee,
      is_enabled: Boolean(row.is_enabled),
      is_paused: Boolean(row.is_paused)
    }
  });

  return row;
};

export const pauseTradingPair = async ({ pairSymbol, isPaused = true, adminId }) => {
  return updateTradingPair({ pairSymbol, isPaused, adminId });
};
