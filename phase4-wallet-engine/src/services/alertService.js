import { AppError } from '../utils/appError.js';

const TELEGRAM_API_BASE = 'https://api.telegram.org';

const buildSmtpConfig = () => {
  const host = String(process.env.SMTP_HOST || '').trim();
  const port = Number.parseInt(String(process.env.SMTP_PORT || '587'), 10) || 587;
  const user = String(process.env.SMTP_USER || '').trim();
  const pass = String(process.env.SMTP_PASS || '').trim();
  const secure = String(process.env.SMTP_SECURE || '').trim().toLowerCase() === 'true' || port === 465;
  const from = String(process.env.SMTP_FROM_EMAIL || process.env.MAIL_FROM || user).trim();
  const to = String(process.env.ADMIN_ALERT_EMAIL || process.env.SMTP_TO_EMAIL || '').trim();

  return { host, port, user, pass, secure, from, to };
};

const loadNodemailer = async () => {
  try {
    const mod = await import('nodemailer');
    return mod.default || mod;
  } catch {
    throw new AppError('nodemailer package is required for email alerts', 500, {
      hint: 'Install dependency: npm install nodemailer'
    });
  }
};

export const sendTelegramAlert = async (message) => {
  const text = String(message || '').trim();
  if (!text) {
    throw new AppError('Alert message is required', 422);
  }

  const botToken = String(process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const chatId = String(process.env.TELEGRAM_CHAT_ID || '').trim();

  if (!botToken || !chatId) {
    throw new AppError('TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required', 500);
  }

  const endpoint = `${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload?.ok === false) {
      throw new Error(String(payload?.description || `Telegram request failed (${response.status})`));
    }

    return {
      sent: true,
      channel: 'telegram',
      message_id: payload?.result?.message_id || null
    };
  } catch (error) {
    throw new AppError(`Failed to send Telegram alert: ${error.message}`, 502);
  }
};

export const sendAdminEmailAlert = async (subject, message) => {
  const normalizedSubject = String(subject || '').trim();
  const normalizedMessage = String(message || '').trim();

  if (!normalizedSubject || !normalizedMessage) {
    throw new AppError('Email subject and message are required', 422);
  }

  const { host, port, user, pass, secure, from, to } = buildSmtpConfig();
  if (!host || !user || !pass || !from || !to) {
    throw new AppError('SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL and ADMIN_ALERT_EMAIL are required', 500);
  }

  const nodemailer = await loadNodemailer();

  try {
    const transport = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass
      }
    });

    const info = await transport.sendMail({
      from,
      to,
      subject: normalizedSubject,
      text: normalizedMessage
    });

    return {
      sent: true,
      channel: 'email',
      message_id: info?.messageId || null
    };
  } catch (error) {
    throw new AppError(`Failed to send admin email alert: ${error.message}`, 502);
  }
};

export default {
  sendTelegramAlert,
  sendAdminEmailAlert
};
