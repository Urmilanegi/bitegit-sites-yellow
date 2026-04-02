const crypto = require('crypto');
const { createRedisConnection, isRedisConfigured } = require('./redis-support');

const RELEASE_LOCK_SCRIPT = `
if redis.call("GET", KEYS[1]) == ARGV[1] then
  return redis.call("DEL", KEYS[1])
end
return 0
`;

function createBackgroundLockService({ logger = console, defaultTtlMs = 30_000 } = {}) {
  const redis = createRedisConnection({
    role: 'background-lock',
    maxRetriesPerRequest: 1
  });
  const ownerId = `${process.pid}:${crypto.randomBytes(8).toString('hex')}`;
  const keyPrefix = String(process.env.BACKGROUND_LOCK_PREFIX || 'bitegit:lock').trim();
  let fallbackWarningLogged = false;

  async function runLocally(task, reason) {
    if (!fallbackWarningLogged) {
      fallbackWarningLogged = true;
      logger.warn(`[background-lock] ${reason}. Running task without a distributed lock.`);
    }
    return {
      acquired: true,
      fallback: true,
      value: await task()
    };
  }

  async function runWithLock(key, task, { ttlMs = defaultTtlMs } = {}) {
    if (typeof task !== 'function') {
      throw new Error('runWithLock requires a task function.');
    }

    if (!redis || !isRedisConfigured()) {
      return runLocally(task, 'REDIS_URL is not configured');
    }

    const normalizedKey = String(key || '').trim();
    if (!normalizedKey) {
      return runLocally(task, 'lock key is missing');
    }

    const lockKey = `${keyPrefix}:${normalizedKey}`;
    const token = `${ownerId}:${Date.now()}`;

    try {
      const acquired = await redis.set(lockKey, token, 'PX', Math.max(1_000, Number(ttlMs) || defaultTtlMs), 'NX');
      if (acquired !== 'OK') {
        return {
          acquired: false,
          skipped: true
        };
      }
    } catch (error) {
      logger.warn(`[background-lock] lock acquisition failed for ${normalizedKey}: ${error.message}`);
      return runLocally(task, 'distributed lock acquisition failed');
    }

    try {
      return {
        acquired: true,
        value: await task()
      };
    } finally {
      try {
        await redis.eval(RELEASE_LOCK_SCRIPT, 1, lockKey, token);
      } catch (error) {
        logger.warn(`[background-lock] lock release failed for ${normalizedKey}: ${error.message}`);
      }
    }
  }

  async function close() {
    if (!redis) {
      return;
    }
    await redis.quit();
  }

  return {
    isEnabled: Boolean(redis && isRedisConfigured()),
    runWithLock,
    close
  };
}

module.exports = {
  createBackgroundLockService
};
