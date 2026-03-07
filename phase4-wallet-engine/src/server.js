import 'dotenv/config';
import { createServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import './models/index.js';
import { initSupportSocketServer } from './socket/supportSocketServer.js';
import { initSupportCenterSocketServer } from './socket/supportCenterSocketServer.js';

const PORT = Number(process.env.PORT || 3001);

const getSocketCorsOrigin = () => {
  const rawValue = String(process.env.SOCKET_CORS_ORIGIN || '*').trim();
  if (rawValue === '*') {
    return '*';
  }

  const rows = rawValue
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return rows.length ? rows : '*';
};

const start = async () => {
  try {
    await connectDatabase();

    const httpServer = createServer(app);
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: getSocketCorsOrigin(),
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    initSupportSocketServer(io);
    initSupportCenterSocketServer(io);

    httpServer.listen(PORT, () => {
      console.log(`Phase 4 Wallet Engine running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
