import { EventEmitter } from 'node:events';

const eventBus = new EventEmitter();
eventBus.setMaxListeners(0);

export const SUPPORT_CENTER_EVENTS = Object.freeze({
  TICKET_CREATED: 'support-center:ticket-created',
  TICKET_UPDATED: 'support-center:ticket-updated',
  ANNOUNCEMENT_CREATED: 'support-center:announcement-created'
});

export const publishSupportCenterEvent = (eventName, payload) => {
  const name = String(eventName || '').trim();
  if (!name) {
    return;
  }
  eventBus.emit(name, payload);
};

export const subscribeSupportCenterEvent = (eventName, handler) => {
  const name = String(eventName || '').trim();
  if (!name || typeof handler !== 'function') {
    return () => {};
  }

  eventBus.on(name, handler);
  return () => {
    eventBus.off(name, handler);
  };
};

