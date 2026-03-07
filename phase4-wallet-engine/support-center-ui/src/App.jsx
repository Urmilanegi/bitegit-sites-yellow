import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from './api.js';
import AnnouncementPopup from './components/AnnouncementPopup.jsx';
import AccountCenterPage from './pages/AccountCenterPage.jsx';
import AdminPanelPage from './pages/AdminPanelPage.jsx';
import CryptoStatusPage from './pages/CryptoStatusPage.jsx';
import HelpCenterPage from './pages/HelpCenterPage.jsx';
import SubmitCasePage from './pages/SubmitCasePage.jsx';

const SOCKET_BASE = import.meta.env.VITE_SOCKET_BASE || window.location.origin;

const NAV_ITEMS = [
  { key: 'help', label: 'Help Center' },
  { key: 'submit', label: 'Submit Case' },
  { key: 'status', label: 'Deposit/Withdraw Status' },
  { key: 'account', label: 'Account Center' },
  { key: 'admin', label: 'Admin Panel' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('help');
  const [helpPayload, setHelpPayload] = useState(null);
  const [caseConfig, setCaseConfig] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [cryptoFilters, setCryptoFilters] = useState({
    search: '',
    hideSuspended: false,
    onlySuspended: false
  });
  const [cryptoPayload, setCryptoPayload] = useState([]);
  const [adminTickets, setAdminTickets] = useState({ tickets: [] });
  const [adminDisputes, setAdminDisputes] = useState({ disputes: [] });
  const [adminCrypto, setAdminCrypto] = useState([]);
  const [globalMessage, setGlobalMessage] = useState('');

  const socket = useMemo(() => io(SOCKET_BASE, { transports: ['websocket', 'polling'] }), []);

  const refreshHelpTopics = async (search = '') => {
    const response = await api.getHelpTopics(search);
    setHelpPayload(response.data);
  };

  const refreshCryptoStatus = async () => {
    const response = await api.getCryptoStatus(cryptoFilters);
    setCryptoPayload(response.data || []);
  };

  const refreshAdmin = async () => {
    const [ticketsRes, disputesRes, cryptoRes] = await Promise.all([
      api.getAdminTickets(),
      api.getAdminDisputes(),
      api.getAdminCryptoStatus()
    ]);
    setAdminTickets(ticketsRes.data || { tickets: [] });
    setAdminDisputes(disputesRes.data || { disputes: [] });
    setAdminCrypto(cryptoRes.data || []);
  };

  useEffect(() => {
    void (async () => {
      const [topicsRes, configRes, announcementRes, cryptoRes] = await Promise.all([
        api.getHelpTopics(''),
        api.getCaseConfig(),
        api.getAnnouncements(),
        api.getCryptoStatus({})
      ]);
      setHelpPayload(topicsRes.data);
      setCaseConfig(configRes.data);
      setAnnouncements(announcementRes.data || []);
      setCryptoPayload(cryptoRes.data || []);
    })().catch((error) => {
      setGlobalMessage(error.message || 'Failed to load support center.');
    });
  }, []);

  useEffect(() => {
    void refreshCryptoStatus().catch(() => {
      // no-op
    });
  }, [cryptoFilters]);

  useEffect(() => {
    socket.emit('support-center:join-admin');

    socket.on('support-center:ticket-created', () => {
      setGlobalMessage('New support request received.');
      if (activeTab === 'admin') {
        void refreshAdmin();
      }
    });

    socket.on('support-center:announcement-created', () => {
      void api.getAnnouncements().then((response) => setAnnouncements(response.data || []));
    });

    return () => {
      socket.disconnect();
    };
  }, [activeTab, socket]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>BITEGIT Support Center</h1>
          <p>Bybit/Binance style Help Center, Support System, and Account Center</p>
        </div>
        <nav className="topbar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={activeTab === item.key ? 'active' : ''}
              onClick={() => {
                setActiveTab(item.key);
                if (item.key === 'admin') {
                  void refreshAdmin();
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {globalMessage ? <p className="global-message">{globalMessage}</p> : null}

      {activeTab === 'help' ? (
        <HelpCenterPage
          payload={helpPayload}
          onSearch={(search) => void refreshHelpTopics(search)}
          onHelpfulVote={(articleId, helpful) => void api.submitFeedback(articleId, helpful)}
          onAskChatbot={(message) => api.askChatbot(message).then((res) => res.data)}
          onOpenSubmitCase={() => setActiveTab('submit')}
        />
      ) : null}

      {activeTab === 'submit' ? (
        <SubmitCasePage
          config={caseConfig}
          onSubmitCase={(payload) =>
            api.submitCase(payload).then((res) => {
              setGlobalMessage(`Ticket created: ${res.data.ticket_code}`);
              return res.data;
            })
          }
        />
      ) : null}

      {activeTab === 'status' ? (
        <CryptoStatusPage coins={cryptoPayload} filters={cryptoFilters} onChangeFilters={setCryptoFilters} />
      ) : null}

      {activeTab === 'account' ? <AccountCenterPage onOpenSubmitCase={() => setActiveTab('submit')} /> : null}

      {activeTab === 'admin' ? (
        <AdminPanelPage
          ticketsPayload={adminTickets}
          disputesPayload={adminDisputes}
          cryptoPayload={adminCrypto}
          onReplyTicket={(ticketId, message) => api.replyAdminTicket(ticketId, message).then(() => refreshAdmin())}
          onResolveTicket={(ticketId, note) => api.resolveAdminTicket(ticketId, note).then(() => refreshAdmin())}
          onCreateAnnouncement={(payload) =>
            api.createAnnouncement(payload).then(() => {
              setGlobalMessage('Announcement published successfully.');
            })
          }
        />
      ) : null}

      <AnnouncementPopup announcements={announcements} />
    </div>
  );
}
