import { SUPPORT_CENTER_EVENTS, subscribeSupportCenterEvent } from '../services/supportCenterEventBus.js';

const ADMIN_ROOM = 'support-center:admins';
const USER_ROOM_PREFIX = 'support-center:user:';

const getUserRoom = (userId) => `${USER_ROOM_PREFIX}${userId}`;

const parsePositiveInt = (value) => {
  const parsed = Number.parseInt(String(value || 0), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
};

export const initSupportCenterSocketServer = (io) => {
  const unsubs = [
    subscribeSupportCenterEvent(SUPPORT_CENTER_EVENTS.TICKET_CREATED, (payload) => {
      io.to(ADMIN_ROOM).emit('support-center:ticket-created', payload);
      const userId = parsePositiveInt(payload?.user_id);
      if (userId) {
        io.to(getUserRoom(userId)).emit('support-center:ticket-created', payload);
      }
    }),
    subscribeSupportCenterEvent(SUPPORT_CENTER_EVENTS.TICKET_UPDATED, (payload) => {
      io.to(ADMIN_ROOM).emit('support-center:ticket-updated', payload);
      const userId = parsePositiveInt(payload?.user_id);
      if (userId) {
        io.to(getUserRoom(userId)).emit('support-center:ticket-updated', payload);
      }
    }),
    subscribeSupportCenterEvent(SUPPORT_CENTER_EVENTS.ANNOUNCEMENT_CREATED, (payload) => {
      io.emit('support-center:announcement-created', payload);
    })
  ];

  io.on('connection', (socket) => {
    socket.on('support-center:join-admin', () => {
      socket.join(ADMIN_ROOM);
    });

    socket.on('support-center:join-user', (payload = {}) => {
      const userId = parsePositiveInt(payload.user_id);
      if (!userId) {
        return;
      }
      socket.join(getUserRoom(userId));
    });
  });

  return () => {
    for (const unsubscribe of unsubs) {
      try {
        unsubscribe();
      } catch {
        // no-op
      }
    }
  };
};

