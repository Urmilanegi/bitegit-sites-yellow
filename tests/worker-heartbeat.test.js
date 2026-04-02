const test = require('node:test');
const assert = require('node:assert/strict');

const { parseWorkerHeartbeat } = require('../services/worker-heartbeat');

test('parseWorkerHeartbeat marks fresh payloads healthy', () => {
  const snapshot = parseWorkerHeartbeat(JSON.stringify({
    updatedAt: '2026-04-02T10:00:30.000Z',
    queueName: 'bitegit-p2p-emails',
    serviceName: 'bitegit-email-worker',
    environment: 'production',
    hostname: 'worker-host',
    pid: 42
  }), {
    now: new Date('2026-04-02T10:01:00.000Z'),
    staleAfterSeconds: 90
  });

  assert.equal(snapshot.status, 'healthy');
  assert.equal(snapshot.ready, true);
  assert.equal(snapshot.ageSeconds, 30);
  assert.equal(snapshot.queueName, 'bitegit-p2p-emails');
});

test('parseWorkerHeartbeat marks stale payloads stale', () => {
  const snapshot = parseWorkerHeartbeat(JSON.stringify({
    updatedAt: '2026-04-02T10:00:00.000Z'
  }), {
    now: new Date('2026-04-02T10:02:00.000Z'),
    staleAfterSeconds: 45
  });

  assert.equal(snapshot.status, 'stale');
  assert.equal(snapshot.ready, false);
  assert.equal(snapshot.ageSeconds, 120);
});

test('parseWorkerHeartbeat rejects invalid payloads', () => {
  const snapshot = parseWorkerHeartbeat('not-json');

  assert.equal(snapshot.status, 'invalid');
  assert.equal(snapshot.ready, false);
});
