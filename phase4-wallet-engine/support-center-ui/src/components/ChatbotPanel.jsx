import { useState } from 'react';

export default function ChatbotPanel({ onAskChatbot, onCreateTicket }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi, I can help with deposits, withdrawals, P2P disputes, KYC, and trading issues.'
    }
  ]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) {
      return;
    }

    setLoading(true);
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);

    try {
      const response = await onAskChatbot(text);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: response.reply || 'I could not generate a response right now.',
          suggestions: response.suggested_articles || [],
          canCreateTicket: Boolean(response.can_create_ticket)
        }
      ]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: error.message || 'Chatbot unavailable.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="chatbot-panel">
      <div className="chatbot-head">
        <h3>AI Support Assistant</h3>
      </div>

      <div className="chatbot-log">
        {messages.map((item, index) => (
          <article key={`${item.role}-${index}`} className={`chat-bubble ${item.role === 'user' ? 'user' : 'assistant'}`}>
            <p>{item.text}</p>
            {item.suggestions?.length ? (
              <ul className="chat-suggestions">
                {item.suggestions.map((suggestion) => (
                  <li key={suggestion.id}>{suggestion.title}</li>
                ))}
              </ul>
            ) : null}
            {item.canCreateTicket ? (
              <button type="button" className="ghost-btn" onClick={onCreateTicket}>
                Create support ticket
              </button>
            ) : null}
          </article>
        ))}
      </div>

      <div className="chatbot-input-row">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about any support issue..."
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void sendMessage();
            }
          }}
        />
        <button type="button" className="accent-btn" disabled={loading} onClick={() => void sendMessage()}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </aside>
  );
}

