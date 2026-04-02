const fs = require('fs/promises');
const path = require('path');

const REPORT_PATH = path.join(process.cwd(), 'health-report.md');
const REQUEST_TIMEOUT_MS = 15_000;
const endpoints = [
  {
    name: 'production',
    url: String(process.env.PRODUCTION_HEALTH_URL || 'https://www.bitegit.com/api/health').trim()
  },
  {
    name: 'staging',
    url: String(process.env.STAGING_HEALTH_URL || 'https://bitegit-sites-staging.onrender.com/api/health').trim()
  }
].filter((entry) => entry.url);

function safeString(value, fallback = 'n/a') {
  const normalized = String(value || '').trim();
  return normalized || fallback;
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
    const elapsedMs = Date.now() - startedAt;
    const bodyText = await response.text();
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
      bodyText,
      json
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      elapsedMs: Date.now() - startedAt,
      bodyText: '',
      json: null,
      error: String(error.message || error)
    };
  } finally {
    clearTimeout(timeout);
  }
}

function evaluateHealth(name, url, response) {
  const failures = [];
  const notes = [];
  const payload = response.json || {};
  const modules = payload.modules || {};
  const worker = payload.worker || modules.emailWorker || {};

  if (!response.ok) {
    failures.push(`HTTP ${response.status || 'request-failed'}`);
  }
  if (!response.json) {
    failures.push('Response is not valid JSON');
  }
  if (payload.ready !== true) {
    failures.push(`ready=${safeString(payload.ready)}`);
  }
  if (payload.db !== 'connected') {
    failures.push(`db=${safeString(payload.db)}`);
  }
  if (safeString(modules.redis?.mode, '') !== 'configured') {
    failures.push(`redis=${safeString(modules.redis?.mode)}`);
  }
  if (safeString(modules.emailQueue?.mode, '') !== 'redis-worker') {
    failures.push(`emailQueue=${safeString(modules.emailQueue?.mode)}`);
  }
  if (!['mysql', 'mongo-fallback'].includes(safeString(modules.userCenter?.mode, ''))) {
    failures.push(`userCenter=${safeString(modules.userCenter?.mode)}`);
  }
  if (!['mysql', 'fallback-memory'].includes(safeString(modules.socialFeed?.mode, ''))) {
    failures.push(`socialFeed=${safeString(modules.socialFeed?.mode)}`);
  }
  if (safeString(worker.status, '') !== 'healthy') {
    failures.push(`emailWorker=${safeString(worker.status)}`);
  }
  if (safeString(modules.otpAuth?.mode, '') === 'repo-fallback') {
    notes.push('otpAuth is running in repo-fallback mode');
  }
  if (safeString(modules.userCenter?.mode, '') === 'mongo-fallback') {
    notes.push('userCenter is running in mongo-fallback mode');
  }
  if (safeString(modules.socialFeed?.mode, '') === 'fallback-memory') {
    notes.push('socialFeed is running in fallback-memory mode');
  }

  return {
    name,
    url,
    passed: failures.length === 0,
    failures,
    notes,
    response,
    payload
  };
}

function buildSummaryTable(results) {
  const lines = [
    '| Environment | Result | Latency | Ready | DB | Email Worker | Queue | URL |',
    '| --- | --- | ---: | --- | --- | --- | --- | --- |'
  ];

  for (const result of results) {
    const worker = result.payload?.worker || result.payload?.modules?.emailWorker || {};
    lines.push(
      `| ${result.name} | ${result.passed ? 'PASS' : 'FAIL'} | ${result.response.elapsedMs} ms | ${safeString(result.payload?.ready)} | ${safeString(result.payload?.db)} | ${safeString(worker.status)} | ${safeString(result.payload?.modules?.emailQueue?.mode)} | ${result.url} |`
    );
  }

  return lines.join('\n');
}

function buildEnvironmentSection(result) {
  const payload = result.payload || {};
  const runtime = payload.runtime || {};
  const worker = payload.worker || payload.modules?.emailWorker || {};
  const lines = [
    `## ${result.name}`,
    '',
    `- Result: ${result.passed ? 'PASS' : 'FAIL'}`,
    `- URL: ${result.url}`,
    `- HTTP: ${result.response.status || 'request-failed'} in ${result.response.elapsedMs} ms`,
    `- Service: ${safeString(runtime.serviceName)}`,
    `- Commit: ${safeString(runtime.gitCommit)}`,
    `- Ready: ${safeString(payload.ready)}`,
    `- DB: ${safeString(payload.db)}`,
    `- Email worker: ${safeString(worker.status)} (updated ${safeString(worker.updatedAt)})`,
    `- Email queue mode: ${safeString(payload.modules?.emailQueue?.mode)}`,
    `- User Center mode: ${safeString(payload.modules?.userCenter?.mode)}`,
    `- Social Feed mode: ${safeString(payload.modules?.socialFeed?.mode)}`
  ];

  if (result.failures.length) {
    lines.push('', '### Failures');
    for (const failure of result.failures) {
      lines.push(`- ${failure}`);
    }
  }

  if (result.notes.length) {
    lines.push('', '### Notes');
    for (const note of result.notes) {
      lines.push(`- ${note}`);
    }
  }

  return lines.join('\n');
}

async function main() {
  const results = [];

  for (const endpoint of endpoints) {
    const response = await fetchJson(endpoint.url);
    results.push(evaluateHealth(endpoint.name, endpoint.url, response));
  }

  const failedCount = results.filter((result) => !result.passed).length;
  const report = [
    '# Bitegit Health Report',
    '',
    `Generated at ${new Date().toISOString()}`,
    '',
    buildSummaryTable(results),
    '',
    ...results.map(buildEnvironmentSection).flatMap((section) => [section, ''])
  ].join('\n');

  await fs.writeFile(REPORT_PATH, report, 'utf8');
  console.log(report);

  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

main().catch(async (error) => {
  const message = `# Bitegit Health Report\n\nMonitoring script crashed: ${error.message}\n`;
  await fs.writeFile(REPORT_PATH, message, 'utf8').catch(() => {});
  console.error(error);
  process.exitCode = 1;
});
