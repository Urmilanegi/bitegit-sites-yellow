import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { AppError } from '../utils/appError.js';

const parsePositiveInt = (value, fieldName) => {
  const parsed = Number.parseInt(String(value || 0), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(`Invalid ${fieldName}`, 422);
  }
  return parsed;
};

const sanitizeText = (value, maxLength = 2000) => String(value || '').trim().slice(0, maxLength);

const safeParseJson = (value, fallback = {}) => {
  if (!value) {
    return fallback;
  }

  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
};

const makeTicketCode = () => {
  const stamp = Date.now().toString(36).toUpperCase();
  const salt = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SUP-${stamp}-${salt}`;
};

export const listHelpCategories = async () => {
  const rows = await sequelize.query(
    `SELECT c.id, c.slug, c.title, c.description, c.sort_order,
            COUNT(a.id) AS article_count
     FROM help_categories c
     LEFT JOIN help_articles a ON a.category_id = c.id
     GROUP BY c.id, c.slug, c.title, c.description, c.sort_order
     ORDER BY c.sort_order ASC, c.id ASC`,
    { type: QueryTypes.SELECT }
  );

  return rows.map((row) => ({
    id: Number(row.id),
    slug: row.slug,
    title: row.title,
    description: row.description,
    article_count: Number(row.article_count || 0)
  }));
};

export const listHelpArticles = async ({ search = '', categoryId = null, limit = 100 }) => {
  const safeSearch = sanitizeText(search, 120);
  const safeLimit = Math.max(1, Math.min(Number.parseInt(String(limit || 100), 10) || 100, 200));
  const where = [];
  const replacements = { limit: safeLimit };

  if (safeSearch) {
    where.push('(a.title LIKE :search OR a.excerpt LIKE :search OR a.body LIKE :search)');
    replacements.search = `%${safeSearch}%`;
  }

  if (categoryId) {
    where.push('a.category_id = :categoryId');
    replacements.categoryId = parsePositiveInt(categoryId, 'category_id');
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const rows = await sequelize.query(
    `SELECT a.id, a.category_id, c.title AS category_title, a.title, a.slug, a.excerpt,
            a.updated_at, a.helpful_count, a.unhelpful_count, a.related_article_ids
     FROM help_articles a
     INNER JOIN help_categories c ON c.id = a.category_id
     ${whereSql}
     ORDER BY a.updated_at DESC
     LIMIT :limit`,
    {
      replacements,
      type: QueryTypes.SELECT
    }
  );

  return rows.map((row) => ({
    id: Number(row.id),
    category_id: Number(row.category_id),
    category_title: row.category_title,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    updated_at: row.updated_at,
    helpful_count: Number(row.helpful_count || 0),
    unhelpful_count: Number(row.unhelpful_count || 0),
    related_article_ids: safeParseJson(row.related_article_ids, [])
  }));
};

export const listTopHelpArticles = async (limit = 8) => {
  const safeLimit = Math.max(1, Math.min(Number.parseInt(String(limit || 8), 10) || 8, 20));
  const rows = await sequelize.query(
    `SELECT id, category_id, title, slug, excerpt, updated_at, helpful_count
     FROM help_articles
     ORDER BY helpful_count DESC, updated_at DESC
     LIMIT :limit`,
    {
      replacements: { limit: safeLimit },
      type: QueryTypes.SELECT
    }
  );

  return rows.map((row) => ({
    id: Number(row.id),
    category_id: Number(row.category_id),
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    updated_at: row.updated_at,
    helpful_count: Number(row.helpful_count || 0)
  }));
};

export const createHelpFeedback = async ({ articleId, userId = null, isHelpful }) => {
  const safeArticleId = parsePositiveInt(articleId, 'article_id');
  const safeIsHelpful = Boolean(isHelpful);
  const safeUserId = Number.parseInt(String(userId || 0), 10);

  await sequelize.query(
    `INSERT INTO help_feedback (article_id, user_id, is_helpful, created_at)
     VALUES (:articleId, :userId, :isHelpful, UTC_TIMESTAMP())`,
    {
      replacements: {
        articleId: safeArticleId,
        userId: Number.isInteger(safeUserId) && safeUserId > 0 ? safeUserId : null,
        isHelpful: safeIsHelpful ? 1 : 0
      }
    }
  );

  await sequelize.query(
    safeIsHelpful
      ? `UPDATE help_articles SET helpful_count = helpful_count + 1 WHERE id = :articleId`
      : `UPDATE help_articles SET unhelpful_count = unhelpful_count + 1 WHERE id = :articleId`,
    {
      replacements: { articleId: safeArticleId }
    }
  );
};

export const createSupportCase = async ({
  userUid,
  email,
  orderId,
  category,
  subcategory,
  disputeStatus,
  subject,
  description,
  attachments = []
}) => {
  const safeUserId = Number.parseInt(String(userUid || 0), 10);
  const normalizedUserId = Number.isInteger(safeUserId) && safeUserId > 0 ? safeUserId : 1;
  const safeSubject = sanitizeText(subject, 255) || 'Support Request';
  const safeDescription = sanitizeText(description, 5000);

  if (!safeDescription) {
    throw new AppError('Description is required', 422);
  }

  const ticketCode = makeTicketCode();
  const now = new Date();

  const [insertResult] = await sequelize.query(
    `INSERT INTO support_tickets (
      user_id, subject, status, is_escalated, assigned_admin_id, first_admin_response_at,
      last_user_message_at, last_admin_message_at, waiting_alert_sent_at, created_at, updated_at
    ) VALUES (
      :userId, :subject, 'open', 0, NULL, NULL,
      :lastUserMessageAt, NULL, NULL, :createdAt, :updatedAt
    )`,
    {
      replacements: {
        userId: normalizedUserId,
        subject: `[${ticketCode}] ${safeSubject}`.slice(0, 255),
        lastUserMessageAt: now,
        createdAt: now,
        updatedAt: now
      }
    }
  );

  const ticketId = Number(insertResult?.insertId || 0);
  if (!ticketId) {
    throw new AppError('Failed to create support ticket', 500);
  }

  const metadata = {
    ticket_code: ticketCode,
    email: sanitizeText(email, 255),
    order_id: sanitizeText(orderId, 120),
    category: sanitizeText(category, 120),
    subcategory: sanitizeText(subcategory, 200),
    dispute_status: sanitizeText(disputeStatus, 120)
  };

  await sequelize.query(
    `INSERT INTO ticket_messages (
      ticket_id, sender_type, message, attachment_urls, metadata_json, created_at
    ) VALUES (
      :ticketId, 'user', :message, :attachmentUrls, :metadataJson, :createdAt
    )`,
    {
      replacements: {
        ticketId,
        message: safeDescription,
        attachmentUrls: JSON.stringify(attachments),
        metadataJson: JSON.stringify(metadata),
        createdAt: now
      }
    }
  );

  return {
    ticket_id: ticketId,
    ticket_code: ticketCode
  };
};

export const listSupportTickets = async ({ status = '', limit = 100 }) => {
  const safeStatus = sanitizeText(status, 40).toLowerCase();
  const safeLimit = Math.max(1, Math.min(Number.parseInt(String(limit || 100), 10) || 100, 200));

  const rows = await sequelize.query(
    `SELECT t.id, t.user_id, t.subject, t.status, t.assigned_admin_id, t.created_at, t.updated_at,
            first_msg.metadata_json AS metadata_json,
            last_msg.sender_type AS last_sender_type,
            last_msg.message AS last_message,
            last_msg.created_at AS last_message_at
     FROM support_tickets t
     LEFT JOIN ticket_messages first_msg
       ON first_msg.id = (
         SELECT tm1.id
         FROM ticket_messages tm1
         WHERE tm1.ticket_id = t.id
         ORDER BY tm1.id ASC
         LIMIT 1
       )
     LEFT JOIN ticket_messages last_msg
       ON last_msg.id = (
         SELECT tm2.id
         FROM ticket_messages tm2
         WHERE tm2.ticket_id = t.id
         ORDER BY tm2.id DESC
         LIMIT 1
       )
     WHERE (:status = '' OR LOWER(t.status) = :status)
     ORDER BY t.updated_at DESC
     LIMIT :limit`,
    {
      replacements: {
        status: safeStatus,
        limit: safeLimit
      },
      type: QueryTypes.SELECT
    }
  );

  return rows.map((row) => ({
    id: Number(row.id),
    user_id: Number(row.user_id || 0),
    subject: row.subject,
    status: row.status,
    assigned_admin_id: row.assigned_admin_id ? Number(row.assigned_admin_id) : null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    metadata: safeParseJson(row.metadata_json, {}),
    last_message: row.last_message,
    last_sender_type: row.last_sender_type,
    last_message_at: row.last_message_at
  }));
};

export const getSupportTicketById = async (ticketId) => {
  const safeTicketId = parsePositiveInt(ticketId, 'ticket_id');
  const tickets = await listSupportTickets({ status: '', limit: 300 });
  const ticket = tickets.find((row) => row.id === safeTicketId);
  if (!ticket) {
    throw new AppError('Support ticket not found', 404);
  }
  return ticket;
};

export const listTicketMessages = async (ticketId) => {
  const safeTicketId = parsePositiveInt(ticketId, 'ticket_id');
  const rows = await sequelize.query(
    `SELECT id, ticket_id, sender_type, message, attachment_urls, metadata_json, created_at
     FROM ticket_messages
     WHERE ticket_id = :ticketId
     ORDER BY id ASC`,
    {
      replacements: { ticketId: safeTicketId },
      type: QueryTypes.SELECT
    }
  );

  return rows.map((row) => ({
    id: Number(row.id),
    ticket_id: Number(row.ticket_id),
    sender_type: row.sender_type,
    message: row.message,
    attachment_urls: safeParseJson(row.attachment_urls, []),
    metadata: safeParseJson(row.metadata_json, {}),
    created_at: row.created_at
  }));
};

export const addTicketMessage = async ({ ticketId, senderType, message, attachments = [], metadata = {} }) => {
  const safeTicketId = parsePositiveInt(ticketId, 'ticket_id');
  const safeSenderType = sanitizeText(senderType, 20).toLowerCase();
  const safeMessage = sanitizeText(message, 6000);

  if (!['user', 'admin', 'ai', 'system'].includes(safeSenderType)) {
    throw new AppError('Invalid sender_type', 422);
  }

  if (!safeMessage) {
    throw new AppError('Message is required', 422);
  }

  const now = new Date();

  await sequelize.query(
    `INSERT INTO ticket_messages (
      ticket_id, sender_type, message, attachment_urls, metadata_json, created_at
    ) VALUES (
      :ticketId, :senderType, :message, :attachments, :metadata, :createdAt
    )`,
    {
      replacements: {
        ticketId: safeTicketId,
        senderType: safeSenderType,
        message: safeMessage,
        attachments: JSON.stringify(attachments),
        metadata: JSON.stringify(metadata),
        createdAt: now
      }
    }
  );

  if (safeSenderType === 'admin') {
    await sequelize.query(
      `UPDATE support_tickets
       SET status = 'in_progress',
           assigned_admin_id = COALESCE(assigned_admin_id, :adminId),
           first_admin_response_at = COALESCE(first_admin_response_at, :responseAt),
           last_admin_message_at = :responseAt,
           updated_at = :responseAt
       WHERE id = :ticketId`,
      {
        replacements: {
          ticketId: safeTicketId,
          adminId: Number.parseInt(String(metadata.admin_id || 0), 10) || null,
          responseAt: now
        }
      }
    );
  } else {
    await sequelize.query(
      `UPDATE support_tickets
       SET last_user_message_at = :messageAt,
           updated_at = :messageAt
       WHERE id = :ticketId`,
      {
        replacements: {
          ticketId: safeTicketId,
          messageAt: now
        }
      }
    );
  }
};

export const updateSupportTicketStatus = async ({ ticketId, status, assignedAdminId = null }) => {
  const safeTicketId = parsePositiveInt(ticketId, 'ticket_id');
  const safeStatus = sanitizeText(status, 20).toLowerCase();

  if (!['open', 'in_progress', 'resolved', 'closed'].includes(safeStatus)) {
    throw new AppError('Invalid ticket status', 422);
  }

  await sequelize.query(
    `UPDATE support_tickets
     SET status = :status,
         assigned_admin_id = COALESCE(:assignedAdminId, assigned_admin_id),
         updated_at = UTC_TIMESTAMP()
     WHERE id = :ticketId`,
    {
      replacements: {
        ticketId: safeTicketId,
        status: safeStatus,
        assignedAdminId: Number.parseInt(String(assignedAdminId || 0), 10) || null
      }
    }
  );
};

export const listP2PDisputes = async (limit = 100) => {
  const safeLimit = Math.max(1, Math.min(Number.parseInt(String(limit || 100), 10) || 100, 200));
  const rows = await sequelize.query(
    `SELECT d.id, d.order_id, d.raised_by_user_id, d.dispute_reason, d.dispute_status,
            d.resolution_note, d.resolved_by_admin_id, d.created_at, d.updated_at,
            o.order_no, o.asset_symbol, o.amount, o.fiat_currency, o.fiat_amount, o.status AS order_status
     FROM p2p_disputes d
     LEFT JOIN p2p_orders o ON o.id = d.order_id
     ORDER BY d.updated_at DESC
     LIMIT :limit`,
    {
      replacements: { limit: safeLimit },
      type: QueryTypes.SELECT
    }
  );

  return rows.map((row) => ({
    id: Number(row.id),
    order_id: Number(row.order_id),
    order_no: row.order_no,
    raised_by_user_id: Number(row.raised_by_user_id),
    dispute_reason: row.dispute_reason,
    dispute_status: row.dispute_status,
    resolution_note: row.resolution_note,
    resolved_by_admin_id: row.resolved_by_admin_id ? Number(row.resolved_by_admin_id) : null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    order: {
      status: row.order_status,
      asset_symbol: row.asset_symbol,
      amount: row.amount,
      fiat_currency: row.fiat_currency,
      fiat_amount: row.fiat_amount
    }
  }));
};

export const resolveP2PDispute = async ({ disputeId, disputeStatus, note, adminId }) => {
  const safeDisputeId = parsePositiveInt(disputeId, 'dispute_id');
  const safeStatus = sanitizeText(disputeStatus, 64);
  const safeNote = sanitizeText(note, 2000);
  const safeAdminId = Number.parseInt(String(adminId || 0), 10) || null;

  await sequelize.query(
    `UPDATE p2p_disputes
     SET dispute_status = :status,
         resolution_note = :note,
         resolved_by_admin_id = :adminId,
         updated_at = UTC_TIMESTAMP()
     WHERE id = :disputeId`,
    {
      replacements: {
        disputeId: safeDisputeId,
        status: safeStatus,
        note: safeNote,
        adminId: safeAdminId
      }
    }
  );
};

const normalizeCoinStatus = (status) => {
  const normalized = sanitizeText(status, 32).toLowerCase();
  if (['available', 'suspended', 'maintenance'].includes(normalized)) {
    return normalized;
  }
  return 'available';
};

export const listCryptoStatus = async ({ search = '', hideSuspended = false, onlySuspended = false }) => {
  const safeSearch = sanitizeText(search, 64);
  const assets = await sequelize.query(
    `SELECT symbol, name
     FROM crypto_assets
     WHERE is_active = 1
       AND (:search = '' OR symbol LIKE :searchLike OR name LIKE :searchLike)
     ORDER BY symbol ASC`,
    {
      replacements: {
        search: safeSearch,
        searchLike: `%${safeSearch}%`
      },
      type: QueryTypes.SELECT
    }
  );

  if (!assets.length) {
    return [];
  }

  const symbols = assets.map((asset) => asset.symbol);

  const depositRows = await sequelize.query(
    `SELECT asset_symbol, network, status, maintenance_alert, updated_at
     FROM deposit_status
     WHERE asset_symbol IN (:symbols)
     ORDER BY asset_symbol ASC, network ASC`,
    {
      replacements: { symbols },
      type: QueryTypes.SELECT
    }
  );

  const withdrawRows = await sequelize.query(
    `SELECT asset_symbol, network, status, maintenance_alert, updated_at
     FROM withdraw_status
     WHERE asset_symbol IN (:symbols)
     ORDER BY asset_symbol ASC, network ASC`,
    {
      replacements: { symbols },
      type: QueryTypes.SELECT
    }
  );

  const groupedDeposit = new Map();
  for (const row of depositRows) {
    const key = row.asset_symbol;
    const list = groupedDeposit.get(key) || [];
    list.push(row);
    groupedDeposit.set(key, list);
  }

  const groupedWithdraw = new Map();
  for (const row of withdrawRows) {
    const key = row.asset_symbol;
    const list = groupedWithdraw.get(key) || [];
    list.push(row);
    groupedWithdraw.set(key, list);
  }

  const result = assets.map((asset) => {
    const depositList = groupedDeposit.get(asset.symbol) || [];
    const withdrawList = groupedWithdraw.get(asset.symbol) || [];
    const networkSet = new Set([...depositList.map((row) => row.network), ...withdrawList.map((row) => row.network)]);
    const networks = [...networkSet].sort().map((network) => {
      const deposit = depositList.find((row) => row.network === network);
      const withdraw = withdrawList.find((row) => row.network === network);

      return {
        network,
        deposit_status: normalizeCoinStatus(deposit?.status),
        withdraw_status: normalizeCoinStatus(withdraw?.status),
        deposit_alert: deposit?.maintenance_alert || null,
        withdraw_alert: withdraw?.maintenance_alert || null,
        updated_at: withdraw?.updated_at || deposit?.updated_at || null
      };
    });

    return {
      symbol: asset.symbol,
      name: asset.name,
      networks
    };
  });

  const shouldHideSuspended = Boolean(hideSuspended);
  const shouldShowOnlySuspended = Boolean(onlySuspended);

  return result.filter((coin) => {
    const hasSuspendedDeposit = coin.networks.some((network) => network.deposit_status !== 'available');
    if (shouldShowOnlySuspended) {
      return hasSuspendedDeposit;
    }
    if (shouldHideSuspended) {
      return !hasSuspendedDeposit;
    }
    return true;
  });
};

export const upsertCryptoStatus = async ({
  symbol,
  network,
  depositStatus,
  withdrawStatus,
  maintenanceAlert = ''
}) => {
  const safeSymbol = sanitizeText(symbol, 32).toUpperCase();
  const safeNetwork = sanitizeText(network, 32).toUpperCase();

  if (!safeSymbol || !safeNetwork) {
    throw new AppError('symbol and network are required', 422);
  }

  const safeDepositStatus = normalizeCoinStatus(depositStatus);
  const safeWithdrawStatus = normalizeCoinStatus(withdrawStatus);
  const safeAlert = sanitizeText(maintenanceAlert, 255);

  await sequelize.query(
    `INSERT INTO deposit_status (asset_symbol, network, status, maintenance_alert, updated_at)
     VALUES (:symbol, :network, :status, :alert, UTC_TIMESTAMP())
     ON DUPLICATE KEY UPDATE
       status = VALUES(status),
       maintenance_alert = VALUES(maintenance_alert),
       updated_at = VALUES(updated_at)`,
    {
      replacements: {
        symbol: safeSymbol,
        network: safeNetwork,
        status: safeDepositStatus,
        alert: safeAlert || null
      }
    }
  );

  await sequelize.query(
    `INSERT INTO withdraw_status (asset_symbol, network, status, maintenance_alert, updated_at)
     VALUES (:symbol, :network, :status, :alert, UTC_TIMESTAMP())
     ON DUPLICATE KEY UPDATE
       status = VALUES(status),
       maintenance_alert = VALUES(maintenance_alert),
       updated_at = VALUES(updated_at)`,
    {
      replacements: {
        symbol: safeSymbol,
        network: safeNetwork,
        status: safeWithdrawStatus,
        alert: safeAlert || null
      }
    }
  );
};

export const listActiveAnnouncements = async () => {
  const rows = await sequelize.query(
    `SELECT id, title, message, starts_at, ends_at, created_at, updated_at
     FROM announcements
     WHERE is_active = 1
       AND (starts_at IS NULL OR starts_at <= UTC_TIMESTAMP())
       AND (ends_at IS NULL OR ends_at >= UTC_TIMESTAMP())
     ORDER BY created_at DESC
     LIMIT 10`,
    { type: QueryTypes.SELECT }
  );

  return rows.map((row) => ({
    id: Number(row.id),
    title: row.title,
    message: row.message,
    starts_at: row.starts_at,
    ends_at: row.ends_at,
    created_at: row.created_at,
    updated_at: row.updated_at
  }));
};

export const createAnnouncement = async ({ title, message, startsAt = null, endsAt = null, adminId = null }) => {
  const safeTitle = sanitizeText(title, 255);
  const safeMessage = sanitizeText(message, 4000);

  if (!safeTitle || !safeMessage) {
    throw new AppError('title and message are required', 422);
  }

  const [insertResult] = await sequelize.query(
    `INSERT INTO announcements (
      title, message, is_active, starts_at, ends_at, created_by_admin_id, created_at, updated_at
    ) VALUES (
      :title, :message, 1, :startsAt, :endsAt, :adminId, UTC_TIMESTAMP(), UTC_TIMESTAMP()
    )`,
    {
      replacements: {
        title: safeTitle,
        message: safeMessage,
        startsAt: startsAt || null,
        endsAt: endsAt || null,
        adminId: Number.parseInt(String(adminId || 0), 10) || null
      }
    }
  );

  const id = Number(insertResult?.insertId || 0);
  return {
    id,
    title: safeTitle,
    message: safeMessage,
    starts_at: startsAt || null,
    ends_at: endsAt || null
  };
};

export const listHelpArticlesForAdmin = async ({ limit = 200 }) => {
  return listHelpArticles({ search: '', categoryId: null, limit });
};

export const createHelpArticle = async ({ categoryId, title, slug, excerpt, body, relatedArticleIds = [] }) => {
  const safeCategoryId = parsePositiveInt(categoryId, 'category_id');
  const safeTitle = sanitizeText(title, 255);
  const safeSlug = sanitizeText(slug, 255).toLowerCase();
  const safeExcerpt = sanitizeText(excerpt, 2000);
  const safeBody = sanitizeText(body, 20000);

  if (!safeTitle || !safeSlug || !safeBody) {
    throw new AppError('title, slug, and body are required', 422);
  }

  await sequelize.query(
    `INSERT INTO help_articles (
      category_id, title, slug, excerpt, body, related_article_ids, helpful_count, unhelpful_count, created_at, updated_at
    ) VALUES (
      :categoryId, :title, :slug, :excerpt, :body, :relatedArticleIds, 0, 0, UTC_TIMESTAMP(), UTC_TIMESTAMP()
    )`,
    {
      replacements: {
        categoryId: safeCategoryId,
        title: safeTitle,
        slug: safeSlug,
        excerpt: safeExcerpt || null,
        body: safeBody,
        relatedArticleIds: JSON.stringify(Array.isArray(relatedArticleIds) ? relatedArticleIds : [])
      }
    }
  );
};

