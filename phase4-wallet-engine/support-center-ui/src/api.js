const API_BASE = import.meta.env.VITE_API_BASE || '';

const normalizeErrorMessage = async (response) => {
  try {
    const body = await response.json();
    return body?.message || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
};

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(await normalizeErrorMessage(response));
  }

  return response.json();
}

export const api = {
  getHelpTopics: (search = '') =>
    request(`/api/support-center/help/topics${search ? `?q=${encodeURIComponent(search)}` : ''}`),

  getCaseConfig: () => request('/api/support-center/case/config'),

  submitCase: (payload) =>
    request('/api/support-center/case/submit', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getCryptoStatus: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) {
      query.set('search', params.search);
    }
    if (params.hideSuspended) {
      query.set('hide_suspended', 'true');
    }
    if (params.onlySuspended) {
      query.set('only_suspended', 'true');
    }
    const qs = query.toString();
    return request(`/api/support-center/crypto/status${qs ? `?${qs}` : ''}`);
  },

  getAnnouncements: () => request('/api/support-center/announcements/active'),

  askChatbot: (message) =>
    request('/api/support-center/chatbot/query', {
      method: 'POST',
      body: JSON.stringify({ message })
    }),

  submitFeedback: (articleId, isHelpful) =>
    request('/api/support-center/help/feedback', {
      method: 'POST',
      body: JSON.stringify({
        article_id: articleId,
        is_helpful: isHelpful
      })
    }),

  getAdminTickets: () => request('/api/admin/support-center/tickets'),
  getAdminDisputes: () => request('/api/admin/support-center/p2p/disputes'),
  getAdminCryptoStatus: () => request('/api/admin/support-center/crypto/status'),

  replyAdminTicket: (ticketId, message) =>
    request(`/api/admin/support-center/tickets/${ticketId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message })
    }),

  resolveAdminTicket: (ticketId, note) =>
    request(`/api/admin/support-center/tickets/${ticketId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ note })
    }),

  createAnnouncement: (payload) =>
    request('/api/admin/support-center/announcements', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

