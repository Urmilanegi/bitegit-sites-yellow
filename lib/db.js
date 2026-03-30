const { MongoClient } = require('mongodb');

const DEFAULT_DB_NAME = 'bitegit';

let client = null;
let db = null;
let connected = false;
let cachedCollections = null;
let connectingPromise = null;
let activeConfig = null;

function toBool(value) {
  return String(value || '')
    .trim()
    .toLowerCase() === 'true';
}

function maskMongoUri(uri) {
  const raw = String(uri || '').trim();
  if (!raw) {
    return '';
  }

  return raw.replace(
    /(mongodb(?:\+srv)?:\/\/)([^@/]+)@/i,
    (_, prefix, credentials) => {
      const user = String(credentials || '').split(':')[0] || 'user';
      return `${prefix}${user}:***@`;
    }
  );
}

function scoreMongoUriCandidate(uri) {
  const normalized = String(uri || '').trim().toLowerCase();
  if (!normalized) {
    return -1;
  }
  if (normalized.startsWith('mongodb+srv://')) {
    return 40;
  }
  if (/mongodb(?:\+srv)?:\/\/[^/]*mongodb\.net/i.test(normalized)) {
    return 35;
  }
  if (/mongodb(?:\+srv)?:\/\/[^/]*:\d+/.test(normalized)) {
    return 15;
  }
  return 10;
}

function resolvePreferredMongoUri() {
  const candidates = [
    { source: 'MONGODB_URI', value: process.env.MONGODB_URI },
    { source: 'MONGO_URI', value: process.env.MONGO_URI }
  ]
    .map((item) => ({
      source: item.source,
      value: String(item.value || '').trim()
    }))
    .filter((item) => item.value);

  if (candidates.length === 0) {
    return { uri: '', source: '' };
  }

  candidates.sort((left, right) => scoreMongoUriCandidate(right.value) - scoreMongoUriCandidate(left.value));
  return {
    uri: candidates[0].value,
    source: candidates[0].source
  };
}

function loadMongoConfig() {
  const resolvedUri = resolvePreferredMongoUri();
  const uri = resolvedUri.uri;
  const dbName = String(process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME).trim() || DEFAULT_DB_NAME;
  const allowLocalMongo = toBool(process.env.ALLOW_LOCAL_MONGO);
  const maskedUri = maskMongoUri(uri);
  const maxPoolSize = Math.max(5, Number.parseInt(String(process.env.MONGO_MAX_POOL_SIZE || '15'), 10) || 15);
  const minPoolSize = Math.max(0, Number.parseInt(String(process.env.MONGO_MIN_POOL_SIZE || '0'), 10) || 0);
  const serverSelectionTimeoutMS = Math.max(
    5000,
    Number.parseInt(String(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || '20000'), 10) || 20000
  );
  const connectTimeoutMS = Math.max(
    5000,
    Number.parseInt(String(process.env.MONGO_CONNECT_TIMEOUT_MS || '20000'), 10) || 20000
  );
  const socketTimeoutMS = Math.max(
    10000,
    Number.parseInt(String(process.env.MONGO_SOCKET_TIMEOUT_MS || '45000'), 10) || 45000
  );
  const maxIdleTimeMS = Math.max(
    10000,
    Number.parseInt(String(process.env.MONGO_MAX_IDLE_TIME_MS || '60000'), 10) || 60000
  );

  return {
    uri,
    dbName,
    allowLocalMongo,
    maskedUri,
    uriSource: resolvedUri.source,
    maxPoolSize,
    minPoolSize,
    serverSelectionTimeoutMS,
    connectTimeoutMS,
    socketTimeoutMS,
    maxIdleTimeMS
  };
}

function isLocalMongoUri(uri) {
  const normalized = String(uri || '').trim().toLowerCase();
  return /mongodb(?:\+srv)?:\/\/[^/]*(localhost|127\.0\.0\.1|\[::1\])/.test(normalized);
}

function formatMongoConnectionError(error, config) {
  const baseMessage = String(error?.message || 'Unknown MongoDB connection failure');
  const hints = [];

  if (/ECONNREFUSED|127\.0\.0\.1|localhost/i.test(baseMessage)) {
    hints.push('Connection refused. Use a valid Atlas URI in MONGO_URI/MONGODB_URI or set ALLOW_LOCAL_MONGO=true for local MongoDB.');
  }

  if (/bad auth|Authentication failed|auth failed/i.test(baseMessage)) {
    hints.push('Check Atlas username/password in MONGO_URI/MONGODB_URI and ensure user has DB access.');
  }

  if (/querySrv ENOTFOUND|ENOTFOUND|dns/i.test(baseMessage)) {
    hints.push('DNS resolution failed. Verify Atlas cluster host in MONGO_URI/MONGODB_URI.');
  }

  const hintMessage = hints.length > 0 ? ` Hint: ${hints.join(' ')}` : '';
  return `MongoDB connection failed for database "${config.dbName}". ${baseMessage}.${hintMessage}`;
}

function getMongoConfig() {
  const current = loadMongoConfig();
  return {
    uri: current.uri,
    maskedUri: current.maskedUri,
    uriSource: current.uriSource,
    dbName: current.dbName,
    allowLocalMongo: current.allowLocalMongo
  };
}

async function connectToMongo() {
  if (connected && db) {
    return db;
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  const config = loadMongoConfig();
  if (!config.uri) {
    throw new Error('MONGO_URI or MONGODB_URI is required. Add it in .env (recommended Atlas URI).');
  }

  if (isLocalMongoUri(config.uri) && !config.allowLocalMongo) {
    throw new Error(
      'Local MongoDB URI detected but local mode is disabled. Use Atlas MONGO_URI/MONGODB_URI or set ALLOW_LOCAL_MONGO=true.'
    );
  }

  connectingPromise = (async () => {
    try {
      client = new MongoClient(config.uri, {
        maxPoolSize: config.maxPoolSize,
        minPoolSize: config.minPoolSize,
        serverSelectionTimeoutMS: config.serverSelectionTimeoutMS,
        connectTimeoutMS: config.connectTimeoutMS,
        socketTimeoutMS: config.socketTimeoutMS,
        maxIdleTimeMS: config.maxIdleTimeMS
      });

      await client.connect();
      db = client.db(config.dbName);
      await db.command({ ping: 1 });
      connected = true;
      cachedCollections = null;
      activeConfig = { dbName: config.dbName, uri: config.uri };

      client.once('close', () => {
        connected = false;
      });

      return db;
    } catch (error) {
      connected = false;
      db = null;
      cachedCollections = null;
      if (client) {
        try {
          await client.close();
        } catch (closeError) {
          // Ignore cleanup errors.
        }
      }
      client = null;
      throw new Error(formatMongoConnectionError(error, config));
    } finally {
      connectingPromise = null;
    }
  })();

  return connectingPromise;
}

function isDbConnected() {
  return connected;
}

function getMongoClient() {
  if (!client) {
    throw new Error('MongoDB client not initialized');
  }
  return client;
}

function getDb() {
  if (!db) {
    throw new Error('MongoDB not connected');
  }
  return db;
}

function getCollections() {
  if (cachedCollections) {
    return cachedCollections;
  }

  const database = getDb();
  cachedCollections = {
    leads: database.collection('leads'),
    adminSessions: database.collection('admin_sessions'),
    refreshTokens: database.collection('refresh_tokens'),
    adminUsers: database.collection('admin_users'),
    adminUserProfiles: database.collection('admin_user_profiles'),
    adminSessionsV2: database.collection('admin_sessions_v2'),
    adminRefreshTokens: database.collection('admin_refresh_tokens'),
    adminAuditLogs: database.collection('admin_audit_logs'),
    adminLoginHistory: database.collection('admin_login_history'),
    adminPlatformSettings: database.collection('admin_platform_settings'),
    adminSupportTickets: database.collection('admin_support_tickets'),
    adminWalletConfig: database.collection('admin_wallet_config'),
    adminHotWallets: database.collection('admin_hot_wallets'),
    adminWithdrawals: database.collection('admin_withdrawals'),
    adminDeposits: database.collection('admin_deposits'),
    adminSpotPairs: database.collection('admin_spot_pairs'),
    adminP2PConfig: database.collection('admin_p2p_config'),
    adminComplianceFlags: database.collection('admin_compliance_flags'),
    adminApiLogs: database.collection('admin_api_logs'),
    adminNotifications: database.collection('admin_notifications'),
    adminKycDocuments: database.collection('admin_kyc_documents'),
    signupOtps: database.collection('signup_otps'),
    p2pCredentials: database.collection('p2p_credentials'),
    p2pKycRequests: database.collection('p2p_kyc_requests'),
    p2pUserSessions: database.collection('p2p_user_sessions'),
    wallets: database.collection('wallets'),
    ledgerEntries: database.collection('ledger_entries'),
    walletFailures: database.collection('wallet_failures'),
    withdrawalRequests: database.collection('withdrawal_requests'),
    auditLogs: database.collection('audit_logs'),
    p2pOffers: database.collection('p2p_offers'),
    p2pOrders: database.collection('p2p_orders'),
    tradeOrders: database.collection('trade_orders'),
    appMeta: database.collection('app_meta'),
    counters: database.collection('counters'),
    p2pPaymentMethods: database.collection('p2p_payment_methods'),
    p2pRatings: database.collection('p2p_ratings')
  };

  return cachedCollections;
}

module.exports = {
  connectToMongo,
  getCollections,
  getMongoClient,
  getMongoConfig,
  isDbConnected
};
