import { checkHotWalletThreshold } from '../services/treasuryService.js';
import { detectBalanceMismatch } from '../services/monitorService.js';

const MONITOR_INTERVAL_MS = Math.max(
  60_000,
  Number.parseInt(String(process.env.MONITOR_CRON_INTERVAL_MS || String(5 * 60 * 1000)), 10) || 5 * 60 * 1000
);

const cronState = {
  started: false,
  timer: null,
  inProgress: false,
  lastRunAt: null,
  lastResult: null
};

export const runMonitorChecks = async () => {
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
    hot_wallet: null,
    balance_mismatch: null,
    errors: []
  };

  try {
    try {
      result.hot_wallet = await checkHotWalletThreshold();
    } catch (error) {
      result.errors.push({ scope: 'checkHotWalletThreshold', message: error.message });
    }

    try {
      result.balance_mismatch = await detectBalanceMismatch();
    } catch (error) {
      result.errors.push({ scope: 'detectBalanceMismatch', message: error.message });
    }

    if (result.hot_wallet?.low_liquidity_warning) {
      console.warn('[monitor-cron] hot wallet low liquidity warning', result.hot_wallet);
    }

    if (result.hot_wallet?.suggest_sweep) {
      console.warn('[monitor-cron] hot wallet sweep suggested', result.hot_wallet);
    }

    if (result.balance_mismatch?.mismatch) {
      console.error('[monitor-cron] balance mismatch detected', result.balance_mismatch);
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
    await runMonitorChecks();
  } catch (error) {
    console.error('[monitor-cron] unhandled monitor run error', {
      message: error.message
    });
  }
};

export const startMonitorCron = () => {
  if (cronState.started) {
    return false;
  }

  cronState.started = true;
  cronState.timer = setInterval(runSafely, MONITOR_INTERVAL_MS);

  if (typeof cronState.timer.unref === 'function') {
    cronState.timer.unref();
  }

  void runSafely();
  return true;
};

export const stopMonitorCron = () => {
  if (cronState.timer) {
    clearInterval(cronState.timer);
    cronState.timer = null;
  }
  cronState.started = false;
};

export const getMonitorCronState = () => ({
  started: cronState.started,
  in_progress: cronState.inProgress,
  interval_ms: MONITOR_INTERVAL_MS,
  last_run_at: cronState.lastRunAt,
  last_result: cronState.lastResult
});

if (String(process.env.MONITOR_CRON_AUTOSTART || 'true').trim().toLowerCase() !== 'false') {
  startMonitorCron();
}

export default {
  runMonitorChecks,
  startMonitorCron,
  stopMonitorCron,
  getMonitorCronState
};
