const test = require('node:test');
const assert = require('node:assert/strict');

const {
  ORDER_STATUS,
  normalizeOrderStatus,
  isActiveOrderStatus,
  isClosedOrderStatus,
  isExpirableOrderStatus,
  getOrderStatusBucket,
  resolveOrderActorRole,
  canTransitionOrder,
  createOrderStatusHistoryEntry
} = require('../lib/p2p-order-state');

function makeOrder(status = 'CREATED') {
  return {
    id: 'ord_1',
    status,
    expiresAt: Date.now() - 1000,
    buyerUserId: 'buyer-1',
    buyerUsername: 'buyeruser',
    buyerEmail: 'buyer@example.com',
    sellerUserId: 'seller-1',
    sellerUsername: 'selleruser',
    sellerEmail: 'seller@example.com',
    participants: [
      { id: 'buyer-1', username: 'buyeruser', role: 'buyer' },
      { id: 'seller-1', username: 'selleruser', role: 'seller' }
    ]
  };
}

test('normalizes legacy order statuses into canonical states', () => {
  assert.equal(normalizeOrderStatus('pending'), ORDER_STATUS.CREATED);
  assert.equal(normalizeOrderStatus('paid'), ORDER_STATUS.PAYMENT_SENT);
  assert.equal(normalizeOrderStatus('released'), ORDER_STATUS.COMPLETED);
  assert.equal(normalizeOrderStatus('canceled'), ORDER_STATUS.CANCELLED);
  assert.equal(normalizeOrderStatus('disputed'), ORDER_STATUS.DISPUTED);
});

test('classifies active, closed, expirable states consistently', () => {
  assert.equal(isActiveOrderStatus('PENDING'), true);
  assert.equal(isActiveOrderStatus('PAYMENT_SENT'), true);
  assert.equal(isActiveOrderStatus('DISPUTED'), true);
  assert.equal(isClosedOrderStatus('RELEASED'), true);
  assert.equal(isClosedOrderStatus('EXPIRED'), true);
  assert.equal(isClosedOrderStatus('CREATED'), false);
  assert.equal(isExpirableOrderStatus('OPEN'), true);
  assert.equal(isExpirableOrderStatus('PAYMENT_SENT'), false);
  assert.equal(getOrderStatusBucket('PAID'), 'inprogress');
  assert.equal(getOrderStatusBucket('DISPUTED'), 'dispute');
  assert.equal(getOrderStatusBucket('COMPLETED'), 'completed');
  assert.equal(getOrderStatusBucket('CANCELED'), 'canceled');
});

test('resolves buyer and seller roles from mixed actor aliases', () => {
  const order = makeOrder('CREATED');
  assert.equal(resolveOrderActorRole(order, { id: 'buyer-1' }), 'buyer');
  assert.equal(resolveOrderActorRole(order, { username: 'selleruser' }), 'seller');
  assert.equal(resolveOrderActorRole(order, { email: 'BUYER@example.com' }), 'buyer');
});

test('allows only buyer to mark unpaid order as paid', () => {
  const order = makeOrder('PENDING');
  const buyerTransition = canTransitionOrder({
    order,
    action: 'mark_paid',
    actor: { id: 'buyer-1', username: 'buyeruser' },
    now: Date.now() - 2000
  });
  const sellerTransition = canTransitionOrder({
    order,
    action: 'mark_paid',
    actor: { id: 'seller-1', username: 'selleruser' },
    now: Date.now() - 2000
  });

  assert.equal(buyerTransition.allowed, true);
  assert.equal(buyerTransition.targetStatus, ORDER_STATUS.PAYMENT_SENT);
  assert.equal(sellerTransition.allowed, false);
  assert.equal(sellerTransition.code, 'FORBIDDEN');
});

test('release, dispute, cancel, and expire rules stay deterministic', () => {
  const paidOrder = makeOrder('PAID');
  const sellerRelease = canTransitionOrder({
    order: paidOrder,
    action: 'release',
    actor: { id: 'seller-1', username: 'selleruser' }
  });
  const buyerCancelAfterPaid = canTransitionOrder({
    order: paidOrder,
    action: 'cancel',
    actor: { id: 'buyer-1', username: 'buyeruser' }
  });
  const sellerCancelAfterPaid = canTransitionOrder({
    order: paidOrder,
    action: 'cancel',
    actor: { id: 'seller-1', username: 'selleruser' }
  });
  const buyerDisputeAfterPaid = canTransitionOrder({
    order: paidOrder,
    action: 'dispute',
    actor: { id: 'buyer-1', username: 'buyeruser' }
  });
  const expiredOrder = makeOrder('CREATED');
  const systemExpire = canTransitionOrder({
    order: expiredOrder,
    action: 'expire',
    actor: { isSystem: true, username: 'System' }
  });

  assert.equal(sellerRelease.allowed, true);
  assert.equal(sellerRelease.targetStatus, ORDER_STATUS.COMPLETED);
  assert.equal(buyerCancelAfterPaid.allowed, true);
  assert.equal(buyerCancelAfterPaid.targetStatus, ORDER_STATUS.CANCELLED);
  assert.equal(sellerCancelAfterPaid.allowed, false);
  assert.equal(sellerCancelAfterPaid.code, 'FORBIDDEN');
  assert.equal(buyerDisputeAfterPaid.allowed, true);
  assert.equal(buyerDisputeAfterPaid.targetStatus, ORDER_STATUS.DISPUTED);
  assert.equal(systemExpire.allowed, true);
  assert.equal(systemExpire.targetStatus, ORDER_STATUS.EXPIRED);
});

test('builds structured status history entries', () => {
  const entry = createOrderStatusHistoryEntry({
    status: 'released',
    actor: { id: 'seller-1', username: 'selleruser', role: 'seller' },
    reason: 'escrow_released',
    at: 123456,
    metadata: { orderId: 'ord_1' }
  });

  assert.deepEqual(entry, {
    status: ORDER_STATUS.COMPLETED,
    reason: 'escrow_released',
    actorId: 'seller-1',
    actorUsername: 'selleruser',
    actorRole: 'seller',
    at: 123456,
    metadata: { orderId: 'ord_1' }
  });
});
