import { runSupportWaitingAlerts } from '../services/telegramSupportService.js';

const SUPPORT_ALERT_CRON_INTERVAL_MS = Math.max(
  30_000,
  Number.parseInt(String(process.env.SUPPORT_ALERT_CRON_INTERVAL_MS || '60000'), 10) || 60000
);

const cronState = {
  started: false,
  inProgress: false,
  timer: null,
  lastRunAt: null,
  lastResult: null
};

export const runSupportAlertCron = async () => {
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
    waiting_alerts: null,
    errors: []
  };

  try {
    try {
      result.waiting_alerts = await runSupportWaitingAlerts();
    } catch (error) {
      result.errors.push({ scope: 'runSupportWaitingAlerts', message: error.message });
    }

    if (Number(result.waiting_alerts?.alerts_sent || 0) > 0) {
      console.warn('[support-alert-cron] waiting alerts sent', result.waiting_alerts);
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
    await runSupportAlertCron();
  } catch (error) {
    console.error('[support-alert-cron] unhandled error', { message: error.message });
  }
};

export const startSupportAlertCron = () => {
  if (cronState.started) {
    return false;
  }

  cronState.started = true;
  cronState.timer = setInterval(runSafely, SUPPORT_ALERT_CRON_INTERVAL_MS);

  if (typeof cronState.timer.unref === 'function') {
    cronState.timer.unref();
  }

  void runSafely();
  return true;
};

export const stopSupportAlertCron = () => {
  if (cronState.timer) {
    clearInterval(cronState.timer);
    cronState.timer = null;
  }

  cronState.started = false;
};

export const getSupportAlertCronState = () => ({
  started: cronState.started,
  in_progress: cronState.inProgress,
  interval_ms: SUPPORT_ALERT_CRON_INTERVAL_MS,
  last_run_at: cronState.lastRunAt,
  last_result: cronState.lastResult
});

if (String(process.env.SUPPORT_ALERT_CRON_AUTOSTART || 'true').trim().toLowerCase() !== 'false') {
  startSupportAlertCron();
}

export default {
  runSupportAlertCron,
  startSupportAlertCron,
  stopSupportAlertCron,
  getSupportAlertCronState
};
