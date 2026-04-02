const crypto = require('crypto');

const SUPPORTED_COINS = ['BTC', 'USDT', 'ETH', 'LTC', 'BCH', 'TRX', 'DOGE', 'XRP', 'SOL', 'BNB'];
const SUPPORTED_NETWORKS_BY_COIN = {
  BTC: ['BTC'],
  USDT: ['TRC20', 'ERC20', 'BEP20'],
  ETH: ['ERC20'],
  LTC: ['LTC'],
  BCH: ['BCH'],
  TRX: ['TRC20'],
  DOGE: ['DOGE'],
  XRP: ['XRP'],
  SOL: ['SOL'],
  BNB: ['BEP20']
};

function normalizeEmail(raw) {
  return String(raw || '').trim().toLowerCase();
}

function normalizeCoin(raw) {
  const normalized = String(raw || '').trim().toUpperCase();
  return SUPPORTED_COINS.includes(normalized) ? normalized : 'USDT';
}

function normalizeNetwork(raw, coin) {
  const normalizedCoin = normalizeCoin(coin);
  const normalizedNetwork = String(raw || '').trim().toUpperCase();
  const allowed = SUPPORTED_NETWORKS_BY_COIN[normalizedCoin] || [normalizedCoin];
  return allowed.includes(normalizedNetwork) ? normalizedNetwork : allowed[0];
}

function normalizeKycStatus(raw) {
  const normalized = String(raw || '').trim().toLowerCase();
  if (['unverified', 'pending', 'verified'].includes(normalized)) {
    return normalized;
  }
  return 'unverified';
}

function toDate(value) {
  if (!value) {
    return null;
  }
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toIso(value) {
  const parsed = toDate(value);
  return parsed ? parsed.toISOString() : null;
}

function randomUid() {
  return String(crypto.randomInt(100000000, 999999999));
}

function randomId(prefix) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

function parseJson(raw, fallback) {
  if (!raw) {
    return fallback;
  }
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }
  if (typeof raw !== 'object') {
    return fallback;
  }
  return raw;
}

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function shapeUser(doc) {
  if (!doc) {
    return null;
  }

  return {
    id: String(doc.id || ''),
    externalUserId: String(doc.externalUserId || '').trim(),
    email: normalizeEmail(doc.email),
    nickname: String(doc.nickname || 'Bitegit User').trim(),
    avatar: doc.avatar ? String(doc.avatar).trim() : '',
    uid: String(doc.uid || '').trim(),
    vipLevel: String(doc.vipLevel || 'Non-VIP').trim(),
    kycStatus: normalizeKycStatus(doc.kycStatus || 'unverified'),
    country: String(doc.country || '').trim(),
    fullName: String(doc.fullName || '').trim(),
    idNumberMasked: String(doc.idNumberMasked || '').trim(),
    phone: String(doc.phone || '').trim(),
    twofaEnabled: Boolean(doc.twofaEnabled),
    accountStatus: String(doc.accountStatus || 'active').trim().toLowerCase(),
    deletedAt: toIso(doc.deletedAt),
    recoveryUntil: toIso(doc.recoveryUntil),
    createdAt: toIso(doc.createdAt),
    updatedAt: toIso(doc.updatedAt)
  };
}

function shapeAddress(doc) {
  return {
    id: String(doc.id || ''),
    coin: String(doc.coin || '').toUpperCase(),
    network: String(doc.network || '').toUpperCase(),
    address: String(doc.address || ''),
    label: String(doc.label || ''),
    createdAt: toIso(doc.createdAt)
  };
}

function shapeTicket(doc) {
  return {
    id: String(doc.id || ''),
    subject: String(doc.subject || ''),
    category: String(doc.category || ''),
    status: String(doc.status || ''),
    priority: String(doc.priority || ''),
    escalatedToHuman: Boolean(doc.escalatedToHuman),
    createdAt: toIso(doc.createdAt),
    updatedAt: toIso(doc.updatedAt)
  };
}

function shapeSupportMessage(doc) {
  return {
    id: String(doc.id || ''),
    senderType: String(doc.senderType || 'user'),
    message: String(doc.message || ''),
    attachmentUrl: doc.attachmentUrl ? String(doc.attachmentUrl) : '',
    createdAt: toIso(doc.createdAt)
  };
}

function shapeGift(doc) {
  return {
    id: String(doc.id || ''),
    asset: String(doc.asset || ''),
    amount: Number(doc.amount || 0),
    giftCode: String(doc.giftCode || ''),
    status: String(doc.status || ''),
    createdAt: toIso(doc.createdAt),
    claimedAt: toIso(doc.claimedAt)
  };
}

function createMongoUserCenterStore({ db, logger = console } = {}) {
  if (!db) {
    throw new Error('Mongo database is required for Mongo user center store');
  }

  const users = db.collection('user_center_users');
  const loginHistory = db.collection('user_center_login_history');
  const withdrawAddresses = db.collection('user_center_withdraw_addresses');
  const preferences = db.collection('user_center_preferences');
  const feeConfigs = db.collection('user_center_fee_configs');
  const cryptoGifts = db.collection('user_center_crypto_gifts');
  const giftClaims = db.collection('user_center_gift_claims');
  const referrals = db.collection('user_center_referrals');
  const supportTickets = db.collection('user_center_support_tickets');
  const supportMessages = db.collection('user_center_support_messages');
  const helpArticles = db.collection('user_center_help_articles');
  const announcements = db.collection('user_center_announcements');
  let initialized = false;

  async function initialize() {
    if (initialized) {
      return true;
    }

    await Promise.all([
      users.createIndex({ email: 1 }, { unique: true }),
      users.createIndex({ externalUserId: 1 }, { unique: true, sparse: true }),
      users.createIndex({ uid: 1 }, { unique: true, sparse: true }),
      loginHistory.createIndex({ userId: 1, loginTime: -1 }),
      withdrawAddresses.createIndex({ userId: 1, createdAt: -1 }),
      preferences.createIndex({ userId: 1 }, { unique: true }),
      feeConfigs.createIndex({ feeType: 1, tierLabel: 1 }, { unique: true }),
      cryptoGifts.createIndex({ giftCode: 1 }, { unique: true }),
      cryptoGifts.createIndex({ creatorId: 1, createdAt: -1 }),
      giftClaims.createIndex({ giftId: 1, userId: 1 }, { unique: true }),
      giftClaims.createIndex({ userId: 1, claimedAt: -1 }),
      referrals.createIndex({ referrerId: 1, createdAt: -1 }),
      supportTickets.createIndex({ userId: 1, updatedAt: -1 }),
      supportMessages.createIndex({ ticketId: 1, createdAt: 1 }),
      helpArticles.createIndex({ topic: 1, title: 1 }, { unique: true }),
      announcements.createIndex({ title: 1 }, { unique: true })
    ]);

    await seedStaticData();
    initialized = true;
    logger.log('[user-center] Mongo fallback store initialized');
    return true;
  }

  async function seedStaticData() {
    const feeRows = [
      ['VIP', 'VIP 0', '0.1000%', '0.1000%', '0.0005 BTC', '0.001 BTC', 1],
      ['VIP', 'VIP 1', '0.0900%', '0.1000%', '0.0004 BTC', '0.001 BTC', 2],
      ['SPOT', 'Standard', '0.1000%', '0.1000%', '0.8 USDT', '10 USDT', 1],
      ['FUTURES', 'USDT-M', '0.0200%', '0.0400%', '0.0', '0.0', 1],
      ['WITHDRAWAL', 'USDT-TRC20', '0.0', '0.0', '1 USDT', '10 USDT', 1],
      ['WITHDRAWAL', 'BTC', '0.0', '0.0', '0.0005 BTC', '0.001 BTC', 2]
    ];
    await Promise.all(
      feeRows.map(([feeType, tierLabel, makerFee, takerFee, withdrawalFee, minWithdrawal, sortOrder]) =>
        feeConfigs.updateOne(
          { feeType, tierLabel },
          {
            $set: {
              feeType,
              tierLabel,
              makerFee,
              takerFee,
              withdrawalFee,
              minWithdrawal,
              sortOrder,
              updatedAt: new Date()
            }
          },
          { upsert: true }
        )
      )
    );

    const announcementRows = [
      ['Security Reminder', 'Enable 2FA and fund code to strengthen account security.'],
      ['Support Update', 'Live chat escalations are currently available 24/7 for priority tickets.']
    ];
    await Promise.all(
      announcementRows.map(([title, body]) =>
        announcements.updateOne(
          { title },
          { $setOnInsert: { id: randomId('uca'), title, body, createdAt: new Date() } },
          { upsert: true }
        )
      )
    );

    const helpRows = [
      ['Deposit issues', 'Deposit not credited', 'Check tx hash confirmations and matching network details.'],
      ['Withdrawal issues', 'Withdrawal pending', 'Pending withdrawals may be delayed by risk control checks.'],
      ['KYC verification', 'KYC status review', 'Ensure your profile name and ID document details match exactly.'],
      ['Account restrictions', 'Account locked or limited', 'Contact support with UID and latest login details for review.'],
      ['Security problems', '2FA and login security', 'Reset security methods only through verified identity recovery flow.']
    ];
    await Promise.all(
      helpRows.map(([topic, title, content]) =>
        helpArticles.updateOne(
          { topic, title },
          { $setOnInsert: { id: randomId('uch'), topic, title, content, createdAt: new Date() } },
          { upsert: true }
        )
      )
    );
  }

  async function close() {
    return;
  }

  async function findUserByIdentity({ externalUserId, email }) {
    const normalizedExternal = String(externalUserId || '').trim();
    const normalizedEmail = normalizeEmail(email);

    if (normalizedExternal) {
      const existing = await users.findOne({ externalUserId: normalizedExternal });
      if (existing) {
        return existing;
      }
    }
    if (normalizedEmail) {
      return users.findOne({ email: normalizedEmail });
    }
    return null;
  }

  async function ensureUniqueUid() {
    for (let index = 0; index < 10; index += 1) {
      const candidate = randomUid();
      const existing = await users.findOne({ uid: candidate }, { projection: { _id: 1 } });
      if (!existing) {
        return candidate;
      }
    }
    throw new Error('Unable to generate unique UID');
  }

  async function ensurePreferences(userId) {
    await preferences.updateOne(
      { userId: String(userId) },
      {
        $setOnInsert: {
          userId: String(userId),
          language: 'en',
          currency: 'USD',
          theme: 'dark',
          trendColors: 'green-up',
          notifications: { email: true, security: true, marketing: false },
          pushNotifications: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
  }

  async function upsertUserFromAuth({ externalUserId, email, kycStatus, vipLevel }) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      const error = new Error('Email is required');
      error.statusCode = 400;
      error.code = 'EMAIL_REQUIRED';
      throw error;
    }

    const normalizedExternal = String(externalUserId || '').trim();
    let user = await findUserByIdentity({ externalUserId: normalizedExternal, email: normalizedEmail });
    const now = new Date();

    if (!user) {
      user = {
        id: randomId('ucu'),
        externalUserId: normalizedExternal || '',
        email: normalizedEmail,
        nickname: normalizedEmail.split('@')[0] || 'Bitegit User',
        avatar: '',
        uid: await ensureUniqueUid(),
        vipLevel: String(vipLevel || 'Non-VIP').trim() || 'Non-VIP',
        kycStatus: normalizeKycStatus(kycStatus || 'unverified'),
        country: '',
        fullName: '',
        idNumberMasked: '',
        passwordHash: '',
        phone: '',
        fundCodeHash: '',
        twofaSecret: '',
        twofaEnabled: false,
        accountStatus: 'active',
        deletedAt: null,
        recoveryUntil: null,
        createdAt: now,
        updatedAt: now
      };
      await users.insertOne(user);
    } else {
      const updates = { updatedAt: now };
      if (!user.externalUserId && normalizedExternal) {
        updates.externalUserId = normalizedExternal;
      }
      const normalizedIncomingKyc = normalizeKycStatus(kycStatus || user.kycStatus);
      if (normalizedIncomingKyc !== normalizeKycStatus(user.kycStatus)) {
        updates.kycStatus = normalizedIncomingKyc;
      }
      const normalizedVip = String(vipLevel || user.vipLevel || 'Non-VIP').trim() || 'Non-VIP';
      if (normalizedVip !== String(user.vipLevel || 'Non-VIP')) {
        updates.vipLevel = normalizedVip;
      }
      if (!user.uid) {
        updates.uid = await ensureUniqueUid();
      }
      if (Object.keys(updates).length > 1) {
        await users.updateOne({ id: user.id }, { $set: updates });
        user = await users.findOne({ id: user.id });
      }
    }

    await ensurePreferences(user.id);
    return shapeUser(user);
  }

  async function getUserByIdentity(identity) {
    const user = await findUserByIdentity(identity || {});
    return shapeUser(user);
  }

  async function getUserById(userId) {
    return users.findOne({ id: String(userId) });
  }

  async function updateProfile(userId, { nickname, avatar }) {
    const updates = { updatedAt: new Date() };
    if (nickname !== undefined) {
      const normalizedNickname = String(nickname || '').trim().slice(0, 80);
      if (normalizedNickname.length < 2) {
        const error = new Error('Nickname must be at least 2 characters.');
        error.statusCode = 400;
        error.code = 'NICKNAME_INVALID';
        throw error;
      }
      updates.nickname = normalizedNickname;
    }
    if (avatar !== undefined) {
      updates.avatar = String(avatar || '').trim();
    }
    await users.updateOne({ id: String(userId) }, { $set: updates });
    return shapeUser(await getUserById(userId));
  }

  async function updateIdentityInfo(userId, { country, fullName, idNumberMasked, kycStatus }) {
    await users.updateOne(
      { id: String(userId) },
      {
        $set: {
          country: String(country || '').trim(),
          fullName: String(fullName || '').trim(),
          idNumberMasked: String(idNumberMasked || '').trim(),
          kycStatus: normalizeKycStatus(kycStatus || 'pending'),
          updatedAt: new Date()
        }
      }
    );
    return shapeUser(await getUserById(userId));
  }

  async function changePassword(userId, passwordHash) {
    await users.updateOne(
      { id: String(userId) },
      { $set: { passwordHash: String(passwordHash || '').trim(), updatedAt: new Date() } }
    );
  }

  async function getPasswordHash(userId) {
    const user = await users.findOne({ id: String(userId) }, { projection: { passwordHash: 1 } });
    return user?.passwordHash ? String(user.passwordHash) : '';
  }

  async function changePhone(userId, phone) {
    await users.updateOne(
      { id: String(userId) },
      { $set: { phone: String(phone || '').trim(), updatedAt: new Date() } }
    );
  }

  async function changeEmail(userId, email) {
    const normalized = normalizeEmail(email);
    await users.updateOne(
      { id: String(userId) },
      { $set: { email: normalized, updatedAt: new Date() } }
    );
  }

  async function setFundCodeHash(userId, fundCodeHash) {
    await users.updateOne(
      { id: String(userId) },
      { $set: { fundCodeHash: String(fundCodeHash || '').trim(), updatedAt: new Date() } }
    );
  }

  async function setTwoFactor(userId, { secret, enabled }) {
    await users.updateOne(
      { id: String(userId) },
      {
        $set: {
          twofaSecret: String(secret || '').trim(),
          twofaEnabled: Boolean(enabled),
          updatedAt: new Date()
        }
      }
    );
  }

  async function getTwoFactorSecret(userId) {
    const user = await users.findOne(
      { id: String(userId) },
      { projection: { twofaSecret: 1, twofaEnabled: 1 } }
    );
    return {
      secret: user?.twofaSecret ? String(user.twofaSecret) : '',
      enabled: Boolean(user?.twofaEnabled)
    };
  }

  async function addLoginHistory(userId, { ip, device }) {
    await loginHistory.insertOne({
      id: randomId('ucl'),
      userId: String(userId),
      ip: String(ip || 'unknown').trim(),
      device: String(device || 'unknown').trim(),
      loginTime: new Date()
    });
  }

  async function listLoginHistory(userId, limit = 30) {
    const rows = await loginHistory
      .find({ userId: String(userId) })
      .sort({ loginTime: -1 })
      .limit(Math.max(1, Math.min(100, Number(limit) || 30)))
      .toArray();

    return rows.map((row) => ({
      id: String(row.id || ''),
      ip: String(row.ip || ''),
      device: String(row.device || ''),
      loginTime: toIso(row.loginTime)
    }));
  }

  async function addWithdrawAddress(userId, payload) {
    const coin = normalizeCoin(payload.coin);
    const network = normalizeNetwork(payload.network, coin);
    const address = String(payload.address || '').trim();
    const label = String(payload.label || '').trim().slice(0, 120);

    if (address.length < 8) {
      const error = new Error('Invalid withdrawal address.');
      error.statusCode = 400;
      error.code = 'ADDRESS_INVALID';
      throw error;
    }

    const document = {
      id: randomId('ucw'),
      userId: String(userId),
      coin,
      network,
      address,
      label: label || `${coin} address`,
      createdAt: new Date()
    };
    await withdrawAddresses.insertOne(document);
    return shapeAddress(document);
  }

  async function listWithdrawAddresses(userId) {
    const rows = await withdrawAddresses
      .find({ userId: String(userId) })
      .sort({ createdAt: -1 })
      .toArray();
    return rows.map(shapeAddress);
  }

  async function deleteWithdrawAddress(userId, addressId) {
    const result = await withdrawAddresses.deleteOne({
      userId: String(userId),
      id: String(addressId)
    });
    return Number(result.deletedCount || 0) > 0;
  }

  async function getPreferences(userId) {
    await ensurePreferences(userId);
    const row = await preferences.findOne({ userId: String(userId) });
    return {
      language: String(row?.language || 'en').toLowerCase(),
      currency: String(row?.currency || 'USD').toUpperCase(),
      theme: String(row?.theme || 'dark').toLowerCase(),
      trendColors: String(row?.trendColors || 'green-up').toLowerCase(),
      notifications: parseJson(row?.notifications, { email: true, security: true, marketing: false }),
      pushNotifications: row?.pushNotifications !== false
    };
  }

  async function updatePreferences(userId, patch = {}) {
    const current = await getPreferences(userId);
    const next = {
      language: String(patch.language || current.language).trim().toLowerCase() || 'en',
      currency: String(patch.currency || current.currency).trim().toUpperCase() || 'USD',
      theme: ['dark', 'light'].includes(String(patch.theme || '').trim().toLowerCase())
        ? String(patch.theme).trim().toLowerCase()
        : current.theme,
      trendColors: ['green-up', 'red-up'].includes(String(patch.trendColors || '').trim().toLowerCase())
        ? String(patch.trendColors).trim().toLowerCase()
        : current.trendColors,
      notifications:
        patch.notifications && typeof patch.notifications === 'object'
          ? patch.notifications
          : current.notifications,
      pushNotifications:
        patch.pushNotifications === undefined
          ? current.pushNotifications
          : Boolean(patch.pushNotifications)
    };

    await preferences.updateOne(
      { userId: String(userId) },
      { $set: { ...next, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    return next;
  }

  async function listFees() {
    const rows = await feeConfigs.find({}).sort({ feeType: 1, sortOrder: 1, tierLabel: 1 }).toArray();
    const grouped = { VIP: [], FUTURES: [], SPOT: [], WITHDRAWAL: [] };
    for (const row of rows) {
      const type = String(row.feeType || '').trim().toUpperCase();
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push({
        tierLabel: String(row.tierLabel || ''),
        makerFee: String(row.makerFee || ''),
        takerFee: String(row.takerFee || ''),
        withdrawalFee: String(row.withdrawalFee || ''),
        minWithdrawal: String(row.minWithdrawal || '')
      });
    }
    return grouped;
  }

  function createGiftCode() {
    return `BGIFT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }

  async function createGift(userId, { asset, amount }) {
    const normalizedAsset = normalizeCoin(asset || 'USDT');
    const amountValue = Number(amount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      const error = new Error('Gift amount must be greater than zero.');
      error.statusCode = 400;
      error.code = 'GIFT_AMOUNT_INVALID';
      throw error;
    }

    let giftCode = createGiftCode();
    for (let index = 0; index < 5; index += 1) {
      const existing = await cryptoGifts.findOne({ giftCode }, { projection: { _id: 1 } });
      if (!existing) {
        break;
      }
      giftCode = createGiftCode();
    }

    const document = {
      id: randomId('ucg'),
      creatorId: String(userId),
      asset: normalizedAsset,
      amount: amountValue,
      giftCode,
      status: 'active',
      claimedBy: null,
      createdAt: new Date(),
      claimedAt: null
    };
    await cryptoGifts.insertOne(document);
    return {
      id: document.id,
      asset: normalizedAsset,
      amount: amountValue,
      giftCode,
      status: 'active'
    };
  }

  async function claimGift(userId, giftCode) {
    const normalizedCode = String(giftCode || '').trim().toUpperCase();
    if (!normalizedCode) {
      const error = new Error('Gift code is required.');
      error.statusCode = 400;
      error.code = 'GIFT_CODE_REQUIRED';
      throw error;
    }

    const claimedAt = new Date();
    const gift = await cryptoGifts.findOneAndUpdate(
      { giftCode: normalizedCode, status: 'active' },
      {
        $set: {
          status: 'claimed',
          claimedBy: String(userId),
          claimedAt
        }
      },
      { returnDocument: 'before' }
    );

    if (!gift) {
      const existing = await cryptoGifts.findOne({ giftCode: normalizedCode }, { projection: { _id: 1, status: 1 } });
      const error = new Error(existing ? 'Gift code has already been claimed.' : 'Gift code is invalid.');
      error.statusCode = existing ? 409 : 404;
      error.code = existing ? 'GIFT_ALREADY_CLAIMED' : 'GIFT_NOT_FOUND';
      throw error;
    }

    await giftClaims.updateOne(
      { giftId: String(gift.id), userId: String(userId) },
      {
        $setOnInsert: {
          id: randomId('ucgc'),
          giftId: String(gift.id),
          userId: String(userId),
          claimedAt
        }
      },
      { upsert: true }
    );

    return {
      id: String(gift.id),
      asset: String(gift.asset || ''),
      amount: Number(gift.amount || 0),
      giftCode: normalizedCode,
      status: 'claimed'
    };
  }

  async function listGifts(userId) {
    const createdRows = await cryptoGifts
      .find({ creatorId: String(userId) })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    const claimRows = await giftClaims
      .find({ userId: String(userId) })
      .sort({ claimedAt: -1 })
      .limit(100)
      .toArray();

    const giftIds = claimRows.map((row) => String(row.giftId || ''));
    const claimedGiftRows = giftIds.length > 0
      ? await cryptoGifts.find({ id: { $in: giftIds } }).toArray()
      : [];
    const giftsById = new Map(claimedGiftRows.map((row) => [String(row.id), row]));

    return {
      created: createdRows.map(shapeGift),
      claimed: claimRows.map((row) => {
        const gift = giftsById.get(String(row.giftId || '')) || {};
        return {
          claimId: String(row.id || ''),
          giftId: String(row.giftId || ''),
          asset: String(gift.asset || ''),
          amount: Number(gift.amount || 0),
          giftCode: String(gift.giftCode || ''),
          claimedAt: toIso(row.claimedAt)
        };
      })
    };
  }

  function referralCodeForUid(uid) {
    const normalized = String(uid || '').replace(/\D/g, '');
    return `BG${normalized.slice(-6).padStart(6, '0')}`;
  }

  async function listReferrals(userId) {
    const user = await getUserById(userId);
    const rows = await referrals
      .find({ referrerId: String(userId) })
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();
    const totalRewards = rows.reduce((sum, row) => sum + Number(row.rewardAmount || 0), 0);

    return {
      referralCode: referralCodeForUid(user?.uid),
      totalInvites: rows.length,
      totalRewards,
      invites: rows.map((row) => ({
        id: String(row.id || ''),
        referredUser: String(row.referredUser || ''),
        rewardAmount: Number(row.rewardAmount || 0),
        createdAt: toIso(row.createdAt)
      }))
    };
  }

  async function listAnnouncements() {
    const rows = await announcements.find({}).sort({ createdAt: -1 }).limit(100).toArray();
    return rows.map((row) => ({
      id: String(row.id || ''),
      title: String(row.title || ''),
      body: String(row.body || ''),
      createdAt: toIso(row.createdAt)
    }));
  }

  async function listHelpArticles({ topic, limit = 100 }) {
    const safeLimit = Math.max(1, Math.min(500, Number(limit) || 100));
    const normalizedTopic = String(topic || '').trim();
    const filter = normalizedTopic
      ? {
          $or: [
            { topic: { $regex: escapeRegex(normalizedTopic), $options: 'i' } },
            { title: { $regex: escapeRegex(normalizedTopic), $options: 'i' } }
          ]
        }
      : {};
    const rows = await helpArticles.find(filter).sort({ createdAt: -1 }).limit(safeLimit).toArray();
    return rows.map((row) => ({
      id: String(row.id || ''),
      topic: String(row.topic || ''),
      title: String(row.title || ''),
      content: String(row.content || ''),
      createdAt: toIso(row.createdAt)
    }));
  }

  async function createSupportTicket(userId, { subject, category, message, attachmentUrl }) {
    const ticketId = randomId('uct');
    const now = new Date();
    await supportTickets.insertOne({
      id: ticketId,
      userId: String(userId),
      subject: String(subject || '').trim().slice(0, 180) || 'Support request',
      category: String(category || 'general').trim().slice(0, 80) || 'general',
      status: 'open',
      priority: 'normal',
      escalatedToHuman: false,
      createdAt: now,
      updatedAt: now
    });

    if (message && String(message).trim()) {
      await supportMessages.insertOne({
        id: randomId('ucm'),
        ticketId,
        senderType: 'user',
        message: String(message).trim(),
        attachmentUrl: String(attachmentUrl || '').trim(),
        createdAt: now
      });
    }

    return ticketId;
  }

  async function getSupportTicketById(userId, ticketId) {
    return supportTickets.findOne({
      id: String(ticketId),
      userId: String(userId)
    });
  }

  async function listSupportTickets(userId, limit = 100) {
    const rows = await supportTickets
      .find({ userId: String(userId) })
      .sort({ updatedAt: -1 })
      .limit(Math.max(1, Math.min(500, Number(limit) || 100)))
      .toArray();
    return rows.map(shapeTicket);
  }

  async function addSupportMessage(userId, ticketId, { senderType, message, attachmentUrl }) {
    const ticket = await getSupportTicketById(userId, ticketId);
    if (!ticket) {
      const error = new Error('Support ticket not found.');
      error.statusCode = 404;
      error.code = 'SUPPORT_TICKET_NOT_FOUND';
      throw error;
    }

    if (String(ticket.status || '').toLowerCase() === 'closed') {
      const error = new Error('Support ticket is already closed.');
      error.statusCode = 409;
      error.code = 'SUPPORT_TICKET_CLOSED';
      throw error;
    }

    const createdAt = new Date();
    await supportMessages.insertOne({
      id: randomId('ucm'),
      ticketId: String(ticketId),
      senderType: String(senderType || 'user').trim(),
      message: String(message || '').trim(),
      attachmentUrl: String(attachmentUrl || '').trim(),
      createdAt
    });
    await supportTickets.updateOne(
      { id: String(ticketId) },
      { $set: { updatedAt: createdAt } }
    );
  }

  async function setSupportEscalation(ticketId, escalated) {
    await supportTickets.updateOne(
      { id: String(ticketId) },
      { $set: { escalatedToHuman: Boolean(escalated), updatedAt: new Date() } }
    );
  }

  async function listSupportMessages(userId, ticketId, limit = 500) {
    const ticket = await getSupportTicketById(userId, ticketId);
    if (!ticket) {
      const error = new Error('Support ticket not found.');
      error.statusCode = 404;
      error.code = 'SUPPORT_TICKET_NOT_FOUND';
      throw error;
    }

    const rows = await supportMessages
      .find({ ticketId: String(ticketId) })
      .sort({ createdAt: 1 })
      .limit(Math.max(1, Math.min(1000, Number(limit) || 500)))
      .toArray();
    return rows.map(shapeSupportMessage);
  }

  async function deleteAccount(userId, recoveryUntil) {
    await users.updateOne(
      { id: String(userId) },
      {
        $set: {
          accountStatus: 'deleted',
          deletedAt: new Date(),
          recoveryUntil: toDate(recoveryUntil),
          updatedAt: new Date()
        }
      }
    );
  }

  return {
    initialize,
    close,
    enabled: true,
    mode: 'mongo-fallback',
    normalizeEmail,
    normalizeCoin,
    normalizeNetwork,
    normalizeKycStatus,
    upsertUserFromAuth,
    getUserByIdentity,
    updateProfile,
    updateIdentityInfo,
    changePassword,
    getPasswordHash,
    changePhone,
    changeEmail,
    setFundCodeHash,
    setTwoFactor,
    getTwoFactorSecret,
    addLoginHistory,
    listLoginHistory,
    addWithdrawAddress,
    listWithdrawAddresses,
    deleteWithdrawAddress,
    getPreferences,
    updatePreferences,
    listFees,
    createGift,
    claimGift,
    listGifts,
    listReferrals,
    listAnnouncements,
    listHelpArticles,
    createSupportTicket,
    getSupportTicketById,
    listSupportTickets,
    addSupportMessage,
    setSupportEscalation,
    listSupportMessages,
    deleteAccount
  };
}

module.exports = {
  createMongoUserCenterStore
};
