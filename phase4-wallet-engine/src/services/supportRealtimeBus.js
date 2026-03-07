import { EventEmitter } from 'node:events';

const supportBus = new EventEmitter();
supportBus.setMaxListeners(0);

export const SUPPORT_EVENTS = Object.freeze({
  NEW_SUPPORT_REQUEST: 'NEW_SUPPORT_REQUEST',
  CHAT_SESSION_CREATED: 'chat:session_created',
  CHAT_NEW_MESSAGE: 'chat:new_message',
  CHAT_SESSION_UPDATED: 'chat:session_updated'
});

export const emitSupportEvent = (eventName, payload) => {
  supportBus.emit(String(eventName || ''), payload);
};

export const subscribeSupportEvent = (eventName, handler) => {
  if (typeof handler !== 'function') {
    return () => {};
  }

  const normalizedEventName = String(eventName || '').trim();
  if (!normalizedEventName) {
    return () => {};
  }

  supportBus.on(normalizedEventName, handler);

  return () => {
    supportBus.off(normalizedEventName, handler);
  };
};
