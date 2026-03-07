import React, { useEffect, useMemo, useRef, useState } from 'react';

const bubbleStyles = {
  user: {
    alignSelf: 'flex-end',
    background: '#1570ef',
    color: '#ffffff'
  },
  support: {
    alignSelf: 'flex-start',
    background: '#eef2f7',
    color: '#111827'
  }
};

const getSocketClient = (socketUrl, token) => {
  if (typeof window === 'undefined' || typeof window.io !== 'function') {
    return null;
  }

  return window.io(socketUrl, {
    auth: {
      token,
      role: 'user'
    },
    transports: ['websocket', 'polling']
  });
};

const senderLabel = (senderType) => {
  if (senderType === 'user') {
    return 'You';
  }

  if (senderType === 'ai') {
    return 'AI Support';
  }

  return 'Support';
};

const messageSide = (senderType) => (senderType === 'user' ? 'user' : 'support');

const formatTime = (value) => {
  if (!value) {
    return '';
  }

  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function FloatingSupportWidget({
  apiBaseUrl = '',
  socketUrl = '',
  authToken,
  title = 'Customer Support'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceBlob, setVoiceBlob] = useState(null);

  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chatBodyRef = useRef(null);

  const canSend = useMemo(() => Boolean(text.trim() || voiceBlob) && Boolean(session?.id), [text, voiceBlob, session]);

  useEffect(() => {
    if (!chatBodyRef.current) {
      return;
    }

    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!authToken || !isOpen) {
      return undefined;
    }

    const socket = getSocketClient(socketUrl, authToken);
    socketRef.current = socket;

    if (!socket) {
      return undefined;
    }

    socket.on('chat:new_message', (payload) => {
      const incoming = payload?.message;
      if (!incoming) {
        return;
      }

      setMessages((prev) => {
        if (prev.some((row) => row.id === incoming.id)) {
          return prev;
        }
        return [...prev, incoming];
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authToken, isOpen, socketUrl]);

  const openAndStart = async () => {
    setIsOpen(true);

    if (session?.id || !authToken) {
      return;
    }

    const response = await fetch(`${apiBaseUrl}/api/support/start`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    const json = await response.json();
    if (!json?.success) {
      return;
    }

    setSession(json.data.session);
    setMessages(json.data.messages || []);
  };

  const sendMessage = async () => {
    if (!canSend || !authToken) {
      return;
    }

    setIsSending(true);

    try {
      const form = new FormData();
      form.append('session_id', String(session.id));
      if (text.trim()) {
        form.append('message', text.trim());
      }
      if (voiceBlob) {
        form.append('voice', voiceBlob, `voice-${Date.now()}.ogg`);
      }

      const response = await fetch(`${apiBaseUrl}/api/support/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: form
      });

      const json = await response.json();
      if (json?.success) {
        setSession(json.data.session);
        setMessages((prev) => {
          const incoming = json.data.messages || [];
          const seen = new Set(prev.map((item) => item.id));
          const merged = [...prev];

          for (const row of incoming) {
            if (!seen.has(row.id)) {
              merged.push(row);
              seen.add(row.id);
            }
          }

          return merged;
        });
        setText('');
        setVoiceBlob(null);
      }
    } finally {
      setIsSending(false);
    }
  };

  const startVoiceRecording = async () => {
    if (isRecording) {
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (event) => {
      if (event.data?.size) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/ogg' });
      setVoiceBlob(blob);
      stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  };

  const stopVoiceRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) {
      return;
    }

    mediaRecorderRef.current.stop();
  };

  return (
    <div>
      <button
        type="button"
        onClick={openAndStart}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: '#0a7d2c',
          color: '#fff',
          fontWeight: 700,
          boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
          zIndex: 999
        }}
      >
        Chat
      </button>

      {isOpen ? (
        <div
          style={{
            position: 'fixed',
            right: 24,
            bottom: 96,
            width: 360,
            maxWidth: 'calc(100vw - 32px)',
            height: 500,
            background: '#ffffff',
            borderRadius: 16,
            boxShadow: '0 16px 40px rgba(15,23,42,0.24)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 999
          }}
        >
          <div
            style={{
              background: '#0a7d2c',
              color: '#fff',
              padding: '14px 16px',
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{title}</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>

          <div
            ref={chatBodyRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              background: '#f8fafc'
            }}
          >
            {messages.map((row) => {
              const side = messageSide(row.sender_type);
              return (
                <div
                  key={row.id}
                  style={{
                    ...bubbleStyles[side],
                    maxWidth: '80%',
                    borderRadius: 12,
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
                  <small style={{ opacity: 0.75 }}>{senderLabel(row.sender_type)}</small>
                  {row.message ? <span>{row.message}</span> : null}
                  {row.voice_url ? <audio controls src={`${apiBaseUrl}${row.voice_url}`} /> : null}
                  <small style={{ opacity: 0.7, alignSelf: 'flex-end' }}>{formatTime(row.created_at)}</small>
                </div>
              );
            })}
          </div>

          <div style={{ padding: 10, borderTop: '1px solid #e5e7eb', display: 'grid', gap: 8 }}>
            <textarea
              rows={2}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type your message"
              style={{ width: '100%', resize: 'none', borderRadius: 10, padding: 10, border: '1px solid #d1d5db' }}
            />

            <div style={{ display: 'flex', gap: 8 }}>
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    padding: '8px 12px',
                    background: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Voice
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopVoiceRecording}
                  style={{
                    border: '1px solid #ef4444',
                    borderRadius: 10,
                    padding: '8px 12px',
                    background: '#fee2e2',
                    color: '#b91c1c',
                    cursor: 'pointer'
                  }}
                >
                  Stop
                </button>
              )}

              <button
                type="button"
                disabled={!canSend || isSending}
                onClick={sendMessage}
                style={{
                  marginLeft: 'auto',
                  border: 'none',
                  borderRadius: 10,
                  padding: '8px 14px',
                  background: '#1570ef',
                  color: '#fff',
                  cursor: canSend ? 'pointer' : 'not-allowed',
                  opacity: canSend ? 1 : 0.5
                }}
              >
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
