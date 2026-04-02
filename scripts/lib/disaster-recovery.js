const fs = require('fs/promises');
const path = require('path');
const { execFileSync } = require('child_process');

const DEFAULT_PRODUCTION_HEALTH_URL = 'https://www.bitegit.com/api/health';
const DEFAULT_STAGING_HEALTH_URL = 'https://bitegit-sites-staging.onrender.com/api/health';
const REQUEST_TIMEOUT_MS = 15_000;

function timestampForPath(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, '-');
}

function shortCommit(value) {
  return String(value || '').trim().slice(0, 7) || 'n/a';
}

function runGit(args, { cwd = process.cwd() } = {}) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim();
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
  return dirPath;
}

function safeString(value, fallback = 'n/a') {
  const normalized = String(value || '').trim();
  return normalized || fallback;
}

function envPresent(name) {
  return Boolean(String(process.env[name] || '').trim());
}

function buildBackupReadiness() {
  const mongoReady = envPresent('BACKUP_MONGODB_URI') && envPresent('BACKUP_MONGODB_DB_NAME');
  const mysqlReady =
    envPresent('BACKUP_MYSQL_HOST') &&
    envPresent('BACKUP_MYSQL_DATABASE') &&
    envPresent('BACKUP_MYSQL_USER') &&
    envPresent('BACKUP_MYSQL_PASSWORD');

  return [
    {
      key: 'sourceBundle',
      label: 'Source backup artifact',
      status: 'ready',
      details: 'Git bundle can be created from repository history during every drill.'
    },
    {
      key: 'mongoProviderSnapshot',
      label: 'Mongo backup secret set',
      status: mongoReady ? 'ready' : 'manual',
      details: mongoReady
        ? 'GitHub secrets are present for future automated Mongo exports.'
        : 'Add BACKUP_MONGODB_URI and BACKUP_MONGODB_DB_NAME if you want GitHub-driven Mongo exports later.'
    },
    {
      key: 'mysqlProviderSnapshot',
      label: 'MySQL backup secret set',
      status: mysqlReady ? 'ready' : 'manual',
      details: mysqlReady
        ? 'GitHub secrets are present for future automated MySQL exports.'
        : 'Add BACKUP_MYSQL_HOST, BACKUP_MYSQL_DATABASE, BACKUP_MYSQL_USER, and BACKUP_MYSQL_PASSWORD for GitHub-driven MySQL exports later.'
    },
    {
      key: 'redisRecovery',
      label: 'Redis recovery mode',
      status: 'ready',
      details: 'Redis is used for queues/locks only; recovery path is service restart plus worker replay.'
    }
  ];
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        accept: 'application/json'
      }
    });
    const bodyText = await response.text();
    const elapsedMs = Date.now() - startedAt;
    let json = null;
    try {
      json = JSON.parse(bodyText);
    } catch (_) {
      json = null;
    }

    return {
      ok: response.ok,
      status: response.status,
      elapsedMs,
      json,
      bodyText
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      elapsedMs: Date.now() - startedAt,
      json: null,
      bodyText: '',
      error: String(error.message || error)
    };
  } finally {
    clearTimeout(timeout);
  }
}

function evaluateEnvironment(name, response, url) {
  const payload = response.json || {};
  const runtime = payload.runtime || {};
  const worker = payload.worker || payload.modules?.emailWorker || {};
  const failures = [];

  if (!response.ok) failures.push(`HTTP ${response.status || 'request-failed'}`);
  if (!response.json) failures.push('invalid-json');
  if (payload.ready !== true) failures.push(`ready=${safeString(payload.ready)}`);
  if (payload.db !== 'connected') failures.push(`db=${safeString(payload.db)}`);
  if (safeString(worker.status, '') !== 'healthy') failures.push(`worker=${safeString(worker.status)}`);
  if (safeString(payload.modules?.emailQueue?.mode, '') !== 'redis-worker') {
    failures.push(`emailQueue=${safeString(payload.modules?.emailQueue?.mode)}`);
  }

  return {
    name,
    url,
    response,
    payload,
    runtime,
    worker,
    healthy: failures.length === 0,
    failures
  };
}

function getProductionHealthUrl() {
  return safeString(process.env.PRODUCTION_HEALTH_URL, DEFAULT_PRODUCTION_HEALTH_URL);
}

function getStagingHealthUrl() {
  return safeString(process.env.STAGING_HEALTH_URL, DEFAULT_STAGING_HEALTH_URL);
}

async function collectEnvironmentStatus() {
  const endpoints = [
    ['production', getProductionHealthUrl()],
    ['staging', getStagingHealthUrl()]
  ];

  const results = [];
  for (const [name, url] of endpoints) {
    const response = await fetchJson(url);
    results.push(evaluateEnvironment(name, response, url));
  }
  return results;
}

function getRollbackTarget(commit) {
  const revList = runGit(['rev-list', '--max-count=2', commit]);
  const lines = revList.split('\n').map((line) => line.trim()).filter(Boolean);
  return {
    current: lines[0] || '',
    previous: lines[1] || ''
  };
}

function collectGitRefs() {
  const preferredRefs = [
    'refs/heads/main',
    'refs/heads/staging',
    'refs/remotes/origin/main',
    'refs/remotes/origin/staging'
  ];

  return preferredRefs.filter((ref) => {
    try {
      runGit(['show-ref', '--verify', '--quiet', ref]);
      return true;
    } catch (_) {
      return false;
    }
  });
}

async function createSourceBackup(outputDir) {
  const refs = Array.from(new Set(['HEAD', ...collectGitRefs()]));
  const backupDir = await ensureDir(path.join(outputDir, 'source-backup'));
  const bundlePath = path.join(backupDir, 'bitegit-source.bundle');
  const manifestPath = path.join(backupDir, 'manifest.json');

  execFileSync('git', ['bundle', 'create', bundlePath, ...refs], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const manifest = {
    generatedAt: new Date().toISOString(),
    headCommit: runGit(['rev-parse', 'HEAD']),
    refs,
    bundlePath
  };

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  return {
    backupDir,
    bundlePath,
    manifestPath,
    manifest
  };
}

function buildDrillStatus({ environments, rollback, sourceBackup }) {
  const warnings = [];
  const failures = [];

  if (!sourceBackup?.bundlePath) {
    failures.push('Source backup bundle was not created.');
  }

  for (const environment of environments) {
    if (!environment.healthy) {
      failures.push(`${environment.name} health check failed: ${environment.failures.join(', ')}`);
    }
  }

  if (!rollback.previous) {
    failures.push('Rollback target commit could not be resolved from git history.');
  }

  const readiness = buildBackupReadiness();
  for (const item of readiness) {
    if (item.status === 'manual') {
      warnings.push(item.details);
    }
  }

  return {
    readiness,
    warnings,
    failures,
    ok: failures.length === 0
  };
}

function buildEnvironmentTable(environments) {
  const lines = [
    '| Environment | Result | Commit | Worker | Queue | DB | URL |',
    '| --- | --- | --- | --- | --- | --- | --- |'
  ];

  for (const environment of environments) {
    lines.push(
      `| ${environment.name} | ${environment.healthy ? 'PASS' : 'FAIL'} | ${shortCommit(environment.runtime.gitCommit)} | ${safeString(environment.worker.status)} | ${safeString(environment.payload.modules?.emailQueue?.mode)} | ${safeString(environment.payload.db)} | ${environment.url} |`
    );
  }

  return lines.join('\n');
}

function buildReadinessTable(readiness) {
  const lines = [
    '| Capability | Status | Details |',
    '| --- | --- | --- |'
  ];

  for (const item of readiness) {
    lines.push(`| ${item.label} | ${item.status.toUpperCase()} | ${item.details} |`);
  }

  return lines.join('\n');
}

function buildDisasterRecoveryReport({ environments, rollback, sourceBackup, status }) {
  const lines = [
    '# Bitegit Disaster Recovery Drill',
    '',
    `Generated at ${new Date().toISOString()}`,
    '',
    `Overall result: ${status.ok ? 'PASS' : 'FAIL'}`,
    '',
    buildEnvironmentTable(environments),
    '',
    '## Rollback Target',
    '',
    `- Current production commit: ${rollback.current || 'n/a'}`,
    `- Recommended rollback commit: ${rollback.previous || 'n/a'}`,
    `- Roll forward commit in repo: ${runGit(['rev-parse', 'HEAD'])}`,
    `- Production health URL: ${getProductionHealthUrl()}`,
    `- Staging health URL: ${getStagingHealthUrl()}`,
    '',
    '## Source Backup Artifact',
    '',
    `- Bundle path: ${sourceBackup.bundlePath}`,
    `- Manifest path: ${sourceBackup.manifestPath}`,
    `- Included refs: ${sourceBackup.manifest.refs.join(', ')}`,
    '',
    '## Backup Readiness',
    '',
    buildReadinessTable(status.readiness),
    '',
    '## Manual Provider Snapshot Checklist',
    '',
    '- MongoDB: keep Atlas/managed snapshots enabled and record the latest restore point before schema-changing deploys.',
    '- MySQL: keep Render or provider snapshot/export enabled and verify restore credentials outside the app repo.',
    '- Redis: no stateful restore is required for current queue/lock usage; restart worker services after rollback.',
    '',
    '## Rollback Steps',
    '',
    `1. Confirm current prod health on ${getProductionHealthUrl()}.`,
    `2. Repoint production to commit ${rollback.previous || 'ROLLBACK_COMMIT_REQUIRED'} and redeploy the web + worker services.`,
    '3. Run smoke checks on `/api/health`, `/healthz`, `/status`, and one authenticated business flow.',
    '4. If the rollback is good, keep staging on the failed commit for debugging and open an incident note.',
    ''
  ];

  if (status.warnings.length > 0) {
    lines.push('## Warnings', '');
    for (const warning of status.warnings) {
      lines.push(`- ${warning}`);
    }
    lines.push('');
  }

  if (status.failures.length > 0) {
    lines.push('## Failures', '');
    for (const failure of status.failures) {
      lines.push(`- ${failure}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function writeDrillArtifacts({ outputDir, report, environments, rollback, sourceBackup, status }) {
  await ensureDir(outputDir);
  const reportPath = path.join(outputDir, 'disaster-recovery-report.md');
  const jsonPath = path.join(outputDir, 'disaster-recovery-report.json');

  await fs.writeFile(reportPath, report, 'utf8');
  await fs.writeFile(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        environments,
        rollback,
        sourceBackup,
        status
      },
      null,
      2
    ),
    'utf8'
  );

  return { reportPath, jsonPath };
}

async function runDisasterRecoveryDrill({
  outputDir = path.join(process.cwd(), 'artifacts', 'disaster-recovery', timestampForPath())
} = {}) {
  const environments = await collectEnvironmentStatus();
  const production = environments.find((environment) => environment.name === 'production');
  const liveCommit = safeString(production?.runtime?.gitCommit, '');
  const rollback = liveCommit ? getRollbackTarget(liveCommit) : { current: '', previous: '' };
  const sourceBackup = await createSourceBackup(outputDir);
  const status = buildDrillStatus({ environments, rollback, sourceBackup });
  const report = buildDisasterRecoveryReport({ environments, rollback, sourceBackup, status });
  const artifacts = await writeDrillArtifacts({
    outputDir,
    report,
    environments,
    rollback,
    sourceBackup,
    status
  });

  return {
    outputDir,
    environments,
    rollback,
    sourceBackup,
    status,
    report,
    ...artifacts
  };
}

module.exports = {
  buildBackupReadiness,
  buildDrillStatus,
  collectEnvironmentStatus,
  createSourceBackup,
  getRollbackTarget,
  runDisasterRecoveryDrill,
  shortCommit,
  timestampForPath
};
