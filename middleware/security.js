let helmetFactory = null;
let rateLimitFactory = null;

const { createRedisConnection, isRedisConfigured } = require('../services/redis-support');
const { getRequestIp } = require('../lib/request-ip');

try {
  helmetFactory = require('helmet');
} catch (error) {
  helmetFactory = null;
}

try {
  rateLimitFactory = require('express-rate-limit');
} catch (error) {
  rateLimitFactory = null;
}

const BLOCKED_METHODS = new Set(['TRACE', 'TRACK', 'CONNECT']);
const SUSPICIOUS_PATH_PATTERNS = [
  /\/\.env(?:$|[/?])/i,
  /\/\.git(?:$|[/?])/i,
  /\/\.ssh(?:$|[/?])/i,
  /\/\.aws(?:$|[/?])/i,
  /\/wp-admin(?:$|[/?])/i,
  /\/wp-login\.php(?:$|[/?])/i,
  /\/xmlrpc\.php(?:$|[/?])/i,
  /\/phpmyadmin(?:$|[/?])/i,
  /\/adminer\.php(?:$|[/?])/i,
  /\/cgi-bin(?:$|[/?])/i,
  /\/vendor\/phpunit(?:$|[/?])/i,
  /\/server-status(?:$|[/?])/i,
  /\/actuator(?:$|[/?])/i,
  /\/boaform(?:$|[/?])/i,
  /\/hnap1(?:$|[/?])/i,
  /\/autodiscover(?:$|[/?])/i,
  /\/owa(?:$|[/?])/i,
  /\/ecp(?:$|[/?])/i,
  /\/solr(?:$|[/?])/i,
  /\/jenkins(?:$|[/?])/i,
  /\/hudson(?:$|[/?])/i
];

let sharedRedisRateLimitClient = null;
const requestShieldLogState = new Map();

function normalizeRateLimitKeySegment(value, fallback = 'unknown') {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized ? normalized.replace(/[^a-z0-9:_-]+/g, '_') : fallback;
}

function buildRateLimitResponseBody(message, retryAfterSeconds) {
  const payload = (message && typeof message === 'object' && !Array.isArray(message))
    ? { ...message }
    : { message: String(message || 'Too many requests. Please try again later.') };

  if (retryAfterSeconds && payload.retryAfterSeconds === undefined) {
    payload.retryAfterSeconds = retryAfterSeconds;
  }

  return payload;
}

function setRateLimitHeaders(res, { max, remaining, retryAfterSeconds }) {
  res.setHeader('RateLimit-Limit', String(max));
  res.setHeader('RateLimit-Remaining', String(Math.max(0, remaining)));
  if (retryAfterSeconds) {
    res.setHeader('RateLimit-Reset', String(retryAfterSeconds));
    res.setHeader('Retry-After', String(retryAfterSeconds));
  }
}

function maybeLogSecurityEvent(type, signature, message) {
  const key = `${type}:${signature}`;
  const now = Date.now();
  const existing = requestShieldLogState.get(key);
  if (existing && now - existing < 60_000) {
    return;
  }
  requestShieldLogState.set(key, now);
  console.warn(message);
}

function getRedisRateLimitClient() {
  if (!isRedisConfigured()) {
    return null;
  }
  if (!sharedRedisRateLimitClient) {
    sharedRedisRateLimitClient = createRedisConnection({
      role: 'rate-limit',
      maxRetriesPerRequest: 1,
      lazyConnect: true
    });
  }
  return sharedRedisRateLimitClient;
}

function createFallbackRateLimiter({ windowMs, max, message, skip, keyGenerator }) {
  const state = new Map();

  return function fallbackRateLimiter(req, res, next) {
    if (req.method === 'OPTIONS' || (typeof skip === 'function' && skip(req))) {
      return next();
    }

    const identifier = normalizeRateLimitKeySegment(
      typeof keyGenerator === 'function' ? keyGenerator(req) : getRequestIp(req)
    );
    const now = Date.now();
    const existing = state.get(identifier);

    if (!existing || now > existing.resetAt) {
      const retryAfterSeconds = Math.max(1, Math.ceil(windowMs / 1000));
      state.set(identifier, { count: 1, resetAt: now + windowMs });
      setRateLimitHeaders(res, {
        max,
        remaining: Math.max(0, max - 1),
        retryAfterSeconds
      });
      return next();
    }

    if (existing.count >= max) {
      const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      setRateLimitHeaders(res, { max, remaining: 0, retryAfterSeconds });
      return res.status(429).json(buildRateLimitResponseBody(message, retryAfterSeconds));
    }

    existing.count += 1;
    state.set(identifier, existing);
    setRateLimitHeaders(res, {
      max,
      remaining: Math.max(0, max - existing.count),
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
    });
    return next();
  };
}

function createRedisBackedRateLimiter({ windowMs, max, message, skip, keyGenerator, keyPrefix }) {
  const redis = getRedisRateLimitClient();
  const fallbackLimiter = createFallbackRateLimiter({ windowMs, max, message, skip, keyGenerator });
  let redisFailureLogged = false;

  if (!redis) {
    return fallbackLimiter;
  }

  return async function redisBackedRateLimiter(req, res, next) {
    if (req.method === 'OPTIONS' || (typeof skip === 'function' && skip(req))) {
      return next();
    }

    const rawIdentifier = typeof keyGenerator === 'function' ? keyGenerator(req) : getRequestIp(req);
    const identifier = normalizeRateLimitKeySegment(rawIdentifier);
    const bucket = Math.floor(Date.now() / windowMs);
    const rateLimitKey = `${normalizeRateLimitKeySegment(keyPrefix, 'global')}:${identifier}:${bucket}`;

    try {
      const count = await redis.incr(rateLimitKey);
      let ttlMs = await redis.pttl(rateLimitKey);
      if (count === 1 || ttlMs < 0) {
        await redis.pexpire(rateLimitKey, windowMs);
        ttlMs = windowMs;
      }

      const retryAfterSeconds = Math.max(1, Math.ceil(ttlMs / 1000));
      const remaining = Math.max(0, max - count);
      setRateLimitHeaders(res, { max, remaining, retryAfterSeconds });

      if (count > max) {
        return res.status(429).json(buildRateLimitResponseBody(message, retryAfterSeconds));
      }

      if (redisFailureLogged) {
        redisFailureLogged = false;
      }
      return next();
    } catch (error) {
      if (!redisFailureLogged) {
        redisFailureLogged = true;
        console.warn(`[security] Redis-backed rate limiter failed for ${keyPrefix}: ${error.message}`);
      }
      return fallbackLimiter(req, res, next);
    }
  };
}

function buildRateLimiter({ windowMs, max, message, skip, keyGenerator, keyPrefix = 'global' }) {
  if (isRedisConfigured()) {
    return createRedisBackedRateLimiter({ windowMs, max, message, skip, keyGenerator, keyPrefix });
  }

  if (!rateLimitFactory) {
    return createFallbackRateLimiter({ windowMs, max, message, skip, keyGenerator });
  }

  return rateLimitFactory({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => normalizeRateLimitKeySegment(
      typeof keyGenerator === 'function' ? keyGenerator(req) : getRequestIp(req)
    ),
    skip: (req) => req.method === 'OPTIONS' || (typeof skip === 'function' && skip(req)),
    handler: (req, res) => {
      const retryAfterFromHeader = Number(res.getHeader('Retry-After'));
      const retryAfterFromRateLimit = req?.rateLimit?.resetTime
        ? Math.max(
            1,
            Math.ceil((new Date(req.rateLimit.resetTime).getTime() - Date.now()) / 1000)
          )
        : undefined;
      const retryAfterSeconds = Number.isFinite(retryAfterFromHeader)
        ? retryAfterFromHeader
        : retryAfterFromRateLimit;
      return res.status(429).json(buildRateLimitResponseBody(message, retryAfterSeconds));
    }
  });
}

function isSuspiciousPath(pathname) {
  const rawPath = String(pathname || '').trim();
  if (!rawPath) {
    return null;
  }

  const candidates = [rawPath];
  try {
    candidates.push(decodeURIComponent(rawPath));
  } catch (_) {
    // Ignore malformed encodings and fall back to the raw path.
  }

  for (const candidate of candidates) {
    const normalized = String(candidate || '').toLowerCase();
    if (
      normalized.includes('/../') ||
      normalized.includes('..%2f') ||
      normalized.includes('%2e%2e') ||
      normalized.includes('..\\')
    ) {
      return 'path-traversal';
    }

    for (const pattern of SUSPICIOUS_PATH_PATTERNS) {
      if (pattern.test(normalized)) {
        return `blocked-pattern:${pattern}`;
      }
    }
  }

  return null;
}

function createMethodBlocker() {
  return function methodBlocker(req, res, next) {
    const method = String(req.method || '').trim().toUpperCase();
    if (!BLOCKED_METHODS.has(method)) {
      return next();
    }
    return res.status(405).json({
      message: 'Method not allowed.'
    });
  };
}

function createSuspiciousRequestBlocker() {
  return function suspiciousRequestBlocker(req, res, next) {
    const reason = isSuspiciousPath(req.originalUrl || req.url || req.path || '');
    if (!reason) {
      return next();
    }

    const requestIp = getRequestIp(req);
    maybeLogSecurityEvent(
      'suspicious-path',
      `${requestIp}:${reason}`,
      `[security] Blocked suspicious request from ${requestIp}: ${req.method} ${req.originalUrl || req.url} (${reason})`
    );
    return res.status(404).json({
      message: 'Not found.'
    });
  };
}

function createRateLimiters() {
  return {
    global: buildRateLimiter({
      windowMs: 15 * 60 * 1000,
      max: 1500,
      keyPrefix: 'api-global',
      message: 'Too many requests. Please try again in a few minutes.',
      skip: (req) => {
        if (req.method !== 'GET') {
          return false;
        }
        const url = String(req.originalUrl || req.url || '');
        return (
          url.startsWith('/api/p2p/market-depth') ||
          url.startsWith('/api/p2p/klines') ||
          url.startsWith('/api/p2p/exchange-ticker')
        );
      }
    }),
    marketData: buildRateLimiter({
      windowMs: 60 * 1000,
      max: 600,
      keyPrefix: 'market-data',
      message: 'Too many market data requests. Please retry shortly.'
    }),
    login: buildRateLimiter({
      windowMs: 10 * 60 * 1000,
      max: 8,
      keyPrefix: 'auth-login',
      message: 'Too many login attempts. Please try again later.'
    }),
    otp: buildRateLimiter({
      windowMs: 10 * 60 * 1000,
      max: 8,
      keyPrefix: 'auth-otp',
      message: 'Too many OTP requests. Please try again later.'
    }),
    withdrawal: buildRateLimiter({
      windowMs: 15 * 60 * 1000,
      max: 3,
      keyPrefix: 'withdrawal',
      message: 'Too many withdrawal attempts. Please try again later.'
    }),
    admin: buildRateLimiter({
      windowMs: 10 * 60 * 1000,
      max: 240,
      keyPrefix: 'admin-api',
      message: 'Too many admin requests. Please retry shortly.'
    })
  };
}

function applySecurityHeaders(app) {
  app.disable('x-powered-by');

  let helmetMounted = false;
  if (helmetFactory) {
    try {
      app.use(
        helmetFactory({
          contentSecurityPolicy: {
            useDefaults: true,
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                'https://cdn.tailwindcss.com',
                'https://cdn.jsdelivr.net',
                'https://s3.tradingview.com',
                'https://*.tradingview.com'
              ],
              styleSrc: [
                "'self'",
                "'unsafe-inline'",
                'https://cdn.tailwindcss.com',
                'https://cdn.jsdelivr.net',
                'https://s3.tradingview.com',
                'https://*.tradingview.com'
              ],
              imgSrc: ["'self'", 'data:', 'https:'],
              connectSrc: [
                "'self'",
                'https://api.binance.com',
                'https://api.resend.com',
                'https://*.tradingview.com',
                'wss://*.tradingview.com'
              ],
              frameSrc: ["'self'", 'https://*.tradingview.com'],
              fontSrc: ["'self'", 'https:', 'data:'],
              workerSrc: ["'self'", 'blob:'],
              objectSrc: ["'none'"],
              frameAncestors: ["'none'"],
              baseUri: ["'self'"]
            }
          },
          hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
          },
          frameguard: { action: 'deny' },
          hidePoweredBy: true,
          noSniff: true,
          referrerPolicy: { policy: 'no-referrer' }
        })
      );
      helmetMounted = true;
    } catch (error) {
      // Fallback to manual headers below.
    }
  }

  if (!helmetMounted) {
    app.use((req, res, next) => {
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://s3.tradingview.com https://*.tradingview.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://s3.tradingview.com https://*.tradingview.com; img-src 'self' data: https:; connect-src 'self' https://api.binance.com https://api.resend.com https://*.tradingview.com wss://*.tradingview.com; frame-src 'self' https://*.tradingview.com; font-src 'self' https: data:; worker-src 'self' blob:; object-src 'none'; frame-ancestors 'none'; base-uri 'self'"
      );
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
  } else {
    app.use((req, res, next) => {
      // Retained for older clients even when Helmet is active.
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
  }
}

function applySecurityHardening(app) {
  const limiters = createRateLimiters();
  app.use(createMethodBlocker());
  app.use(createSuspiciousRequestBlocker());
  applySecurityHeaders(app);

  // Scope global limiter to API endpoints to avoid throttling normal page/assets rendering.
  app.use('/api', limiters.global);
  app.use(['/api/p2p/market-depth', '/api/p2p/klines', '/api/p2p/exchange-ticker'], limiters.marketData);
  app.use(['/auth/login', '/auth/register', '/api/p2p/login', '/api/admin/auth/login', '/api/admin/login'], limiters.login);
  app.use(['/api/signup/send-code', '/api/signup/verify-code'], limiters.otp);
  app.use(['/api/withdrawals', '/api/admin/wallet/withdrawals'], limiters.withdrawal);
  app.use('/api/admin', limiters.admin);

  return limiters;
}

module.exports = {
  applySecurityHardening,
  buildRateLimiter,
  createRateLimiters,
  getRequestIp,
  isSuspiciousPath
};
