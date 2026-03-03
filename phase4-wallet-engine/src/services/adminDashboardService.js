import { sequelize } from '../config/db.js';
import { AdminSetting, AdminWithdrawControl } from '../models/index.js';
import { getUSDTBalance } from './tronService.js';
import { hasColumn, hasTable, querySingleNumber } from './adminSchemaService.js';

const getActiveUsers24h = async () => {
  if (await hasColumn('users', 'last_login_at')) {
    return querySingleNumber(
      `SELECT COUNT(*) AS count
       FROM users
       WHERE last_login_at >= (UTC_TIMESTAMP() - INTERVAL 24 HOUR)`
    );
  }

  return 0;
};

const getTradingVolume = async () => {
  if (!(await hasTable('trades'))) {
    return 0;
  }

  if (await hasColumn('trades', 'volume')) {
    return querySingleNumber('SELECT COALESCE(SUM(volume), 0) AS total FROM trades', {}, 0);
  }

  if (await hasColumn('trades', 'amount')) {
    return querySingleNumber('SELECT COALESCE(SUM(amount), 0) AS total FROM trades', {}, 0);
  }

  return 0;
};

const getFeeRevenue = async () => {
  if (!(await hasTable('trades'))) {
    return 0;
  }

  if (await hasColumn('trades', 'fee')) {
    return querySingleNumber('SELECT COALESCE(SUM(fee), 0) AS total FROM trades', {}, 0);
  }

  if (await hasColumn('trades', 'fee_amount')) {
    return querySingleNumber('SELECT COALESCE(SUM(fee_amount), 0) AS total FROM trades', {}, 0);
  }

  return 0;
};

const getPendingKyc = async () => {
  if (await hasTable('kyc_requests')) {
    return querySingleNumber("SELECT COUNT(*) AS count FROM kyc_requests WHERE status = 'pending'");
  }

  return 0;
};

const getHotWalletBalance = async () => {
  const hotWalletAddress = String(process.env.HOT_WALLET_ADDRESS || '').trim();
  if (!hotWalletAddress) {
    return {
      address: null,
      balance: 0,
      source: 'unconfigured'
    };
  }

  try {
    const balance = await getUSDTBalance(hotWalletAddress);
    return {
      address: hotWalletAddress,
      balance: Number(balance || 0),
      source: 'tron'
    };
  } catch {
    return {
      address: hotWalletAddress,
      balance: 0,
      source: 'error'
    };
  }
};

const getSystemStatus = async () => {
  const [maintenanceMode, withdrawControl] = await Promise.all([
    AdminSetting.findOne({ where: { key: 'maintenance_mode' } }),
    AdminWithdrawControl.findByPk(1)
  ]);

  return {
    database: 'up',
    maintenance_mode: String(maintenanceMode?.value || 'false').toLowerCase() === 'true',
    withdrawals_paused: Boolean(withdrawControl?.is_paused || false)
  };
};

export const getAdminDashboardOverview = async () => {
  await sequelize.authenticate();

  const [
    totalUsers,
    activeUsers24h,
    totalDeposits,
    totalWithdrawals,
    totalTradingVolume,
    totalFeeRevenue,
    pendingWithdrawals,
    pendingKyc,
    hotWalletBalance,
    systemStatus
  ] = await Promise.all([
    querySingleNumber('SELECT COUNT(*) AS count FROM users'),
    getActiveUsers24h(),
    querySingleNumber("SELECT COALESCE(SUM(amount), 0) AS total FROM deposits WHERE status = 'approved'", {}, 0),
    querySingleNumber("SELECT COALESCE(SUM(amount), 0) AS total FROM withdrawals WHERE status = 'approved'", {}, 0),
    getTradingVolume(),
    getFeeRevenue(),
    querySingleNumber("SELECT COUNT(*) AS count FROM withdrawals WHERE status = 'pending'"),
    getPendingKyc(),
    getHotWalletBalance(),
    getSystemStatus()
  ]);

  return {
    total_users: totalUsers,
    active_users_24h: activeUsers24h,
    total_deposits: totalDeposits,
    total_withdrawals: totalWithdrawals,
    total_trading_volume: totalTradingVolume,
    total_fee_revenue: totalFeeRevenue,
    pending_withdrawals: pendingWithdrawals,
    pending_kyc: pendingKyc,
    hot_wallet_balance: hotWalletBalance,
    system_status: systemStatus
  };
};
