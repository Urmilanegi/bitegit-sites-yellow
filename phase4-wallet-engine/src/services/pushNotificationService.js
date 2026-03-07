import { EventEmitter } from 'node:events';
import admin from 'firebase-admin';

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

const RECENT_NOTIFICATIONS_LIMIT = 25;
const recentNotificationsByUser = new Map();

const getChannel = (userId) => `support:user:${userId}`;
const getTopicName = (userId) => `support_user_${userId}`;

const getLegacyFcmServerKey = () => String(process.env.FCM_SERVER_KEY || '').trim();
const getServiceAccountJson = () => String(process.env.FCM_SERVICE_ACCOUNT_JSON || '').trim();

let firebaseInitAttempted = false;
let firebaseReady = false;

const rememberNotification = (notification) => {
  const key = String(notification.user_id);
  const existing = recentNotificationsByUser.get(key) || [];
  existing.push(notification);

  if (existing.length > RECENT_NOTIFICATIONS_LIMIT) {
    existing.splice(0, existing.length - RECENT_NOTIFICATIONS_LIMIT);
  }

  recentNotificationsByUser.set(key, existing);
};

const serializeMetadata = (metadata = {}) => {
  const payload = {};

  for (const [key, value] of Object.entries(metadata)) {
    payload[key] = typeof value === 'string' ? value : JSON.stringify(value);
  }

  return payload;
};

const ensureFirebaseAdmin = () => {
  if (firebaseInitAttempted) {
    return firebaseReady;
  }

  firebaseInitAttempted = true;

  try {
    if (admin.apps.length > 0) {
      firebaseReady = true;
      return firebaseReady;
    }

    const serviceAccountJson = getServiceAccountJson();
    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      firebaseReady = true;
      return firebaseReady;
    }

    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
    firebaseReady = true;
    return firebaseReady;
  } catch (error) {
    firebaseReady = false;
    console.warn('[push-notify] firebase-admin initialization skipped', { message: error.message });
    return firebaseReady;
  }
};

const sendViaFirebaseAdmin = async (notification) => {
  if (!ensureFirebaseAdmin()) {
    return { sent: false, provider: 'firebase-admin', reason: 'firebase_not_initialized' };
  }

  try {
    const result = await admin.messaging().send({
      topic: getTopicName(notification.user_id),
      notification: {
        title: 'Support Update',
        body: String(notification.message || '').slice(0, 200)
      },
      data: serializeMetadata(notification.metadata)
    });

    return {
      sent: true,
      provider: 'firebase-admin',
      id: result
    };
  } catch (error) {
    console.error('[push-notify] firebase-admin send failed', { message: error.message });
    return {
      sent: false,
      provider: 'firebase-admin',
      reason: 'send_failed'
    };
  }
};

const sendViaLegacyFcm = async (notification) => {
  const serverKey = getLegacyFcmServerKey();
  if (!serverKey) {
    return { sent: false, provider: 'fcm-legacy', reason: 'missing_fcm_server_key' };
  }

  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${serverKey}`
      },
      body: JSON.stringify({
        to: `/topics/${getTopicName(notification.user_id)}`,
        notification: {
          title: 'Support Update',
          body: String(notification.message || '').slice(0, 200)
        },
        data: serializeMetadata(notification.metadata)
      })
    });

    if (!response.ok) {
      return {
        sent: false,
        provider: 'fcm-legacy',
        reason: 'http_error'
      };
    }

    return {
      sent: true,
      provider: 'fcm-legacy'
    };
  } catch (error) {
    console.error('[push-notify] legacy fcm send failed', { message: error.message });
    return {
      sent: false,
      provider: 'fcm-legacy',
      reason: 'request_failed'
    };
  }
};

export const notifyUser = async (userId, message, metadata = {}) => {
  const normalizedUserId = Number.parseInt(String(userId || 0), 10);
  const text = String(message || '').trim();

  if (!Number.isInteger(normalizedUserId) || normalizedUserId <= 0 || !text) {
    return null;
  }

  const payload = {
    user_id: normalizedUserId,
    message: text,
    metadata,
    created_at: new Date().toISOString()
  };

  rememberNotification(payload);
  emitter.emit(getChannel(normalizedUserId), payload);

  const firebaseResult = await sendViaFirebaseAdmin(payload);
  if (firebaseResult.sent) {
    return {
      ...payload,
      push: firebaseResult
    };
  }

  const legacyResult = await sendViaLegacyFcm(payload);

  return {
    ...payload,
    push: legacyResult
  };
};

export const subscribeToUserNotifications = (userId, handler) => {
  const normalizedUserId = Number.parseInt(String(userId || 0), 10);

  if (!Number.isInteger(normalizedUserId) || normalizedUserId <= 0 || typeof handler !== 'function') {
    return () => {};
  }

  const channel = getChannel(normalizedUserId);
  emitter.on(channel, handler);

  return () => {
    emitter.off(channel, handler);
  };
};

export const getRecentNotifications = (userId) => {
  const normalizedUserId = Number.parseInt(String(userId || 0), 10);
  if (!Number.isInteger(normalizedUserId) || normalizedUserId <= 0) {
    return [];
  }

  return [...(recentNotificationsByUser.get(String(normalizedUserId)) || [])];
};
