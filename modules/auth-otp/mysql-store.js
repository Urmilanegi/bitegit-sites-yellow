const mysql = require('mysql2/promise');
const crypto = require('crypto');

function normalizeEmail(raw) {
  return String(raw || '').trim().toLowerCase();
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const digest = crypto.scryptSync(String(password || ''), salt, 64).toString('hex');
  return `scrypt$${salt}$${digest}`;
}

async function verifyPasswordAsync(password, storedHash) {
  const [algorithm, salt, digest] = String(storedHash || '').split('$');
  if (algorithm !== 'scrypt' || !salt || !digest) {
    return false;
  }
  const check = await new Promise((resolve, reject) => {
    crypto.scrypt(String(password || ''), salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(derivedKey);
    });
  });
  return crypto.timingSafeEqual(Buffer.from(digest, 'hex'), check);
}

function toMySqlDateTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mi = String(d.getUTCMinutes()).padStart(2, '0');
  const ss = String(d.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function createMySqlAuthStore(config, { logger = console } = {}) {
  const mysqlConfig = config && typeof config === 'object' ? config : {};
  const enabled = Boolean(mysqlConfig.enabled);
  let pool = null;

  async function initialize() {
    if (!enabled) {
      return false;
    }
    if (pool) {
      return true;
    }

    pool = mysql.createPool({
      host: mysqlConfig.host,
      port: mysqlConfig.port,
      user: mysqlConfig.user,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
      waitForConnections: true,
      connectionLimit: mysqlConfig.connectionLimit || 10,
      connectTimeout: mysqlConfig.connectTimeoutMs || 5000,
      ssl: mysqlConfig.ssl
    });

    await pool.query('SELECT 1');
    await ensureTables();
    logger.log('[auth-otp] MySQL store initialized');
    return true;
  }

  async function ensureTables() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_otps (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        purpose VARCHAR(64) NOT NULL DEFAULT 'auth_otp',
        otp_hash VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
        payload_json LONGTEXT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_email_otps_email_created (email, purpose, created_at),
        KEY idx_email_otps_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id VARCHAR(64) NULL,
        email VARCHAR(255) NOT NULL,
        username VARCHAR(80) NULL,
        password VARCHAR(255) NULL,
        role VARCHAR(24) NOT NULL DEFAULT 'USER',
        email_verified TINYINT(1) NOT NULL DEFAULT 1,
        kyc_status VARCHAR(32) NOT NULL DEFAULT 'pending',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY ux_users_user_id_auth (user_id),
        UNIQUE KEY ux_users_email_auth (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Keep compatibility if the table already existed from earlier deployments.
    await pool.query("ALTER TABLE email_otps ADD COLUMN IF NOT EXISTS purpose VARCHAR(64) NOT NULL DEFAULT 'auth_otp'");
    await pool.query('ALTER TABLE email_otps ADD COLUMN IF NOT EXISTS payload_json LONGTEXT NULL');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255) NULL');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS user_id VARCHAR(64) NULL');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(80) NULL');
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(24) NOT NULL DEFAULT 'USER'");
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified TINYINT(1) NOT NULL DEFAULT 1');
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(32) NOT NULL DEFAULT 'pending'");
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
    await pool.query(
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
    );

    try {
      await pool.query('ALTER TABLE users ADD UNIQUE KEY ux_users_email_auth (email)');
    } catch (error) {
      if (!String(error.message || '').toLowerCase().includes('duplicate')) {
        throw error;
      }
    }

    try {
      await pool.query('ALTER TABLE users ADD UNIQUE KEY ux_users_user_id_auth (user_id)');
    } catch (error) {
      if (!String(error.message || '').toLowerCase().includes('duplicate')) {
        throw error;
      }
    }
  }

  function assertReady() {
    if (!enabled || !pool) {
      const error = new Error('Auth OTP MySQL store is not configured');
      error.statusCode = 503;
      error.code = 'AUTH_OTP_STORE_DISABLED';
      throw error;
    }
  }

  async function countOtpRequestsInLastHour(email) {
    assertReady();
    const normalizedEmail = normalizeEmail(email);
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS count
       FROM email_otps
       WHERE email = ?
         AND created_at >= (UTC_TIMESTAMP() - INTERVAL 1 HOUR)`,
      [normalizedEmail]
    );
    return Number(rows?.[0]?.count || 0);
  }

  async function createOtpRecord(email, otpHash, expiresAt) {
    assertReady();
    const normalizedEmail = normalizeEmail(email);
    await pool.execute("DELETE FROM email_otps WHERE email = ? AND purpose = 'auth_otp'", [normalizedEmail]);
    const [result] = await pool.execute(
      `INSERT INTO email_otps (email, purpose, otp_hash, expires_at, attempts, payload_json, created_at)
       VALUES (?, 'auth_otp', ?, ?, 0, NULL, UTC_TIMESTAMP())`,
      [normalizedEmail, String(otpHash || '').trim(), toMySqlDateTime(expiresAt)]
    );
    return Number(result.insertId || 0);
  }

  async function getLatestOtpRecord(email) {
    assertReady();
    const normalizedEmail = normalizeEmail(email);
    const [rows] = await pool.execute(
      `SELECT id, email, otp_hash, expires_at, attempts, payload_json, created_at
       FROM email_otps
       WHERE email = ? AND purpose = 'auth_otp'
       ORDER BY created_at DESC
       LIMIT 1`,
      [normalizedEmail]
    );
    const row = rows?.[0];
    if (!row) {
      return null;
    }

    return {
      id: Number(row.id),
      email: normalizeEmail(row.email),
      otpHash: String(row.otp_hash || '').trim(),
      expiresAt: new Date(row.expires_at),
      attempts: Number(row.attempts || 0),
      payload:
        row.payload_json && String(row.payload_json).trim()
          ? JSON.parse(String(row.payload_json))
          : {},
      createdAt: new Date(row.created_at)
    };
  }

  async function incrementOtpAttempts(otpId) {
    assertReady();
    await pool.execute('UPDATE email_otps SET attempts = attempts + 1 WHERE id = ?', [Number(otpId)]);
    const [rows] = await pool.execute('SELECT attempts FROM email_otps WHERE id = ?', [Number(otpId)]);
    return Number(rows?.[0]?.attempts || 0);
  }

  async function deleteOtpRecordById(otpId) {
    assertReady();
    await pool.execute('DELETE FROM email_otps WHERE id = ?', [Number(otpId)]);
  }

  async function findUserByEmail(email) {
    assertReady();
    const normalizedEmail = normalizeEmail(email);
    const [rows] = await pool.execute(
      `SELECT id, user_id, email, username, password, role, email_verified, kyc_status, created_at, updated_at
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [normalizedEmail]
    );
    const row = rows?.[0];
    if (!row) {
      return null;
    }

    return {
      id: Number(row.id),
      userId: String(row.user_id || '').trim(),
      email: normalizeEmail(row.email),
      username: String(row.username || '').trim(),
      password: row.password,
      role: String(row.role || 'USER').trim().toUpperCase() || 'USER',
      emailVerified: Boolean(row.email_verified),
      kycStatus: String(row.kyc_status || 'pending').trim().toLowerCase(),
      createdAt: new Date(row.created_at),
      updatedAt: row.updated_at ? new Date(row.updated_at) : null
    };
  }

  async function createUser(email, options = {}) {
    assertReady();
    const normalizedEmail = normalizeEmail(email);
    const passwordHash = String(options.passwordHash || '').trim() || null;
    const username = String(options.username || '').trim() || null;
    const role = String(options.role || 'USER').trim().toUpperCase() || 'USER';
    const userId = String(options.userId || '').trim() || null;
    const emailVerified = options.emailVerified === undefined ? true : Boolean(options.emailVerified);
    const kycStatus = String(options.kycStatus || 'pending').trim().toLowerCase() || 'pending';
    const [result] = await pool.execute(
      `INSERT INTO users (user_id, email, username, password, role, email_verified, kyc_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())`,
      [userId, normalizedEmail, username, passwordHash, role, emailVerified ? 1 : 0, kycStatus]
    );
    const created = await findUserByEmail(normalizedEmail);
    if (created) {
      return created;
    }
    return {
      id: Number(result.insertId || 0),
      userId: userId || '',
      email: normalizedEmail,
      username: username || '',
      password: passwordHash,
      role,
      emailVerified,
      kycStatus,
      createdAt: new Date()
    };
  }

  async function setP2PCredential(email, passwordHash, options = {}) {
    assertReady();
    const normalizedEmail = normalizeEmail(email);
    const normalizedPasswordHash = String(passwordHash || '').trim();
    const userId = String(options.userId || '').trim() || null;
    const username = String(options.username || '').trim() || null;
    const role = String(options.role || 'USER').trim().toUpperCase() || 'USER';
    const emailVerified = options.emailVerified === undefined ? true : Boolean(options.emailVerified);
    const kycStatus = String(options.kycStatus || 'pending').trim().toLowerCase() || 'pending';

    await pool.execute(
      `INSERT INTO users (user_id, email, username, password, role, email_verified, kyc_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())
       ON DUPLICATE KEY UPDATE
         user_id = COALESCE(VALUES(user_id), user_id),
         username = COALESCE(VALUES(username), username),
         password = VALUES(password),
         role = VALUES(role),
         email_verified = VALUES(email_verified),
         kyc_status = VALUES(kyc_status),
         updated_at = UTC_TIMESTAMP()`,
      [userId, normalizedEmail, username, normalizedPasswordHash, role, emailVerified ? 1 : 0, kycStatus]
    );
  }

  async function getP2PCredential(email) {
    const user = await findUserByEmail(email);
    if (!user) {
      return null;
    }
    return {
      id: user.userId || '',
      userId: user.userId || '',
      email: user.email,
      username: user.username || '',
      passwordHash: String(user.password || '').trim(),
      role: user.role || 'USER',
      emailVerified: user.emailVerified === true,
      kycStatus: user.kycStatus || 'pending',
      createdAt: user.createdAt || null,
      updatedAt: user.updatedAt || null
    };
  }

  async function updateP2PCredentialPassword(email, passwordHash) {
    assertReady();
    const normalizedEmail = normalizeEmail(email);
    await pool.execute(
      'UPDATE users SET password = ?, updated_at = UTC_TIMESTAMP() WHERE email = ?',
      [String(passwordHash || '').trim(), normalizedEmail]
    );
  }

  async function updateP2PCredentialProfile(email, payload = {}, options = {}) {
    assertReady();
    const normalizedEmail = normalizeEmail(email);
    const nextUsername = String(payload.username || payload.nickname || '').trim();
    const nextUserId = String(options.userId || '').trim();
    const updates = [];
    const params = [];

    if (nextUsername) {
      updates.push('username = ?');
      params.push(nextUsername);
    }
    if (nextUserId) {
      updates.push('user_id = ?');
      params.push(nextUserId);
    }
    if (updates.length === 0) {
      return getP2PCredential(normalizedEmail);
    }
    params.push(normalizedEmail);
    await pool.execute(
      `UPDATE users SET ${updates.join(', ')}, updated_at = UTC_TIMESTAMP() WHERE email = ?`,
      params
    );
    return getP2PCredential(normalizedEmail);
  }

  async function touchP2PCredentialLogin() {
    return true;
  }

  async function upsertSignupOtp(contact, otpState, options = {}) {
    assertReady();
    const normalizedEmail = normalizeEmail(contact);
    const purpose = String(options.purpose || 'signup').trim().toLowerCase() || 'signup';
    const payload =
      otpState?.payload && typeof otpState.payload === 'object' && otpState.payload !== null
        ? JSON.stringify(otpState.payload)
        : null;
    await pool.execute('DELETE FROM email_otps WHERE email = ? AND purpose = ?', [normalizedEmail, purpose]);
    await pool.execute(
      `INSERT INTO email_otps (email, purpose, otp_hash, expires_at, attempts, payload_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())`,
      [
        normalizedEmail,
        purpose,
        String(otpState?.code || '').trim(),
        toMySqlDateTime(otpState?.expiresAt || Date.now()),
        Number(otpState?.attempts || 0),
        payload
      ]
    );
  }

  async function getSignupOtp(contact, options = {}) {
    assertReady();
    const normalizedEmail = normalizeEmail(contact);
    const purpose = String(options.purpose || 'signup').trim().toLowerCase() || 'signup';
    const [rows] = await pool.execute(
      `SELECT otp_hash, expires_at, attempts, payload_json
       FROM email_otps
       WHERE email = ? AND purpose = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [normalizedEmail, purpose]
    );
    const row = rows?.[0];
    if (!row) {
      return null;
    }
    let payload = {};
    if (row.payload_json && String(row.payload_json).trim()) {
      try {
        payload = JSON.parse(String(row.payload_json));
      } catch (_) {
        payload = {};
      }
    }
    return {
      code: String(row.otp_hash || '').trim(),
      type: 'email',
      attempts: Number(row.attempts || 0),
      expiresAt: new Date(row.expires_at),
      payload
    };
  }

  async function deleteSignupOtp(contact, options = {}) {
    assertReady();
    const normalizedEmail = normalizeEmail(contact);
    const purpose = String(options.purpose || 'signup').trim().toLowerCase() || 'signup';
    await pool.execute('DELETE FROM email_otps WHERE email = ? AND purpose = ?', [normalizedEmail, purpose]);
  }

  async function close() {
    if (!pool) {
      return;
    }
    await pool.end();
    pool = null;
  }

  return {
    initialize,
    close,
    enabled,
    countOtpRequestsInLastHour,
    createOtpRecord,
    getLatestOtpRecord,
    incrementOtpAttempts,
    deleteOtpRecordById,
    findUserByEmail,
    createUser
    ,
    hashPassword,
    verifyPasswordAsync,
    setP2PCredential,
    getP2PCredential,
    updateP2PCredentialPassword,
    updateP2PCredentialProfile,
    touchP2PCredentialLogin,
    upsertSignupOtp,
    getSignupOtp,
    deleteSignupOtp
  };
}

module.exports = {
  createMySqlAuthStore,
  normalizeEmail
};
