const test = require('node:test');
const assert = require('node:assert/strict');

const { sanitizeOrderForEmailJob } = require('../services/p2p-email-job-queue');

test('sanitizeOrderForEmailJob keeps only email-job-safe fields', () => {
  const result = sanitizeOrderForEmailJob({
    id: 'ord_123',
    reference: 'P2P-123',
    sellerUserId: 'seller_1',
    buyerUserId: 'buyer_1',
    buyerUsername: 'BuyerOne',
    sellerUsername: 'SellerOne',
    paymentMethod: 'UPI',
    amountInr: '1500.25',
    cryptoAmount: '17.5',
    asset: 'usdt',
    sellerEmail: 'SELLER@EXAMPLE.COM',
    buyerEmail: ' buyer@example.com ',
    antiPhishingCode: 'ABCD',
    ignoredField: 'should-not-leak'
  });

  assert.deepEqual(result, {
    id: 'ord_123',
    reference: 'P2P-123',
    orderNo: 'P2P-123',
    sellerUserId: 'seller_1',
    buyerUserId: 'buyer_1',
    sellerUsername: 'SellerOne',
    buyerUsername: 'BuyerOne',
    sellerEmail: 'seller@example.com',
    buyerEmail: 'buyer@example.com',
    antiPhishingCode: 'ABCD',
    paymentMethod: 'UPI',
    paymentDetails: '',
    upiId: '',
    amountInr: 1500.25,
    fiatAmount: 1500.25,
    assetAmount: 17.5,
    cryptoAmount: 17.5,
    asset: 'USDT',
    canceledBy: '',
    cancelledBy: '',
    status: '',
    appealType: '',
    appealReason: ''
  });
});
