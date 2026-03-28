const ORDER_STATUS = Object.freeze({
  CREATED: 'CREATED',
  PAYMENT_SENT: 'PAYMENT_SENT',
  DISPUTED: 'DISPUTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
});

const ORDER_STATUS_ALIASES = Object.freeze({
  OPEN: ORDER_STATUS.CREATED,
  PENDING: ORDER_STATUS.CREATED,
  PAID: ORDER_STATUS.PAYMENT_SENT,
  RELEASED: ORDER_STATUS.COMPLETED,
  CANCELED: ORDER_STATUS.CANCELLED
});

const CREATED_LIKE_STATUSES = Object.freeze(['OPEN', 'PENDING', ORDER_STATUS.CREATED]);
const PAYMENT_SENT_LIKE_STATUSES = Object.freeze(['PAID', ORDER_STATUS.PAYMENT_SENT]);
const COMPLETED_LIKE_STATUSES = Object.freeze(['RELEASED', ORDER_STATUS.COMPLETED]);
const CANCELLED_LIKE_STATUSES = Object.freeze(['CANCELED', ORDER_STATUS.CANCELLED]);
const ACTIVE_ORDER_STATUSES = Object.freeze([
  ...CREATED_LIKE_STATUSES,
  ...PAYMENT_SENT_LIKE_STATUSES,
  ORDER_STATUS.DISPUTED
]);
const ENDED_ORDER_STATUSES = Object.freeze([
  ...COMPLETED_LIKE_STATUSES,
  ...CANCELLED_LIKE_STATUSES,
  ORDER_STATUS.EXPIRED
]);
const EXPIRABLE_ORDER_STATUSES = Object.freeze([...CREATED_LIKE_STATUSES]);

function normalizeIdentityValue(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeOrderStatus(status) {
  const normalized = String(status || '').trim().toUpperCase();
  if (!normalized) {
    return ORDER_STATUS.CREATED;
  }
  return ORDER_STATUS_ALIASES[normalized] || normalized;
}

function isActiveOrderStatus(status) {
  const normalized = normalizeOrderStatus(status);
  return (
    normalized === ORDER_STATUS.CREATED ||
    normalized === ORDER_STATUS.PAYMENT_SENT ||
    normalized === ORDER_STATUS.DISPUTED
  );
}

function isClosedOrderStatus(status) {
  const normalized = normalizeOrderStatus(status);
  return (
    normalized === ORDER_STATUS.COMPLETED ||
    normalized === ORDER_STATUS.CANCELLED ||
    normalized === ORDER_STATUS.EXPIRED
  );
}

function isExpirableOrderStatus(status) {
  return normalizeOrderStatus(status) === ORDER_STATUS.CREATED;
}

function getOrderStatusBucket(status) {
  const normalized = normalizeOrderStatus(status);
  if (normalized === ORDER_STATUS.DISPUTED) {
    return 'dispute';
  }
  if (normalized === ORDER_STATUS.COMPLETED) {
    return 'completed';
  }
  if (normalized === ORDER_STATUS.CANCELLED || normalized === ORDER_STATUS.EXPIRED) {
    return 'canceled';
  }
  return 'inprogress';
}

function resolveOrderActorRole(order, actor = {}) {
  if (actor?.isSystem === true) {
    return 'system';
  }

  const aliases = new Set();
  const actorId = String(actor?.id || actor?.userId || '').trim();
  const actorUsername = normalizeIdentityValue(actor?.username);
  const actorEmail = normalizeIdentityValue(actor?.email);

  if (actorId) {
    aliases.add(actorId);
    aliases.add(normalizeIdentityValue(actorId));
  }
  if (actorUsername) {
    aliases.add(actorUsername);
  }
  if (actorEmail) {
    aliases.add(actorEmail);
  }

  const participantRole = Array.isArray(order?.participants)
    ? order.participants.find((participant) => {
        const participantId = String(participant?.id || '').trim();
        const participantUsername = normalizeIdentityValue(participant?.username);
        return aliases.has(participantId) || aliases.has(normalizeIdentityValue(participantId)) || aliases.has(participantUsername);
      })?.role
    : '';

  if (participantRole === 'seller' || participantRole === 'buyer') {
    return participantRole;
  }

  const sellerValues = [
    String(order?.sellerUserId || order?.sellerId || '').trim(),
    normalizeIdentityValue(order?.sellerUserId || order?.sellerId),
    normalizeIdentityValue(order?.sellerUsername),
    normalizeIdentityValue(order?.sellerEmail)
  ].filter(Boolean);
  if (sellerValues.some((value) => aliases.has(value))) {
    return 'seller';
  }

  const buyerValues = [
    String(order?.buyerUserId || order?.buyerId || '').trim(),
    normalizeIdentityValue(order?.buyerUserId || order?.buyerId),
    normalizeIdentityValue(order?.buyerUsername),
    normalizeIdentityValue(order?.buyerEmail)
  ].filter(Boolean);
  if (buyerValues.some((value) => aliases.has(value))) {
    return 'buyer';
  }

  return '';
}

function canTransitionOrder({ order, action, actor, now = Date.now() } = {}) {
  const currentStatus = normalizeOrderStatus(order?.status);
  const actorRole = resolveOrderActorRole(order, actor);
  const isSystem = actorRole === 'system' || actor?.isSystem === true;
  const isParticipant = actorRole === 'buyer' || actorRole === 'seller';

  switch (action) {
    case 'mark_paid':
      if (currentStatus !== ORDER_STATUS.CREATED) {
        return { allowed: false, code: 'INVALID_ORDER_STATUS', message: 'Only awaiting-payment orders can be marked as paid.' };
      }
      if (actorRole !== 'buyer') {
        return { allowed: false, code: 'FORBIDDEN', message: 'Only the buyer can mark this order as paid.' };
      }
      return { allowed: true, actorRole, targetStatus: ORDER_STATUS.PAYMENT_SENT };
    case 'release':
      if (currentStatus !== ORDER_STATUS.PAYMENT_SENT) {
        return { allowed: false, code: 'INVALID_ORDER_STATUS', message: 'Only payment-sent orders can be released.' };
      }
      if (actorRole !== 'seller') {
        return { allowed: false, code: 'FORBIDDEN', message: 'Only the seller can release this order.' };
      }
      return { allowed: true, actorRole, targetStatus: ORDER_STATUS.COMPLETED };
    case 'cancel':
      if (currentStatus === ORDER_STATUS.PAYMENT_SENT) {
        if (isSystem) {
          return { allowed: true, actorRole, targetStatus: ORDER_STATUS.CANCELLED };
        }
        if (actorRole !== 'buyer') {
          return { allowed: false, code: 'FORBIDDEN', message: 'Only the buyer can cancel after marking payment.' };
        }
        return { allowed: true, actorRole, targetStatus: ORDER_STATUS.CANCELLED };
      }
      if (currentStatus !== ORDER_STATUS.CREATED) {
        return { allowed: false, code: 'INVALID_ORDER_STATUS', message: 'Only active buyer-side orders can be cancelled directly.' };
      }
      if (!isSystem && !isParticipant) {
        return { allowed: false, code: 'FORBIDDEN', message: 'Only order participants can cancel this order.' };
      }
      return { allowed: true, actorRole, targetStatus: ORDER_STATUS.CANCELLED };
    case 'expire':
      if (!isExpirableOrderStatus(currentStatus)) {
        return { allowed: false, code: 'INVALID_ORDER_STATUS', message: 'Only unpaid orders can expire.' };
      }
      if (Number(order?.expiresAt || 0) > now && !isSystem) {
        return { allowed: false, code: 'ORDER_NOT_EXPIRED', message: 'Order has not reached its payment deadline yet.' };
      }
      if (!isSystem && !isParticipant) {
        return { allowed: false, code: 'FORBIDDEN', message: 'Only order participants can expire this order.' };
      }
      return { allowed: true, actorRole, targetStatus: ORDER_STATUS.EXPIRED };
    case 'dispute':
      if (isClosedOrderStatus(currentStatus)) {
        return { allowed: false, code: 'INVALID_ORDER_STATUS', message: 'Closed orders cannot be disputed.' };
      }
      if (!isParticipant) {
        return { allowed: false, code: 'FORBIDDEN', message: 'Only order participants can raise a dispute.' };
      }
      return { allowed: true, actorRole, targetStatus: ORDER_STATUS.DISPUTED };
    default:
      return { allowed: false, code: 'INVALID_ORDER_ACTION', message: 'Invalid order action.' };
  }
}

function createOrderStatusHistoryEntry({ status, actor, reason = '', at = Date.now(), metadata = {} } = {}) {
  const normalizedStatus = normalizeOrderStatus(status);
  const actorId = String(actor?.id || actor?.userId || (actor?.isSystem ? 'system' : '') || '').trim();
  const actorUsername = String(actor?.username || actor?.name || (actor?.isSystem ? 'System' : '') || '').trim();
  const actorRole = String(actor?.role || '').trim() || (actor?.isSystem ? 'system' : '');

  return {
    status: normalizedStatus,
    reason: String(reason || '').trim() || normalizedStatus.toLowerCase(),
    actorId,
    actorUsername,
    actorRole,
    at,
    metadata: metadata && typeof metadata === 'object' ? { ...metadata } : {}
  };
}

module.exports = {
  ORDER_STATUS,
  ORDER_STATUS_ALIASES,
  ACTIVE_ORDER_STATUSES,
  ENDED_ORDER_STATUSES,
  EXPIRABLE_ORDER_STATUSES,
  CREATED_LIKE_STATUSES,
  PAYMENT_SENT_LIKE_STATUSES,
  COMPLETED_LIKE_STATUSES,
  CANCELLED_LIKE_STATUSES,
  normalizeOrderStatus,
  normalizeIdentityValue,
  isActiveOrderStatus,
  isClosedOrderStatus,
  isExpirableOrderStatus,
  getOrderStatusBucket,
  resolveOrderActorRole,
  canTransitionOrder,
  createOrderStatusHistoryEntry
};
