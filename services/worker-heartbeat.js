const os = require('os');
const { createRedisConnection, firstNonEmptyEnv, isRedisConfigured } = require('./redis-support');

const DEFAULT_HEARTBEAT_KEY = 'bitegit:monitoring:email-worker';
const DEFAULT_INTERVAL_MS = 30_000;
const DEFAULT_TTL_SECONDS = 120;
const DEFAULT_STALE_AFTER_SECONDS = 90;

function normalizePositiveInt(value, fallback, minimum = 1) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (Number.isFinite(parsed) && parsed >= minimum) {
    return parsed;
  }
  return fallback;
}

function getHeartbeatKey() {
  return firstNonEmptyEnv(
    process.env.P2P_EMAIL_WORKER_HEARTBEAT_KEY,
    DEFAULT_HEARTBEAT_KEY
  );
}

function getHeartbeatIntervalMs() {
  return normalizePositiveInt(process.env.P2P_EMAIL_WORKER_HEARTBEAT_MS, DEFAULT_INTERVAL_MS, 5_000);
}

function getHeartbeatTtlSeconds() {
  return normalizePositiveInt(process.env.P2P_EMAIL_WORKER_HEARTBEAT_TTL_SECONDS, DEFAULT_TTL_SECONDS, 30);
}

function getHeartbeatStaleAfterSeconds() {
  return normalizePositiveInt(
    process.env.P2P_EMAIL_WORKER_STALE_AFTER_SECONDS,
    DEFAULT_STALE_AFTER_SECONDS,
    30
  );
}

function getWorkerServiceName() {
  return firstNonEmptyEnv(
    process.env.RENDER_SERVICE_NAME,
    process.env.APP_NAME,
    'bitegit-email-worker'
  );
}

function buildDisabledSnapshot(overrides = {}) {
  return {
    mode: 'disabled',
    status: 'disabled',
    ready: false,
    key: getHeartbeatKey(),
    updatedAt: null,
    ageSeconds: null,
    staleAfterSeconds: getHeartbeatStaleAfterSeconds(),
    ...overrides
  };
}

function sanitizeText(value) {
  const normalized = String(value || '').trim();
  return normalized || null;
}

function parseWorkerHeartbeat(rawValue, { now = new Date(), staleAfterSeconds = getHeartbeatStaleAfterSeconds() } = {}) {
  const normalizedRawValue = String(rawValue || '').trim();
  if (!normalizedRawValue) {
    return {
      mode: 'unavailable',
      status: 'missing',
      ready: false,
      key: getHeartbeatKey(),
      updatedAt: null,
      ageSeconds: null,
      staleAfterSeconds
    };
  }

  let payload = null;
  try {
    payload = JSON.parse(normalizedRawValue);
  } catch (_) {
    return {
      mode: 'unavailable',
      status: 'invalid',
      ready: false,
      key: getHeartbeatKey(),
      updatedAt: null,
      ageSeconds: null,
      staleAfterSeconds,
      error: 'invalid-json'
    };
  }

  const updatedAt = sanitizeText(payload.updatedAt);
  const updatedAtMs = updatedAt ? Date.parse(updatedAt) : Number.NaN;
  if (!updatedAt || Number.isNaN(updatedAtMs)) {
    return {
      mode: 'unavailable',
      status: 'invalid',
      ready: false,
      key: getHeartbeatKey(),
      updatedAt: null,
      ageSeconds: null,
      staleAfterSeconds,
      error: 'missing-updatedAt'
    };
  }

  const ageSeconds = Math.max(0, Math.round((now.getTime() - updatedAtMs) / 1000));
  const isStale = ageSeconds > staleAfterSeconds;

  return {
    mode: 'redis-worker',
    status: isStale ? 'stale' : 'healthy',
    ready: !isStale,
    key: getHeartbeatKey(),
    updatedAt,
    ageSeconds,
    staleAfterSeconds,
    queueName: sanitizeText(payload.queueName),
    serviceName: sanitizeText(payload.serviceName),
    appName: sanitizeText(payload.appName),
    environment: sanitizeText(payload.environment),
    hostname: sanitizeText(payload.hostname),
    nodeVersion: sanitizeText(payload.nodeVersion),
    startedAt: sanitizeText(payload.startedAt),
    pid: Number.isFinite(Number(payload.pid)) ? Number(payload.pid) : null
  };
}

function createWorkerHeartbeatReporter({ logger = console, queueName = '' } = {}) {
  if (!isRedisConfigured()) {
    return {
      isEnabled: false,
      start() {},
      async stop() {},
      getSnapshot() {
        return buildDisabledSnapshot();
      }
    };
  }

  const redis = createRedisConnection({
    role: 'worker-heartbeat',
    maxRetriesPerRequest: 1
  });
  const heartbeatKey = getHeartbeatKey();
  const heartbeatIntervalMs = getHeartbeatIntervalMs();
  const heartbeatTtlSeconds = getHeartbeatTtlSeconds();
  const basePayload = {
    role: 'p2p-email-worker',
    queueName: sanitizeText(queueName),
    serviceName: getWorkerServiceName(),
    appName: sanitizeText(process.env.APP_NAME),
    environment: sanitizeText(process.env.RENDER_ENVIRONMENT || process.env.NODE_ENV || 'development'),
    hostname: os.hostname(),
    pid: process.pid,
    nodeVersion: process.version,
    startedAt: new Date().toISOString()
  };
  let timer = null;

  async function publishHeartbeat() {
    const payload = {
      ...basePayload,
      updatedAt: new Date().toISOString()
    };
    await redis.set(heartbeatKey, JSON.stringify(payload), 'EX', heartbeatTtlSeconds);
    return payload;
  }

  function start() {
    if (timer) {
      return;
    }

    publishHeartbeat().catch((error) => {
      logger.warn(`[worker-heartbeat] Initial publish failed: ${error.message}`);
    });
    timer = setInterval(() => {
      publishHeartbeat().catch((error) => {
        logger.warn(`[worker-heartbeat] Publish failed: ${error.message}`);
      });
    }, heartbeatIntervalMs);
    if (typeof timer.unref === 'function') {
      timer.unref();
    }

    logger.log(
      `[worker-heartbeat] Publishing heartbeat to ${heartbeatKey} every ${Math.round(heartbeatIntervalMs / 1000)}s.`
    );
  }

  async function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    await redis.quit().catch(() => {});
  }

  return {
    isEnabled: true,
    start,
    stop,
    getSnapshot() {
      return {
        ...basePayload,
        key: heartbeatKey,
        status: 'publishing'
      };
    }
  };
}

function createWorkerHeartbeatMonitor({ logger = console } = {}) {
  if (!isRedisConfigured()) {
    let disabledSnapshot = buildDisabledSnapshot();
    return {
      isEnabled: false,
      async start() {
        return disabledSnapshot;
      },
      async refresh() {
        return disabledSnapshot;
      },
      getSnapshot() {
        return disabledSnapshot;
      },
      async close() {}
    };
  }

  const redis = createRedisConnection({
    role: 'worker-heartbeat-monitor',
    maxRetriesPerRequest: 1,
    lazyConnect: true
  });
  const staleAfterSeconds = getHeartbeatStaleAfterSeconds();
  const pollIntervalMs = Math.max(10_000, Math.min(getHeartbeatIntervalMs(), staleAfterSeconds * 1000));
  let timer = null;
  let refreshErrorLogged = false;
  let snapshot = {
    mode: 'starting',
    status: 'starting',
    ready: false,
    key: getHeartbeatKey(),
    updatedAt: null,
    ageSeconds: null,
    staleAfterSeconds
  };

  async function refresh() {
    try {
      const rawValue = await redis.get(getHeartbeatKey());
      snapshot = parseWorkerHeartbeat(rawValue, { staleAfterSeconds });
      refreshErrorLogged = false;
      return snapshot;
    } catch (error) {
      snapshot = {
        mode: 'unavailable',
        status: 'error',
        ready: false,
        key: getHeartbeatKey(),
        updatedAt: snapshot.updatedAt || null,
        ageSeconds: snapshot.ageSeconds || null,
        staleAfterSeconds,
        error: String(error.message || error)
      };
      if (!refreshErrorLogged) {
        refreshErrorLogged = true;
        logger.warn(`[monitoring] Failed to refresh worker heartbeat: ${error.message}`);
      }
      return snapshot;
    }
  }

  async function start() {
    await refresh();
    if (timer) {
      return snapshot;
    }
    timer = setInterval(() => {
      refresh().catch(() => {});
    }, pollIntervalMs);
    if (typeof timer.unref === 'function') {
      timer.unref();
    }
    return snapshot;
  }

  async function close() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    await redis.quit().catch(() => {});
  }

  return {
    isEnabled: true,
    start,
    refresh,
    getSnapshot() {
      return snapshot;
    },
    close
  };
}

module.exports = {
  createWorkerHeartbeatMonitor,
  createWorkerHeartbeatReporter,
  parseWorkerHeartbeat
};
