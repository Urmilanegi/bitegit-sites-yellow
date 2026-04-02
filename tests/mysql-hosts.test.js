const test = require('node:test');
const assert = require('node:assert/strict');

const { resolveMySqlHosts } = require('../lib/mysql-hosts');
const { isRetryableMySqlError } = require('../lib/mysql-failover-pool');

test('resolveMySqlHosts merges comma-separated host lists without duplicates', () => {
  const hosts = resolveMySqlHosts(
    'primary-db, standby-db',
    '',
    'primary-db',
    'standby-db, analytics-db'
  );

  assert.deepEqual(hosts, ['primary-db', 'standby-db', 'analytics-db']);
});

test('isRetryableMySqlError detects network-style connection failures', () => {
  assert.equal(isRetryableMySqlError({ code: 'ETIMEDOUT' }), true);
  assert.equal(isRetryableMySqlError({ message: 'connect ECONNREFUSED 127.0.0.1:3306' }), true);
  assert.equal(isRetryableMySqlError({ code: 'ER_DUP_ENTRY' }), false);
});
