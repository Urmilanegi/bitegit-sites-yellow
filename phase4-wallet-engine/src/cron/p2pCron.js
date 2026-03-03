import { cancelExpiredPendingOrders } from '../services/p2pService.js';

const P2P_CRON_INTERVAL_MS = Math.max(
  10_000,
  Number.parseInt(String(process.env.P2P_CRON_INTERVAL_MS || '60000'), 10) || 60000
);

const cronState = {
  started: false,
  inProgress: false,
  timer: null,
  lastRunAt: null,
  lastResult: null
};

export const runP2PCron = async () => {
  if (cronState.inProgress) {
    return {
      running: true,
      skipped: true,
      reason: 'already_in_progress',
      last_run_at: cronState.lastRunAt,
      last_result: cronState.lastResult
    };
  }

  cronState.inProgress = true;

  const result = {
    running: true,
    started_at: new Date().toISOString(),
    expired_orders: null,
    errors: []
  };

  try {
    try {
      result.expired_orders = await cancelExpiredPendingOrders();
    } catch (error) {
      result.errors.push({ scope: 'cancelExpiredPendingOrders', message: error.message });
    }

    if (Number(result.expired_orders?.cancelled || 0) > 0) {
      console.warn('[p2p-cron] cancelled expired orders', result.expired_orders);
    }

    return result;
  } finally {
    cronState.inProgress = false;
    cronState.lastRunAt = new Date().toISOString();
    cronState.lastResult = result;
  }
};

const runSafely = async () => {
  try {
    await runP2PCron();
  } catch (error) {
    console.error('[p2p-cron] unhandled run error', { message: error.message });
  }
};

export const startP2PCron = () => {
  if (cronState.started) {
    return false;
  }

  cronState.started = true;
  cronState.timer = setInterval(runSafely, P2P_CRON_INTERVAL_MS);

  if (typeof cronState.timer.unref === 'function') {
    cronState.timer.unref();
  }

  void runSafely();
  return true;
};

export const stopP2PCron = () => {
  if (cronState.timer) {
    clearInterval(cronState.timer);
    cronState.timer = null;
  }

  cronState.started = false;
};

export const getP2PCronState = () => ({
  started: cronState.started,
  in_progress: cronState.inProgress,
  interval_ms: P2P_CRON_INTERVAL_MS,
  last_run_at: cronState.lastRunAt,
  last_result: cronState.lastResult
});

if (String(process.env.P2P_CRON_AUTOSTART || 'true').trim().toLowerCase() !== 'false') {
  startP2PCron();
}

export default {
  runP2PCron,
  startP2PCron,
  stopP2PCron,
  getP2PCronState
};
