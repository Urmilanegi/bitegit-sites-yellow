const { buildAuditLogRecord } = require('../models/AuditLog');

const AUDIT_LOG_TIMEOUT_MS = Math.max(
  50,
  Number.parseInt(String(process.env.AUDIT_LOG_TIMEOUT_MS || '150'), 10) || 150
);

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function createAuditLogService(collections) {
  const { auditLogs } = collections;

  async function log(entry = {}) {
    if (!auditLogs) {
      return null;
    }

    const record = buildAuditLogRecord(entry);
    await auditLogs.insertOne(record);
    return record;
  }

  async function safeLog(entry = {}) {
    try {
      const writePromise = Promise.resolve().then(() => log(entry));
      writePromise.catch(() => {});
      await Promise.race([writePromise, delay(AUDIT_LOG_TIMEOUT_MS)]);
    } catch (error) {
      // Audit logging should not break request flow.
    }
  }

  return {
    log,
    safeLog
  };
}

module.exports = {
  createAuditLogService
};
