require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const { connectToMongo, getCollections, getMongoClient, getMongoConfig } = require('./lib/db');
const { createRepositories } = require('./lib/repositories');
const { createP2PEmailService } = require('./services/p2p-email-service');
const { createP2PEmailJobWorker } = require('./services/p2p-email-job-queue');
const { isRedisConfigured } = require('./services/redis-support');
const { createWorkerHeartbeatReporter } = require('./services/worker-heartbeat');

let shuttingDown = false;
let emailWorker = null;
let workerHeartbeatReporter = null;

async function closeMongoClient() {
  let mongoClient = null;
  try {
    mongoClient = getMongoClient();
  } catch (_) {
    mongoClient = null;
  }

  if (mongoClient && typeof mongoClient.close === 'function') {
    await mongoClient.close();
  }
}

async function shutdown(signal) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  console.log(`[worker] ${signal} received, shutting down...`);

  try {
    if (workerHeartbeatReporter && typeof workerHeartbeatReporter.stop === 'function') {
      await workerHeartbeatReporter.stop();
      console.log('[worker] Heartbeat reporter closed.');
    }
  } catch (error) {
    console.warn(`[worker] Failed to close heartbeat reporter cleanly: ${error.message}`);
  }

  try {
    if (emailWorker && typeof emailWorker.close === 'function') {
      await emailWorker.close();
      console.log('[worker] P2P email worker closed.');
    }
  } catch (error) {
    console.warn(`[worker] Failed to close email worker cleanly: ${error.message}`);
  }

  try {
    await closeMongoClient();
    console.log('[worker] MongoDB client closed.');
  } catch (error) {
    console.warn(`[worker] Failed to close MongoDB cleanly: ${error.message}`);
  }

  process.exit(0);
}

async function main() {
  if (!isRedisConfigured()) {
    throw new Error('REDIS_URL is required to start the background worker.');
  }

  const mongoConfig = getMongoConfig();
  console.log(`[worker] Starting Bitegit background worker on PID ${process.pid}`);
  console.log(`MongoDB target URI (${mongoConfig.uriSource || 'unknown'}): ${mongoConfig.maskedUri}`);

  await connectToMongo();

  const repos = createRepositories(getCollections());
  const p2pEmailService = createP2PEmailService();

  emailWorker = createP2PEmailJobWorker({
    repos,
    p2pEmailService
  });
  workerHeartbeatReporter = createWorkerHeartbeatReporter({
    queueName: emailWorker.queueName
  });
  workerHeartbeatReporter.start();

  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
      shutdown(signal).catch((error) => {
        console.error(`[worker] Shutdown failure: ${error.message}`);
        process.exit(1);
      });
    });
  });

  console.log('[worker] Background worker is online.');
}

main().catch((error) => {
  console.error('[worker] Failed to start:', error);
  process.exit(1);
});
