const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildBackupReadiness,
  buildDrillStatus,
  shortCommit
} = require('../scripts/lib/disaster-recovery');

test('shortCommit returns a 7-char commit hash prefix', () => {
  assert.equal(shortCommit('8fbbfdc2ae37589aa41c68e2d072b225e6ed3ebc'), '8fbbfdc');
});

test('buildBackupReadiness always marks source backup and redis recovery ready', () => {
  const readiness = buildBackupReadiness();
  const sourceBundle = readiness.find((item) => item.key === 'sourceBundle');
  const redisRecovery = readiness.find((item) => item.key === 'redisRecovery');

  assert.equal(sourceBundle.status, 'ready');
  assert.equal(redisRecovery.status, 'ready');
});

test('buildDrillStatus fails if rollback target is missing', () => {
  const status = buildDrillStatus({
    environments: [
      {
        name: 'production',
        healthy: true,
        failures: []
      }
    ],
    rollback: {
      current: 'abc1234',
      previous: ''
    },
    sourceBackup: {
      bundlePath: '/tmp/example.bundle'
    }
  });

  assert.equal(status.ok, false);
  assert.match(status.failures.join('\n'), /rollback target/i);
});
