import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { SupportTicket } from '../models/index.js';

const TELEGRAM_API_BASE = 'https://api.telegram.org';

const getBotToken = () => String(process.env.TELEGRAM_BOT_TOKEN || '').trim();
const getChatId = () => String(process.env.TELEGRAM_CHAT_ID || '').trim();

const sanitizeAlertText = (message) => String(message || '').trim().slice(0, 3500);

const getWaitThresholdMinutes = () =>
  Math.max(10, Number.parseInt(String(process.env.SUPPORT_WAIT_ALERT_MINUTES || '10'), 10) || 10);

export const sendTelegramAlert = async (message) => {
  const text = sanitizeAlertText(message);
  if (!text) {
    return { sent: false, reason: 'empty_message' };
  }

  const token = getBotToken();
  const chatId = getChatId();
  if (!token || !chatId) {
    return { sent: false, reason: 'telegram_not_configured' };
  }

  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true
      })
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('[support-telegram] send failed', {
        status: response.status,
        body: body.slice(0, 300)
      });
      return { sent: false, reason: 'telegram_api_error' };
    }

    return { sent: true };
  } catch (error) {
    console.error('[support-telegram] request failed', { message: error.message });
    return { sent: false, reason: 'telegram_request_failed' };
  }
};

export const sendNewSupportTicketAlert = async (ticket) => {
  return sendTelegramAlert(
    `[SUPPORT][NEW] Ticket #${ticket.id} from user ${ticket.user_id}. Subject: ${ticket.subject}`
  );
};

export const sendEscalatedSupportAlert = async (ticket, reason = 'Escalated by support workflow') => {
  return sendTelegramAlert(
    `[SUPPORT][ESCALATED] Ticket #${ticket.id} from user ${ticket.user_id}. Reason: ${String(reason || '').trim()}`
  );
};

export const runSupportWaitingAlerts = async () => {
  const waitMinutes = getWaitThresholdMinutes();

  try {
    const waitingTickets = await sequelize.query(
      `SELECT id, user_id, subject, last_user_message_at
       FROM support_tickets
       WHERE status <> 'closed'
         AND last_user_message_at IS NOT NULL
         AND last_user_message_at <= (UTC_TIMESTAMP() - INTERVAL :waitMinutes MINUTE)
         AND (last_admin_message_at IS NULL OR last_admin_message_at < last_user_message_at)
         AND (waiting_alert_sent_at IS NULL OR waiting_alert_sent_at < last_user_message_at)
       ORDER BY last_user_message_at ASC
       LIMIT 100`,
      {
        replacements: { waitMinutes },
        type: QueryTypes.SELECT
      }
    );

    let alertsSent = 0;

    for (const ticket of waitingTickets) {
      const alert = await sendTelegramAlert(
        `[SUPPORT][WAITING] User ${ticket.user_id} has been waiting >${waitMinutes} min on ticket #${ticket.id}. Subject: ${ticket.subject}`
      );

      if (!alert.sent) {
        continue;
      }

      alertsSent += 1;

      await SupportTicket.update(
        {
          waiting_alert_sent_at: new Date(),
          updated_at: new Date()
        },
        {
          where: {
            id: ticket.id
          }
        }
      );
    }

    return {
      wait_minutes: waitMinutes,
      checked: waitingTickets.length,
      alerts_sent: alertsSent
    };
  } catch (error) {
    console.error('[support-telegram] waiting alert scan failed', { message: error.message });
    return {
      wait_minutes: waitMinutes,
      checked: 0,
      alerts_sent: 0,
      error: 'scan_failed'
    };
  }
};
