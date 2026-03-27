const crypto = require('crypto');
const fs = require('fs');
const { promisify } = require('util');
const { buildRefreshTokenRecord, toRefreshTokenResponse } = require('../models/RefreshToken');
const { toWithdrawalResponse } = require('../models/WithdrawalRequest');
const {
  ACTIVE_ORDER_STATUSES,
  EXPIRABLE_ORDER_STATUSES
} = require('./p2p-order-state');
const USER_ACTIVE_ORDER_STATUSES = ACTIVE_ORDER_STATUSES;

const scryptAsync = promisify(crypto.scrypt);

function toDate(value) {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'number') {
    return new Date(value);
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
}

function toLeadResponse(doc) {
  return {
    id: doc.id,
    name: doc.name,
    mobile: doc.mobile,
    createdAt: toDate(doc.createdAt).toISOString(),
    verified: doc.verified,
    verificationMethod: doc.verificationMethod,
    source: doc.source
  };
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const digest = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${digest}`;
}

async function hashPasswordAsync(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const digest = await scryptAsync(password, salt, 64);
  return `${salt}:${Buffer.from(digest).toString('hex')}`;
}

function verifyPassword(password, storedHash) {
  const [salt, digest] = String(storedHash || '').split(':');
  if (!salt || !digest) {
    return false;
  }

  const check = crypto.scryptSync(password, salt, 64);
  const digestBuffer = Buffer.from(digest, 'hex');
  if (digestBuffer.length !== check.length) {
    return false;
  }
  return crypto.timingSafeEqual(digestBuffer, check);
}

async function verifyPasswordAsync(password, storedHash) {
  const [salt, digest] = String(storedHash || '').split(':');
  if (!salt || !digest) {
    return false;
  }

  const check = await scryptAsync(password, salt, 64);
  const checkBuffer = Buffer.from(check);
  const digestBuffer = Buffer.from(digest, 'hex');
  if (digestBuffer.length !== checkBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(digestBuffer, checkBuffer);
}

const KYC_STATUSES = ['NOT_SUBMITTED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED'];

function normalizeKycStatus(status) {
  const normalized = String(status || '').trim().toUpperCase();
  if (KYC_STATUSES.includes(normalized)) {
    return normalized;
  }
  return 'NOT_SUBMITTED';
}

function normalizeUserAliasValue(value) {
  return String(value || '').trim().toLowerCase();
}

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildAliasRegex(value) {
  const normalized = normalizeUserAliasValue(value);
  if (!normalized) {
    return null;
  }
  return new RegExp(`^${escapeRegex(normalized)}$`, 'i');
}

function buildP2POrderParticipantQuery(userInput, { activeOnly = false } = {}) {
  const user = userInput && typeof userInput === 'object' ? userInput : { id: userInput };
  const ids = new Set();
  const usernames = new Set();
  const emails = new Set();

  const normalizedId = String(user?.id || '').trim();
  const normalizedEmail = normalizeUserAliasValue(user?.email);
  const normalizedUsername = normalizeUserAliasValue(user?.username);

  if (normalizedId) {
    ids.add(normalizedId);
  }
  if (normalizedEmail) {
    ids.add(normalizedEmail);
    emails.add(normalizedEmail);
    usernames.add(normalizedEmail.split('@')[0] || '');
  }
  if (normalizedUsername) {
    usernames.add(normalizedUsername);
    ids.add(normalizedUsername);
  }

  usernames.delete('');

  const orConditions = [];
  for (const id of ids) {
    const idRegex = buildAliasRegex(id);
    orConditions.push(
      { 'participants.id': id },
      { buyerUserId: id },
      { buyerId: id },
      { sellerUserId: id },
      { sellerId: id }
    );
    if (idRegex) {
      orConditions.push(
        { 'participants.id': idRegex },
        { buyerUserId: idRegex },
        { buyerId: idRegex },
        { sellerUserId: idRegex },
        { sellerId: idRegex }
      );
    }
  }
  for (const email of emails) {
    const emailRegex = buildAliasRegex(email);
    orConditions.push(
      { buyerEmail: email },
      { sellerEmail: email }
    );
    if (emailRegex) {
      orConditions.push(
        { buyerEmail: emailRegex },
        { sellerEmail: emailRegex }
      );
    }
  }
  for (const username of usernames) {
    const usernameRegex = buildAliasRegex(username);
    orConditions.push(
      { 'participants.username': username },
      { buyerUsername: username },
      { sellerUsername: username }
    );
    if (usernameRegex) {
      orConditions.push(
        { 'participants.username': usernameRegex },
        { buyerUsername: usernameRegex },
        { sellerUsername: usernameRegex }
      );
    }
  }

  if (!orConditions.length) {
    return null;
  }

  return activeOnly
    ? { status: { $in: USER_ACTIVE_ORDER_STATUSES }, $or: orConditions }
    : { $or: orConditions };
}

function createRepositories(collections) {
  const {
    leads,
    adminSessions,
    refreshTokens,
    signupOtps,
    p2pCredentials,
    p2pKycRequests,
    p2pUserSessions,
    wallets,
    ledgerEntries,
    walletFailures,
    withdrawalRequests,
    auditLogs,
    p2pOffers,
    p2pOrders,
    tradeOrders,
    appMeta,
    counters,
    p2pPaymentMethods
  } = collections;
  const SELLER_ACTIVE_ORDER_STATUSES = ACTIVE_ORDER_STATUSES;
  const SELLER_ACTIVE_ORDER_INDEX_NAME = 'uniq_p2p_orders_seller_active';
  const SIGNUP_OTP_COMPOSITE_INDEX_NAME = 'uniq_signup_otp_contact_purpose';

  function hasSameItems(a = [], b = []) {
    return a.length === b.length && a.every((item) => b.includes(item));
  }

  async function ensureSellerActiveOrderIndex() {
    const indexes = await p2pOrders.indexes();
    let hasDesiredIndex = false;

    for (const index of indexes) {
      if (!index || index.name === '_id_') {
        continue;
      }

      const key = index.key || {};
      const isSellerSingleKey = Object.keys(key).length === 1 && key.sellerUserId === 1;
      if (!isSellerSingleKey || index.unique !== true) {
        continue;
      }

      const statuses = Array.isArray(index.partialFilterExpression?.status?.$in)
        ? index.partialFilterExpression.status.$in.map((value) => String(value).trim().toUpperCase())
        : [];
      const matches = hasSameItems(statuses, SELLER_ACTIVE_ORDER_STATUSES);

      if (matches) {
        hasDesiredIndex = true;
        continue;
      }

      // Drop legacy/conflicting seller active-order indexes to avoid startup conflicts.
      await p2pOrders.dropIndex(index.name);
    }

    if (!hasDesiredIndex) {
      await p2pOrders.createIndex(
        { sellerUserId: 1 },
        {
          name: SELLER_ACTIVE_ORDER_INDEX_NAME,
          unique: true,
          partialFilterExpression: {
            status: { $in: SELLER_ACTIVE_ORDER_STATUSES }
          }
        }
      );
    }
  }

  async function ensureSignupOtpIndexes() {
    const indexes = await signupOtps.indexes();
    let hasDesiredIndex = false;

    for (const index of indexes) {
      if (!index || index.name === '_id_') {
        continue;
      }

      const key = index.key || {};
      const keyFields = Object.keys(key);
      const isLegacyContactOnly = keyFields.length === 1 && key.contact === 1;
      const isCompositeContactPurpose = keyFields.length === 2 && key.contact === 1 && key.purpose === 1;

      if (isCompositeContactPurpose && index.unique === true) {
        hasDesiredIndex = true;
        continue;
      }

      if (isLegacyContactOnly && index.unique === true) {
        // Drop legacy unique index to allow separate OTP purposes for the same contact.
        await signupOtps.dropIndex(index.name);
      }
    }

    if (!hasDesiredIndex) {
      await signupOtps.createIndex(
        { contact: 1, purpose: 1 },
        { name: SIGNUP_OTP_COMPOSITE_INDEX_NAME, unique: true }
      );
    }

    await signupOtps.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  }

  async function ensureIndexes() {
    // Seller active-order unique index removed — sellers can have multiple concurrent orders
    // Drop it from DB if it exists from a previous deployment
    try {
      const existingIdxs = await p2pOrders.indexes();
      for (const idx of existingIdxs) {
        if (idx.name === 'uniq_p2p_orders_seller_active') {
          await p2pOrders.dropIndex(idx.name);
        }
      }
    } catch (_) { /* ignore if index doesn't exist */ }
    await ensureSignupOtpIndexes();

    await Promise.all([
      leads.createIndex({ createdAt: -1 }),
      adminSessions.createIndex({ token: 1 }, { unique: true }),
      adminSessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      refreshTokens.createIndex({ tokenHash: 1 }, { unique: true }),
      refreshTokens.createIndex({ userId: 1 }, { unique: true }),
      refreshTokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      p2pCredentials.createIndex({ email: 1 }, { unique: true }),
      p2pKycRequests.createIndex({ requestId: 1 }, { unique: true }),
      p2pKycRequests.createIndex({ userId: 1 }, { unique: true }),
      p2pKycRequests.createIndex({ updatedAt: -1 }),
      p2pUserSessions.createIndex({ token: 1 }, { unique: true }),
      p2pUserSessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      wallets.createIndex({ userId: 1 }, { unique: true }),
      wallets.createIndex({ updatedAt: -1 }),
      wallets.createIndex({ availableBalance: 1 }),
      wallets.createIndex({ lockedBalance: 1 }),
      ledgerEntries.createIndex({ userId: 1, createdAt: -1 }),
      ledgerEntries.createIndex({ referenceId: 1 }),
      ledgerEntries.createIndex({ type: 1, createdAt: -1 }),
      walletFailures.createIndex({ userId: 1, createdAt: -1 }),
      withdrawalRequests.createIndex({ requestId: 1 }, { unique: true }),
      withdrawalRequests.createIndex({ userId: 1, status: 1, createdAt: -1 }),
      withdrawalRequests.createIndex(
        { userId: 1, currency: 1, address: 1, status: 1 },
        {
          unique: true,
          partialFilterExpression: { status: 'pending' }
        }
      ),
      auditLogs.createIndex({ userId: 1, createdAt: -1 }),
      auditLogs.createIndex({ action: 1, createdAt: -1 }),
      auditLogs.createIndex({ createdAt: -1 }),
      p2pOffers.createIndex({ id: 1 }, { unique: true }),
      p2pOffers.createIndex({ side: 1, asset: 1, price: 1 }),
      p2pOffers.createIndex({ status: 1, side: 1, asset: 1 }),
      p2pOffers.createIndex({ merchantDepositLocked: 1, isDemo: 1, environment: 1 }),
      p2pOrders.createIndex({ id: 1 }, { unique: true }),
      p2pOrders.createIndex({ reference: 1 }, { unique: true }),
      p2pOrders.createIndex({ status: 1 }),
      p2pOrders.createIndex({ expiresAt: 1 }),
      p2pOrders.createIndex({ status: 1, updatedAt: -1 }),
      // Indexes for listP2POrderHistory — critical for fast per-user order lookups
      p2pOrders.createIndex({ buyerUserId: 1, updatedAt: -1 }),
      p2pOrders.createIndex({ sellerUserId: 1, updatedAt: -1 }),
      p2pOrders.createIndex({ buyerId: 1, updatedAt: -1 }),
      p2pOrders.createIndex({ sellerId: 1, updatedAt: -1 }),
      p2pOrders.createIndex({ buyerUserId: 1, status: 1, updatedAt: -1 }),
      p2pOrders.createIndex({ sellerUserId: 1, status: 1, updatedAt: -1 }),
      p2pOrders.createIndex({ buyerId: 1, status: 1, updatedAt: -1 }),
      p2pOrders.createIndex({ sellerId: 1, status: 1, updatedAt: -1 }),
      p2pOrders.createIndex({ 'participants.id': 1, updatedAt: -1 }),
      p2pOrders.createIndex({ 'participants.id': 1, status: 1, updatedAt: -1 }),
      p2pOrders.createIndex({ buyerUsername: 1, updatedAt: -1 }),
      p2pOrders.createIndex({ sellerUsername: 1, updatedAt: -1 }),
      p2pOrders.createIndex({ buyerUsername: 1, status: 1, updatedAt: -1 }),
      p2pOrders.createIndex({ sellerUsername: 1, status: 1, updatedAt: -1 }),
      p2pOrders.createIndex({ 'participants.username': 1, updatedAt: -1 }),
      p2pOrders.createIndex({ 'participants.username': 1, status: 1, updatedAt: -1 }),
      p2pOrders.createIndex({ updatedAt: -1 }),
      tradeOrders.createIndex({ createdAt: -1 }),
      appMeta.createIndex({ key: 1 }, { unique: true }),
      counters.createIndex({ key: 1 }, { unique: true })
    ]);
  }

  async function getMeta(key) {
    return appMeta.findOne({ key });
  }

  async function setMeta(key, value = {}) {
    await appMeta.updateOne(
      { key },
      {
        $set: {
          key,
          ...value,
          at: new Date()
        }
      },
      { upsert: true }
    );
  }

  async function migrateLegacyLeadsJsonOnce(jsonPath) {
    const metaKey = 'leads_migrated_v1';
    const existingMeta = await getMeta(metaKey);
    if (existingMeta?.done) {
      return { migrated: false, reason: 'already_migrated' };
    }

    if (!fs.existsSync(jsonPath)) {
      await setMeta(metaKey, { done: true, reason: 'legacy_file_missing' });
      return { migrated: false, reason: 'legacy_file_missing' };
    }

    let parsed = [];
    try {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      const json = JSON.parse(raw);
      if (Array.isArray(json)) {
        parsed = json;
      }
    } catch (error) {
      await setMeta(metaKey, { done: false, reason: 'parse_error', error: error.message });
      throw error;
    }

    if (!parsed.length) {
      await setMeta(metaKey, { done: true, reason: 'no_legacy_rows' });
      return { migrated: false, reason: 'no_legacy_rows' };
    }

    const ops = parsed.map((lead) => {
      const createdAt = toDate(lead.createdAt || Date.now());
      const uniqueKey = `${lead.id || '0'}_${createdAt.toISOString()}_${String(lead.mobile || '').toLowerCase()}`;
      const migrationDoc = {
        _legacyMigrationKey: uniqueKey,
        id: Number(lead.id || Date.now()),
        name: String(lead.name || 'Website Lead'),
        mobile: String(lead.mobile || ''),
        createdAt,
        source: lead.source ? String(lead.source) : 'legacy_import'
      };

      if (lead.verified !== undefined) {
        migrationDoc.verified = Boolean(lead.verified);
      }

      if (lead.verificationMethod) {
        migrationDoc.verificationMethod = String(lead.verificationMethod);
      }

      return {
        updateOne: {
          filter: { _legacyMigrationKey: uniqueKey },
          update: {
            $setOnInsert: migrationDoc
          },
          upsert: true
        }
      };
    });

    if (ops.length) {
      await leads.bulkWrite(ops, { ordered: false });
    }

    await setMeta(metaKey, { done: true, imported: ops.length });
    return { migrated: true, imported: ops.length };
  }

  async function saveLeadRecord(name, mobile, extra = {}) {
    const now = new Date();
    const doc = {
      id: Number(Date.now()),
      name: String(name || 'Website Lead'),
      mobile: String(mobile || ''),
      createdAt: now,
      ...extra
    };
    await leads.insertOne(doc);
    return toLeadResponse(doc);
  }

  async function getLeadsLatest() {
    const rows = await leads.find({}).sort({ createdAt: -1 }).toArray();
    return rows.map(toLeadResponse);
  }

  async function createAdminSession(token, expiresAtMs) {
    await adminSessions.updateOne(
      { token },
      {
        $set: {
          token,
          expiresAt: new Date(expiresAtMs)
        }
      },
      { upsert: true }
    );
  }

  async function getAdminSession(token) {
    return adminSessions.findOne({ token });
  }

  async function refreshAdminSession(token, expiresAtMs) {
    await adminSessions.updateOne(
      { token },
      { $set: { expiresAt: new Date(expiresAtMs) } }
    );
  }

  async function deleteAdminSession(token) {
    await adminSessions.deleteOne({ token });
  }

  async function saveRefreshToken(input) {
    const doc = buildRefreshTokenRecord(input);
    await refreshTokens.updateOne(
      { userId: doc.userId },
      {
        $set: doc
      },
      { upsert: true }
    );
    return toRefreshTokenResponse(doc);
  }

  async function getRefreshTokenByHash(tokenHash) {
    const row = await refreshTokens.findOne({ tokenHash: String(tokenHash || '').trim() });
    return toRefreshTokenResponse(row);
  }

  async function deleteRefreshTokenByHash(tokenHash) {
    await refreshTokens.deleteOne({ tokenHash: String(tokenHash || '').trim() });
  }

  async function deleteRefreshTokensByUserId(userId) {
    await refreshTokens.deleteMany({ userId: String(userId || '').trim() });
  }

  async function upsertSignupOtp(contact, otp, options = {}) {
    const purpose = String(options.purpose || 'signup').trim().toLowerCase() || 'signup';
    const payload =
      otp && typeof otp.payload === 'object' && otp.payload !== null
        ? otp.payload
        : {};
    await signupOtps.updateOne(
      { contact, purpose },
      {
        $set: {
          contact,
          purpose,
          code: otp.code,
          type: otp.type,
          attempts: Number(otp.attempts || 0),
          expiresAt: new Date(otp.expiresAt),
          payload
        }
      },
      { upsert: true }
    );
  }

  async function getSignupOtp(contact, options = {}) {
    const purpose = String(options.purpose || 'signup').trim().toLowerCase() || 'signup';
    return signupOtps.findOne({ contact, purpose });
  }

  async function deleteSignupOtp(contact, options = {}) {
    const purpose = String(options.purpose || 'signup').trim().toLowerCase() || 'signup';
    await signupOtps.deleteOne({ contact, purpose });
  }

  async function setP2PCredential(email, passwordHash, options = {}) {
    const now = new Date();
    const role = String(options.role || 'USER').trim().toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';
    const hasMerchantFlag = options.isMerchant !== undefined;
    const hasMerchantDepositFlag = options.merchantDepositLocked !== undefined;
    const hasEmailVerifiedFlag = options.emailVerified !== undefined;
    const nextMerchantLevel = String(options.merchantLevel || '').trim().toLowerCase();
    const nextUsername = String(options.username || '').trim();
    const nextAvatar = String(options.avatar || '').trim();
    const nextUserId = String(options.userId || '').trim();

    const updateDoc = {
      email,
      passwordHash,
      role,
      updatedAt: now
    };

    if (hasMerchantFlag) {
      updateDoc.isMerchant = Boolean(options.isMerchant);
    }
    if (hasMerchantDepositFlag) {
      updateDoc.merchantDepositLocked = Boolean(options.merchantDepositLocked);
    }
    if (nextMerchantLevel) {
      updateDoc.merchantLevel = nextMerchantLevel;
    }
    if (nextUsername) {
      updateDoc.username = nextUsername;
    }
    if (nextAvatar) {
      updateDoc.avatar = nextAvatar;
    }
    if (nextUserId) {
      updateDoc.userId = nextUserId;
    }
    if (hasEmailVerifiedFlag) {
      updateDoc.emailVerified = Boolean(options.emailVerified);
      updateDoc.emailVerifiedAt = Boolean(options.emailVerified) ? now : null;
    }

    await p2pCredentials.updateOne(
      { email },
      {
        $set: updateDoc,
        $setOnInsert: {
          createdAt: now,
          isMerchant: false,
          merchantDepositLocked: false,
          merchantLevel: 'trial',
          kycStatus: 'NOT_SUBMITTED',
          kycLevel: 'BASIC',
          kycUpdatedAt: null,
          kycVerifiedAt: null,
          kycRejectedAt: null,
          kycRejectionReason: '',
          kycAadhaarLast4: '',
          kycRequestId: '',
          emailVerified: false,
          emailVerifiedAt: null
        }
      },
      { upsert: true }
    );
  }

  async function getP2PCredential(email) {
    return p2pCredentials.findOne({ email });
  }

  async function updateP2PCredentialPassword(email, passwordHash) {
    await p2pCredentials.updateOne(
      { email },
      {
        $set: {
          passwordHash,
          updatedAt: new Date()
        }
      }
    );
  }

  async function updateP2PCredentialProfile(email, payload = {}, options = {}) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const nextUsername = String(payload.username || payload.nickname || '').trim();
    const nextAvatar = String(payload.avatar || '').trim();
    const nextUserId = String(options.userId || '').trim();
    const patch = {
      updatedAt: new Date()
    };

    if (nextUsername) {
      patch.username = nextUsername;
    }
    if (payload.avatar !== undefined) {
      patch.avatar = nextAvatar;
    }
    if (nextUserId) {
      patch.userId = nextUserId;
    }

    await p2pCredentials.updateOne(
      { email: normalizedEmail },
      { $set: patch }
    );

    return getP2PCredential(normalizedEmail);
  }

  async function touchP2PCredentialLogin(email, loginMeta = {}) {
    const updateDoc = {
      updatedAt: new Date(),
      lastLoginAt: new Date()
    };

    if (loginMeta.ipAddress) {
      updateDoc.lastLoginIp = String(loginMeta.ipAddress).trim();
    }
    if (loginMeta.userAgent) {
      updateDoc.lastUserAgent = String(loginMeta.userAgent).trim();
    }
    if (loginMeta.deviceLabel) {
      updateDoc.lastLoginDevice = String(loginMeta.deviceLabel).trim();
    }

    await p2pCredentials.updateOne(
      { email },
      { $set: updateDoc }
    );
  }

  async function updateP2PCredentialKyc(email, payload = {}) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const status = normalizeKycStatus(payload.status);
    const now = new Date();
    const patch = {
      updatedAt: now,
      kycStatus: status,
      kycUpdatedAt: now
    };

    if (payload.kycLevel !== undefined) {
      patch.kycLevel = String(payload.kycLevel || 'FULL').trim().toUpperCase() || 'FULL';
    }
    if (payload.requestId !== undefined) {
      patch.kycRequestId = String(payload.requestId || '').trim();
    }
    if (payload.aadhaarLast4 !== undefined) {
      patch.kycAadhaarLast4 = String(payload.aadhaarLast4 || '').trim().slice(-4);
    }
    if (payload.faceMatchScore !== undefined) {
      const numericScore = Number(payload.faceMatchScore);
      patch.kycFaceMatchScore = Number.isFinite(numericScore) ? Number(numericScore.toFixed(2)) : null;
    }
    if (payload.faceMatchProvider !== undefined) {
      patch.kycFaceMatchProvider = String(payload.faceMatchProvider || '').trim();
    }
    if (status === 'VERIFIED') {
      patch.kycVerifiedAt = now;
      patch.kycRejectedAt = null;
      patch.kycRejectionReason = '';
    } else if (status === 'REJECTED') {
      patch.kycRejectedAt = now;
      patch.kycVerifiedAt = null;
      patch.kycRejectionReason = String(payload.rejectionReason || 'AI face match failed').trim();
    } else {
      patch.kycVerifiedAt = null;
      patch.kycRejectedAt = null;
      patch.kycRejectionReason = String(payload.rejectionReason || '').trim();
    }

    await p2pCredentials.updateOne(
      { email: normalizedEmail },
      {
        $set: patch
      }
    );

    return getP2PCredential(normalizedEmail);
  }

  async function upsertP2PKycRequest(userId, email, payload = {}) {
    const normalizedUserId = String(userId || '').trim();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const requestId = String(payload.requestId || '').trim();
    const now = new Date();
    const status = normalizeKycStatus(payload.status || 'PENDING_REVIEW');

    const doc = {
      requestId,
      userId: normalizedUserId,
      email: normalizedEmail,
      status,
      aadhaarMasked: String(payload.aadhaarMasked || '').trim(),
      aadhaarHash: String(payload.aadhaarHash || '').trim(),
      aadhaarFrontImage: String(payload.aadhaarFrontImage || '').trim(),
      aadhaarBackImage: String(payload.aadhaarBackImage || '').trim(),
      selfieWithDocumentImage: String(payload.selfieWithDocumentImage || '').trim(),
      rejectionReason: String(payload.rejectionReason || '').trim(),
      faceMatch: payload.faceMatch && typeof payload.faceMatch === 'object' ? payload.faceMatch : {},
      createdAt: payload.createdAt ? toDate(payload.createdAt) : now,
      updatedAt: now
    };

    await p2pKycRequests.updateOne(
      { userId: normalizedUserId },
      { $set: doc },
      { upsert: true }
    );

    return p2pKycRequests.findOne({ userId: normalizedUserId });
  }

  async function getP2PKycRequestByUserId(userId) {
    const normalizedUserId = String(userId || '').trim();
    if (!normalizedUserId) {
      return null;
    }
    return p2pKycRequests.findOne({ userId: normalizedUserId });
  }

  async function createP2PUserSession(token, user, expiresAtMs) {
    await p2pUserSessions.updateOne(
      { token },
      {
        $set: {
          token,
          userId: user.id,
          username: user.username,
          email: user.email,
          role: String(user.role || 'USER').trim().toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER',
          expiresAt: new Date(expiresAtMs)
        }
      },
      { upsert: true }
    );
  }

  async function getP2PUserSession(token) {
    return p2pUserSessions.findOne({ token });
  }

  async function refreshP2PUserSession(token, expiresAtMs) {
    await p2pUserSessions.updateOne(
      { token },
      { $set: { expiresAt: new Date(expiresAtMs) } }
    );
  }

  async function deleteP2PUserSession(token) {
    await p2pUserSessions.deleteOne({ token });
  }

  async function ensureCounter(key, value) {
    await counters.updateOne(
      { key },
      { $setOnInsert: { key, value: Number(value || 0) } },
      { upsert: true }
    );
  }

  async function nextCounterValue(key) {
    const result = await counters.findOneAndUpdate(
      { key },
      { $inc: { value: 1 } },
      { returnDocument: 'after', upsert: true }
    );
    // MongoDB driver v6 returns the document directly (result = doc)
    // v3/v4 returned { value: doc }, so result.value was the doc and result.value.value was the counter
    // In v6: result.value IS the counter number
    const counterValue = typeof result?.value === 'object' ? result?.value?.value : result?.value;
    return Number(counterValue || 1);
  }

  async function getOfferMaxNumericId() {
    const rows = await p2pOffers
      .find({ id: /^ofr_\d+$/ }, { projection: { id: 1 } })
      .toArray();

    if (!rows.length) {
      return 1000;
    }

    let maxId = 1000;
    for (const row of rows) {
      const parsed = Number.parseInt(String(row.id).replace('ofr_', ''), 10);
      if (Number.isFinite(parsed) && parsed > maxId) {
        maxId = parsed;
      }
    }

    return maxId;
  }

  async function ensureSeedOffers() {
    const existingCount = await p2pOffers.countDocuments({});
    if (existingCount > 0) {
      await p2pOffers.updateMany(
        {},
        [
          {
            $set: {
              status: {
                $let: {
                  vars: { normalizedStatus: { $toUpper: { $ifNull: ['$status', 'ACTIVE'] } } },
                  in: {
                    $cond: [{ $eq: ['$$normalizedStatus', 'ACTIVE'] }, 'ACTIVE', '$status']
                  }
                }
              },
              availableAmount: { $ifNull: ['$availableAmount', '$available'] },
              escrowLockedAmount: {
                $ifNull: ['$escrowLockedAmount', { $ifNull: ['$availableAmount', '$available'] }]
              },
              merchantDepositLocked: { $ifNull: ['$merchantDepositLocked', false] },
              isDemo: { $ifNull: ['$isDemo', false] },
              environment: { $ifNull: ['$environment', 'production'] },
              fundingSource: { $ifNull: ['$fundingSource', 'legacy'] },
              updatedAt: new Date()
            }
          }
        ]
      );
      const maxId = await getOfferMaxNumericId();
      await ensureCounter('p2p_offer_seq', maxId);
      return { seeded: false, count: existingCount };
    }

    await ensureCounter('p2p_offer_seq', 1000);
    return { seeded: false, count: 0 };
  }

  async function listOffers(filter = {}) {
    const query = {};
    const andConditions = [];
    if (filter.side) {
      query.side = filter.side;
    }
    if (filter.asset) {
      query.asset = filter.asset;
    }

    if (filter.activeOnly) {
      query.status = 'ACTIVE';
    }
    if (filter.merchantDepositLocked === true) {
      query.merchantDepositLocked = true;
    }
    if (filter.excludeDemo) {
      andConditions.push({ isDemo: { $ne: true } });
      andConditions.push({ environment: { $ne: 'demo' } });
    }
    if (filter.escrowBackedOnly) {
      query.fundingSource = 'ad_locked';
    }
    if (filter.merchantOwnedOnly) {
      andConditions.push({ createdByUserId: { $exists: true, $ne: '' } });
    }
    if (filter.availableOnly) {
      andConditions.push({
        $or: [{ availableAmount: { $gt: 0 } }, { available: { $gt: 0 } }]
      });
    }
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const rows = await p2pOffers.find(query).toArray();
    return rows.map((row) => {
      const mapped = { ...row };
      delete mapped._id;
      return mapped;
    });
  }

  async function getOfferById(offerId) {
    const row = await p2pOffers.findOne({ id: offerId });
    if (!row) {
      return null;
    }
    const mapped = { ...row };
    delete mapped._id;
    return mapped;
  }

  async function updateOffer(offerId, userId, updates) {
    const allowedFields = ['price', 'minLimit', 'maxLimit', 'payments', 'status', 'remark'];
    const setFields = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) setFields[key] = updates[key];
    }
    setFields.updatedAt = new Date();
    const result = await p2pOffers.updateOne(
      { id: offerId, createdByUserId: userId },
      { $set: setFields }
    );
    if (result.matchedCount === 0) return null;
    const row = await p2pOffers.findOne({ id: offerId });
    if (!row) return null;
    const mapped = { ...row }; delete mapped._id; return mapped;
  }

  async function deleteOffer(offerId, userId) {
    // Only delete if no active orders exist for this offer
    const result = await p2pOffers.deleteOne({ id: offerId, createdByUserId: userId, status: { $ne: 'DELETED' } });
    return result.deletedCount === 1;
  }

  async function createOffer(offer) {
    const doc = {
      ...offer,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await p2pOffers.insertOne(doc);
    const mapped = { ...doc };
    delete mapped._id;
    return mapped;
  }

  async function createTradeOrder(order) {
    const doc = {
      ...order,
      createdAt: toDate(order.createdAt || Date.now())
    };
    await tradeOrders.insertOne(doc);

    const overflowIds = await tradeOrders
      .find({}, { projection: { _id: 1 } })
      .sort({ createdAt: -1 })
      .skip(100)
      .toArray();

    if (overflowIds.length > 0) {
      await tradeOrders.deleteMany({
        _id: {
          $in: overflowIds.map((row) => row._id)
        }
      });
    }

    const mapped = { ...doc, createdAt: doc.createdAt.toISOString() };
    delete mapped._id;
    return mapped;
  }

  async function listTradeOrders(limit = 30) {
    const rows = await tradeOrders.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
    return rows.map((row) => {
      const mapped = { ...row, createdAt: toDate(row.createdAt).toISOString() };
      delete mapped._id;
      return mapped;
    });
  }

  async function countTradeOrders() {
    return tradeOrders.countDocuments({});
  }

  // ===== PAYMENT METHODS =====
  async function listPaymentMethods(userId) {
    const rows = await p2pPaymentMethods.find({ userId }).sort({ createdAt: 1 }).toArray();
    return rows.map(r => { const m = { ...r }; delete m._id; return m; });
  }

  async function addPaymentMethod(userId, method) {
    const id = `pm_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
    const doc = { id, userId, ...method, createdAt: new Date(), updatedAt: new Date() };
    await p2pPaymentMethods.insertOne(doc);
    const mapped = { ...doc }; delete mapped._id; return mapped;
  }

  async function updatePaymentMethod(id, userId, updates) {
    const allowed = ['nickname','upiId','bankName','accountNumber','ifsc','accountHolder','details','type'];
    const setFields = { updatedAt: new Date() };
    for (const key of allowed) { if (updates[key] !== undefined) setFields[key] = updates[key]; }
    const result = await p2pPaymentMethods.updateOne({ id, userId }, { $set: setFields });
    if (result.matchedCount === 0) return null;
    const row = await p2pPaymentMethods.findOne({ id, userId });
    if (!row) return null;
    const mapped = { ...row }; delete mapped._id; return mapped;
  }

  async function deletePaymentMethod(id, userId) {
    const result = await p2pPaymentMethods.deleteOne({ id, userId });
    return result.deletedCount === 1;
  }
  // ===== END PAYMENT METHODS =====

  // ===== USER REPUTATION =====
  async function getP2PCredentialByUserId(userId) {
    if (!userId) return null;
    return p2pCredentials.findOne({ userId: String(userId) });
  }

  async function getUserReputation(userId) {
    const cred = await p2pCredentials.findOne({ userId });
    if (!cred) return null;
    const completed = cred.rep_completedOrders || 0;
    const cancelled = cred.rep_cancelledOrders || 0;
    const total = completed + cancelled;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100;
    const totalReleaseMs = cred.rep_totalReleaseTimeMs || 0;
    const releaseCount = cred.rep_totalReleasedCount || 0;
    const avgReleaseMinutes = releaseCount > 0 ? Math.round(totalReleaseMs / releaseCount / 60000) : null;
    return {
      userId,
      username: cred.username || cred.email,
      completedOrders: completed,
      cancelledOrders: cancelled,
      totalOrders: total,
      completionRate,
      avgReleaseMinutes,
      joinedAt: cred.createdAt || null
    };
  }

  async function incRepCompleted(userId, releaseTimeMs) {
    await p2pCredentials.updateOne(
      { userId },
      { $inc: { rep_completedOrders: 1, rep_totalReleasedCount: 1, rep_totalReleaseTimeMs: releaseTimeMs || 0 } }
    );
  }

  async function incRepCancelled(userId) {
    await p2pCredentials.updateOne({ userId }, { $inc: { rep_cancelledOrders: 1 } });
  }
  // ===== END USER REPUTATION =====

  async function createP2POrder(order) {
    await p2pOrders.insertOne(order);
    return order;
  }

  async function getP2POrderById(id) {
    const row = await p2pOrders.findOne({ id });
    if (!row) {
      return null;
    }
    delete row._id;
    return row;
  }

  async function getP2POrderByReference(reference) {
    const row = await p2pOrders.findOne({ reference });
    if (!row) {
      return null;
    }
    delete row._id;
    return row;
  }

  async function listP2PLiveOrders({ side, asset, limit = 20 } = {}) {
    const query = {
      status: { $in: ACTIVE_ORDER_STATUSES }
    };
    if (side) {
      query.side = side;
    }
    if (asset) {
      query.asset = asset;
    }

    const rows = await p2pOrders.find(query).sort({ updatedAt: -1 }).limit(limit).toArray();
    return rows.map((row) => {
      const mapped = { ...row };
      delete mapped._id;
      return mapped;
    });
  }

  async function listP2PActiveOrdersForUser({ user, userId, email, username, limit = 50 } = {}) {
    const query = buildP2POrderParticipantQuery(
      user && typeof user === 'object'
        ? user
        : {
            id: userId,
            email,
            username
          },
      { activeOnly: true }
    );
    if (!query) {
      return [];
    }

    const rows = await p2pOrders.find(query).sort({ updatedAt: -1 }).limit(limit).toArray();
    return rows.map((row) => {
      const mapped = { ...row };
      delete mapped._id;
      return mapped;
    });
  }

  async function listP2POrderHistory(userInput, { limit = 10, offset = 0 } = {}) {
    const query = buildP2POrderParticipantQuery(userInput);
    if (!query) {
      return {
        total: 0,
        hasMore: false,
        orders: []
      };
    }
    const total = await p2pOrders.countDocuments(query);
    const rows = await p2pOrders.find(query).sort({ updatedAt: -1 }).skip(offset).limit(limit).toArray();
    return {
      total,
      hasMore: offset + limit < total,
      orders: rows.map((row) => { const mapped = { ...row }; delete mapped._id; return mapped; })
    };
  }

  async function replaceP2POrderIfVersionMatches(id, expectedUpdatedAt, updatedOrder) {
    const result = await p2pOrders.replaceOne(
      { id, updatedAt: expectedUpdatedAt },
      updatedOrder
    );
    return result.modifiedCount === 1;
  }

  async function expireOpenOrders(nowMs = Date.now()) {
    await p2pOrders.updateMany(
      {
        status: { $in: EXPIRABLE_ORDER_STATUSES },
        expiresAt: { $lte: nowMs }
      },
      {
        $set: {
          status: 'EXPIRED',
          updatedAt: nowMs
        }
      }
    );
  }

  async function createWithdrawalRequest(doc, { session = null } = {}) {
    const payload = {
      ...doc,
      createdAt: toDate(doc.createdAt || Date.now()),
      processedAt: doc.processedAt ? toDate(doc.processedAt) : null
    };
    await withdrawalRequests.insertOne(payload, session ? { session } : undefined);
    return toWithdrawalResponse(payload);
  }

  async function getWithdrawalRequestById(requestId, { session = null } = {}) {
    const row = await withdrawalRequests.findOne({ requestId: String(requestId || '').trim() }, session ? { session } : undefined);
    return toWithdrawalResponse(row);
  }

  async function getPendingWithdrawalByFingerprint({ userId, currency, address }, { session = null } = {}) {
    const row = await withdrawalRequests.findOne(
      {
        userId: String(userId || '').trim(),
        currency: String(currency || '').trim().toUpperCase(),
        address: String(address || '').trim(),
        status: 'pending'
      },
      session ? { session } : undefined
    );
    return toWithdrawalResponse(row);
  }

  async function listWithdrawalsByUser(userId, limit = 50) {
    const rows = await withdrawalRequests
      .find({ userId: String(userId || '').trim() })
      .sort({ createdAt: -1 })
      .limit(Math.min(Math.max(Number(limit) || 20, 1), 100))
      .toArray();
    return rows.map((row) => toWithdrawalResponse(row));
  }

  async function updateWithdrawalStatus(requestId, status, metadata = {}, { session = null } = {}) {
    const now = new Date();
    const normalizedStatus = String(status || '').trim().toLowerCase();
    await withdrawalRequests.updateOne(
      { requestId: String(requestId || '').trim() },
      {
        $set: {
          status: normalizedStatus,
          processedAt: now,
          metadata: metadata && typeof metadata === 'object' ? metadata : {}
        }
      },
      session ? { session } : undefined
    );
    return getWithdrawalRequestById(requestId, { session });
  }

  async function writeAuditLog(entry) {
    await auditLogs.insertOne({
      userId: String(entry?.userId || '').trim(),
      action: String(entry?.action || 'unknown_action').trim().toLowerCase(),
      ipAddress: String(entry?.ipAddress || '').trim(),
      metadata: entry?.metadata && typeof entry.metadata === 'object' ? entry.metadata : {},
      createdAt: toDate(entry?.createdAt || Date.now())
    });
  }

  return {
    ensureIndexes,
    migrateLegacyLeadsJsonOnce,
    saveLeadRecord,
    getLeadsLatest,
    createAdminSession,
    getAdminSession,
    refreshAdminSession,
    deleteAdminSession,
    saveRefreshToken,
    getRefreshTokenByHash,
    deleteRefreshTokenByHash,
    deleteRefreshTokensByUserId,
    upsertSignupOtp,
    getSignupOtp,
    deleteSignupOtp,
    setP2PCredential,
    getP2PCredential,
    updateP2PCredentialPassword,
    updateP2PCredentialProfile,
    touchP2PCredentialLogin,
    updateP2PCredentialKyc,
    upsertP2PKycRequest,
    getP2PKycRequestByUserId,
    createP2PUserSession,
    getP2PUserSession,
    refreshP2PUserSession,
    deleteP2PUserSession,
    ensureCounter,
    nextCounterValue,
    ensureSeedOffers,
    listOffers,
    getOfferById,
    createOffer,
    createTradeOrder,
    listTradeOrders,
    countTradeOrders,
    createP2POrder,
    getP2POrderById,
    getP2POrderByReference,
    listP2PLiveOrders,
    listP2PActiveOrdersForUser,
    listP2POrderHistory,
    replaceP2POrderIfVersionMatches,
    expireOpenOrders,
    createWithdrawalRequest,
    getWithdrawalRequestById,
    getPendingWithdrawalByFingerprint,
    listWithdrawalsByUser,
    updateWithdrawalStatus,
    writeAuditLog,
    hashPassword,
    hashPasswordAsync,
    verifyPassword,
    verifyPasswordAsync,
    getP2PCredentialByUserId,
    getUserReputation,
    incRepCompleted,
    incRepCancelled,
    updateOffer,
    deleteOffer,
    listPaymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
  };
}

module.exports = {
  createRepositories
};
