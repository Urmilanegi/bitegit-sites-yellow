const test = require('node:test');
const assert = require('node:assert/strict');

const { getRequestIp } = require('../lib/request-ip');
const { isSuspiciousPath } = require('../middleware/security');

test('getRequestIp prefers cf-connecting-ip and normalizes IPv4-mapped addresses', () => {
  const ip = getRequestIp({
    headers: {
      'cf-connecting-ip': '::ffff:203.0.113.10',
      'x-forwarded-for': '198.51.100.22, 10.0.0.1'
    },
    ip: '10.0.0.2'
  });

  assert.equal(ip, '203.0.113.10');
});

test('getRequestIp falls back to x-forwarded-for when cloudflare header is absent', () => {
  const ip = getRequestIp({
    headers: {
      'x-forwarded-for': '198.51.100.22, 10.0.0.1'
    },
    ip: '10.0.0.2'
  });

  assert.equal(ip, '198.51.100.22');
});

test('isSuspiciousPath blocks common exploit probes', () => {
  assert.match(String(isSuspiciousPath('/wp-login.php')), /blocked-pattern/i);
  assert.match(String(isSuspiciousPath('/.env')), /blocked-pattern/i);
  assert.equal(isSuspiciousPath('/markets'), null);
});

test('isSuspiciousPath blocks traversal attempts', () => {
  assert.equal(isSuspiciousPath('/../../etc/passwd'), 'path-traversal');
  assert.equal(isSuspiciousPath('/api/%2e%2e/%2e%2e/private'), 'path-traversal');
});
