const { buildRateLimiter } = require('../middleware/security');

function registerP2POrderRoutes(app, deps = {}) {
  if (!app) {
    throw new Error('Express app is required to register P2P order routes.');
  }

  const requiresP2PUser = deps.requiresP2PUser;
  const controller = deps.controller;

  if (typeof requiresP2PUser !== 'function') {
    throw new Error('requiresP2PUser middleware is required for P2P order routes.');
  }

  if (!controller || typeof controller.createOrder !== 'function') {
    throw new Error('P2P order controller is required for P2P order routes.');
  }
  if (typeof controller.markPaymentSent !== 'function') {
    throw new Error('markPaymentSent handler is required for P2P order routes.');
  }
  if (typeof controller.releaseCrypto !== 'function') {
    throw new Error('releaseCrypto handler is required for P2P order routes.');
  }
  if (typeof controller.cancelOrder !== 'function') {
    throw new Error('cancelOrder handler is required for P2P order routes.');
  }
  if (typeof controller.raiseDispute !== 'function') {
    throw new Error('raiseDispute handler is required for P2P order routes.');
  }

  const createOrderLimiter = buildRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 24,
    keyPrefix: 'p2p-order-create',
    message: {
      success: false,
      message: 'Too many order create attempts. Please retry shortly.'
    }
  });

  const orderActionLimiter = buildRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 90,
    keyPrefix: 'p2p-order-action',
    message: {
      success: false,
      message: 'Too many order actions. Please retry shortly.'
    }
  });

  app.post('/api/p2p/orders', createOrderLimiter, requiresP2PUser, controller.createOrder);
  app.post('/api/p2p/orders/:id/mark-paid', orderActionLimiter, requiresP2PUser, controller.markPaymentSent);
  app.post('/api/p2p/orders/:id/release', orderActionLimiter, requiresP2PUser, controller.releaseCrypto);
  app.post('/api/p2p/orders/:id/cancel', orderActionLimiter, requiresP2PUser, controller.cancelOrder);
  app.post('/api/p2p/orders/:id/dispute', orderActionLimiter, requiresP2PUser, controller.raiseDispute);
}

module.exports = {
  registerP2POrderRoutes
};
