const assetsStatus = document.getElementById('assetsStatus');
const assetsActionMessage = document.getElementById('assetsActionMessage');

const totalBalanceEl = document.getElementById('assetsTotalBalance');
const spotBalanceEl = document.getElementById('assetsSpotBalance');
const fundingBalanceEl = document.getElementById('assetsFundingBalance');
const spotInlineEl = document.getElementById('assetsSpotInline');
const fundingInlineEl = document.getElementById('assetsFundingInline');

const tabs = Array.from(document.querySelectorAll('[data-assets-tab]'));
const panels = Array.from(document.querySelectorAll('[data-assets-panel]'));

const depositBtn = document.getElementById('assetsDepositBtn');
const withdrawBtn = document.getElementById('assetsWithdrawBtn');
const transferBtn = document.getElementById('assetsTransferBtn');

const depositModal = document.getElementById('depositModal');
const withdrawModal = document.getElementById('withdrawModal');

const state = {
  activeTab: 'overview',
  loading: false,
  balances: {
    total: 0,
    spot: 0,
    funding: 0
  }
};

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatUsdt(value) {
  return `${toNumber(value).toFixed(2)} USDT`;
}

function setStatus(text, type = '') {
  if (!assetsStatus) {
    return;
  }

  assetsStatus.textContent = text;
  assetsStatus.className = 'assets-status';
  if (type) {
    assetsStatus.classList.add(type);
  }
}

function setActionMessage(text = '') {
  if (!assetsActionMessage) {
    return;
  }
  assetsActionMessage.textContent = text;
}

function renderBalances() {
  if (totalBalanceEl) {
    totalBalanceEl.textContent = formatUsdt(state.balances.total);
  }
  if (spotBalanceEl) {
    spotBalanceEl.textContent = formatUsdt(state.balances.spot);
  }
  if (fundingBalanceEl) {
    fundingBalanceEl.textContent = formatUsdt(state.balances.funding);
  }
  if (spotInlineEl) {
    spotInlineEl.textContent = formatUsdt(state.balances.spot);
  }
  if (fundingInlineEl) {
    fundingInlineEl.textContent = formatUsdt(state.balances.funding);
  }
}

function setActiveTab(tab) {
  const resolved = ['overview', 'spot', 'funding'].includes(tab) ? tab : 'overview';
  state.activeTab = resolved;

  tabs.forEach((tabButton) => {
    const isActive = tabButton.getAttribute('data-assets-tab') === resolved;
    tabButton.classList.toggle('active', isActive);
    tabButton.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  panels.forEach((panel) => {
    const panelKey = panel.getAttribute('data-assets-panel');
    panel.classList.toggle('hidden', panelKey !== resolved);
  });
}

function modalIsOpen(modal) {
  return Boolean(modal) && !modal.classList.contains('hidden');
}

function syncBodyInteractionState() {
  const hasOpenModal = modalIsOpen(depositModal) || modalIsOpen(withdrawModal);
  document.body.style.overflow = hasOpenModal ? 'hidden' : 'auto';
  document.body.style.pointerEvents = 'auto';
}

function setModalOpen(modal, open) {
  if (!modal) {
    return;
  }

  const shouldOpen = Boolean(open);
  modal.classList.toggle('hidden', !shouldOpen);
  modal.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  syncBodyInteractionState();
}

function closeAllModals() {
  setModalOpen(depositModal, false);
  setModalOpen(withdrawModal, false);
  document.body.style.overflow = 'auto';
}

async function loadWalletSummary() {
  if (state.loading) {
    return;
  }

  state.loading = true;
  setStatus('Loading balances...');

  try {
    const response = await fetch('/api/wallet/summary', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.message || `Unable to load wallet summary (${response.status})`);
    }

    const data = payload?.data || payload;
    const summary = data?.summary || data || {};

    state.balances.total = toNumber(summary.total_balance ?? summary.total ?? summary.totalBalance);
    state.balances.spot = toNumber(summary.spot_balance ?? summary.spot ?? summary.spotBalance);
    state.balances.funding = toNumber(summary.funding_balance ?? summary.funding ?? summary.fundingBalance);

    renderBalances();
    setStatus('Balances synced.');
  } catch (error) {
    console.error(error);
    setStatus(error.message || 'Failed to load balances.', 'error');
  } finally {
    state.loading = false;
  }
}

function bindEvents() {
  tabs.forEach((tabButton) => {
    tabButton.addEventListener('click', () => {
      setActiveTab(tabButton.getAttribute('data-assets-tab'));
    });
  });

  depositBtn?.addEventListener('click', () => {
    setActionMessage('');
    setModalOpen(depositModal, true);
  });

  withdrawBtn?.addEventListener('click', () => {
    setActionMessage('');
    setModalOpen(withdrawModal, true);
  });

  transferBtn?.addEventListener('click', () => {
    setActionMessage('Transfer flow will be enabled in next release.');
  });

  document.querySelectorAll('[data-modal-close]').forEach((node) => {
    node.addEventListener('click', () => {
      const modalId = node.getAttribute('data-modal-close');
      if (modalId === 'depositModal') {
        setModalOpen(depositModal, false);
      } else if (modalId === 'withdrawModal') {
        setModalOpen(withdrawModal, false);
      }
    });
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllModals();
    }
  });

  window.addEventListener('pagehide', () => {
    document.body.style.overflow = 'auto';
    document.body.style.pointerEvents = 'auto';
  });
}

(function initAssetsPage() {
  setActiveTab('overview');
  renderBalances();
  bindEvents();
  loadWalletSummary();
})();
