import React, { useEffect, useMemo, useState } from 'react';

const containerStyle = {
  display: 'grid',
  gridTemplateColumns: '340px 1fr',
  gap: 16,
  minHeight: 620
};

const cardStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  background: '#fff'
};

export default function AdminSupportDashboard({ apiBaseUrl = '', adminToken, socket }) {
  const [dashboard, setDashboard] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [replyText, setReplyText] = useState('');

  const activeChats = useMemo(() => dashboard?.active_chats || [], [dashboard]);

  const loadDashboard = async () => {
    const response = await fetch(`${apiBaseUrl}/api/admin/support/requests`, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });
    const json = await response.json();
    if (json?.success) {
      setDashboard(json.data);
    }
  };

  const loadHistory = async (sessionId) => {
    const response = await fetch(`${apiBaseUrl}/api/admin/support/history/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });

    const json = await response.json();
    if (json?.success) {
      setSelectedSession(json.data.session);
      setHistory(json.data.messages || []);
    }
  };

  useEffect(() => {
    if (!adminToken) {
      return;
    }

    void loadDashboard();
  }, [adminToken]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const onSupportRequest = () => {
      void loadDashboard();
    };

    socket.on('NEW_SUPPORT_REQUEST', onSupportRequest);
    socket.on('chat:new_message', onSupportRequest);

    return () => {
      socket.off('NEW_SUPPORT_REQUEST', onSupportRequest);
      socket.off('chat:new_message', onSupportRequest);
    };
  }, [socket]);

  const joinChat = async (sessionId) => {
    await fetch(`${apiBaseUrl}/api/admin/support/join`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session_id: sessionId })
    });

    await loadHistory(sessionId);
    await loadDashboard();
  };

  const sendReply = async () => {
    if (!selectedSession?.id || !replyText.trim()) {
      return;
    }

    await fetch(`${apiBaseUrl}/api/admin/support/reply`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session_id: selectedSession.id,
        message: replyText.trim()
      })
    });

    setReplyText('');
    await loadHistory(selectedSession.id);
    await loadDashboard();
  };

  const closeChat = async () => {
    if (!selectedSession?.id) {
      return;
    }

    await fetch(`${apiBaseUrl}/api/admin/support/close`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session_id: selectedSession.id })
    });

    await loadDashboard();
    await loadHistory(selectedSession.id);
  };

  return (
    <div style={containerStyle}>
      <section style={{ ...cardStyle, padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Support Requests</h3>
        <div style={{ fontSize: 13, color: '#475467', marginBottom: 10 }}>
          Open: {dashboard?.open_sessions || 0} | Assigned: {dashboard?.assigned_sessions || 0}
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          {activeChats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => loadHistory(chat.id)}
              style={{
                textAlign: 'left',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                background: '#f9fafb',
                padding: 10,
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 700 }}>Session #{chat.id}</div>
              <div style={{ fontSize: 12, color: '#475467' }}>
                User: {chat.user_id} | Status: {chat.status}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section style={{ ...cardStyle, padding: 12, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginTop: 0 }}>Conversation</h3>

        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <button
            type="button"
            disabled={!selectedSession?.id}
            onClick={() => joinChat(selectedSession.id)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d5dd', cursor: 'pointer' }}
          >
            Join Chat
          </button>
          <button
            type="button"
            disabled={!selectedSession?.id}
            onClick={closeChat}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #fecaca',
              background: '#fef2f2',
              color: '#b91c1c',
              cursor: 'pointer'
            }}
          >
            Close Chat
          </button>
        </div>

        <div
          style={{
            flex: 1,
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            padding: 10,
            background: '#f8fafc',
            overflowY: 'auto',
            minHeight: 360
          }}
        >
          {history.map((row) => {
            const isAdmin = row.sender_type === 'admin';
            return (
              <div
                key={row.id}
                style={{
                  maxWidth: '80%',
                  marginBottom: 8,
                  marginLeft: isAdmin ? 'auto' : 0,
                  borderRadius: 10,
                  padding: 10,
                  background: isAdmin ? '#1570ef' : '#e2e8f0',
                  color: isAdmin ? '#fff' : '#0f172a'
                }}
              >
                {row.message ? <div>{row.message}</div> : null}
                {row.voice_url ? <audio controls src={`${apiBaseUrl}${row.voice_url}`} /> : null}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input
            type="text"
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            placeholder="Type support reply"
            style={{ flex: 1, border: '1px solid #d0d5dd', borderRadius: 8, padding: '10px 12px' }}
          />
          <button
            type="button"
            onClick={sendReply}
            style={{
              border: 'none',
              borderRadius: 8,
              background: '#111827',
              color: '#fff',
              padding: '10px 14px',
              cursor: 'pointer'
            }}
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
}
