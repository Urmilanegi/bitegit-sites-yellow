import { AppError } from '../utils/appError.js';
import { notifyUser } from './pushNotificationService.js';
import { generateSupportChatbotReply } from './supportCenterChatbotService.js';
import {
  ALLOWED_ATTACHMENT_EXTENSIONS,
  DEFAULT_COIN_STATUS_LIST,
  DEFAULT_HELP_TOPICS,
  DISPUTE_STATUS_OPTIONS,
  SUPPORT_CATEGORY_OPTIONS,
  SUPPORT_SUBCATEGORY_MAP,
  SUPPORT_TIP_TEXT
} from './supportCenterConstants.js';
import { SUPPORT_CENTER_EVENTS, publishSupportCenterEvent } from './supportCenterEventBus.js';
import {
  addTicketMessage,
  createAnnouncement,
  createHelpArticle,
  createHelpFeedback,
  createSupportCase,
  getSupportTicketById,
  listActiveAnnouncements,
  listCryptoStatus,
  listHelpArticles,
  listHelpArticlesForAdmin,
  listHelpCategories,
  listP2PDisputes,
  listSupportTickets,
  listTicketMessages,
  resolveP2PDispute,
  updateSupportTicketStatus,
  upsertCryptoStatus
} from './supportCenterRepository.js';

const sanitizeText = (value, maxLength = 3000) => String(value || '').trim().slice(0, maxLength);

const normalizeAttachmentList = (rawAttachments) => {
  const input = Array.isArray(rawAttachments)
    ? rawAttachments
    : typeof rawAttachments === 'string'
      ? rawAttachments
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean)
      : [];

  const normalized = [];
  for (const item of input) {
    const name = sanitizeText(item, 255);
    if (!name) {
      continue;
    }
    const extension = name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_ATTACHMENT_EXTENSIONS.includes(extension)) {
      throw new AppError(`Unsupported attachment type: ${name}`, 422);
    }
    normalized.push(name);
  }
  return normalized;
};

const resolveSubcategories = (category) => {
  const normalized = sanitizeText(category, 120);
  return SUPPORT_SUBCATEGORY_MAP[normalized] || [];
};

const shouldShowDisputeStatus = (subcategory) => {
  const text = sanitizeText(subcategory, 200).toLowerCase();
  const keywords = ['appeal', 'dispute', 'report', 'release'];
  return keywords.some((keyword) => text.includes(keyword));
};

export const getHelpCenterTopics = async (search = '') => {
  const [categories, allArticles, topArticles] = await Promise.all([
    listHelpCategories(),
    listHelpArticles({ search, categoryId: null, limit: 80 }),
    listHelpArticles({ search: '', categoryId: null, limit: 8 })
  ]);

  const fallbackCategories = SUPPORT_CATEGORY_OPTIONS.map((title, index) => ({
    id: index + 1,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title,
    description: `${title} support articles`,
    article_count: 0
  }));

  return {
    search,
    start_now: DEFAULT_HELP_TOPICS.start_now,
    top_articles: topArticles.length
      ? topArticles
      : DEFAULT_HELP_TOPICS.top_articles.map((item, index) => ({
          id: `top-${index + 1}`,
          title: item.title,
          excerpt: item.description
        })),
    categories: categories.length ? categories : fallbackCategories,
    all_topics: allArticles
  };
};

export const getSubmitCaseConfig = () => ({
  categories: SUPPORT_CATEGORY_OPTIONS,
  subcategories: SUPPORT_SUBCATEGORY_MAP,
  dispute_status_options: DISPUTE_STATUS_OPTIONS,
  support_tip: SUPPORT_TIP_TEXT
});

export const submitSupportCase = async (payload) => {
  const category = sanitizeText(payload.category, 120);
  const subcategory = sanitizeText(payload.subcategory, 200);
  const disputeStatus = sanitizeText(payload.dispute_status, 120);

  if (!SUPPORT_CATEGORY_OPTIONS.includes(category)) {
    throw new AppError('Invalid category', 422);
  }

  const subcategories = resolveSubcategories(category);
  if (subcategory && subcategories.length > 0 && !subcategories.includes(subcategory)) {
    throw new AppError('Invalid subcategory for selected category', 422);
  }

  if (shouldShowDisputeStatus(subcategory) && disputeStatus && !DISPUTE_STATUS_OPTIONS.includes(disputeStatus)) {
    throw new AppError('Invalid dispute status', 422);
  }

  const attachments = normalizeAttachmentList(payload.attachments);
  const ticket = await createSupportCase({
    userUid: payload.user_uid,
    email: payload.email,
    orderId: payload.order_id,
    category,
    subcategory,
    disputeStatus,
    subject: payload.subject,
    description: payload.description,
    attachments
  });

  publishSupportCenterEvent(SUPPORT_CENTER_EVENTS.TICKET_CREATED, {
    ticket_id: ticket.ticket_id,
    ticket_code: ticket.ticket_code,
    category,
    subcategory,
    order_id: sanitizeText(payload.order_id, 120)
  });

  return ticket;
};

export const askSupportChatbot = async (message) => {
  return generateSupportChatbotReply(message);
};

export const submitHelpFeedback = async ({ articleId, userId, isHelpful }) => {
  await createHelpFeedback({ articleId, userId, isHelpful });
  return { ok: true };
};

export const getAnnouncementsForPopup = async () => {
  const rows = await listActiveAnnouncements();
  if (rows.length) {
    return rows;
  }

  return [
    {
      id: 'fallback-maintenance',
      title: 'System Notice',
      message: 'Scheduled maintenance may temporarily affect fiat services and selected withdrawals.',
      starts_at: null,
      ends_at: null
    }
  ];
};

export const getCryptoStatusMatrix = async ({ search = '', hideSuspended = false, onlySuspended = false }) => {
  const rows = await listCryptoStatus({
    search,
    hideSuspended,
    onlySuspended
  });

  if (rows.length) {
    return rows;
  }

  return DEFAULT_COIN_STATUS_LIST.map((coin) => ({
    symbol: coin.symbol,
    name: coin.name,
    networks: [
      {
        network: 'Mainnet',
        deposit_status: 'available',
        withdraw_status: 'available',
        deposit_alert: null,
        withdraw_alert: null
      }
    ]
  }));
};

export const getAdminTicketDashboard = async ({ status = '', limit = 100 }) => {
  const tickets = await listSupportTickets({ status, limit });
  return {
    total: tickets.length,
    tickets
  };
};

export const getAdminTicketDetails = async (ticketId) => {
  const [ticket, messages] = await Promise.all([getSupportTicketById(ticketId), listTicketMessages(ticketId)]);
  return {
    ticket,
    messages
  };
};

export const adminReplyToTicket = async ({ ticketId, adminId, message }) => {
  const safeMessage = sanitizeText(message, 6000);
  if (!safeMessage) {
    throw new AppError('message is required', 422);
  }

  await addTicketMessage({
    ticketId,
    senderType: 'admin',
    message: safeMessage,
    attachments: [],
    metadata: { admin_id: adminId }
  });

  const ticket = await getSupportTicketById(ticketId);

  await notifyUser(ticket.user_id, safeMessage, {
    event: 'admin_support_reply',
    ticket_id: Number(ticketId)
  });

  publishSupportCenterEvent(SUPPORT_CENTER_EVENTS.TICKET_UPDATED, {
    ticket_id: Number(ticketId),
    status: 'in_progress',
    action: 'admin_reply'
  });

  return {
    ticket_id: Number(ticketId),
    status: 'in_progress'
  };
};

export const adminResolveTicket = async ({ ticketId, adminId, note = '' }) => {
  const safeNote = sanitizeText(note, 4000);

  if (safeNote) {
    await addTicketMessage({
      ticketId,
      senderType: 'system',
      message: safeNote,
      attachments: [],
      metadata: { admin_id: adminId, action: 'resolve' }
    });
  }

  await updateSupportTicketStatus({
    ticketId,
    status: 'resolved',
    assignedAdminId: adminId
  });

  const ticket = await getSupportTicketById(ticketId);
  await notifyUser(ticket.user_id, 'Your support ticket has been resolved.', {
    event: 'ticket_resolved',
    ticket_id: Number(ticketId)
  });

  publishSupportCenterEvent(SUPPORT_CENTER_EVENTS.TICKET_UPDATED, {
    ticket_id: Number(ticketId),
    status: 'resolved',
    action: 'admin_resolve'
  });

  return {
    ticket_id: Number(ticketId),
    status: 'resolved'
  };
};

export const getAdminP2PDisputes = async () => {
  const disputes = await listP2PDisputes(200);
  return {
    total: disputes.length,
    disputes
  };
};

export const adminResolveP2PDispute = async ({ disputeId, adminId, disputeStatus, note }) => {
  await resolveP2PDispute({
    disputeId,
    disputeStatus,
    note,
    adminId
  });
  return { dispute_id: Number(disputeId), dispute_status: disputeStatus };
};

export const adminUpdateCryptoStatus = async ({ symbol, network, depositStatus, withdrawStatus, maintenanceAlert }) => {
  await upsertCryptoStatus({
    symbol,
    network,
    depositStatus,
    withdrawStatus,
    maintenanceAlert
  });

  return {
    symbol: String(symbol || '').toUpperCase(),
    network: String(network || '').toUpperCase(),
    deposit_status: String(depositStatus || '').toLowerCase(),
    withdraw_status: String(withdrawStatus || '').toLowerCase()
  };
};

export const adminCreateAnnouncement = async ({ title, message, startsAt, endsAt, adminId }) => {
  const announcement = await createAnnouncement({
    title,
    message,
    startsAt,
    endsAt,
    adminId
  });

  publishSupportCenterEvent(SUPPORT_CENTER_EVENTS.ANNOUNCEMENT_CREATED, announcement);
  return announcement;
};

export const adminReviewKycRequest = async ({ userId, action, adminId, note = '' }) => {
  const safeAction = sanitizeText(action, 40).toLowerCase();
  if (!['approve', 'reject'].includes(safeAction)) {
    throw new AppError('action must be approve or reject', 422);
  }

  return {
    user_id: Number.parseInt(String(userId || 0), 10) || 0,
    action: safeAction,
    reviewed_by_admin_id: Number.parseInt(String(adminId || 0), 10) || null,
    note: sanitizeText(note, 600),
    status: safeAction === 'approve' ? 'VERIFIED' : 'REJECTED'
  };
};

export const adminListHelpArticles = async () => {
  const articles = await listHelpArticlesForAdmin({ limit: 300 });
  return {
    total: articles.length,
    articles
  };
};

export const adminCreateHelpArticle = async (payload) => {
  await createHelpArticle({
    categoryId: payload.category_id,
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    body: payload.body,
    relatedArticleIds: payload.related_article_ids
  });

  return {
    ok: true
  };
};
