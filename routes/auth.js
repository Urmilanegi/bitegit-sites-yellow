const { getRequestIp } = require('../lib/request-ip');

function createIpRateLimiter({ windowMs, maxAttempts }) {
  const state = new Map();

  function middleware(req, res, next) {
    const ip = getRequestIp(req);
    const now = Date.now();
    const existing = state.get(ip);

    if (!existing || now > existing.resetAt) {
      state.set(ip, { count: 0, resetAt: now + windowMs });
    }

    const entry = state.get(ip);
    if (entry.count >= maxAttempts) {
      const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({
        message: 'Too many attempts. Please try again later.',
        retryAfterSeconds
      });
    }

    // attach helper so routes can increment only on failure
    req._ipRateLimitEntry = entry;
    req._recordFailedAttempt = function () {
      entry.count += 1;
      state.set(ip, entry);
    };

    return next();
  }

  return middleware;
}

function createEmailFromInput(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return String(password || '').trim().length >= 6;
}

function createOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function isValidOtpCode(code) {
  return /^\d{6}$/.test(String(code || '').trim());
}

function isTruthyEnvFlag(...values) {
  return values.some((value) => ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase()));
}

function registerAuthRoutes(app, deps) {
  const {
    repos,
    authStore = null,
    walletService,
    authMiddleware,
    tokenService,
    buildP2PUserFromEmail,
    createLegacyP2PUserSession,
    setCookie,
    clearCookie,
    cookieNames,
    p2pUserTtlMs,
    auditLogService,
    authEmailService,
    captchaVerifier = null,
    otpTtlMs = 10 * 60 * 1000,
    onLoginSuccess = null,
    enableLegacyOtpEndpoints = true
  } = deps;

  const credentialStore = authStore || repos;
  const otpStore = authStore || repos;

  const loginLimiter = createIpRateLimiter({
    windowMs: 10 * 60 * 1000,
    maxAttempts: 30
  });

  const registerLimiter = createIpRateLimiter({
    windowMs: 10 * 60 * 1000,
    maxAttempts: 5
  });

  const signupOtpLimiter = createIpRateLimiter({
    windowMs: 10 * 60 * 1000,
    maxAttempts: 5
  });

  const forgotOtpLimiter = createIpRateLimiter({
    windowMs: 10 * 60 * 1000,
    maxAttempts: 5
  });

  const SIGNUP_OTP_PURPOSE = 'signup';
  const SIGNIN_OTP_PURPOSE = 'signin';
  const PASSWORD_RESET_OTP_PURPOSE = 'password_reset';
  const REGISTER_EMAIL_VERIFY_PURPOSE = 'register_email_verify';
  const REGISTER_EMAIL_VERIFY_TTL_MS = 5 * 60 * 1000;
  const allowDebugOtp = isTruthyEnvFlag(process.env.ALLOW_DEV_OTP, process.env.ALLOW_DEMO_OTP);

  function runDetached(task) {
    Promise.resolve()
      .then(task)
      .catch(() => {});
  }

  function safeAuditLog(entry) {
    if (!auditLogService || typeof auditLogService.safeLog !== 'function') {
      return;
    }
    runDetached(() => auditLogService.safeLog(entry));
  }

  function buildUserFromCredential(email, role = 'USER', credential = null) {
    return buildP2PUserFromEmail(email, role, credential || {});
  }

  function safeOnLoginSuccess(payload) {
    if (typeof onLoginSuccess !== 'function') {
      return;
    }
    runDetached(async () => {
      try {
        await onLoginSuccess(payload);
      } catch (error) {
        // User-center login history failure should not block auth flow.
      }
    });
  }

  async function verifyCredentialPassword(password, storedHash) {
    if (credentialStore && typeof credentialStore.verifyPasswordAsync === 'function') {
      return credentialStore.verifyPasswordAsync(password, storedHash);
    }
    if (credentialStore && typeof credentialStore.verifyPassword === 'function') {
      return credentialStore.verifyPassword(password, storedHash);
    }
    if (repos && typeof repos.verifyPasswordAsync === 'function') {
      return repos.verifyPasswordAsync(password, storedHash);
    }
    return repos ? repos.verifyPassword(password, storedHash) : false;
  }

  async function persistRefreshToken(user, refreshToken, expiresAtMs) {
    if (!repos || typeof repos.saveRefreshToken !== 'function') {
      return;
    }
    const tokenHash = tokenService.hashRefreshToken(refreshToken);
    await repos.saveRefreshToken({
      userId: user.id,
      role: tokenService.normalizeRole(user.role),
      username: user.username,
      email: user.email,
      tokenHash,
      issuedAt: Date.now(),
      expiresAt: expiresAtMs
    });
  }

  function setAuthCookies(res, tokenPair) {
    const maxAgeAccess = tokenService.ACCESS_TOKEN_TTL_SECONDS;
    const maxAgeRefresh = tokenService.REFRESH_TOKEN_TTL_SECONDS;
    setCookie(res, cookieNames.accessToken, tokenPair.accessToken, maxAgeAccess);
    setCookie(res, cookieNames.refreshToken, tokenPair.refreshToken, maxAgeRefresh);
  }

  function createCaptchaPayload(body = {}) {
    if (!body || typeof body !== 'object') {
      return {};
    }

    if (body.geetest && typeof body.geetest === 'object') {
      return body.geetest;
    }

    return {
      lot_number: body.lot_number,
      captcha_output: body.captcha_output,
      pass_token: body.pass_token,
      gen_time: body.gen_time,
      fallback_type: body.fallback_type,
      challenge_id: body.challenge_id,
      position: body.position,
      token: body.token
    };
  }

  async function verifyRegistrationCaptcha(req, email) {
    if (!captchaVerifier || typeof captchaVerifier.verifyChallenge !== 'function') {
      return { skipped: true };
    }

    const payload = createCaptchaPayload(req.body);
    return captchaVerifier.verifyChallenge(payload, {
      ipAddress: getRequestIp(req),
      userAgent: String(req.headers['user-agent'] || '').trim().slice(0, 1024),
      email
    });
  }

  function clearAuthCookies(res) {
    clearCookie(res, cookieNames.accessToken);
    clearCookie(res, cookieNames.refreshToken);
  }

  function hashPasswordValue(password) {
    if (credentialStore && typeof credentialStore.hashPassword === 'function') {
      return credentialStore.hashPassword(password);
    }
    return repos.hashPassword(password);
  }

  async function getCredential(email) {
    if (!credentialStore || typeof credentialStore.getP2PCredential !== 'function') {
      return null;
    }
    return credentialStore.getP2PCredential(email);
  }

  async function setCredential(email, passwordHash, options = {}) {
    if (!credentialStore || typeof credentialStore.setP2PCredential !== 'function') {
      throw new Error('Credential store is unavailable');
    }
    return credentialStore.setP2PCredential(email, passwordHash, options);
  }

  async function updateCredentialPassword(email, passwordHash) {
    if (!credentialStore || typeof credentialStore.updateP2PCredentialPassword !== 'function') {
      throw new Error('Credential store is unavailable');
    }
    return credentialStore.updateP2PCredentialPassword(email, passwordHash);
  }

  async function updateCredentialProfile(email, payload = {}, options = {}) {
    if (!credentialStore || typeof credentialStore.updateP2PCredentialProfile !== 'function') {
      return null;
    }
    return credentialStore.updateP2PCredentialProfile(email, payload, options);
  }

  async function touchCredentialLogin(email, loginMeta = {}) {
    if (!credentialStore || typeof credentialStore.touchP2PCredentialLogin !== 'function') {
      return;
    }
    await credentialStore.touchP2PCredentialLogin(email, loginMeta);
  }

  async function upsertOtpRecord(contact, otpState, options = {}) {
    if (!otpStore || typeof otpStore.upsertSignupOtp !== 'function') {
      throw new Error('OTP store is unavailable');
    }
    return otpStore.upsertSignupOtp(contact, otpState, options);
  }

  async function getOtpRecord(contact, options = {}) {
    if (!otpStore || typeof otpStore.getSignupOtp !== 'function') {
      return null;
    }
    return otpStore.getSignupOtp(contact, options);
  }

  async function deleteOtpRecord(contact, options = {}) {
    if (!otpStore || typeof otpStore.deleteSignupOtp !== 'function') {
      return;
    }
    await otpStore.deleteSignupOtp(contact, options);
  }

  async function ensureWalletSafe(user) {
    if (!walletService || typeof walletService.ensureWallet !== 'function') {
      return;
    }
    try {
      await walletService.ensureWallet(user.id, { username: user.username });
    } catch (_) {
      // Wallet bootstrap is best-effort for auth flows.
    }
  }

  async function createLegacySessionSafe(email, role, credential) {
    if (authStore || typeof createLegacyP2PUserSession !== 'function') {
      return null;
    }
    try {
      return await createLegacyP2PUserSession(email, role, credential);
    } catch (_) {
      return null;
    }
  }

  async function deleteRefreshTokensByUserIdSafe(userId) {
    if (!repos || typeof repos.deleteRefreshTokensByUserId !== 'function') {
      return;
    }
    try {
      await repos.deleteRefreshTokensByUserId(userId);
    } catch (_) {
      // Password reset should not fail just because refresh-token cleanup timed out.
    }
  }

  async function sendOtpEmail(contact, purpose, options = {}) {
    const code = createOtpCode();
    const effectiveOtpTtlMs = Math.max(60 * 1000, Number(options.ttlMs || otpTtlMs || 0));
    const otpState = {
      code,
      type: 'email',
      attempts: 0,
      expiresAt: Date.now() + effectiveOtpTtlMs,
      payload:
        options.payload && typeof options.payload === 'object' && options.payload !== null
          ? options.payload
          : {}
    };

    await upsertOtpRecord(contact, otpState, { purpose });

    const expiresInMinutes = Math.max(1, Math.floor(effectiveOtpTtlMs / (60 * 1000)));
    let sendResult = { delivered: false, reason: 'missing_email_provider_config' };

    if (authEmailService && typeof authEmailService === 'object') {
      try {
        if (purpose === SIGNUP_OTP_PURPOSE || purpose === SIGNIN_OTP_PURPOSE) {
          if (typeof authEmailService.sendLoginOtpEmail === 'function') {
            sendResult = await authEmailService.sendLoginOtpEmail(contact, code, { expiresInMinutes });
          } else if (typeof authEmailService.sendSignupOtpEmail === 'function') {
            sendResult = await authEmailService.sendSignupOtpEmail(contact, code, { expiresInMinutes });
          }
        } else if (
          purpose === PASSWORD_RESET_OTP_PURPOSE &&
          typeof authEmailService.sendForgotPasswordOtpEmail === 'function'
        ) {
          sendResult = await authEmailService.sendForgotPasswordOtpEmail(contact, code, { expiresInMinutes });
        }
      } catch (error) {
        sendResult = { delivered: false, reason: `provider_error:${error.message}` };
      }
    }

    if (sendResult.delivered) {
      return {
        message: 'Verification code sent to your email.',
        delivery: 'email',
        expiresInSeconds: Math.floor(effectiveOtpTtlMs / 1000)
      };
    }

    if (allowDebugOtp) {
      return {
        message: 'Verification code generated in debug mode.',
        delivery: 'debug',
        expiresInSeconds: Math.floor(effectiveOtpTtlMs / 1000),
        debugOtpCode: code
      };
    }

    await deleteOtpRecord(contact, { purpose });
    const failureReason = String(sendResult.reason || 'email_provider_unavailable').trim();
    return {
      error: true,
      status: 503,
      message: 'Unable to send email OTP right now.',
      reason: failureReason
    };
  }

  async function verifyOtp(contact, code, purpose) {
    const otpState = await getOtpRecord(contact, { purpose });
    if (!otpState) {
      return {
        ok: false,
        message: 'Verification code expired. Please request a new code.'
      };
    }

    const expiresAtMs = new Date(otpState.expiresAt).getTime();
    if (!Number.isFinite(expiresAtMs) || expiresAtMs < Date.now()) {
      await deleteOtpRecord(contact, { purpose });
      return {
        ok: false,
        message: 'Verification code expired. Please request a new code.'
      };
    }

    if (String(otpState.code || '').trim() !== String(code || '').trim()) {
      const attempts = Number(otpState.attempts || 0) + 1;
      if (attempts >= 5) {
        await deleteOtpRecord(contact, { purpose });
        return {
          ok: false,
          message: 'Too many failed attempts. Request a new code.'
        };
      }

      await upsertOtpRecord(
        contact,
        {
          ...otpState,
          attempts,
          expiresAt: expiresAtMs
        },
        { purpose }
      );
      return {
        ok: false,
        message: 'Invalid verification code.'
      };
    }

    const payload =
      otpState.payload && typeof otpState.payload === 'object' && otpState.payload !== null
        ? otpState.payload
        : {};
    await deleteOtpRecord(contact, { purpose });
    return { ok: true, payload };
  }

  app.post('/auth/signup/send-otp', signupOtpLimiter, async (req, res) => {
    const email = createEmailFromInput(req.body?.email);
    const ipAddress = getRequestIp(req);
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }

    try {
      const existing = await getCredential(email);
      if (existing) {
        return res.status(409).json({ message: 'Account already exists. Please login.' });
      }

      const result = await sendOtpEmail(email, SIGNUP_OTP_PURPOSE);
      if (result.error) {
        return res.status(result.status || 500).json({
          message: result.message,
          reason: result.reason
        });
      }

      await safeAuditLog({
        userId: '',
        action: 'signup_otp_sent',
        ipAddress,
        metadata: {
          email,
          delivery: result.delivery
        }
      });

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Server error while sending verification code.' });
    }
  });

  app.post('/auth/forgot-password/send-otp', forgotOtpLimiter, async (req, res) => {
    const email = createEmailFromInput(req.body?.email);
    const ipAddress = getRequestIp(req);
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }

    try {
      const existing = await getCredential(email);
      if (!existing) {
        return res.json({
          message: 'If an account exists, a verification code has been sent.',
          expiresInSeconds: Math.floor(Number(otpTtlMs || 0) / 1000)
        });
      }

      const result = await sendOtpEmail(email, PASSWORD_RESET_OTP_PURPOSE);
      if (result.error) {
        return res.status(result.status || 500).json({
          message: result.message,
          reason: result.reason
        });
      }

      await safeAuditLog({
        userId: buildUserFromCredential(email, existing.role || 'USER', existing).id,
        action: 'forgot_password_otp_sent',
        ipAddress,
        metadata: {
          email,
          delivery: result.delivery
        }
      });

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Server error while sending reset code.' });
    }
  });

  app.post('/api/auth/register', registerLimiter, async (req, res) => {
    const email = createEmailFromInput(req.body?.email);
    const password = String(req.body?.password || '').trim();
    const ipAddress = getRequestIp(req);

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    try {
      const existing = await getCredential(email);
      if (existing && Boolean(existing.emailVerified)) {
        return res.status(409).json({ message: 'Account already exists. Please login.' });
      }

      const passwordHash = hashPasswordValue(password);
      const result = await sendOtpEmail(email, REGISTER_EMAIL_VERIFY_PURPOSE, {
        ttlMs: REGISTER_EMAIL_VERIFY_TTL_MS,
        payload: {
          passwordHash,
          role: 'USER',
          flow: 'register_v2'
        }
      });

      if (result.error) {
        return res.status(result.status || 500).json({
          message: result.message,
          reason: result.reason
        });
      }

      await safeAuditLog({
        userId: '',
        action: 'register_otp_sent_v2',
        ipAddress,
        metadata: {
          email,
          delivery: result.delivery
        }
      });

      return res.status(202).json({
        message: 'Verification code sent to your email.',
        email,
        expiresInSeconds: result.expiresInSeconds
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error while starting registration.' });
    }
  });

  app.post('/api/auth/verify-email', registerLimiter, async (req, res) => {
    const email = createEmailFromInput(req.body?.email);
    const otpCode = String(req.body?.otpCode || '').trim();
    const ipAddress = getRequestIp(req);

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    if (!isValidOtpCode(otpCode)) {
      return res.status(400).json({ message: 'Enter a valid 6-digit verification code.' });
    }

    try {
      const otpResult = await verifyOtp(email, otpCode, REGISTER_EMAIL_VERIFY_PURPOSE);
      if (!otpResult.ok) {
        return res.status(400).json({ message: otpResult.message });
      }

      const payload = otpResult.payload && typeof otpResult.payload === 'object' ? otpResult.payload : {};
      const passwordHash = String(payload.passwordHash || '').trim();
      if (!passwordHash) {
        return res.status(400).json({ message: 'Registration session expired. Please sign up again.' });
      }

      const existing = await getCredential(email);
      if (existing && Boolean(existing.emailVerified)) {
        return res.status(409).json({ message: 'Email already verified. Please login.' });
      }

      await setCredential(email, passwordHash, {
        role: String(payload.role || 'USER').trim().toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER',
        emailVerified: true
      });

      const credential = await getCredential(email);
      const user = buildUserFromCredential(email, 'USER', credential);
      await updateCredentialProfile(email, {}, { userId: user.id });
      runDetached(() => ensureWalletSafe(user));

      await safeAuditLog({
        userId: user.id,
        action: 'email_verified',
        ipAddress,
        metadata: {
          email
        }
      });

      return res.json({
        message: 'Email verified successfully. Account activated.',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          email_verified: true
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error while verifying email.' });
    }
  });

  async function createAndReturnTokens(res, user) {
    const tokenPair = tokenService.createTokenPair(user);
    // Set cookies FIRST — JWT access token is self-contained, does not need DB.
    // Persist refresh token in background so a slow/failing DB never blocks login.
    setAuthCookies(res, tokenPair);
    persistRefreshToken(user, tokenPair.refreshToken, tokenPair.refreshTokenExpiresAt).catch(() => {});
    return tokenPair;
  }

  if (enableLegacyOtpEndpoints) {
    app.post('/auth/send-otp', signupOtpLimiter, async (req, res) => {
      const email = createEmailFromInput(req.body?.email);
      const ipAddress = getRequestIp(req);

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }

    try {
      const result = await sendOtpEmail(email, SIGNIN_OTP_PURPOSE);
      if (result.error) {
        return res.status(result.status || 500).json({
          message: result.message,
          reason: result.reason
        });
      }

      await safeAuditLog({
        userId: '',
        action: 'signin_otp_sent',
        ipAddress,
        metadata: {
          email,
          delivery: result.delivery
        }
      });

      return res.json({
        success: true,
        message: result.message,
        expiresInSeconds: result.expiresInSeconds
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error while sending verification code.' });
    }
    });

    app.post('/auth/verify-otp', registerLimiter, async (req, res) => {
      const email = createEmailFromInput(req.body?.email);
      const otpCode = String(req.body?.otp || req.body?.otpCode || '').trim();
      const ipAddress = getRequestIp(req);
    const userAgent = String(req.headers['user-agent'] || '').trim().slice(0, 1024);

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    if (!isValidOtpCode(otpCode)) {
      return res.status(400).json({ message: 'Enter a valid 6-digit verification code.' });
    }

    try {
      const otpResult = await verifyOtp(email, otpCode, SIGNIN_OTP_PURPOSE);
      if (!otpResult.ok) {
        return res.status(400).json({ message: otpResult.message });
      }

      let credential = await getCredential(email);
      if (!credential) {
        const randomPassword = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
        await setCredential(email, hashPasswordValue(randomPassword), {
          role: 'USER',
          emailVerified: true
        });
        credential = await getCredential(email);
      }

      const role = tokenService.normalizeRole(credential?.role || 'USER');
      const user = buildUserFromCredential(email, role, credential);
      await updateCredentialProfile(email, {}, { userId: user.id });
      runDetached(() => ensureWalletSafe(user));
      const tokenPair = await createAndReturnTokens(res, user);

      {
        const legacySession = await createLegacySessionSafe(email, role, credential);
        if (legacySession) {
          setCookie(res, cookieNames.legacyP2PSession, legacySession.token, Math.floor(p2pUserTtlMs / 1000));
        }
      }

      await touchCredentialLogin(email, {
        ipAddress,
        userAgent,
        deviceLabel: userAgent
      });

      await safeAuditLog({
        userId: user.id,
        action: 'signin_otp_success',
        ipAddress,
        metadata: { email, role }
      });

      await safeOnLoginSuccess({
        user,
        ipAddress,
        userAgent
      });

      return res.json({
        success: true,
        message: 'Authentication successful.',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          kycStatus: credential?.kycStatus || 'pending'
        },
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        accessTokenExpiresAt: tokenPair.accessTokenExpiresAt,
        refreshTokenExpiresAt: tokenPair.refreshTokenExpiresAt
      });
    } catch (error) {
      if (String(error.message || '').includes('JWT_SECRET')) {
        return res.status(503).json({ message: 'JWT auth is not configured.' });
      }
      return res.status(500).json({ message: 'Server error while verifying OTP.' });
    }
    });
  }

  app.post('/auth/login', loginLimiter, async (req, res) => {
    const email = createEmailFromInput(req.body?.email);
    const password = String(req.body?.password || '').trim();
    const ipAddress = getRequestIp(req);
    const userAgent = String(req.headers['user-agent'] || '').trim().slice(0, 1024);

    if (!isValidEmail(email)) {
      req._recordFailedAttempt?.();
      await safeAuditLog({
        userId: '',
        action: 'login_failed',
        ipAddress,
        metadata: { reason: 'invalid_email', email }
      });
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    if (!isValidPassword(password)) {
      req._recordFailedAttempt?.();
      await safeAuditLog({
        userId: '',
        action: 'login_failed',
        ipAddress,
        metadata: { reason: 'invalid_password_length', email }
      });
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    try {
      const credential = await getCredential(email);
      const passwordMatches =
        credential && credential.passwordHash
          ? await verifyCredentialPassword(password, credential.passwordHash)
          : false;
      if (!credential || !passwordMatches) {
        req._recordFailedAttempt?.();
        await safeAuditLog({
          userId: '',
          action: 'login_failed',
          ipAddress,
          metadata: { reason: 'invalid_credentials', email }
        });
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const role = tokenService.normalizeRole(credential.role || 'USER');
      const user = buildUserFromCredential(email, role, credential);
      await updateCredentialProfile(email, {}, { userId: user.id });
      const previousLoginIp = String(credential.lastLoginIp || '').trim();
      const previousUserAgent = String(credential.lastUserAgent || '').trim();
      const hasLoginHistory = Boolean(previousLoginIp || previousUserAgent);
      const isNewDeviceLogin =
        hasLoginHistory && (previousLoginIp !== ipAddress || previousUserAgent !== userAgent);

      const tokenPair = await createAndReturnTokens(res, user);
      const legacySession = await createLegacySessionSafe(email, role, credential);
      if (legacySession) {
        setCookie(res, cookieNames.legacyP2PSession, legacySession.token, Math.floor(p2pUserTtlMs / 1000));
      }

      // Fire-and-forget background tasks — don't block the response
      Promise.all([
        ensureWalletSafe(user),
        touchCredentialLogin(email, { ipAddress, userAgent, deviceLabel: userAgent }),
        safeAuditLog({ userId: user.id, action: 'login_success', ipAddress, metadata: { email, role: user.role } }),
        safeOnLoginSuccess({ user, ipAddress, userAgent }),
        isNewDeviceLogin && authEmailService && typeof authEmailService.sendNewDeviceLoginAlert === 'function'
          ? authEmailService.sendNewDeviceLoginAlert(email, {
              loginTimeUtc: new Date().toISOString().replace('T', ' ').replace('Z', ' (UTC)'),
              ipAddress,
              userAgent,
              location: 'Unknown'
            }).catch(() => {})
          : Promise.resolve()
      ]).catch(() => {});

      return res.json({
        message: 'Login successful.',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken
      });
    } catch (error) {
      req._recordFailedAttempt?.();
      await safeAuditLog({
        userId: '',
        action: 'login_failed',
        ipAddress,
        metadata: { reason: 'server_error', email }
      });
      if (String(error.message || '').includes('JWT_SECRET')) {
        return res.status(503).json({ message: 'JWT auth is not configured.' });
      }
      return res.status(500).json({ message: 'Server error during login.' });
    }
  });

  app.post('/auth/register', registerLimiter, async (req, res) => {
    const email = createEmailFromInput(req.body?.email);
    const password = String(req.body?.password || '').trim();
    const otpCode = String(req.body?.otpCode || '').trim();
    const ipAddress = getRequestIp(req);
    const userAgent = String(req.headers['user-agent'] || '').trim().slice(0, 1024);

    if (!isValidEmail(email)) {
      await safeAuditLog({
        userId: '',
        action: 'register_failed',
        ipAddress,
        metadata: { reason: 'invalid_email', email }
      });
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    if (!isValidPassword(password)) {
      await safeAuditLog({
        userId: '',
        action: 'register_failed',
        ipAddress,
        metadata: { reason: 'invalid_password_length', email }
      });
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    if (!isValidOtpCode(otpCode)) {
      await safeAuditLog({
        userId: '',
        action: 'register_failed',
        ipAddress,
        metadata: { reason: 'invalid_otp_format', email }
      });
      return res.status(400).json({ message: 'Enter a valid 6-digit verification code.' });
    }

    try {
      try {
        await verifyRegistrationCaptcha(req, email);
      } catch (captchaError) {
        await safeAuditLog({
          userId: '',
          action: 'register_failed',
          ipAddress,
          metadata: {
            reason: String(captchaError?.code || 'captcha_verification_failed').toLowerCase(),
            email
          }
        });
        return res.status(Number(captchaError?.statusCode || captchaError?.status || 400)).json({
          message: String(captchaError?.message || 'Captcha verification failed.'),
          code: String(captchaError?.code || 'CAPTCHA_VERIFICATION_FAILED')
        });
      }

      const existing = await getCredential(email);
      if (existing) {
        await safeAuditLog({
          userId: '',
          action: 'register_failed',
          ipAddress,
          metadata: { reason: 'already_exists', email }
        });
        return res.status(409).json({ message: 'Account already exists. Please login.' });
      }

      const otpResult = await verifyOtp(email, otpCode, SIGNUP_OTP_PURPOSE);
      if (!otpResult.ok) {
        await safeAuditLog({
          userId: '',
          action: 'register_failed',
          ipAddress,
          metadata: { reason: 'otp_verification_failed', email }
        });
        return res.status(400).json({ message: otpResult.message });
      }

      await setCredential(email, hashPasswordValue(password), {
        role: 'USER',
        emailVerified: true
      });

      const credential = await getCredential(email);
      const user = buildUserFromCredential(email, 'USER', credential);
      await updateCredentialProfile(email, {}, { userId: user.id });
      runDetached(() => ensureWalletSafe(user));

      const tokenPair = await createAndReturnTokens(res, user);

      {
        const legacySession = await createLegacySessionSafe(email, 'USER', credential);
        if (legacySession) {
          setCookie(res, cookieNames.legacyP2PSession, legacySession.token, Math.floor(p2pUserTtlMs / 1000));
        }
      }

      await safeAuditLog({
        userId: user.id,
        action: 'register_success',
        ipAddress,
        metadata: { email }
      });

      await safeOnLoginSuccess({
        user,
        ipAddress,
        userAgent
      });

      return res.status(201).json({
        message: 'Registration successful.',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken
      });
    } catch (error) {
      await safeAuditLog({
        userId: '',
        action: 'register_failed',
        ipAddress,
        metadata: { reason: 'server_error', email }
      });
      if (String(error.message || '').includes('JWT_SECRET')) {
        return res.status(503).json({ message: 'JWT auth is not configured.' });
      }
      return res.status(500).json({ message: 'Server error during registration.' });
    }
  });

  app.post('/auth/forgot-password/reset', registerLimiter, async (req, res) => {
    const email = createEmailFromInput(req.body?.email);
    const otpCode = String(req.body?.otpCode || '').trim();
    const nextPassword = String(req.body?.newPassword || '').trim();
    const ipAddress = getRequestIp(req);

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    if (!isValidOtpCode(otpCode)) {
      return res.status(400).json({ message: 'Enter a valid 6-digit verification code.' });
    }
    if (!isValidPassword(nextPassword)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    try {
      const credential = await getCredential(email);
      if (!credential) {
        return res.status(400).json({ message: 'Unable to reset password for this account.' });
      }

      const otpResult = await verifyOtp(email, otpCode, PASSWORD_RESET_OTP_PURPOSE);
      if (!otpResult.ok) {
        await safeAuditLog({
          userId: buildUserFromCredential(email, credential.role || 'USER', credential).id,
          action: 'password_reset_failed',
          ipAddress,
          metadata: { reason: 'otp_verification_failed', email }
        });
        return res.status(400).json({ message: otpResult.message });
      }

      await updateCredentialPassword(email, hashPasswordValue(nextPassword));
      await deleteRefreshTokensByUserIdSafe(buildUserFromCredential(email, credential.role || 'USER', credential).id);

      await safeAuditLog({
        userId: buildUserFromCredential(email, credential.role || 'USER', credential).id,
        action: 'password_reset_success',
        ipAddress,
        metadata: { email }
      });

      return res.json({ message: 'Password reset successful. Please login.' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error while resetting password.' });
    }
  });

  app.post('/auth/refresh', async (req, res) => {
    try {
      const refreshToken = authMiddleware.extractRefreshTokenFromRequest(req);
      if (!refreshToken) {
        clearAuthCookies(res);
        return res.status(401).json({ message: 'Refresh token is required.' });
      }

      const decoded = tokenService.verifyRefreshToken(refreshToken);
      const refreshTokenHash = tokenService.hashRefreshToken(refreshToken);
      const dbToken = await repos.getRefreshTokenByHash(refreshTokenHash);
      if (!dbToken) {
        clearAuthCookies(res);
        return res.status(401).json({ message: 'Invalid refresh token.' });
      }

      if (String(dbToken.userId) !== String(decoded.sub || '')) {
        await repos.deleteRefreshTokenByHash(refreshTokenHash);
        clearAuthCookies(res);
        return res.status(401).json({ message: 'Invalid refresh token.' });
      }

      const expiresAtMs = new Date(dbToken.expiresAt).getTime();
      if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) {
        await repos.deleteRefreshTokenByHash(refreshTokenHash);
        clearAuthCookies(res);
        return res.status(401).json({ message: 'Refresh token expired.' });
      }

      const user = {
        id: dbToken.userId,
        username: dbToken.username,
        email: dbToken.email,
        role: dbToken.role
      };
      const tokenPair = tokenService.createTokenPair(user);

      await persistRefreshToken(user, tokenPair.refreshToken, tokenPair.refreshTokenExpiresAt);
      setAuthCookies(res, tokenPair);

      return res.json({
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken
      });
    } catch (error) {
      clearAuthCookies(res);
      return res.status(401).json({ message: 'Invalid or expired refresh token.' });
    }
  });

  app.post('/auth/logout', async (req, res) => {
    try {
      const refreshToken = authMiddleware.extractRefreshTokenFromRequest(req);
      if (refreshToken) {
        const refreshTokenHash = tokenService.hashRefreshToken(refreshToken);
        await repos.deleteRefreshTokenByHash(refreshTokenHash);
      } else {
        const accessToken = authMiddleware.extractAccessTokenFromRequest(req);
        if (accessToken) {
          try {
            const decoded = tokenService.verifyAccessToken(accessToken);
            if (String(decoded?.sub || '').trim()) {
              await repos.deleteRefreshTokensByUserId(String(decoded.sub).trim());
            }
          } catch (error) {
            // Ignore token parsing errors during logout.
          }
        }
      }
      clearAuthCookies(res);
      clearCookie(res, cookieNames.legacyP2PSession);
      return res.json({ message: 'Logged out successfully.' });
    } catch (error) {
      clearAuthCookies(res);
      clearCookie(res, cookieNames.legacyP2PSession);
      return res.status(500).json({ message: 'Server error during logout.' });
    }
  });
}

module.exports = {
  registerAuthRoutes
};
