import { useMemo, useState } from 'react';

export default function AdminPanelPage({
  ticketsPayload,
  disputesPayload,
  cryptoPayload,
  onReplyTicket,
  onResolveTicket,
  onCreateAnnouncement
}) {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [resolveNote, setResolveNote] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const tickets = useMemo(() => ticketsPayload?.tickets || [], [ticketsPayload]);
  const disputes = useMemo(() => disputesPayload?.disputes || [], [disputesPayload]);
  const cryptoList = useMemo(() => (Array.isArray(cryptoPayload) ? cryptoPayload : []), [cryptoPayload]);
  const selectedTicket = tickets.find((ticket) => Number(ticket.id) === Number(selectedTicketId)) || null;

  const submitReply = async () => {
    if (!selectedTicket || !replyText.trim()) {
      return;
    }
    await onReplyTicket(selectedTicket.id, replyText.trim());
    setReplyText('');
    setStatusMessage('Reply sent successfully.');
  };

  const submitResolve = async () => {
    if (!selectedTicket) {
      return;
    }
    await onResolveTicket(selectedTicket.id, resolveNote.trim());
    setResolveNote('');
    setStatusMessage('Ticket resolved successfully.');
  };

  const submitAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementMessage.trim()) {
      return;
    }
    await onCreateAnnouncement({
      title: announcementTitle.trim(),
      message: announcementMessage.trim()
    });
    setAnnouncementTitle('');
    setAnnouncementMessage('');
    setStatusMessage('Announcement published.');
  };

  return (
    <section className="page-main">
      <article className="card">
        <h1>Admin Moderation Dashboard</h1>
        <p>Manage support tickets, P2P disputes, announcements, and crypto deposit/withdraw status.</p>
        {statusMessage ? <p className="status-success-text">{statusMessage}</p> : null}
      </article>

      <div className="admin-grid">
        <article className="card">
          <h2>Support Tickets</h2>
          <div className="admin-list">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                className={`admin-item ${Number(selectedTicketId) === Number(ticket.id) ? 'active' : ''}`}
                onClick={() => setSelectedTicketId(ticket.id)}
              >
                <strong>{ticket.subject}</strong>
                <small>
                  #{ticket.id} • {ticket.status}
                </small>
              </button>
            ))}
          </div>

          {selectedTicket ? (
            <div className="admin-ticket-actions">
              <h3>Ticket #{selectedTicket.id}</h3>
              <p>{selectedTicket.last_message || 'No messages yet.'}</p>
              <textarea
                rows={3}
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                placeholder="Send reply to user"
              />
              <button type="button" className="accent-btn" onClick={() => void submitReply()}>
                Send Reply
              </button>
              <textarea
                rows={2}
                value={resolveNote}
                onChange={(event) => setResolveNote(event.target.value)}
                placeholder="Resolution note"
              />
              <button type="button" className="ghost-btn" onClick={() => void submitResolve()}>
                Resolve Ticket
              </button>
            </div>
          ) : null}
        </article>

        <article className="card">
          <h2>P2P Disputes</h2>
          <div className="admin-list">
            {disputes.map((dispute) => (
              <div key={dispute.id} className="admin-item static">
                <strong>
                  {dispute.order_no || `Order ${dispute.order_id}`} - {dispute.dispute_status}
                </strong>
                <small>{dispute.dispute_reason}</small>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="admin-grid">
        <article className="card">
          <h2>Coin Status Monitor</h2>
          <div className="admin-list">
            {cryptoList.map((coin) => (
              <div key={coin.symbol} className="admin-item static">
                <strong>
                  {coin.symbol} - {coin.name}
                </strong>
                <small>{(coin.networks || []).length} network(s)</small>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h2>System Announcement</h2>
          <div className="ticket-form">
            <label>
              <span>Title</span>
              <input value={announcementTitle} onChange={(event) => setAnnouncementTitle(event.target.value)} />
            </label>
            <label>
              <span>Message</span>
              <textarea
                rows={4}
                value={announcementMessage}
                onChange={(event) => setAnnouncementMessage(event.target.value)}
              />
            </label>
            <button type="button" className="accent-btn" onClick={() => void submitAnnouncement()}>
              Publish Announcement
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

