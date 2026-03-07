import { EventEmitter } from 'node:events';

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

const RECENT_NOTIFICATIONS_LIMIT = 25;
const recentNotificationsByUser = new Map();

const getChannel = (userId) => `support:user:${userId}`;

const rememberNotification = (notification) => {
  const key = String(notification.user_id);
  const existing = recentNotificationsByUser.get(key) || [];
  existing.push(notification);

  if (existing.length > RECENT_NOTIFICATIONS_LIMIT) {
    existing.splice(0, existing.length - RECENT_NOTIFICATIONS_LIMIT);
  }

  recentNotificationsByUser.set(key, existing);
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
  return payload;
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
