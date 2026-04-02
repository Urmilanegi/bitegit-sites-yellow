const Redis = require('ioredis');

function firstNonEmptyEnv(...values) {
  for (const value of values) {
    const normalized = String(value || '').trim();
    if (normalized) {
      return normalized;
    }
  }
  return '';
}

function getRedisUrl() {
  return firstNonEmptyEnv(
    process.env.REDIS_URL,
    process.env.KEY_VALUE_URL,
    process.env.RENDER_KEY_VALUE_URL
  );
}

function isRedisConfigured() {
  return Boolean(getRedisUrl());
}

function createRedisConnection({
  role = 'default',
  maxRetriesPerRequest = 1,
  enableReadyCheck = true,
  lazyConnect = false
} = {}) {
  const redisUrl = getRedisUrl();
  if (!redisUrl) {
    return null;
  }

  return new Redis(redisUrl, {
    connectionName: `bitegit-${role}-${process.pid}`,
    maxRetriesPerRequest,
    enableReadyCheck,
    lazyConnect
  });
}

module.exports = {
  createRedisConnection,
  firstNonEmptyEnv,
  getRedisUrl,
  isRedisConfigured
};
