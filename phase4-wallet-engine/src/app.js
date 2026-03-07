import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import depositRoutes from './routes/depositRoutes.js';
import withdrawRoutes from './routes/withdrawRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import p2pRoutes from './routes/p2p.routes.js';
import supportRoutes from './routes/supportRoutes.js';
import supportChatRoutes from './routes/supportChat.routes.js';
import adminSupportRoutes from './routes/adminSupport.routes.js';
import supportCenterRoutes from './routes/supportCenter.routes.js';
import adminSupportCenterRoutes from './routes/adminSupportCenter.routes.js';
import './cron/p2pCron.js';
import './cron/supportAlertCron.js';
import { encrypt, decrypt } from './utils/encryption.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'OK', data: {} });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/test/encryption', (req, res) => {
  try {
    const text = String(req.query.text || 'test-message');
    const encrypted = encrypt(text);
    const decrypted = decrypt(encrypted);

    return res.json({
      ok: true,
      input: text,
      encrypted,
      decrypted
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: String(error?.message || 'Encryption test failed')
    });
  }
});

app.use('/api', authRoutes);
app.use('/api', walletRoutes);
app.use('/api', depositRoutes);
app.use('/api', withdrawRoutes);
app.use('/api', adminRoutes);
app.use('/api', supportRoutes);
app.use('/api', supportChatRoutes);
app.use('/api', adminSupportRoutes);
app.use('/api', supportCenterRoutes);
app.use('/api', adminSupportCenterRoutes);
app.use('/api/p2p', p2pRoutes);

const supportCenterDistPath = path.resolve(process.cwd(), 'support-center-ui', 'dist');
if (fs.existsSync(supportCenterDistPath)) {
  app.use('/support-center', express.static(supportCenterDistPath));
  app.get('/support-center/*', (req, res) => {
    res.sendFile(path.join(supportCenterDistPath, 'index.html'));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
