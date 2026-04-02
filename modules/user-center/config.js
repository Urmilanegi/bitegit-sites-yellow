const { resolveMySqlHosts } = require('../../lib/mysql-hosts');

function toInt(value, fallback) {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeBool(value) {
  const raw = String(value || '').trim().toLowerCase();
  return raw === '1' || raw === 'true' || raw === 'yes';
}

function readUserCenterConfig() {
  const mysqlHosts = resolveMySqlHosts(
    process.env.USER_CENTER_MYSQL_HOSTS,
    process.env.MYSQL_HOSTS,
    process.env.USER_CENTER_MYSQL_HOST,
    process.env.USER_CENTER_MYSQL_STANDBY_HOST,
    process.env.MYSQL_HOST,
    process.env.MYSQL_STANDBY_HOST
  );
  const mysqlHost = mysqlHosts[0] || '';
  const mysqlUser = String(process.env.USER_CENTER_MYSQL_USER || process.env.MYSQL_USER || '').trim();
  const mysqlPassword = String(process.env.USER_CENTER_MYSQL_PASSWORD || process.env.MYSQL_PASSWORD || '').trim();
  const mysqlDatabase = String(process.env.USER_CENTER_MYSQL_DATABASE || process.env.MYSQL_DATABASE || '').trim();

  return {
    mysql: {
      enabled: Boolean(mysqlHosts.length && mysqlUser && mysqlDatabase),
      host: mysqlHost,
      hosts: mysqlHosts,
      port: toInt(process.env.USER_CENTER_MYSQL_PORT || process.env.MYSQL_PORT, 3306),
      user: mysqlUser,
      password: mysqlPassword,
      database: mysqlDatabase,
      connectionLimit: toInt(process.env.USER_CENTER_MYSQL_POOL_SIZE || process.env.MYSQL_POOL_SIZE, 10),
      connectTimeoutMs: Math.max(
        2000,
        toInt(process.env.USER_CENTER_MYSQL_CONNECT_TIMEOUT_MS || process.env.MYSQL_CONNECT_TIMEOUT_MS || process.env.MYSQL_CONNECT_TIMEOUT_MS, 5000)
      ),
      ssl: normalizeBool(process.env.USER_CENTER_MYSQL_SSL || process.env.MYSQL_SSL)
        ? {
            rejectUnauthorized: normalizeBool(process.env.USER_CENTER_MYSQL_SSL_STRICT || process.env.MYSQL_SSL_STRICT)
          }
        : undefined
    },
    app: {
      defaultVipLevel: String(process.env.USER_CENTER_DEFAULT_VIP_LEVEL || 'Non-VIP').trim(),
      accountRecoveryDays: Math.max(1, toInt(process.env.USER_CENTER_RECOVERY_DAYS, 50))
    }
  };
}

module.exports = {
  readUserCenterConfig
};
