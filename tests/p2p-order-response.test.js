const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeExpiresAtValue, toOrderResponse } = require('../models/P2POrder');
const { createP2POrderController } = require('../controllers/p2p-order-controller');

function createMockResponse() {
  return {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    }
  };
}

test('normalizeExpiresAtValue accepts ISO strings and Date objects', () => {
  const isoString = '2026-03-29T13:00:00.000Z';
  const dateValue = new Date(isoString);

  assert.equal(normalizeExpiresAtValue(isoString), dateValue.getTime());
  assert.equal(normalizeExpiresAtValue(dateValue), dateValue.getTime());
  assert.equal(toOrderResponse({ id: 'ord_1', status: 'CREATED', expiresAt: isoString }).expiresAt, isoString);
});

test('createOrder returns existing order payload even when expiresAt is an ISO string', async () => {
  const existingOrder = {
    id: 'ord_existing',
    reference: 'P2P-EXIST-1234',
    adId: 'ofr_1028',
    offerId: 'ofr_1028',
    buyerId: 'buyer_1',
    sellerId: 'seller_1',
    buyerUserId: 'buyer_1',
    sellerUserId: 'seller_1',
    buyerUsername: 'buyer',
    sellerUsername: 'seller',
    type: 'SELL',
    side: 'buy',
    asset: 'USDT',
    paymentMethod: 'UPI',
    price: 90,
    cryptoAmount: 11.11111111,
    assetAmount: 11.11111111,
    escrowAmount: 11.11111111,
    fiatAmount: 1000,
    amountInr: 1000,
    status: 'CREATED',
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  };

  const controller = createP2POrderController({
    repos: {
      async getP2PCredentialByUserId() {
        return { email: 'buyer@example.com', emailVerified: true };
      },
      async getOfferById() {
        return {
          id: 'ofr_1028',
          type: 'SELL',
          asset: 'USDT',
          price: 90,
          minLimit: 100,
          maxLimit: 10000,
          availableAmount: 500,
          payments: ['UPI'],
          createdByUserId: 'seller_1',
          createdByUsername: 'seller',
          advertiser: 'seller',
          status: 'ACTIVE',
          moderationStatus: 'APPROVED',
          merchantDepositLocked: true,
          fundingSource: 'ad_locked',
          environment: 'production'
        };
      },
      async listPaymentMethods() {
        return [];
      }
    },
    walletService: {
      async createEscrowOrder() {
        const error = new Error('You already have an active order. Complete or cancel it first.');
        error.code = 'ACTIVE_ORDER_EXISTS';
        error.status = 409;
        error.existingOrder = existingOrder;
        throw error;
      }
    }
  });

  const req = {
    body: { adId: 'ofr_1028', fiatAmount: 1000, paymentMethod: 'UPI' },
    p2pUser: {
      id: 'buyer_1',
      userId: 'buyer_1',
      username: 'buyer',
      email: 'buyer@example.com'
    }
  };
  const res = createMockResponse();

  await controller.createOrder(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.existingOrder, true);
  assert.equal(res.payload.order.id, existingOrder.id);
  assert.equal(res.payload.order.status, 'CREATED');
  assert.equal(typeof res.payload.order.remainingSeconds, 'number');
  assert.ok(res.payload.order.remainingSeconds > 0);
});

test('createOrder recovers buyer active order after unexpected error', async () => {
  const recoveredOrder = {
    id: 'ord_recovered',
    reference: 'P2P-RECOVER-1234',
    adId: 'ofr_1028',
    offerId: 'ofr_1028',
    buyerId: 'buyer_1',
    sellerId: 'seller_1',
    buyerUserId: 'buyer_1',
    sellerUserId: 'seller_1',
    buyerUsername: 'buyer',
    sellerUsername: 'seller',
    type: 'SELL',
    side: 'buy',
    asset: 'USDT',
    paymentMethod: 'UPI',
    price: 90,
    cryptoAmount: 11.11111111,
    assetAmount: 11.11111111,
    escrowAmount: 11.11111111,
    fiatAmount: 1000,
    amountInr: 1000,
    status: 'CREATED',
    expiresAt: Date.now() + 5 * 60 * 1000
  };

  const controller = createP2POrderController({
    repos: {
      async getP2PCredentialByUserId() {
        return { email: 'buyer@example.com', emailVerified: true };
      },
      async getOfferById() {
        return {
          id: 'ofr_1028',
          type: 'SELL',
          asset: 'USDT',
          price: 90,
          minLimit: 100,
          maxLimit: 10000,
          availableAmount: 500,
          payments: ['UPI'],
          createdByUserId: 'seller_1',
          createdByUsername: 'seller',
          advertiser: 'seller',
          status: 'ACTIVE',
          moderationStatus: 'APPROVED',
          merchantDepositLocked: true,
          fundingSource: 'ad_locked',
          environment: 'production'
        };
      },
      async listPaymentMethods() {
        return [];
      },
      async listP2PActiveOrdersForUser() {
        return [recoveredOrder];
      }
    },
    walletService: {
      async createEscrowOrder() {
        throw new Error('Unexpected write concern failure');
      }
    }
  });

  const req = {
    body: { adId: 'ofr_1028', fiatAmount: 1000, paymentMethod: 'UPI' },
    p2pUser: {
      id: 'buyer_1',
      userId: 'buyer_1',
      username: 'buyer',
      email: 'buyer@example.com'
    }
  };
  const res = createMockResponse();

  await controller.createOrder(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.existingOrder, true);
  assert.equal(res.payload.recovered, true);
  assert.equal(res.payload.order.id, recoveredOrder.id);
});
