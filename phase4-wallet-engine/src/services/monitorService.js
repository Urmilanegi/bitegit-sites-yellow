import Decimal from 'decimal.js';
import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { AppError } from '../utils/appError.js';
import { getUSDTBalance, validateTronAddress } from './tronService.js';
import { sendAdminEmailAlert, sendTelegramAlert } from './alertService.js';

const LARGE_WITHDRAW_ALERT_THRESHOLD = new Decimal(String(process.env.LARGE_WITHDRAW_ALERT_THRESHOLD || '1000'));
const FAILED_WITHDRAW_ALERT_THRESHOLD = Math.max(
  1,
  Number.parseInt(String(process.env.FAILED_WITHDRAW_ALERT_THRESHOLD || '3'), 10) || 3
);
const FAILED_WITHDRAW_WINDOW_MINUTES = Math.max(
  1,
  Number.parseInt(String(process.env.FAILED_WITHDRAW_WINDOW_MINUTES || '10'), 10) || 10
);
const BALANCE_MISMATCH_ALERT_THRESHOLD = new Decimal(String(process.env.BALANCE_MISMATCH_THRESHOLD || '1'));
const ALERT_DEDUP_WINDOW_MS = Math.max(
  60_000,
  Number.parseInt(String(process.env.MONITOR_ALERT_DEDUP_WINDOW_MS || '300000'), 10) || 300000
);

const dedupState = new Map();

const shouldSendAlertForKey = (key) => {
  const now = Date.now();
  const lastSent = dedupState.get(key) || 0;
  if (now - lastSent < ALERT_DEDUP_WINDOW_MS) {
    return false;
  }
  dedupState.set(key, now);
  return true;
};

const sendAllAlerts = async ({ subject, message, dedupKey }) => {
  const allow = shouldSendAlertForKey(dedupKey);
  if (!allow) {
    return { telegram: { skipped: true }, email: { skipped: true } };
  }

  const results = {
    telegram: { sent: false, error: null },
    email: { sent: false, error: null }
  };

  try {
    const telegramResult = await sendTelegramAlert(message);
    results.telegram = { sent: Boolean(telegramResult?.sent), error: null };
  } catch (error) {
    results.telegram = { sent: false, error: error.message };
  }

  try {
    const emailResult = await sendAdminEmailAlert(subject, message);
    results.email = { sent: Boolean(emailResult?.sent), error: null };
  } catch (error) {
    results.email = { sent: false, error: error.message };
  }

  return results;
};

const findUserBalanceColumn = async () => {
  const rows = await sequelize.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = 'users'
       AND column_name = 'balance'
     LIMIT 1`,
    { type: QueryTypes.SELECT }
  );

  return rows?.[0]?.column_name ? 'balance' : null;
};

const getLedgerBalance = async () => {
  const userBalanceColumn = await findUserBalanceColumn();

  if (userBalanceColumn) {
    const rows = await sequelize.query(
      'SELECT COALESCE(SUM(balance), 0) AS total FROM users',
      { type: QueryTypes.SELECT }
    );

    return {
      source: 'users.balance',
      total: new Decimal(String(rows?.[0]?.total || '0'))
    };
  }

  const rows = await sequelize.query(
    'SELECT COALESCE(SUM(available_balance + locked_balance), 0) AS total FROM wallets WHERE coin = :coin',
    {
      type: QueryTypes.SELECT,
      replacements: { coin: 'USDT' }
    }
  );

  return {
    source: 'wallets.available_balance+locked_balance',
    total: new Decimal(String(rows?.[0]?.total || '0'))
  };
};

export const detectLargeWithdraw = async (amount) => {
  const withdrawalAmount = new Decimal(String(amount || '0'));
  if (!withdrawalAmount.isFinite() || withdrawalAmount.lte(0)) {
    throw new AppError('Invalid amount for large withdraw detection', 422);
  }

  const triggered = withdrawalAmount.gt(LARGE_WITHDRAW_ALERT_THRESHOLD);
  if (!triggered) {
    return {
      triggered: false,
      threshold: LARGE_WITHDRAW_ALERT_THRESHOLD.toFixed(8),
      amount: withdrawalAmount.toFixed(8)
    };
  }

  const subject = 'Large Withdrawal Alert';
  const message = `Large withdrawal detected: ${withdrawalAmount.toFixed(8)} USDT (threshold: ${LARGE_WITHDRAW_ALERT_THRESHOLD.toFixed(8)} USDT).`;
  const alerts = await sendAllAlerts({
    subject,
    message,
    dedupKey: `large_withdraw:${withdrawalAmount.toFixed(8)}`
  });

  return {
    triggered: true,
    threshold: LARGE_WITHDRAW_ALERT_THRESHOLD.toFixed(8),
    amount: withdrawalAmount.toFixed(8),
    alerts
  };
};

export const detectMultipleFailedWithdraw = async (userId) => {
  const normalizedUserId = Number.parseInt(String(userId || ''), 10);
  if (!Number.isInteger(normalizedUserId) || normalizedUserId <= 0) {
    throw new AppError('Invalid userId for failed withdraw detection', 422);
  }

  const rows = await sequelize.query(
    `SELECT COUNT(*) AS total
     FROM withdrawals
     WHERE user_id = :userId
       AND status IN ('failed', 'rejected')
       AND created_at >= (NOW() - INTERVAL :windowMinutes MINUTE)`,
    {
      type: QueryTypes.SELECT,
      replacements: {
        userId: normalizedUserId,
        windowMinutes: FAILED_WITHDRAW_WINDOW_MINUTES
      }
    }
  );

  const failedCount = Number(rows?.[0]?.total || 0);
  const triggered = failedCount > FAILED_WITHDRAW_ALERT_THRESHOLD;

  if (!triggered) {
    return {
      triggered: false,
      user_id: normalizedUserId,
      failed_count: failedCount,
      threshold: FAILED_WITHDRAW_ALERT_THRESHOLD,
      window_minutes: FAILED_WITHDRAW_WINDOW_MINUTES
    };
  }

  const subject = 'Multiple Failed Withdrawals Alert';
  const message = `User ${normalizedUserId} has ${failedCount} failed/rejected withdrawals within ${FAILED_WITHDRAW_WINDOW_MINUTES} minutes.`;
  const alerts = await sendAllAlerts({
    subject,
    message,
    dedupKey: `failed_withdraw:${normalizedUserId}`
  });

  return {
    triggered: true,
    user_id: normalizedUserId,
    failed_count: failedCount,
    threshold: FAILED_WITHDRAW_ALERT_THRESHOLD,
    window_minutes: FAILED_WITHDRAW_WINDOW_MINUTES,
    alerts
  };
};

export const detectBalanceMismatch = async () => {
  const hotWalletAddress = String(process.env.HOT_WALLET_ADDRESS || '').trim();
  if (!hotWalletAddress || !validateTronAddress(hotWalletAddress)) {
    throw new AppError('Valid HOT_WALLET_ADDRESS is required for balance mismatch detection', 500);
  }

  const [ledgerBalance, blockchainBalanceInfo] = await Promise.all([
    getLedgerBalance(),
    getUSDTBalance(hotWalletAddress)
  ]);

  const blockchainBalance = new Decimal(String(blockchainBalanceInfo.balance || '0'));
  const diff = ledgerBalance.total.minus(blockchainBalance).abs();
  const mismatch = diff.gt(BALANCE_MISMATCH_ALERT_THRESHOLD);

  if (!mismatch) {
    return {
      mismatch: false,
      source: ledgerBalance.source,
      ledger_balance: ledgerBalance.total.toFixed(8),
      blockchain_balance: blockchainBalance.toFixed(8),
      diff: diff.toFixed(8),
      threshold: BALANCE_MISMATCH_ALERT_THRESHOLD.toFixed(8)
    };
  }

  const subject = 'Wallet Balance Mismatch Alert';
  const message =
    `Balance mismatch detected. Source=${ledgerBalance.source}, ` +
    `ledger=${ledgerBalance.total.toFixed(8)} USDT, blockchain=${blockchainBalance.toFixed(8)} USDT, ` +
    `diff=${diff.toFixed(8)} USDT, threshold=${BALANCE_MISMATCH_ALERT_THRESHOLD.toFixed(8)} USDT.`;

  const alerts = await sendAllAlerts({
    subject,
    message,
    dedupKey: 'balance_mismatch'
  });

  return {
    mismatch: true,
    source: ledgerBalance.source,
    ledger_balance: ledgerBalance.total.toFixed(8),
    blockchain_balance: blockchainBalance.toFixed(8),
    diff: diff.toFixed(8),
    threshold: BALANCE_MISMATCH_ALERT_THRESHOLD.toFixed(8),
    alerts
  };
};

export default {
  detectLargeWithdraw,
  detectMultipleFailedWithdraw,
  detectBalanceMismatch
};
