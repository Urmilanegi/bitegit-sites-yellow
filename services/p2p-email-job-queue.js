const { Queue, Worker } = require('bullmq');
const { createRedisConnection, isRedisConfigured } = require('./redis-support');

const QUEUE_NAME = String(process.env.P2P_EMAIL_QUEUE_NAME || 'bitegit-p2p-emails').trim();
const DEFAULT_ATTEMPTS = Math.max(
  1,
  Number.parseInt(String(process.env.P2P_EMAIL_JOB_ATTEMPTS || '5'), 10) || 5
);
const DEFAULT_BACKOFF_DELAY_MS = Math.max(
  5_000,
  Number.parseInt(String(process.env.P2P_EMAIL_JOB_BACKOFF_MS || '15000'), 10) || 15_000
);
const DEFAULT_WORKER_CONCURRENCY = Math.max(
  1,
  Number.parseInt(String(process.env.P2P_EMAIL_WORKER_CONCURRENCY || '4'), 10) || 4
);

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeAmount(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sanitizeOrderForEmailJob(order = {}) {
  return {
    id: normalizeText(order.id || order._id),
    reference: normalizeText(order.reference || order.orderNo || order.id || order._id),
    orderNo: normalizeText(order.orderNo || order.reference || order.id || order._id),
    sellerUserId: normalizeText(order.sellerUserId || order.sellerId),
    buyerUserId: normalizeText(order.buyerUserId || order.buyerId),
    sellerUsername: normalizeText(order.sellerUsername),
    buyerUsername: normalizeText(order.buyerUsername || order.buyerEmail || 'Buyer'),
    sellerEmail: normalizeEmail(order.sellerEmail),
    buyerEmail: normalizeEmail(order.buyerEmail),
    antiPhishingCode: normalizeText(order.antiPhishingCode),
    paymentMethod: normalizeText(order.paymentMethod || 'UPI'),
    paymentDetails: normalizeText(order.paymentDetails || ''),
    upiId: normalizeText(order.upiId || ''),
    amountInr: normalizeAmount(order.amountInr || order.fiatAmount),
    fiatAmount: normalizeAmount(order.fiatAmount || order.amountInr),
    assetAmount: normalizeAmount(order.assetAmount || order.cryptoAmount),
    cryptoAmount: normalizeAmount(order.cryptoAmount || order.assetAmount),
    asset: normalizeText(order.asset || 'USDT').toUpperCase(),
    canceledBy: normalizeText(order.canceledBy || order.cancelledBy),
    cancelledBy: normalizeText(order.cancelledBy || order.canceledBy),
    status: normalizeText(order.status),
    appealType: normalizeText(order.appealType),
    appealReason: normalizeText(order.appealReason)
  };
}

function buildQueueOptions() {
  return {
    attempts: DEFAULT_ATTEMPTS,
    backoff: {
      type: 'exponential',
      delay: DEFAULT_BACKOFF_DELAY_MS
    },
    removeOnComplete: {
      age: 7 * 24 * 60 * 60,
      count: 500
    },
    removeOnFail: {
      age: 30 * 24 * 60 * 60,
      count: 1000
    }
  };
}

async function resolveParticipantEmails(repos, order = {}) {
  const [sellerCred, buyerCred] = await Promise.all([
    order.sellerUserId ? repos.getP2PCredentialByUserId(order.sellerUserId) : Promise.resolve(null),
    order.buyerUserId ? repos.getP2PCredentialByUserId(order.buyerUserId) : Promise.resolve(null)
  ]);

  return {
    sellerEmail: normalizeEmail(sellerCred?.email || order.sellerEmail),
    buyerEmail: normalizeEmail(buyerCred?.email || order.buyerEmail)
  };
}

async function processOrderCreatedJob(data, { repos, p2pEmailService }) {
  const order = sanitizeOrderForEmailJob(data?.order);
  const { sellerEmail, buyerEmail } = await resolveParticipantEmails(repos, order);

  if (sellerEmail) {
    await p2pEmailService.sendOrderCreated(sellerEmail, order);
  }
  if (buyerEmail && buyerEmail !== sellerEmail) {
    await p2pEmailService.sendOrderCreated(buyerEmail, order);
  }
}

async function processOrderStatusJob(data, { repos, p2pEmailService }) {
  const action = normalizeText(data?.action).toLowerCase();
  const order = sanitizeOrderForEmailJob(data?.order);
  const actorUsername = normalizeText(data?.actorUsername || 'A user');
  const { sellerEmail, buyerEmail } = await resolveParticipantEmails(repos, order);

  if (action === 'mark_paid') {
    if (sellerEmail) {
      await p2pEmailService.sendOrderPaid(sellerEmail, order);
    }
    return;
  }

  if (action === 'release') {
    if (buyerEmail) {
      await p2pEmailService.sendOrderReleased(buyerEmail, order);
    }
    if (sellerEmail && sellerEmail !== buyerEmail) {
      await p2pEmailService.sendOrderReleased(sellerEmail, order);
    }
    return;
  }

  if (action === 'cancel' || action === 'expire') {
    if (sellerEmail) {
      await p2pEmailService.sendOrderCancelled(sellerEmail, order);
    }
    if (buyerEmail && buyerEmail !== sellerEmail) {
      await p2pEmailService.sendOrderCancelled(buyerEmail, order);
    }
    return;
  }

  if (action === 'dispute') {
    const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
    if (adminEmail) {
      await p2pEmailService.sendDisputeRaised(adminEmail, order, actorUsername);
    }
    if (sellerEmail) {
      await p2pEmailService.sendDisputeRaised(sellerEmail, order, actorUsername);
    }
    if (buyerEmail && buyerEmail !== sellerEmail) {
      await p2pEmailService.sendDisputeRaised(buyerEmail, order, actorUsername);
    }
  }
}

function createP2PEmailJobQueue({ logger = console } = {}) {
  if (!isRedisConfigured()) {
    return null;
  }

  const connection = createRedisConnection({
    role: 'p2p-email-queue',
    maxRetriesPerRequest: null
  });
  const queue = new Queue(QUEUE_NAME, {
    connection,
    defaultJobOptions: buildQueueOptions()
  });

  async function enqueueOrderCreatedNotifications(order) {
    return queue.add('order-created', {
      order: sanitizeOrderForEmailJob(order)
    });
  }

  async function enqueueOrderStatusNotifications({ action, order, actorUsername }) {
    return queue.add('order-status', {
      action: normalizeText(action),
      actorUsername: normalizeText(actorUsername),
      order: sanitizeOrderForEmailJob(order)
    });
  }

  async function close() {
    await queue.close();
    await connection.quit();
  }

  logger.log(`[p2p-email-queue] Enabled Redis-backed queue: ${QUEUE_NAME}`);

  return {
    isEnabled: true,
    queueName: QUEUE_NAME,
    enqueueOrderCreatedNotifications,
    enqueueOrderStatusNotifications,
    close
  };
}

function createP2PEmailJobWorker({ repos, p2pEmailService, logger = console } = {}) {
  if (!repos || typeof repos.getP2PCredentialByUserId !== 'function') {
    throw new Error('P2P email worker requires repository access.');
  }
  if (!p2pEmailService) {
    throw new Error('P2P email worker requires p2pEmailService.');
  }
  if (!isRedisConfigured()) {
    throw new Error('REDIS_URL is required for the P2P email worker.');
  }

  const connection = createRedisConnection({
    role: 'p2p-email-worker',
    maxRetriesPerRequest: null
  });

  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      if (job.name === 'order-created') {
        await processOrderCreatedJob(job.data, { repos, p2pEmailService });
        return;
      }
      if (job.name === 'order-status') {
        await processOrderStatusJob(job.data, { repos, p2pEmailService });
        return;
      }
      throw new Error(`Unsupported P2P email job: ${job.name}`);
    },
    {
      connection,
      concurrency: DEFAULT_WORKER_CONCURRENCY
    }
  );

  worker.on('ready', () => {
    logger.log(`[p2p-email-worker] Ready on queue ${QUEUE_NAME} with concurrency ${DEFAULT_WORKER_CONCURRENCY}`);
  });

  worker.on('failed', (job, error) => {
    logger.error(
      `[p2p-email-worker] Job ${job?.id || 'unknown'} (${job?.name || 'unknown'}) failed: ${error.message}`
    );
  });

  async function close() {
    await worker.close();
    await connection.quit();
  }

  return {
    queueName: QUEUE_NAME,
    worker,
    close
  };
}

module.exports = {
  createP2PEmailJobQueue,
  createP2PEmailJobWorker,
  sanitizeOrderForEmailJob
};
