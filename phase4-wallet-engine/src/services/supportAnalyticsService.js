import { Op, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { SupportTicket } from '../models/index.js';

export const getTicketStats = async () => {
  const startOfTodayUtc = new Date();
  startOfTodayUtc.setUTCHours(0, 0, 0, 0);

  const [totalTickets, openTickets, closedTickets, ticketsToday, avgResponseRow] = await Promise.all([
    SupportTicket.count(),
    SupportTicket.count({ where: { status: { [Op.in]: ['open', 'in_progress'] } } }),
    SupportTicket.count({ where: { status: 'closed' } }),
    SupportTicket.count({
      where: {
        created_at: {
          [Op.gte]: startOfTodayUtc
        }
      }
    }),
    sequelize.query(
      `SELECT AVG(TIMESTAMPDIFF(SECOND, t.created_at, first_admin.first_reply_at)) AS avg_seconds
       FROM support_tickets t
       INNER JOIN (
         SELECT ticket_id, MIN(created_at) AS first_reply_at
         FROM support_messages
         WHERE sender_type = 'admin'
         GROUP BY ticket_id
       ) first_admin
       ON first_admin.ticket_id = t.id`,
      {
        type: QueryTypes.SELECT
      }
    )
  ]);

  const avgResponseTimeSeconds = Number(avgResponseRow?.[0]?.avg_seconds || 0);

  return {
    total_tickets: Number(totalTickets || 0),
    open_tickets: Number(openTickets || 0),
    closed_tickets: Number(closedTickets || 0),
    avg_response_time: Number.isFinite(avgResponseTimeSeconds)
      ? Number(avgResponseTimeSeconds.toFixed(2))
      : 0,
    tickets_today: Number(ticketsToday || 0)
  };
};
