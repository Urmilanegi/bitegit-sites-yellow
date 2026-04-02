const mysql = require('mysql2/promise');

const RETRYABLE_MYSQL_ERROR_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'ENOTFOUND',
  'EPIPE',
  'ETIMEDOUT',
  'PROTOCOL_CONNECTION_LOST',
  'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR',
  'PROTOCOL_ENQUEUE_AFTER_QUIT',
  'PROTOCOL_PACKETS_OUT_OF_ORDER',
  'ER_SERVER_SHUTDOWN'
]);

function callLogger(logger, level, message) {
  if (logger && typeof logger[level] === 'function') {
    logger[level](message);
    return;
  }
  if (logger && typeof logger.log === 'function') {
    logger.log(message);
    return;
  }
  console.log(message);
}

function isRetryableMySqlError(error) {
  if (!error) {
    return false;
  }

  const code = String(error.code || '').trim().toUpperCase();
  if (RETRYABLE_MYSQL_ERROR_CODES.has(code)) {
    return true;
  }

  const message = String(error.message || '').trim().toLowerCase();
  return (
    message.includes('econnrefused') ||
    message.includes('etimedout') ||
    message.includes('connect etimedout') ||
    message.includes('connection lost') ||
    message.includes('connection refused') ||
    message.includes('server has gone away') ||
    message.includes('read econ') ||
    message.includes('socket hang up')
  );
}

function buildPoolOptions(config, host) {
  return {
    host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: config.connectionLimit || 10,
    connectTimeout: config.connectTimeoutMs || 5000,
    ssl: config.ssl
  };
}

function orderHosts(hosts, activeHost) {
  if (!activeHost || !hosts.includes(activeHost)) {
    return hosts.slice();
  }
  return [activeHost, ...hosts.filter((host) => host !== activeHost)];
}

function createConnectionWrapper(connection, host) {
  return {
    activeHost: host,
    beginTransaction: (...args) => connection.beginTransaction(...args),
    commit: (...args) => connection.commit(...args),
    rollback: (...args) => connection.rollback(...args),
    query: (...args) => connection.query(...args),
    execute: (...args) => connection.execute(...args),
    release: (...args) => connection.release(...args)
  };
}

function createResilientMySqlPool(config, { logger = console, logPrefix = 'mysql' } = {}) {
  const mysqlConfig = config && typeof config === 'object' ? config : {};
  const hosts = Array.isArray(mysqlConfig.hosts)
    ? mysqlConfig.hosts.filter(Boolean)
    : String(mysqlConfig.host || '').trim()
      ? [String(mysqlConfig.host).trim()]
      : [];

  const pools = new Map();
  let activeHost = hosts[0] || '';

  async function closePool(host) {
    const existingPool = pools.get(host);
    if (!existingPool) {
      return;
    }
    pools.delete(host);
    try {
      await existingPool.end();
    } catch (_) {
      // Ignore pool shutdown failures while rotating hosts.
    }
  }

  function setActiveHost(host, reason) {
    if (!host) {
      return;
    }
    if (activeHost !== host) {
      const suffix = reason ? ` (${reason})` : '';
      callLogger(logger, 'warn', `[${logPrefix}] Switched active MySQL host to ${host}${suffix}`);
    }
    activeHost = host;
  }

  async function getPool(host) {
    if (pools.has(host)) {
      return pools.get(host);
    }
    const pool = mysql.createPool(buildPoolOptions(mysqlConfig, host));
    pools.set(host, pool);
    return pool;
  }

  async function withPool(operation, { context = 'operation' } = {}) {
    let lastError = null;
    const orderedHosts = orderHosts(hosts, activeHost);

    for (const host of orderedHosts) {
      const pool = await getPool(host);
      try {
        const result = await operation(pool, host);
        setActiveHost(host, context);
        return result;
      } catch (error) {
        if (!isRetryableMySqlError(error) || orderedHosts.length === 1) {
          throw error;
        }
        lastError = error;
        callLogger(
          logger,
          'warn',
          `[${logPrefix}] MySQL host ${host} failed with ${String(error.code || error.message || 'unknown error')}; trying next host`
        );
        await closePool(host);
      }
    }

    throw lastError || new Error(`[${logPrefix}] No MySQL hosts are available`);
  }

  return {
    query(sql, params) {
      return withPool((pool) => pool.query(sql, params), { context: 'query' });
    },
    execute(sql, params) {
      return withPool((pool) => pool.execute(sql, params), { context: 'execute' });
    },
    getConnection() {
      return withPool(async (pool, host) => {
        const connection = await pool.getConnection();
        return createConnectionWrapper(connection, host);
      }, { context: 'connection' });
    },
    async end() {
      const shutdowns = [];
      for (const host of pools.keys()) {
        shutdowns.push(closePool(host));
      }
      await Promise.allSettled(shutdowns);
    },
    getState() {
      return {
        hosts: hosts.slice(),
        activeHost: activeHost || null
      };
    }
  };
}

module.exports = {
  createResilientMySqlPool,
  isRetryableMySqlError
};
