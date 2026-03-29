const test = require('node:test');
const assert = require('node:assert/strict');

const { buildP2PCredentialUpsert } = require('../lib/repositories');

function overlappingKeys(operation) {
  const setKeys = new Set(Object.keys(operation.update.$set || {}));
  return Object.keys(operation.update.$setOnInsert || {}).filter((key) => setKeys.has(key));
}

test('buildP2PCredentialUpsert avoids overlapping Mongo update paths for legacy auto-heal flags', () => {
  const now = new Date('2026-03-29T14:00:00.000Z');
  const operation = buildP2PCredentialUpsert(
    'legacy@example.com',
    'hash:value',
    {
      role: 'USER',
      username: 'legacyUser',
      isMerchant: false,
      merchantDepositLocked: false,
      merchantLevel: 'trial',
      userId: 'usr_legacy',
      emailVerified: true
    },
    now
  );

  assert.deepEqual(overlappingKeys(operation), []);
  assert.equal(operation.update.$set.isMerchant, false);
  assert.equal(operation.update.$set.merchantDepositLocked, false);
  assert.equal(operation.update.$set.emailVerified, true);
  assert.equal(operation.update.$set.emailVerifiedAt, now);
  assert.equal(operation.update.$setOnInsert.createdAt, now);
  assert.equal(operation.update.$setOnInsert.kycStatus, 'NOT_SUBMITTED');
});

test('buildP2PCredentialUpsert keeps insert defaults when optional flags are not provided', () => {
  const operation = buildP2PCredentialUpsert('fresh@example.com', 'hash:value', { username: 'freshUser' });

  assert.deepEqual(overlappingKeys(operation), []);
  assert.equal(operation.update.$set.username, 'freshUser');
  assert.equal(operation.update.$setOnInsert.isMerchant, false);
  assert.equal(operation.update.$setOnInsert.merchantDepositLocked, false);
  assert.equal(operation.update.$setOnInsert.emailVerified, false);
  assert.equal(operation.update.$setOnInsert.emailVerifiedAt, null);
});
