const rowsEl = document.getElementById('p2pRows');
const cardsEl = document.getElementById('p2pCards');
const metaEl = document.getElementById('p2pMeta');
const sideTabs = document.getElementById('sideTabs');
const assetChipRow = document.getElementById('assetChipRow');
const assetFilter = document.getElementById('assetFilter');
const paymentFilter = document.getElementById('paymentFilter');
const amountFilter = document.getElementById('amountFilter');
const advertiserFilter = document.getElementById('advertiserFilter');
const applyFilters = document.getElementById('applyFilters');
const refreshOffers = document.getElementById('refreshOffers');
const exchangeTicker = document.getElementById('exchangeTicker');
const themeToggleBtn = document.getElementById('themeToggleBtn');

const userStatus = document.getElementById('userStatus');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const openAuthBtn = document.getElementById('openAuthBtn');
const openAuthBtnDrawer = document.getElementById('openAuthBtnDrawer');
const closeAuthBtn = document.getElementById('closeAuthBtn');
const authModal = document.getElementById('authModal');
const authBackdrop = document.getElementById('authBackdrop');

const p2pMenuToggle = document.getElementById('p2pMenuToggle');
const p2pNavClose = document.getElementById('p2pNavClose');
const p2pNavDrawer = document.getElementById('p2pNavDrawer');
const p2pNavOverlay = document.getElementById('p2pNavOverlay');
const mobileCurrencyBtn = document.getElementById('mobileCurrencyBtn');
const p2pMobileBottomNav =
  document.querySelector('.p2p-mobile-bottom-nav') ||
  document.querySelector('.mobile-app-nav');
const p2pBoardCard = document.querySelector('.p2p-board-card');
const ordersSection = document.getElementById('orders');
const adsSection = document.getElementById('ads');
const profileSection = document.getElementById('profile');

const liveOrdersMeta = document.getElementById('liveOrdersMeta');
const liveOrdersRows = document.getElementById('liveOrdersRows');
const liveOrdersCards = document.getElementById('liveOrdersCards');
const mobileOrdersTabs = document.getElementById('mobileOrdersTabs');
const mobileOrdersList = document.getElementById('mobileOrdersList') || document.getElementById('liveOrdersCards');

const orderModal = document.getElementById('orderModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const closeModalBackdrop = document.getElementById('closeModalBackdrop');
const orderChatBtn = document.getElementById('orderChatBtn');

const orderRef = document.getElementById('orderRef');
const orderStatus = document.getElementById('orderStatus');
const orderTimer = document.getElementById('orderTimer');
const orderMerchant = document.getElementById('orderMerchant');
const orderCounterpartyName = document.getElementById('orderCounterpartyName');
const orderCounterpartyMeta = document.getElementById('orderCounterpartyMeta');
const orderPrice = document.getElementById('orderPrice');
const orderAmount = document.getElementById('orderAmount');
const orderAssetAmount = document.getElementById('orderAssetAmount');
const orderFee = document.getElementById('orderFee');
const orderPayment = document.getElementById('orderPayment');
const orderParticipants = document.getElementById('orderParticipants');
const orderTime = document.getElementById('orderTime');

const markPaidBtn = document.getElementById('markPaidBtn');
const cancelOrderBtn = document.getElementById('cancelOrderBtn');
const disputeBtn = document.getElementById('disputeBtn');
const paymentPanel = document.getElementById('paymentPanel');
const paymentAmountDisplay = document.getElementById('paymentAmountDisplay');
const paymentMethodDisplay = document.getElementById('paymentMethodDisplay');
const paymentInstructions = document.getElementById('paymentInstructions');
const paymentCountdown = document.getElementById('paymentCountdown');
const paidConfirmBtn = document.getElementById('paidConfirmBtn');

const cancelModal = document.getElementById('cancelModal');
const cancelModalBackdrop = document.getElementById('cancelModalBackdrop');
const cancelModalCloseBtn = document.getElementById('cancelModalCloseBtn');
const cancelReasonForm = document.getElementById('cancelReasonForm');
const cancelNoPaymentCheck = document.getElementById('cancelNoPaymentCheck');
const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');

const chatState = document.getElementById('chatState');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatImageBtn = document.getElementById('chatImageBtn');
const chatImageInput = document.getElementById('chatImageInput');
const chatUploadState = document.getElementById('chatUploadState');

const imagePreviewModal = document.getElementById('imagePreviewModal');
const imagePreviewBackdrop = document.getElementById('imagePreviewBackdrop');
const imagePreviewCloseBtn = document.getElementById('imagePreviewCloseBtn');
const imagePreviewEl = document.getElementById('imagePreviewEl');

const dealModal = document.getElementById('dealModal');
const dealBackdrop = document.getElementById('dealBackdrop');
const dealAvatar = document.getElementById('dealAvatar');
const dealTitle = document.getElementById('dealTitle');
const dealAdvertiserMeta = document.getElementById('dealAdvertiserMeta');
const dealAvailable = document.getElementById('dealAvailable');
const dealLimits = document.getElementById('dealLimits');
const dealDuration = document.getElementById('dealDuration');
const dealPaymentPreview = document.getElementById('dealPaymentPreview');
const dealPrice = document.getElementById('dealPrice');
const dealPayAmount = document.getElementById('dealPayAmount');
const dealReceiveAmount = document.getElementById('dealReceiveAmount');
const dealPaymentSelect = document.getElementById('dealPaymentSelect');
const dealHint = document.getElementById('dealHint');
const dealConfirmBtn = document.getElementById('dealConfirmBtn');
const dealCancelBtn = document.getElementById('dealCancelBtn');

const kycModal = document.getElementById('kycModal');
const kycBackdrop = document.getElementById('kycBackdrop');
const kycCloseBtn = document.getElementById('kycCloseBtn');
const kycForm = document.getElementById('kycForm');
const kycStatusText = document.getElementById('kycStatusText');
const kycAadhaarInput = document.getElementById('kycAadhaarInput');
const kycAadhaarFrontInput = document.getElementById('kycAadhaarFrontInput');
const kycAadhaarFrontMeta = document.getElementById('kycAadhaarFrontMeta');
const kycSelfieInput = document.getElementById('kycSelfieInput');
const kycSelfieMeta = document.getElementById('kycSelfieMeta');
const kycConsent = document.getElementById('kycConsent');
const kycHint = document.getElementById('kycHint');
const kycSubmitBtn = document.getElementById('kycSubmitBtn');

const adCreateForm = document.getElementById('adCreateForm');
const adTypeInput = document.getElementById('adTypeInput');
const adAssetInput = document.getElementById('adAssetInput');
const adPriceInput = document.getElementById('adPriceInput');
const adAvailableInput = document.getElementById('adAvailableInput');
const adMinLimitInput = document.getElementById('adMinLimitInput');
const adMaxLimitInput = document.getElementById('adMaxLimitInput');
const adPaymentsInput = document.getElementById('adPaymentsInput');
const adCreateBtn = document.getElementById('adCreateBtn');
const adCreateMeta = document.getElementById('adCreateMeta');
const myAdsList = document.getElementById('myAdsList');
const refreshMyAdsBtn = document.getElementById('refreshMyAdsBtn');

const profileAvatar = document.getElementById('profileAvatar');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileIdentityTag = document.getElementById('profileIdentityTag');
const profileDepositBtn = document.getElementById('profileDepositBtn');
const profileKyc = document.getElementById('profileKyc');
const profileSecurity = document.getElementById('profileSecurity');
const profileTotalOrders = document.getElementById('profileTotalOrders');
const profileCompletionRate = document.getElementById('profileCompletionRate');
const profileDeposit = document.getElementById('profileDeposit');
const profileCompletedOrders = document.getElementById('profileCompletedOrders');
const profileCompletedOrders30d = document.getElementById('profileCompletedOrders30d');
const profileCompletionRate30d = document.getElementById('profileCompletionRate30d');
const profileCancelledOrders = document.getElementById('profileCancelledOrders');
const profileAvgReleaseTime = document.getElementById('profileAvgReleaseTime');
const profileAvgPaymentTime = document.getElementById('profileAvgPaymentTime');
const profileMeta = document.getElementById('profileMeta');
const profileEditBtn = document.getElementById('profileEditBtn');
const profileAvatarMobile = document.getElementById('profileAvatarMobile');
const profileNameMobile = document.getElementById('profileNameMobile');
const profileSignupTimeMobile = document.getElementById('profileSignupTimeMobile');
const profileIdentityTagMobile = document.getElementById('profileIdentityTagMobile');
const profileTotalTradesMobile = document.getElementById('profileTotalTradesMobile');
const profileThirtyDayTradesMobile = document.getElementById('profileThirtyDayTradesMobile');
const profileCompletionRateMobile = document.getElementById('profileCompletionRateMobile');
const profileAvgReleaseTimeMobile = document.getElementById('profileAvgReleaseTimeMobile');
const profileAvgPaymentTimeMobile = document.getElementById('profileAvgPaymentTimeMobile');
const profileCancelledTradesMobile = document.getElementById('profileCancelledTradesMobile');
const profileDepositMobile = document.getElementById('profileDepositMobile');
const profileKycMobile = document.getElementById('profileKycMobile');

let currentSide = 'buy';
let currentAsset = 'USDT';
let offersMap = new Map();
let currentUser = null;
let activeDealOffer = null;
let dealSyncLock = false;

if (typeof window !== 'undefined') {
  window.__P2P_NATIVE_NAV__ = true;
}

function normalizeCurrentUserPayload(user) {
  if (!user || typeof user !== 'object') {
    return null;
  }
  var email = String(user.email || '').trim().toLowerCase();
  var username = String(user.username || '').trim();
  var id = String(user.id || user.userId || email || username || '').trim();
  if (!id) {
    return null;
  }
  return {
    ...user,
    id: id,
    userId: id,
    email: email,
    username: username
  };
}

function getCurrentUserId() {
  return currentUser ? String(currentUser.id || currentUser.userId || '').trim() : '';
}

// ── Global per-action locks — prevent duplicate API calls ──────────────────
var _loginInFlight     = false; // login button
var _orderActionLock   = false; // release / mark_paid / cancel / dispute
var _dealSubmitLock    = false; // deal confirm (create order)

let activeOrderId = null;
let pollingIntervalId = null;
let countdownIntervalId = null;
let orderStream = null;
let remainingSeconds = 0;
let activeOrderRole = '';
let activeOrderSnapshot = null;
let autoCancelRequested = false;
let chatUploading = false;
let messagePollTick = 0;
let mobileActiveTab = 'p2p';
let mobileOrderFilter = 'all';
const mobileOrdersCache = new Map();
let profileWalletBalance = 0;
let profileWalletLocked = 0;
let profileWalletSyncedAt = 0;
let paymentMethodsCache = [];
let paymentMethodFormState = {
  methodId: '',
  provider: 'UPI',
  category: 'UPI',
  qrCode: '',
  mode: 'create',
  backScreen: 'methods'
};
let profileEditAvatarDraft = '';
const chatMessageMap = new Map();
const chatMessageNodes = new Map();
const CHAT_IMAGE_MAX_SIZE = 3 * 1024 * 1024;
// Keep payload comfortably below default Express JSON body limit once base64 + JSON overhead is added.
const CHAT_MAX_PAYLOAD_BYTES = 60 * 1024;
const CHAT_IMAGE_ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const CHAT_PAYLOAD_PREFIX = '__P2P_MSG__:';
const P2P_THEME_STORAGE_KEY = 'p2p_theme_mode';
const KYC_REQUIRED_CODES = new Set(['KYC_REQUIRED', 'KYC_PENDING', 'KYC_REJECTED']);
const KYC_ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const KYC_MAX_FILE_SIZE = 6 * 1024 * 1024;
const KYC_TARGET_IMAGE_BYTES = 320 * 1024;
// SVG icon helpers for payment methods
var PM_ICONS = {
  UPI: '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#ff9900"/><path d="M10 22L14 10l4 8 4-12" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Bank Transfer(India)': '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#00b4d8"/><path d="M7 14h18M7 24h18M9 14v10M13 14v10M19 14v10M23 14v10M8 11l8-5 8 5z" stroke="#fff" stroke-width="1.5" fill="none" stroke-linejoin="round"/></svg>',
  Paytm: '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#00baf2"/><text x="16" y="20" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="sans-serif">Pay</text></svg>',
  PhonePe: '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#5f259f"/><path d="M12 8v16M12 8l8 5v3l-8-4" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="20" cy="10" r="2" fill="#fff"/></svg>',
  'Google Pay': '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#fff"/><text x="16" y="21" text-anchor="middle" font-size="14" font-weight="700" fill="#4285f4" font-family="sans-serif">G</text><rect x="9" y="14" width="3" height="6" rx="1" fill="#ea4335"/><rect x="20" y="12" width="3" height="8" rx="1" fill="#34a853"/><rect x="14.5" y="10" width="3" height="12" rx="1" fill="#fbbc05"/></svg>',
  'Bank Transfer(Union Bank)': '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#e8590c"/><path d="M7 14h18M7 24h18M9 14v10M13 14v10M19 14v10M23 14v10M8 11l8-5 8 5z" stroke="#fff" stroke-width="1.5" fill="none" stroke-linejoin="round"/></svg>',
  GoPay: '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#00aed6"/><circle cx="16" cy="16" r="8" fill="#fff" opacity="0.3"/><text x="16" y="20" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="sans-serif">Go</text></svg>',
  'Bank Jago': '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#ff5733"/><text x="16" y="21" text-anchor="middle" font-size="14" font-weight="800" fill="#fff" font-family="sans-serif">J</text></svg>',
  'A-Bank': '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#2d9d3a"/><circle cx="16" cy="14" r="5" fill="#fff" opacity="0.25"/><text x="16" y="21" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" font-family="sans-serif">A</text></svg>',
  NETELLER: '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#83c341"/><text x="16" y="21" text-anchor="middle" font-size="14" font-weight="800" fill="#fff" font-family="sans-serif">N</text></svg>',
  'Volet.com(Formerly Advcash)': '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#5cb85c"/><text x="16" y="20" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="sans-serif">volet</text></svg>',
  Cashapp: '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#00d632"/><text x="16" y="22" text-anchor="middle" font-size="16" font-weight="800" fill="#fff" font-family="sans-serif">$</text></svg>',
  'STC PAY': '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#6f42c1"/><text x="16" y="19" text-anchor="middle" font-size="8" font-weight="700" fill="#fff" font-family="sans-serif">stc</text><text x="16" y="25" text-anchor="middle" font-size="6" fill="#d4b8ff" font-family="sans-serif">pay</text></svg>',
  'Transfers with specific bank': '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#0d6efd"/><path d="M7 14h18M7 24h18M9 14v10M13 14v10M19 14v10M23 14v10M8 11l8-5 8 5z" stroke="#fff" stroke-width="1.5" fill="none" stroke-linejoin="round"/></svg>',
  'Cash Deposit to Bank': '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#198754"/><path d="M10 18h12M10 22h12M10 14h12M12 10h8" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M16 6v5M14 9l2 2 2-2" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Western Union': '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#ffdd00"/><text x="16" y="21" text-anchor="middle" font-size="11" font-weight="800" fill="#000" font-family="sans-serif">WU</text></svg>',
  'Faster Payment System': '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#fd7e14"/><path d="M14 8l-2 10h6l-2 10 8-14h-6l4-6z" fill="#fff"/></svg>',
  GeoPay: '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#e8590c"/><circle cx="16" cy="14" r="5" stroke="#fff" stroke-width="1.5" fill="none"/><path d="M16 19v5M12 26h8" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
  'Digital eRupee': '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="8" fill="#0d6efd"/><text x="16" y="22" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="sans-serif">₹</text></svg>'
};

const PAYMENT_METHOD_OPTIONS = [
  { key: 'UPI', label: 'UPI', category: 'UPI', chip: 'UP', color: '#ff9900' },
  { key: 'Bank Transfer(India)', label: 'Bank Transfer(India)', category: 'BANK', chip: 'BK', color: '#00b4d8' },
  { key: 'Paytm', label: 'Paytm', category: 'UPI', chip: 'PT', color: '#00baf2' },
  { key: 'PhonePe', label: 'PhonePe', category: 'UPI', chip: 'PP', color: '#5f259f' },
  { key: 'Google Pay', label: 'Google Pay', category: 'UPI', chip: 'GP', color: '#4285f4' },
  { key: 'Bank Transfer(Union Bank)', label: 'Bank Transfer(Union Bank)', category: 'BANK', chip: 'UB', color: '#e8590c' },
  { key: 'GoPay', label: 'GoPay', category: 'OTHER', chip: 'GO', color: '#00aed6' },
  { key: 'Bank Jago', label: 'Bank Jago', category: 'BANK', chip: 'BJ', color: '#ff5733' },
  { key: 'A-Bank', label: 'A-Bank', category: 'BANK', chip: 'AB', color: '#2d9d3a' },
  { key: 'NETELLER', label: 'NETELLER', category: 'OTHER', chip: 'NT', color: '#83c341' },
  { key: 'Volet.com(Formerly Advcash)', label: 'Volet.com(Formerly Advcash)', category: 'OTHER', chip: 'VL', color: '#5cb85c' },
  { key: 'Cashapp', label: 'Cashapp', category: 'OTHER', chip: 'CA', color: '#00d632' },
  { key: 'STC PAY', label: 'STC PAY', category: 'OTHER', chip: 'ST', color: '#6f42c1' },
  { key: 'Transfers with specific bank', label: 'Transfers with specific bank', category: 'BANK', chip: 'TB', color: '#0d6efd' },
  { key: 'Cash Deposit to Bank', label: 'Cash Deposit to Bank', category: 'BANK', chip: 'CD', color: '#198754' },
  { key: 'Western Union', label: 'Western Union', category: 'OTHER', chip: 'WU', color: '#ffdd00' },
  { key: 'Faster Payment System', label: 'Faster Payment System', category: 'OTHER', chip: 'FP', color: '#fd7e14' },
  { key: 'GeoPay', label: 'GeoPay', category: 'OTHER', chip: 'GE', color: '#e8590c' },
  { key: 'Digital eRupee', label: 'Digital eRupee', category: 'UPI', chip: '₹', color: '#0d6efd' }
];

function maskEmail(s) {
  var str = String(s || '');
  if (str.indexOf('@') === -1) return str;
  var parts = str.split('@');
  var local = parts[0];
  var masked = local.length > 3 ? local.slice(0, 3) + '***' : local.slice(0, 1) + '***';
  return masked + '@' + parts[1];
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatNumber(value) {
  return Number(value).toLocaleString('en-IN', {
    maximumFractionDigits: 6
  });
}

function formatTimer(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }
  return date.toLocaleString();
}

function getPostLoginRedirectPath() {
  try {
    const params = new URLSearchParams(window.location.search);
    const redirect = String(params.get('redirect') || '').trim();
    if (!redirect) {
      return '';
    }
    if (!redirect.startsWith('/') || redirect.startsWith('//')) {
      return '';
    }
    return redirect;
  } catch (_) {
    return '';
  }
}

function syncBodyInteractionState() {
  const hasBlockingLayer =
    document.body.classList.contains('p2p-nav-open') ||
    document.body.classList.contains('p2p-order-open') ||
    document.body.classList.contains('p2p-deal-open') ||
    document.body.classList.contains('p2p-kyc-open') ||
    document.body.classList.contains('p2p-cancel-open') ||
    Boolean(authModal && !authModal.classList.contains('hidden')) ||
    Boolean(kycModal && !kycModal.classList.contains('hidden')) ||
    Boolean(imagePreviewModal && !imagePreviewModal.classList.contains('hidden'));

  document.body.style.overflow = hasBlockingLayer ? 'hidden' : 'auto';
  document.body.style.pointerEvents = 'auto';
}

function normalizeStatusForUi(status) {
  var normalized = String(status || '').trim().toUpperCase();
  if (normalized === 'PENDING' || normalized === 'OPEN') {
    return 'CREATED';
  }
  // PAYMENT_SENT = buyer confirmed payment → treat as PAID in UI (seller needs to release)
  if (normalized === 'PAYMENT_SENT') {
    return 'PAID';
  }
  if (normalized === 'COMPLETED') {
    return 'RELEASED';
  }
  if (normalized === 'CANCELED') {
    return 'CANCELLED';
  }
  return normalized;
}

function statusLabel(status) {
  const map = {
    CREATED: 'Pending Payment',
    PAID: 'Payment Sent',
    RELEASED: 'Released',
    CANCELLED: 'Cancelled',
    DISPUTED: 'Disputed',
    EXPIRED: 'Expired'
  };
  return map[normalizeStatusForUi(status)] || status;
}

function statusClass(status) {
  const map = {
    CREATED: 'status-created',
    PAID: 'status-paid',
    RELEASED: 'status-released',
    CANCELLED: 'status-cancelled',
    DISPUTED: 'status-paid',
    EXPIRED: 'status-expired'
  };
  return map[normalizeStatusForUi(status)] || 'status-created';
}

function normalizeKycStatus(status) {
  const normalized = String(status || '')
    .trim()
    .toUpperCase();
  if (['VERIFIED', 'PENDING_REVIEW', 'REJECTED', 'NOT_SUBMITTED'].includes(normalized)) {
    return normalized;
  }
  return 'NOT_SUBMITTED';
}

function getKycStatusLabel(status) {
  const normalized = normalizeKycStatus(status);
  if (normalized === 'VERIFIED') {
    return 'Verified';
  }
  if (normalized === 'PENDING_REVIEW') {
    return 'Pending Review';
  }
  if (normalized === 'REJECTED') {
    return 'Rejected';
  }
  return 'Not Submitted';
}

function getKycRequirementMessage(status) {
  const normalized = normalizeKycStatus(status);
  if (normalized === 'PENDING_REVIEW') {
    return 'KYC is under review. Buy orders unlock after verification.';
  }
  if (normalized === 'REJECTED') {
    return 'Previous KYC failed face match. Re-upload Aadhaar + selfie.';
  }
  return 'KYC required: upload Aadhaar front and selfie with document to buy on P2P.';
}

function updateCurrentUserKyc(kyc) {
  if (!currentUser) {
    return;
  }
  const next = kyc && typeof kyc === 'object' ? kyc : {};
  const status = normalizeKycStatus(next.status || currentUser.kyc?.status);
  currentUser.kyc = {
    ...(currentUser.kyc && typeof currentUser.kyc === 'object' ? currentUser.kyc : {}),
    ...next,
    status,
    statusLabel: getKycStatusLabel(status),
    canBuy: status === 'VERIFIED'
  };
}

function isKycVerifiedForBuy() {
  return normalizeKycStatus(currentUser?.kyc?.status) === 'VERIFIED';
}

function isKycBlockedError(error) {
  const code = String(error?.code || '')
    .trim()
    .toUpperCase();
  return KYC_REQUIRED_CODES.has(code);
}

function setKycHint(text, type = '') {
  if (!kycHint) {
    return;
  }
  kycHint.textContent = text;
  kycHint.className = 'p2p-kyc-hint';
  if (type) {
    kycHint.classList.add(type);
  }
}

function setKycModalOpen(open, options = {}) {
  if (!kycModal) {
    return;
  }
  const shouldOpen = Boolean(open);
  kycModal.classList.toggle('hidden', !shouldOpen);
  kycModal.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  document.body.classList.toggle('p2p-kyc-open', shouldOpen);
  if (shouldOpen) {
    if (kycStatusText) {
      kycStatusText.textContent =
        String(options.statusText || '').trim() || getKycRequirementMessage(currentUser?.kyc?.status);
    }
    if (String(options.hintText || '').trim()) {
      setKycHint(String(options.hintText).trim(), options.hintType || '');
    } else {
      setKycHint(getKycRequirementMessage(currentUser?.kyc?.status));
    }
  }
  syncBodyInteractionState();
}

function showKycGate(options = {}) {
  const nextStatus = normalizeKycStatus(options.status || currentUser?.kyc?.status);
  updateCurrentUserKyc({ status: nextStatus });
  loadProfilePanel();
  const message = String(options.message || '').trim() || getKycRequirementMessage(nextStatus);
  setKycModalOpen(true, {
    statusText: message,
    hintText: message,
    hintType: nextStatus === 'REJECTED' ? 'error' : ''
  });
  refreshCurrentUserKyc();
}

function generateClientId() {
  return `tmp_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

function encodeChatPayload(payload) {
  return `${CHAT_PAYLOAD_PREFIX}${JSON.stringify(payload)}`;
}

function sanitizeImageUrl(url) {
  const source = String(url || '').trim();
  if (!source) {
    return '';
  }

  const isSafeData =
    /^data:image\/(png|jpe?g|webp);base64,[a-z0-9+/=\s]+$/i.test(source);
  const isSafeRemote = /^https?:\/\/[^\s]+$/i.test(source);
  const isSafePath = source.startsWith('/');

  if (isSafeData || isSafeRemote || isSafePath) {
    return source;
  }
  return '';
}

function estimateDataUrlBytes(dataUrl) {
  const text = String(dataUrl || '');
  const base64Part = text.includes(',') ? text.split(',')[1] : text;
  const normalized = base64Part.replace(/\s/g, '');
  return Math.floor((normalized.length * 3) / 4);
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to process image.'));
    };
    img.src = objectUrl;
  });
}

async function compressImageForChat(file) {
  const image = await loadImageFromFile(file);
  const maxDimension = 1280;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to initialize image processor.');
  }
  context.drawImage(image, 0, 0, width, height);

  const mimeType = 'image/webp';
  let quality = 0.9;
  let dataUrl = canvas.toDataURL(mimeType, quality);

  while (estimateDataUrlBytes(dataUrl) > CHAT_MAX_PAYLOAD_BYTES && quality > 0.4) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL(mimeType, quality);
  }

  if (estimateDataUrlBytes(dataUrl) > CHAT_MAX_PAYLOAD_BYTES) {
    throw new Error('Image is too large after compression. Try a smaller screenshot.');
  }

  return dataUrl;
}

async function compressImageForKyc(file) {
  if (!file) {
    throw new Error('Image file is required.');
  }
  if (!KYC_ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Only JPG, JPEG, PNG, and WEBP files are allowed.');
  }
  if (file.size > KYC_MAX_FILE_SIZE) {
    throw new Error('Image size must be 6MB or smaller.');
  }

  const image = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to initialize image processor.');
  }

  let maxDimension = 1440;
  let quality = 0.9;
  let dataUrl = '';

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    let workingQuality = quality;
    dataUrl = canvas.toDataURL('image/webp', workingQuality);
    while (estimateDataUrlBytes(dataUrl) > KYC_TARGET_IMAGE_BYTES && workingQuality > 0.4) {
      workingQuality -= 0.08;
      dataUrl = canvas.toDataURL('image/webp', workingQuality);
    }

    if (estimateDataUrlBytes(dataUrl) <= KYC_TARGET_IMAGE_BYTES) {
      return dataUrl;
    }

    maxDimension = Math.max(700, Math.round(maxDimension * 0.82));
    quality = Math.max(0.45, quality - 0.06);
  }

  throw new Error('Image is too large. Use a clear image with smaller dimensions.');
}

function decodeChatPayload(rawText) {
  const raw = String(rawText || '');
  if (!raw.startsWith(CHAT_PAYLOAD_PREFIX)) {
    return {
      messageType: 'text',
      text: raw,
      imageUrl: '',
      clientId: '',
      createdAt: null
    };
  }

  try {
    const parsed = JSON.parse(raw.slice(CHAT_PAYLOAD_PREFIX.length));
    const messageType = parsed?.messageType === 'image' ? 'image' : 'text';
    const text = String(parsed?.text || '').trim();
    const imageUrl = sanitizeImageUrl(parsed?.imageUrl || '');
    const clientId = String(parsed?.clientId || '').trim();
    const createdAt = parsed?.createdAt || null;
    return {
      messageType,
      text,
      imageUrl,
      clientId,
      createdAt
    };
  } catch (error) {
    return {
      messageType: 'text',
      text: raw,
      imageUrl: '',
      clientId: '',
      createdAt: null
    };
  }
}

function messageKeyFromMessage(message) {
  if (!message) {
    return '';
  }
  if (message.clientId) {
    return `client:${message.clientId}`;
  }
  if (message.id) {
    return `id:${message.id}`;
  }
  return `fallback:${message.sender || ''}:${message.createdAt || ''}:${message.text || ''}:${message.imageUrl || ''}`;
}

function toEpoch(value) {
  const epoch = new Date(value).getTime();
  return Number.isNaN(epoch) ? Date.now() : epoch;
}

function normalizeServerMessage(raw, optimistic = false) {
  const payload = decodeChatPayload(raw?.text || '');
  const explicitType = raw?.messageType === 'image' || raw?.messageType === 'text' ? raw.messageType : '';
  const explicitImageUrl = sanitizeImageUrl(raw?.imageUrl || '');
  const explicitClientId = String(raw?.clientId || '').trim();
  const explicitText = String(raw?.text || '').trim();
  const createdAtSource = raw?.createdAt || payload.createdAt || Date.now();
  const messageType = explicitType || payload.messageType;
  const imageUrl = explicitImageUrl || payload.imageUrl;
  const clientId = explicitClientId || payload.clientId;
  const isPayloadEncodedText = !explicitType && explicitText.startsWith(CHAT_PAYLOAD_PREFIX);
  const safeExplicitText = isPayloadEncodedText ? '' : explicitText;
  const text =
    messageType === 'image'
      ? safeExplicitText || payload.text || 'Payment screenshot'
      : explicitType
        ? safeExplicitText
        : payload.text;

  return {
    id: raw?.id || '',
    sender: String(raw?.sender || currentUser?.username || 'You'),
    createdAt: new Date(createdAtSource).toISOString(),
    messageType,
    text,
    imageUrl,
    clientId,
    pending: Boolean(optimistic),
    failed: false
  };
}

function resetChatMessages() {
  chatMessageMap.clear();
  chatMessageNodes.clear();
  if (chatMessages) {
    chatMessages.innerHTML = '';
  }
}

function setChatUploading(isUploading, label = '') {
  chatUploading = Boolean(isUploading);

  if (chatSendBtn) {
    chatSendBtn.disabled = chatUploading;
  }
  if (chatImageBtn) {
    chatImageBtn.disabled = chatUploading;
  }
  if (chatUploadState) {
    chatUploadState.classList.toggle('hidden', !chatUploading);
    chatUploadState.textContent = label || 'Uploading image...';
  }
}

function scrollChatToBottom(smooth = false) {
  if (!chatMessages) {
    return;
  }
  chatMessages.scrollTo({
    top: chatMessages.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

function getMessageCssClasses(message) {
  const buyerName = String(activeOrderSnapshot?.buyerUsername || '').trim();
  const sellerName = String(activeOrderSnapshot?.sellerUsername || activeOrderSnapshot?.advertiser || '').trim();
  const sender = String(message.sender || '').trim();
  const normalizedSender = sender.toLowerCase();
  const normalizedBuyer = buyerName.toLowerCase();
  const normalizedSeller = sellerName.toLowerCase();
  const normalizedCurrentUser = String(currentUser?.username || '')
    .trim()
    .toLowerCase();
  const senderIsBuyer = Boolean(normalizedBuyer && normalizedSender === normalizedBuyer);
  const senderIsSeller = Boolean(normalizedSeller && normalizedSender === normalizedSeller);
  const roleBasedSelf =
    (activeOrderRole === 'buyer' && senderIsBuyer) || (activeOrderRole === 'seller' && senderIsSeller);
  const isCurrentUser = Boolean(
    (normalizedCurrentUser && normalizedSender === normalizedCurrentUser) || roleBasedSelf
  );

  if (sender === 'System') {
    return 'chat-system';
  }

  const classes = [isCurrentUser ? 'chat-self' : 'chat-other'];

  if (senderIsBuyer) {
    classes.push('chat-buyer');
    return classes.join(' ');
  }
  if (senderIsSeller) {
    classes.push('chat-seller');
    return classes.join(' ');
  }
  if (isCurrentUser) {
    classes.push(activeOrderRole === 'buyer' ? 'chat-buyer' : 'chat-seller');
    return classes.join(' ');
  }

  classes.push('chat-seller');
  return classes.join(' ');
}

function getMessageInlineStyle(messageClass) {
  const cls = String(messageClass || '');
  if (cls.includes('chat-system')) {
    return 'background:linear-gradient(145deg,#1d2536 0%,#151b28 100%);border:1px solid rgba(130,170,255,0.45);color:#ffffff;';
  }
  if (cls.includes('chat-self')) {
    return 'background:linear-gradient(145deg,#4a3410 0%,#33260f 100%);border:1px solid rgba(247,167,35,0.82);color:#ffffff;';
  }
  return 'background:linear-gradient(145deg,#1c2331 0%,#161c27 100%);border:1px solid rgba(255,255,255,0.18);color:#ffffff;';
}

function buildMessageMarkup(message) {
  const messageClass = getMessageCssClasses(message);
  const bubbleStyle = getMessageInlineStyle(messageClass);
  const textContent = escapeHtml(message.text || (message.messageType === 'image' ? 'Payment screenshot' : ''));
  const imageMarkup = message.messageType === 'image' && message.imageUrl
    ? `<button class="chat-image-link" type="button" data-preview-src="${escapeHtml(message.imageUrl)}"><img class="chat-image" src="${escapeHtml(
        message.imageUrl
      )}" alt="Payment screenshot" loading="lazy" /></button>`
    : '';
  const pendingTag = message.pending ? '<span class="chat-meta-flag">Sending...</span>' : '';
  const failedTag = message.failed ? '<span class="chat-meta-flag failed">Failed</span>' : '';

  return `
    <article class="chat-item ${messageClass}${message.pending ? ' pending' : ''}${message.failed ? ' failed' : ''}" data-message-key="${escapeHtml(
      messageKeyFromMessage(message)
    )}" style="${bubbleStyle}">
      <p class="chat-sender" style="color:${messageClass.includes('chat-self') ? '#f6d98f' : '#cad2e2'};">${escapeHtml(message.sender)}</p>
      ${imageMarkup}
      ${
        textContent
          ? `<p class="chat-text" style="color:#ffffff;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;">${textContent}</p>`
          : ''
      }
      <p class="chat-time" style="color:#aab2c6;">${new Date(message.createdAt).toLocaleTimeString()} ${pendingTag} ${failedTag}</p>
    </article>
  `;
}

function updateMessageNode(node, message) {
  if (!node) {
    return null;
  }
  const wrapper = document.createElement('div');
  wrapper.innerHTML = buildMessageMarkup(message).trim();
  const next = wrapper.firstElementChild;
  if (!next) {
    return null;
  }
  node.replaceWith(next);
  return next;
}

function appendMessage(message, options = {}) {
  const normalized = normalizeServerMessage(message, Boolean(options.optimistic));
  const key = messageKeyFromMessage(normalized);
  if (!key || !chatMessages) {
    return false;
  }

  const existing = chatMessageMap.get(key);
  if (existing) {
    if ((existing.pending || existing.failed) && !normalized.pending) {
      const updated = { ...existing, ...normalized, pending: false, failed: false };
      chatMessageMap.set(key, updated);
      const node = chatMessageNodes.get(key);
      if (node) {
        const nextNode = updateMessageNode(node, updated);
        if (nextNode) {
          chatMessageNodes.set(key, nextNode);
        }
      }
    }
    if (options.scroll) {
      scrollChatToBottom(Boolean(options.smooth));
    }
    return false;
  }

  const emptyNode = chatMessages.querySelector('.chat-empty');
  if (emptyNode) {
    emptyNode.remove();
  }

  chatMessageMap.set(key, normalized);
  const wrapper = document.createElement('div');
  wrapper.innerHTML = buildMessageMarkup(normalized).trim();
  const messageNode = wrapper.firstElementChild;
  if (!messageNode) {
    return false;
  }

  chatMessages.appendChild(messageNode);
  chatMessageNodes.set(key, messageNode);

  if (normalized.messageType === 'image') {
    const imageEl = messageNode.querySelector('.chat-image');
    if (imageEl && !imageEl.complete) {
      imageEl.addEventListener(
        'load',
        () => {
          scrollChatToBottom(false);
        },
        { once: true }
      );
    }
  }

  if (options.scroll !== false) {
    scrollChatToBottom(Boolean(options.smooth));
  }
  return true;
}

function renderMessages(messages = [], options = {}) {
  if (!chatMessages) {
    return;
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    if (chatMessageMap.size === 0) {
      chatMessages.innerHTML = '<p class="chat-empty">No messages yet.</p>';
    }
    return;
  }

  const sorted = messages
    .map((item) => normalizeServerMessage(item))
    .sort((a, b) => toEpoch(a.createdAt) - toEpoch(b.createdAt));

  let appendedCount = 0;
  sorted.forEach((message) => {
    const appended = appendMessage(message, { scroll: false });
    if (appended) {
      appendedCount += 1;
    }
  });

  if (appendedCount > 0 || options.forceScroll) {
    scrollChatToBottom(Boolean(options.smoothScroll));
  }
}

function isMobileViewport() {
  return window.matchMedia('(max-width: 768px)').matches;
}

function normalizeMobileTabName(value) {
  const normalized = String(value || '')
    .trim()
    .toLowerCase();
  if (['p2p', 'orders', 'ads', 'post', 'profile'].includes(normalized)) {
    return normalized;
  }
  return 'p2p';
}

function getMobileNavTabValue(link) {
  if (!link) {
    return 'p2p';
  }
  return link.dataset.mobileTab || link.dataset.mob || 'p2p';
}

function setMobileNavActive(tab) {
  if (!p2pMobileBottomNav) {
    return;
  }

  p2pMobileBottomNav.querySelectorAll('a[data-mobile-tab], a[data-mob]').forEach((link) => {
    const isActive = normalizeMobileTabName(getMobileNavTabValue(link)) === tab;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function getOrderBucketByStatus(status) {
  const normalized = normalizeStatusForUi(status);
  if (normalized === 'RELEASED') {
    return 'completed';
  }
  if (['CANCELLED', 'EXPIRED'].includes(normalized)) {
    return 'cancelled';
  }
  return 'all';
}

function isOngoingOrderStatus(status) {
  const normalized = normalizeStatusForUi(status);
  return normalized === 'CREATED' || normalized === 'PAID' || normalized === 'DISPUTED';
}

function storeOrderForMobile(order) {
  if (!order || !order.id) {
    return;
  }

  const previous = mobileOrdersCache.get(order.id) || {};
  const currentUserId = getCurrentUserId();
  const next = {
    ...previous,
    ...order,
    status: normalizeStatusForUi(order.status),
    paidAt:
      order.paidAt ||
      order.paymentMarkedAt ||
      order.paymentConfirmedAt ||
      order.markedPaidAt ||
      previous.paidAt ||
      '',
    releasedAt: order.releasedAt || order.completedAt || previous.releasedAt || '',
    updatedAt: order.updatedAt || order.createdAt || previous.updatedAt || new Date().toISOString(),
    createdAt: order.createdAt || previous.createdAt || new Date().toISOString(),
    participantsLabel: order.participantsLabel || previous.participantsLabel || '--',
    paymentMethod: order.paymentMethod || previous.paymentMethod || '--',
    isParticipant:
      typeof order.isParticipant === 'boolean'
        ? order.isParticipant
        : previous.isParticipant ||
          _ordBelongsToCurrentUser(order) ||
          Boolean(currentUserId && (order.buyerUserId === currentUserId || order.sellerUserId === currentUserId))
  };

  mobileOrdersCache.set(order.id, next);
}

function pruneMobileOrdersCache(maxAgeMs = 45 * 24 * 60 * 60 * 1000) {
  const threshold = Date.now() - maxAgeMs;
  for (const [orderId, order] of mobileOrdersCache.entries()) {
    const createdAtMs = new Date(order?.createdAt || 0).getTime();
    const updatedAtMs = new Date(order?.updatedAt || 0).getTime();
    const pivot = Math.max(createdAtMs || 0, updatedAtMs || 0);
    if (pivot > 0 && pivot < threshold) {
      mobileOrdersCache.delete(orderId);
    }
  }
}

function getAllCachedParticipantOrders() {
  return Array.from(mobileOrdersCache.values())
    .filter((order) => Boolean(order?.isParticipant))
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
}

function getMobileOrdersSnapshot() {
  return getAllCachedParticipantOrders().filter((order) => isOngoingOrderStatus(order.status));
}

function getProfileOrdersSnapshot() {
  var orders = getAllCachedParticipantOrders();
  if (orders.length) {
    return orders;
  }

  var merged = _ordMergeById(
    _loadOrdCache(),
    _ordLoadSavedSnapshots({ activeOnly: false })
  );

  return merged
    .filter(function(order) { return _ordBelongsToCurrentUser(order); })
    .sort(function(a, b) {
      return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime();
    });
}

function filteredMobileOrders() {
  return getMobileOrdersSnapshot();
}

function renderMobileOrdersList() {
  // Also refresh the mobile active-orders tab if it's open
  if (typeof renderMobileActiveOrders === 'function' && typeof _mobOrderTab !== 'undefined' && _mobOrderTab === 'active') {
    renderMobileActiveOrders();
  }
  if (!mobileOrdersList) {
    return;
  }

  const orders = filteredMobileOrders();
  if (!orders.length) {
    mobileOrdersList.innerHTML = '<p class="empty-row">No ongoing orders.</p>';
    return;
  }

  mobileOrdersList.innerHTML = orders
    .map((order) => {
      return `
        <article class="mobile-order-card">
          <div class="mobile-order-head">
            <p class="mobile-order-ref">${escapeHtml(order.reference || order.id)}</p>
            <span class="status-pill ${statusClass(order.status)}">${statusLabel(order.status)}</span>
          </div>
          <div class="mobile-order-grid">
            <p>Type<strong>${escapeHtml(getOrderDisplaySide(order))} ${escapeHtml(order.asset || '')}</strong></p>
            <p>Amount<strong>₹${formatNumber(order.amountInr || 0)}</strong></p>
            <p>Price<strong>₹${formatNumber(order.price || 0)}</strong></p>
            <p>Payment<strong>${escapeHtml(order.paymentMethod || '--')}</strong></p>
          </div>
          <div class="mobile-order-actions">
            <button type="button" class="secondary-btn open-order-btn" data-order-id="${escapeHtml(order.id)}">Open</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function formatDurationLabel(ms) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return '--';
  }
  const mins = Math.round(ms / 60000);
  if (mins < 60) {
    return `${mins}m`;
  }
  const hours = (mins / 60).toFixed(1);
  return `${hours}h`;
}

function setNodeText(node, value) {
  if (node) {
    node.textContent = value;
  }
}

function applyProfileAvatarToNode(node, user, fallbackText) {
  if (!node) {
    return;
  }
  const avatarUrl = String(user?.avatar || '').trim();
  const initial = String(fallbackText || 'U').trim().slice(0, 1).toUpperCase() || 'U';
  if (avatarUrl) {
    node.classList.add('has-image');
    node.style.backgroundImage = 'url("' + avatarUrl.replace(/"/g, '%22') + '")';
    node.textContent = initial;
    node.setAttribute('aria-label', 'Profile photo');
  } else {
    node.classList.remove('has-image');
    node.style.backgroundImage = '';
    node.textContent = initial;
    node.removeAttribute('aria-label');
  }
}

function formatSignupTimeLabel(value) {
  const date = new Date(value || 0);
  if (Number.isNaN(date.getTime())) {
    return 'Signup Time: --';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `Signup Time: ${year}/${month}/${day}`;
}

function setAdCreateMeta(text, type = '') {
  if (!adCreateMeta) {
    return;
  }
  adCreateMeta.textContent = text;
  adCreateMeta.className = 'ad-create-meta';
  if (type) {
    adCreateMeta.classList.add(type);
  }
}

function renderMyAds(offers = []) {
  if (!myAdsList) return;
  if (!offers.length) {
    myAdsList.innerHTML = '<p class="empty-row">No ads posted yet.</p>';
    return;
  }
  myAdsList.innerHTML = offers.map((offer) => {
    const adType = String(offer.adType || (offer.side === 'buy' ? 'sell' : 'buy')).toUpperCase();
    const payments = Array.isArray(offer.payments) ? offer.payments.join(', ') : '--';
    const isPaused = offer.status === 'PAUSED';
    const statusLabel = isPaused
      ? '<span class="my-ad-status paused">Paused</span>'
      : '<span class="my-ad-status active">Active</span>';
    return `
      <article class="my-ad-card" data-offer-id="${offer.id}">
        <div class="my-ad-top">
          <div>
            <span class="my-ad-type ${offer.side === 'buy' ? 'ad-buy' : 'ad-sell'}">${adType}</span>
            <strong class="my-ad-asset">${escapeHtml(offer.asset || 'USDT')}</strong>
          </div>
          ${statusLabel}
        </div>
        <div class="my-ad-price">₹${formatNumber(offer.price || 0)} <span class="my-ad-cur">INR</span></div>
        <div class="my-ad-row"><span>Available</span><span>${formatNumber(offer.available || offer.availableAmount || 0)} ${escapeHtml(offer.asset || 'USDT')}</span></div>
        <div class="my-ad-row"><span>Limits</span><span>₹${formatNumber(offer.minLimit || 0)} ~ ₹${formatNumber(offer.maxLimit || 0)}</span></div>
        <div class="my-ad-row"><span>Payment</span><span>${escapeHtml(payments)}</span></div>
        <div class="my-ad-actions">
          <button class="my-ad-btn my-ad-edit" onclick="openEditAdModal('${offer.id}')">Edit</button>
          <button class="my-ad-btn my-ad-pause" onclick="togglePauseAd('${offer.id}','${isPaused ? 'ACTIVE' : 'PAUSED'}')">${isPaused ? 'Resume' : 'Pause'}</button>
          <button class="my-ad-btn my-ad-delete" onclick="deleteMyAd('${offer.id}')">Delete</button>
        </div>
      </article>
    `;
  }).join('');
}

async function togglePauseAd(offerId, newStatus) {
  try {
    const res = await fetch(`/api/p2p/offers/${offerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (!res.ok) { alert(data.message || 'Failed to update ad.'); return; }
    await loadMyAds();
  } catch (e) { alert('Network error.'); }
}

async function deleteMyAd(offerId) {
  if (!confirm('Delete this ad? This cannot be undone.')) return;
  try {
    const res = await fetch(`/api/p2p/offers/${offerId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { alert(data.message || 'Failed to delete ad.'); return; }
    await loadMyAds();
  } catch (e) { alert('Network error.'); }
}

function openEditAdModal(offerId) {
  var offer = null;
  // find from DOM
  var card = document.querySelector(`.my-ad-card[data-offer-id="${offerId}"]`);
  // Show edit modal
  var existing = document.getElementById('editAdModal');
  if (existing) existing.remove();
  var modal = document.createElement('div');
  modal.id = 'editAdModal';
  modal.className = 'edit-ad-modal-overlay';
  modal.innerHTML = `
    <div class="edit-ad-modal">
      <div class="edit-ad-head">
        <h3>Edit Ad</h3>
        <button onclick="document.getElementById('editAdModal').remove()" class="edit-ad-close">✕</button>
      </div>
      <div class="edit-ad-body">
        <label class="edit-ad-label">Price (INR)</label>
        <input id="eadPrice" type="number" class="edit-ad-input" placeholder="Enter price"/>
        <label class="edit-ad-label">Min Limit (INR)</label>
        <input id="eadMin" type="number" class="edit-ad-input" placeholder="Min limit"/>
        <label class="edit-ad-label">Max Limit (INR)</label>
        <input id="eadMax" type="number" class="edit-ad-input" placeholder="Max limit"/>
        <label class="edit-ad-label">Payment Methods (comma separated)</label>
        <input id="eadPayments" type="text" class="edit-ad-input" placeholder="UPI, Bank Transfer"/>
        <label class="edit-ad-label">Remark (optional)</label>
        <input id="eadRemark" type="text" class="edit-ad-input" placeholder="Note for buyers"/>
      </div>
      <button class="mob-kyc-fp-btn" style="background:linear-gradient(96deg,#00c2b2,#0099a8);margin:0 1rem 1rem;" onclick="submitEditAd('${offerId}')">Save Changes</button>
    </div>
  `;
  document.body.appendChild(modal);
}

async function submitEditAd(offerId) {
  const price = Number(document.getElementById('eadPrice')?.value);
  const minLimit = Number(document.getElementById('eadMin')?.value);
  const maxLimit = Number(document.getElementById('eadMax')?.value);
  const paymentsRaw = document.getElementById('eadPayments')?.value || '';
  const remark = document.getElementById('eadRemark')?.value || '';
  const payments = paymentsRaw.split(',').map(p => p.trim()).filter(Boolean);
  const body = {};
  if (price) body.price = price;
  if (minLimit) body.minLimit = minLimit;
  if (maxLimit) body.maxLimit = maxLimit;
  if (payments.length) body.payments = payments;
  if (remark) body.remark = remark;
  try {
    const res = await fetch(`/api/p2p/offers/${offerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) { alert(data.message || 'Update failed.'); return; }
    document.getElementById('editAdModal')?.remove();
    await loadMyAds();
  } catch (e) { alert('Network error.'); }
}

async function loadMyAds() {
  if (!myAdsList) return;
  if (!currentUser) {
    myAdsList.innerHTML = '<p class="empty-row">Login required to view your ads.</p>';
    return;
  }
  console.log('[loadMyAds] fetching /api/p2p/my-ads');
  var _adsAbort = new AbortController();
  var _adsTimer = setTimeout(function() { _adsAbort.abort(); }, 12000);
  try {
    const res = await fetch('/api/p2p/my-ads', { credentials: 'include', signal: _adsAbort.signal });
    clearTimeout(_adsTimer);
    console.log('[loadMyAds] response', res.status);
    const data = await res.json().catch(() => ({ offers: [] }));
    const myOffers = Array.isArray(data.offers) ? data.offers.sort((a, b) => Number(b.price || 0) - Number(a.price || 0)) : [];
    console.log('[loadMyAds] rendering', myOffers.length, 'ads');
    renderMyAds(myOffers);
  } catch (error) {
    clearTimeout(_adsTimer);
    console.warn('[loadMyAds] error:', error && error.message);
    myAdsList.innerHTML = '<p class="empty-row">Unable to load your ads. <a href="#" onclick="loadMyAds();return false;" style="color:#00d4d4;">Retry</a></p>';
  }
}

async function handleAdCreate(event) {
  event.preventDefault();
  if (!currentUser) {
    requireLoginNotice();
    return;
  }

  const payload = {
    adType: String(adTypeInput?.value || '').trim().toLowerCase(),
    asset: String(adAssetInput?.value || '').trim().toUpperCase(),
    price: Number(adPriceInput?.value || 0),
    available: Number(adAvailableInput?.value || 0),
    minLimit: Number(adMinLimitInput?.value || 0),
    maxLimit: Number(adMaxLimitInput?.value || 0),
    payments: String(adPaymentsInput?.value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  };

  if (!payload.payments.length) {
    setAdCreateMeta('Add at least one payment method.', 'error');
    return;
  }

  if (adCreateBtn) {
    adCreateBtn.disabled = true;
    adCreateBtn.textContent = 'Posting...';
  }

  try {
    const response = await fetch('/api/p2p/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Unable to post ad.');
    }

    setAdCreateMeta('Ad posted successfully.', 'success');
    adCreateForm?.reset();
    await loadOffers();
    await loadMyAds();
  } catch (error) {
    setAdCreateMeta(error.message, 'error');
  } finally {
    if (adCreateBtn) {
      adCreateBtn.disabled = false;
      adCreateBtn.textContent = 'Post Ad';
    }
  }
}

function syncMobProfile() {
  var s = document.getElementById('mobProfileScreen');
  if (!s) return;
  var el;
  el = s.querySelector('.mob-profile-avatar');
  if (el) el.textContent = profileAvatar ? profileAvatar.textContent : ((currentUser && currentUser.username ? currentUser.username[0].toUpperCase() : 'U'));
  el = s.querySelector('.mob-profile-name');
  if (el) el.textContent = currentUser ? (currentUser.username || 'P2P User') : 'Guest';
  el = s.querySelector('.mob-profile-since');
  if (el) {
    var d = currentUser && currentUser.createdAt ? new Date(currentUser.createdAt) : null;
    el.textContent = 'Signup Time: ' + (d && !isNaN(d) ? d.toISOString().slice(0,10).replace(/-/g,'/') : '\u2014');
  }
  // Email chip
  var emailChip = s.querySelector('#profileEmailChip') || s.querySelector('.mob-verify-chip');
  if (emailChip) {
    var isEmailVerified = currentUser && currentUser.emailVerified;
    emailChip.textContent = isEmailVerified ? '\u2713 Email' : 'Verify Email';
    emailChip.style.cssText = isEmailVerified
      ? 'background:rgba(22,199,132,.15);border-color:rgba(22,199,132,.4);color:#16c784;cursor:default;'
      : 'background:rgba(240,185,11,.1);border-color:rgba(240,185,11,.3);color:#f0b90b;cursor:pointer;';
  }
  var chips = s.querySelectorAll('.mob-verify-chip');
  if (chips[2]) {
    var ks = normalizeKycStatus(currentUser && currentUser.kyc && currentUser.kyc.status);
    chips[2].textContent = ks === 'VERIFIED' ? '\u2713 Identity' : 'Identity';
    chips[2].style.cssText = ks === 'VERIFIED' ? 'background:rgba(22,199,132,.15);border-color:rgba(22,199,132,.4);color:#16c784;' : '';
  }
  var sg = s.querySelector('.mob-stats-grid');
  if (sg) {
    var st = sg.querySelectorAll('strong');
    if (st[0] && profileCompletedOrders30d) st[0].textContent = profileCompletedOrders30d.textContent;
    if (st[1] && profileCompletionRate30d) st[1].textContent = profileCompletionRate30d.textContent;
    if (st[2] && profileCompletedOrders30d) st[2].textContent = profileCompletedOrders30d.textContent;
    if (st[3] && profileAvgReleaseTime) st[3].textContent = profileAvgReleaseTime.textContent;
  }
  // Rating row
  var ratingRow = document.getElementById('profileRatingRow');
  var avgStarsVal = document.getElementById('profileAvgStarsVal');
  var ratingCountEl = document.getElementById('profileRatingCount');
  if (ratingRow && currentUser && currentUser._rep) {
    var rep = currentUser._rep;
    if (rep.avgStars !== null && rep.avgStars !== undefined) {
      ratingRow.style.display = 'block';
      if (avgStarsVal) avgStarsVal.textContent = Number(rep.avgStars).toFixed(1);
      if (ratingCountEl) ratingCountEl.textContent = '(' + (rep.ratingCount || 0) + ' ratings)';
    }
  }
}

// ── Email verification (p2p.html) ─────────────────────────────────
window.openEmailVerifyModal = function() {
  var modal = document.getElementById('emailVerifyModal');
  if (!modal) return;
  if (currentUser && currentUser.emailVerified) return;
  // Reset state
  document.getElementById('emailOtpInputWrap').style.display = 'none';
  document.getElementById('emailVerifySendBtn').style.display = '';
  document.getElementById('emailVerifyConfirmBtn').style.display = 'none';
  var errEl = document.getElementById('emailOtpError');
  if (errEl) errEl.style.display = 'none';
  var desc = document.getElementById('emailVerifyDesc');
  if (desc) desc.textContent = 'We\'ll send a 6-digit code to: ' + (currentUser && currentUser.email ? currentUser.email : 'your email');
  modal.style.display = 'flex';
};

window.closeEmailVerifyModal = function() {
  var modal = document.getElementById('emailVerifyModal');
  if (modal) modal.style.display = 'none';
};

window.sendEmailOtp = async function() {
  var btn = document.getElementById('emailVerifySendBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
  try {
    var res = await fetch('/api/p2p/verify-email/send', { method: 'POST', credentials: 'include' });
    var data = await res.json().catch(function() { return {}; });
    if (res.ok) {
      document.getElementById('emailOtpInputWrap').style.display = 'block';
      document.getElementById('emailVerifyConfirmBtn').style.display = '';
      if (btn) btn.style.display = 'none';
      var desc = document.getElementById('emailVerifyDesc');
      if (desc) desc.textContent = 'Enter the 6-digit code sent to your email.';
    } else {
      if (btn) { btn.disabled = false; btn.textContent = 'Send Code'; }
      var errEl = document.getElementById('emailOtpError');
      if (errEl) { errEl.textContent = data.message || 'Failed. Try again.'; errEl.style.display = 'block'; }
    }
  } catch (e) {
    if (btn) { btn.disabled = false; btn.textContent = 'Send Code'; }
  }
};

window.confirmEmailOtp = async function() {
  var otp = (document.getElementById('emailOtpInput') || {}).value || '';
  var errEl = document.getElementById('emailOtpError');
  if (!otp || otp.length < 6) {
    if (errEl) { errEl.textContent = 'Enter the 6-digit code.'; errEl.style.display = 'block'; }
    return;
  }
  var btn = document.getElementById('emailVerifyConfirmBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Verifying...'; }
  try {
    var res = await fetch('/api/p2p/verify-email/confirm', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp: otp })
    });
    var data = await res.json().catch(function() { return {}; });
    if (res.ok) {
      window.closeEmailVerifyModal();
      if (currentUser) currentUser.emailVerified = true;
      syncMobProfile();
      if (typeof showToast === 'function') showToast('Email verified!');
    } else {
      if (errEl) { errEl.textContent = data.message || 'Wrong code. Try again.'; errEl.style.display = 'block'; }
      if (btn) { btn.disabled = false; btn.textContent = 'Verify'; }
    }
  } catch (e) {
    if (btn) { btn.disabled = false; btn.textContent = 'Verify'; }
  }
};

async function loadProfilePanel(options = {}) {
  if (!profileSection && !document.getElementById('mobProfileScreen')) {
    return;
  }

  const setIdentityTag = (label, verified = false) => {
    [profileIdentityTag, profileIdentityTagMobile].forEach((node) => {
      if (!node) {
        return;
      }
      node.textContent = label;
      node.classList.toggle('verified', Boolean(verified));
    });
  };

  const readTimestampMs = (order, keys) => {
    for (const key of keys) {
      const value = order?.[key];
      const epoch = new Date(value || 0).getTime();
      if (Number.isFinite(epoch) && epoch > 0) {
        return epoch;
      }
    }
    return 0;
  };

  if (!currentUser) {
    profileWalletBalance = 0;
    profileWalletLocked = 0;
    profileWalletSyncedAt = 0;
    mobileOrdersCache.clear();
    applyProfileAvatarToNode(profileAvatar, null, 'U');
    applyProfileAvatarToNode(profileAvatarMobile, null, 'U');
    setNodeText(profileName, 'Guest User');
    setNodeText(profileNameMobile, 'Guest User');
    setNodeText(profileEmail, 'Login required');
    setNodeText(profileSignupTimeMobile, 'Signup Time: --');
    setIdentityTag('Identity Not Submitted', false);
    setNodeText(profileKyc, 'Not Submitted');
    setNodeText(profileKycMobile, 'Not Submitted');
    setNodeText(profileSecurity, 'Basic');
    setNodeText(profileTotalOrders, '0');
    setNodeText(profileTotalTradesMobile, '0');
    setNodeText(profileCompletionRate, '0%');
    setNodeText(profileCompletionRate30d, '0%');
    setNodeText(profileCompletionRateMobile, '0%');
    setNodeText(profileDeposit, '₹0');
    setNodeText(profileDepositMobile, '₹0');
    setNodeText(profileCompletedOrders, '0');
    setNodeText(profileCompletedOrders30d, '0');
    setNodeText(profileThirtyDayTradesMobile, '0');
    setNodeText(profileCancelledOrders, '0');
    setNodeText(profileCancelledTradesMobile, '0');
    setNodeText(profileAvgReleaseTime, '--');
    setNodeText(profileAvgReleaseTimeMobile, '--');
    setNodeText(profileAvgPaymentTime, '--');
    setNodeText(profileAvgPaymentTimeMobile, '--');
    setNodeText(profileMeta, 'Login to view profile analytics.');
    return;
  }

  const initial = String(currentUser.username || currentUser.email || 'U')
    .trim()
    .slice(0, 1)
    .toUpperCase();

  applyProfileAvatarToNode(profileAvatar, currentUser, initial || 'U');
  applyProfileAvatarToNode(profileAvatarMobile, currentUser, initial || 'U');
  setNodeText(profileName, currentUser.username || 'P2P User');
  setNodeText(profileNameMobile, currentUser.username || 'P2P User');
  setNodeText(profileEmail, currentUser.email || '--');
  setNodeText(profileSignupTimeMobile, formatSignupTimeLabel(currentUser.createdAt));
  const currentKycStatus = normalizeKycStatus(currentUser?.kyc?.status);
  const isKycVerified = currentKycStatus === 'VERIFIED';
  setIdentityTag(isKycVerified ? 'Identity Verified' : `Identity ${getKycStatusLabel(currentKycStatus)}`, isKycVerified);
  setNodeText(profileKyc, getKycStatusLabel(currentKycStatus));
  setNodeText(profileKycMobile, getKycStatusLabel(currentKycStatus));
  // Update KYC badge in profile menu
  var kycBadge = document.getElementById('kycStatusBadge');
  if (kycBadge) {
    if (currentKycStatus === 'VERIFIED') {
      kycBadge.textContent = 'Verified';
      kycBadge.style.cssText = 'font-size:0.62rem;font-weight:700;padding:2px 7px;border-radius:999px;background:rgba(22,199,132,0.15);border:1px solid rgba(22,199,132,0.35);color:#16c784;margin-left:6px;';
    } else if (currentKycStatus === 'PENDING_REVIEW') {
      kycBadge.textContent = 'Under Review';
      kycBadge.style.cssText = 'font-size:0.62rem;font-weight:700;padding:2px 7px;border-radius:999px;background:rgba(240,185,11,0.12);border:1px solid rgba(240,185,11,0.3);color:#f0b90b;margin-left:6px;';
    } else if (currentKycStatus === 'REJECTED') {
      kycBadge.textContent = 'Rejected';
      kycBadge.style.cssText = 'font-size:0.62rem;font-weight:700;padding:2px 7px;border-radius:999px;background:rgba(246,70,93,0.15);border:1px solid rgba(246,70,93,0.3);color:#f6465d;margin-left:6px;cursor:pointer;';
      // Show rejection reason screen automatically once
      var rejReason = currentUser?.kyc?.rejectionReason || '';
      var rejScreen = document.getElementById('kycRejectedScreen');
      var rejReasonBox = document.getElementById('kycRejectionReasonBox');
      var rejReasonText = document.getElementById('kycRejectionReasonText');
      if (rejScreen && rejReasonText) {
        rejReasonText.textContent = rejReason || 'No specific reason provided.';
        if (rejReasonBox) rejReasonBox.style.display = rejReason ? '' : 'none';
      }
      // Make badge clickable to show rejection screen
      kycBadge.onclick = function() { if (rejScreen) rejScreen.style.display = ''; };
    } else {
      kycBadge.textContent = 'Not Done';
      kycBadge.style.cssText = 'font-size:0.62rem;font-weight:700;padding:2px 7px;border-radius:999px;background:rgba(246,70,93,0.15);border:1px solid rgba(246,70,93,0.3);color:#f6465d;margin-left:6px;';
    }
  }
  setNodeText(profileSecurity, currentKycStatus === 'VERIFIED' ? 'KYC + Email Protected' : 'KYC Required');

  const shouldRefreshWallet =
    Boolean(options.refreshWallet) || Date.now() - profileWalletSyncedAt > 30 * 1000;

  if (shouldRefreshWallet) {
    try {
      const response = await fetch('/api/p2p/wallet');
      const data = await response.json();
      if (response.ok && data.wallet) {
        profileWalletBalance = Number(data.wallet.balance || 0);
        profileWalletLocked = Number(data.wallet.lockedBalance || 0);
        profileWalletSyncedAt = Date.now();
      }
    } catch (error) {
      // Wallet panel remains with previous values.
    }
  }

  const nowMs = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const orders = getProfileOrdersSnapshot();
  const orders30d = orders.filter((order) => {
    const createdMs = readTimestampMs(order, ['createdAt']);
    return createdMs > 0 && createdMs >= nowMs - thirtyDaysMs;
  });

  const completedOrdersAll = orders.filter((order) => normalizeStatusForUi(order.status) === 'RELEASED');
  const completedOrders30d = orders30d.filter((order) => normalizeStatusForUi(order.status) === 'RELEASED');
  const cancelledOrdersAll = orders.filter((order) =>
    ['CANCELLED', 'EXPIRED'].includes(normalizeStatusForUi(order.status))
  );
  const cancelledOrders30d = orders30d.filter((order) =>
    ['CANCELLED', 'EXPIRED'].includes(normalizeStatusForUi(order.status))
  );
  const totalOrdersAll = orders.length;
  const totalOrders30d = orders30d.length;
  const completionRateValueAll = totalOrdersAll ? (completedOrdersAll.length / totalOrdersAll) * 100 : 0;
  const completionRateValue30d = totalOrders30d ? (completedOrders30d.length / totalOrders30d) * 100 : 0;

  const releaseDurations = completedOrdersAll
    .map((order) => {
      const createdAtMs = readTimestampMs(order, ['createdAt']);
      const releasedAtMs = readTimestampMs(order, ['releasedAt', 'completedAt', 'updatedAt']);
      if (releasedAtMs > createdAtMs) {
        return releasedAtMs - createdAtMs;
      }
      return 0;
    })
    .filter((value) => Number.isFinite(value) && value > 0);
  const avgReleaseMs =
    releaseDurations.length > 0
      ? releaseDurations.reduce((sum, value) => sum + value, 0) / releaseDurations.length
      : 0;

  const paymentDurations = orders
    .map((order) => {
      const createdAtMs = readTimestampMs(order, ['createdAt']);
      if (!createdAtMs) {
        return 0;
      }

      const paidAtMs = readTimestampMs(order, [
        'paidAt',
        'paymentMarkedAt',
        'paymentConfirmedAt',
        'markedPaidAt',
        'buyerPaidAt',
        'updatedAt'
      ]);

      if (paidAtMs > createdAtMs) {
        return paidAtMs - createdAtMs;
      }
      return 0;
    })
    .filter((value) => Number.isFinite(value) && value > 0);

  const avgPaymentMs =
    paymentDurations.length > 0
      ? paymentDurations.reduce((sum, value) => sum + value, 0) / paymentDurations.length
      : 0;

  const walletLabel = `₹${formatNumber(profileWalletBalance + profileWalletLocked)}`;
  const avgReleaseLabel = formatDurationLabel(avgReleaseMs);
  const avgPaymentLabel = formatDurationLabel(avgPaymentMs);

  setNodeText(profileTotalOrders, String(totalOrdersAll));
  setNodeText(profileTotalTradesMobile, String(totalOrdersAll));
  setNodeText(profileCompletionRate, `${completionRateValueAll.toFixed(1)}%`);
  setNodeText(profileCompletionRate30d, `${completionRateValue30d.toFixed(1)}%`);
  setNodeText(profileCompletionRateMobile, `${completionRateValueAll.toFixed(1)}%`);
  setNodeText(profileDeposit, walletLabel);
  setNodeText(profileDepositMobile, walletLabel);
  setNodeText(profileCompletedOrders, String(completedOrdersAll.length));
  setNodeText(profileCompletedOrders30d, String(completedOrders30d.length));
  setNodeText(profileThirtyDayTradesMobile, String(totalOrders30d));
  setNodeText(profileCancelledOrders, String(cancelledOrdersAll.length));
  setNodeText(profileCancelledTradesMobile, String(cancelledOrdersAll.length));
  setNodeText(profileAvgReleaseTime, avgReleaseLabel);
  setNodeText(profileAvgReleaseTimeMobile, avgReleaseLabel);
  setNodeText(profileAvgPaymentTime, avgPaymentLabel);
  setNodeText(profileAvgPaymentTimeMobile, avgPaymentLabel);
  setNodeText(
    profileMeta,
    `All trades: ${totalOrdersAll} | 30D trades: ${totalOrders30d} | Cancelled: ${cancelledOrders30d.length} | Wallet: ${formatNumber(profileWalletBalance)}`
  );
}

function compressImageFileToDataUrl(file, options = {}) {
  const maxEdge = Math.max(320, Number(options.maxEdge || 720));
  const quality = Math.min(0.92, Math.max(0.5, Number(options.quality || 0.8)));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        let width = image.width;
        let height = image.height;
        if (width > maxEdge || height > maxEdge) {
          if (width >= height) {
            height = Math.round((height * maxEdge) / width);
            width = maxEdge;
          } else {
            width = Math.round((width * maxEdge) / height);
            height = maxEdge;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function closeProfileEditModal() {
  const modal = document.getElementById('profileEditModal');
  if (modal) {
    modal.remove();
  }
  profileEditAvatarDraft = '';
}

function renderProfileEditAvatarPreview(avatarUrl) {
  const preview = document.getElementById('profileEditAvatarPreview');
  if (!preview) {
    return;
  }
  const initial = String((document.getElementById('profileEditNameInput') || {}).value || currentUser?.username || currentUser?.email || 'U')
    .trim()
    .slice(0, 1)
    .toUpperCase() || 'U';
  if (avatarUrl) {
    preview.classList.add('has-image');
    preview.style.backgroundImage = 'url("' + String(avatarUrl).replace(/"/g, '%22') + '")';
    preview.textContent = initial;
  } else {
    preview.classList.remove('has-image');
    preview.style.backgroundImage = '';
    preview.textContent = initial;
  }
}

async function submitProfileEdit() {
  const nameInput = document.getElementById('profileEditNameInput');
  const saveBtn = document.getElementById('profileEditSaveBtn');
  const meta = document.getElementById('profileEditMeta');
  const nickname = String(nameInput?.value || '').trim();

  if (!nickname || nickname.length < 2) {
    if (meta) {
      meta.textContent = 'Enter at least 2 characters for your display name.';
      meta.style.color = '#f6465d';
    }
    return;
  }

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
  }

  try {
    const response = await fetch('/api/p2p/profile', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname,
        avatar: profileEditAvatarDraft || String(currentUser?.avatar || '').trim()
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Unable to update profile right now.');
    }

    const nextProfile = data.profile || {};
    currentUser = normalizeCurrentUserPayload({
      ...currentUser,
      username: nextProfile.username || nickname,
      avatar: nextProfile.avatar || profileEditAvatarDraft || '',
      createdAt: nextProfile.createdAt || currentUser?.createdAt || null
    });

    try {
      localStorage.setItem('_p2p_hint', JSON.stringify({
        id: getCurrentUserId(),
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role,
        avatar: currentUser.avatar || '',
        createdAt: currentUser.createdAt || null
      }));
    } catch (_) {}

    updateUserUi();
    closeProfileEditModal();
    showToast('Profile updated');
  } catch (error) {
    if (meta) {
      meta.textContent = error.message || 'Unable to update profile right now.';
      meta.style.color = '#f6465d';
    }
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Changes';
    }
  }
}

function openProfileEditModal() {
  if (!currentUser) {
    requireLoginNotice();
    return;
  }

  // Show edit screen
  var editScreen = document.getElementById('mobProfileEditScreen');
  var profileScreen = document.getElementById('mobProfileScreen');
  if (editScreen) {
    // Prefill
    var nicknameInput = document.getElementById('editNicknameInput');
    if (nicknameInput) nicknameInput.value = currentUser.nickname || currentUser.username || '';
    if (profileScreen) { profileScreen.classList.add('hidden'); profileScreen.style.display = 'none'; }
    editScreen.classList.remove('hidden');
    editScreen.style.setProperty('display', 'flex', 'important');
    editScreen.style.flexDirection = 'column';
  }
}

function saveProfileNickname() {
  var nicknameInput = document.getElementById('editNicknameInput');
  var msg = document.getElementById('editProfileMsg');
  var nickname = (nicknameInput && nicknameInput.value || '').trim();
  if (!nickname || nickname.length < 2) {
    if (msg) { msg.style.color = '#f6465d'; msg.textContent = 'Nickname must be at least 2 characters.'; }
    return;
  }
  if (msg) { msg.style.color = '#555'; msg.textContent = 'Saving...'; }
  fetch('/api/p2p/profile', {
    method: 'PUT', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname: nickname })
  }).then(function(r) { return r.json(); }).then(function(d) {
    if (d.ok || d.success || d.nickname) {
      if (msg) { msg.style.color = '#16c784'; msg.textContent = '✓ Nickname updated!'; }
      if (currentUser) currentUser.nickname = nickname;
      // Update displays
      var el;
      if ((el = document.getElementById('profileNameMobile'))) el.textContent = nickname;
      if ((el = document.getElementById('profileName'))) el.textContent = nickname;
      if ((el = document.getElementById('profileAvatarMobile'))) el.textContent = nickname.charAt(0).toUpperCase();
      if ((el = document.getElementById('profileAvatar'))) el.textContent = nickname.charAt(0).toUpperCase();
      setTimeout(function() {
        closeMobScreen('mobProfileEditScreen', 'mobProfileScreen');
      }, 800);
    } else {
      if (msg) { msg.style.color = '#f6465d'; msg.textContent = d.error || d.message || 'Failed to save.'; }
    }
  }).catch(function() {
    if (msg) { msg.style.color = '#f6465d'; msg.textContent = 'Network error.'; }
  });
}

function syncMobileTabFromHash(options = {}) {
  const tabFromHash = normalizeMobileTabName(String(window.location.hash || '').replace('#', ''));
  const resolvedTab = tabFromHash || 'p2p';
  mobileActiveTab = resolvedTab;
  document.body.dataset.mobileTab = resolvedTab;
  setMobileNavActive(resolvedTab);

  if (!isMobileViewport()) {
    return;
  }

  if (resolvedTab === 'orders') {
    _applyOrdersFocusState();
    renderMobileOrdersList();
    loadLiveOrders();
  } else if (resolvedTab === 'ads') {
    loadMyAds();
  } else if (resolvedTab === 'profile') {
    loadProfilePanel();
  } else if (options.refreshP2P !== false) {
    loadOffers();
  }
}

function setMobileTab(tab, options = {}) {
  const normalized = normalizeMobileTabName(tab);
  mobileActiveTab = normalized;
  document.body.dataset.mobileTab = normalized;
  setMobileNavActive(normalized);

  if (isMobileViewport()) {
    if (options.updateHash !== false) {
      const nextHash = normalized === 'p2p' ? '' : `#${normalized}`;
      if (`${window.location.hash}` !== nextHash) {
        history.replaceState(null, '', `${window.location.pathname}${nextHash}`);
      }
    }

    if (normalized === 'orders') {
      _applyOrdersFocusState();
      renderMobileOrdersList();
      loadLiveOrders();
    } else if (normalized === 'ads') {
      loadMyAds();
    } else if (normalized === 'profile') {
      loadProfilePanel();
    } else {
      loadOffers();
    }
  }
}

function setP2PNavOpen(open) {
  if (!p2pNavDrawer || !p2pNavOverlay || !p2pMenuToggle) {
    return;
  }

  const shouldOpen = Boolean(open);
  document.body.classList.toggle('p2p-nav-open', shouldOpen);
  p2pNavDrawer.classList.toggle('is-open', shouldOpen);
  p2pNavOverlay.classList.toggle('hidden', !shouldOpen);
  p2pNavDrawer.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  p2pNavOverlay.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  p2pMenuToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
  syncBodyInteractionState();
}

function setUserStatus(text, type = '') {
  if (!userStatus) {
    return;
  }
  userStatus.textContent = text;
  userStatus.className = 'user-status';
  if (type) {
    userStatus.classList.add(type);
  }
}

function setDealModalOpen(open) {
  if (!dealModal) {
    return;
  }

  if (open) {
    document.body.classList.add('p2p-deal-open');
    dealModal.classList.remove('hidden');
    dealModal.setAttribute('aria-hidden', 'false');
  } else {
    document.body.classList.remove('p2p-deal-open');
    dealModal.classList.add('hidden');
    dealModal.setAttribute('aria-hidden', 'true');
  }
  syncBodyInteractionState();
}

function setDealHint(text, type = '') {
  if (!dealHint) {
    return;
  }
  dealHint.textContent = text;
  dealHint.className = 'deal-hint';
  if (type) {
    dealHint.classList.add(type);
  }
}

function updateDealComputedFromPay() {
  if (!activeDealOffer || !dealPayAmount || !dealReceiveAmount) {
    return;
  }

  const price = Number(activeDealOffer.price || 0);
  const payAmount = Number(dealPayAmount.value || 0);
  if (!Number.isFinite(payAmount) || payAmount <= 0 || !Number.isFinite(price) || price <= 0) {
    dealReceiveAmount.value = '';
    return;
  }

  const receiveAmount = payAmount / price;
  dealSyncLock = true;
  dealReceiveAmount.value = receiveAmount.toFixed(6);
  dealSyncLock = false;
}

function updateDealComputedFromReceive() {
  if (!activeDealOffer || !dealPayAmount || !dealReceiveAmount) {
    return;
  }

  const price = Number(activeDealOffer.price || 0);
  const receiveAmount = Number(dealReceiveAmount.value || 0);
  if (!Number.isFinite(receiveAmount) || receiveAmount <= 0 || !Number.isFinite(price) || price <= 0) {
    dealPayAmount.value = '';
    return;
  }

  const payAmount = receiveAmount * price;
  dealSyncLock = true;
  dealPayAmount.value = payAmount.toFixed(2);
  dealSyncLock = false;
}

function refreshDealValidation() {
  if (!activeDealOffer || !dealPayAmount || !dealPaymentSelect) {
    return false;
  }

  const amountInr = Number(dealPayAmount.value || 0);
  const minLimit = Number(activeDealOffer.minLimit || 0);
  const maxLimit = Number(activeDealOffer.maxLimit || 0);
  const action = currentSide === 'sell' ? 'Sell' : 'Buy';

  if (!Number.isFinite(amountInr) || amountInr <= 0) {
    setDealHint('Enter INR amount first.');
    return false;
  }

  if (amountInr < minLimit || amountInr > maxLimit) {
    setDealHint(`Amount must be between ₹${formatNumber(minLimit)} and ₹${formatNumber(maxLimit)}.`, 'error');
    return false;
  }

  const paymentMethod = String(dealPaymentSelect.value || '').trim();
  if (!paymentMethod) {
    setDealHint('Select payment mode to continue.', 'error');
    return false;
  }

  setDealHint(`${action} ready: ₹${formatNumber(amountInr)} via ${paymentMethod}.`, 'success');
  return true;
}

function fillDealModal(offer) {
  if (!offer) {
    return;
  }

  activeDealOffer = offer;
  const action = currentSide === 'sell' ? 'Sell' : 'Buy';
  const avatarText = String(offer.advertiser || 'U').trim().slice(0, 1).toUpperCase() || 'U';

  if (dealAvatar) {
    dealAvatar.textContent = avatarText;
  }
  if (dealTitle) {
    dealTitle.textContent = offer.advertiser;
  }
  if (dealAdvertiserMeta) {
    dealAdvertiserMeta.textContent = `${offer.orders} Order(s) | ${offer.completionRate}%`;
  }
  if (dealAvailable) {
    dealAvailable.textContent = `${formatNumber(offer.available)} ${offer.asset}`;
  }
  if (dealLimits) {
    dealLimits.textContent = `₹${formatNumber(offer.minLimit)} - ₹${formatNumber(offer.maxLimit)}`;
  }
  if (dealDuration) {
    dealDuration.textContent = '15m';
  }
  if (dealPrice) {
    dealPrice.textContent = `${formatNumber(offer.price)} INR`;
  }
  if (dealConfirmBtn) {
    dealConfirmBtn.textContent = `${action} ${offer.asset}`;
    dealConfirmBtn.classList.toggle('is-sell', currentSide === 'sell');
  }

  const offerPayments = getOfferPayments(offer);
  if (dealPaymentSelect) {
    dealPaymentSelect.innerHTML = offerPayments
      .map((method) => `<option value="${escapeHtml(method)}">${escapeHtml(method)}</option>`)
      .join('');
  }

  if (dealPaymentPreview) {
    dealPaymentPreview.textContent = offerPayments[0] || '--';
  }

  const amountInput = Number(amountFilter?.value || 0);
  const defaultAmount = amountInput > 0 ? amountInput : Number(offer.minLimit || 0);
  if (dealPayAmount) {
    dealPayAmount.value = defaultAmount > 0 ? Number(defaultAmount).toFixed(2) : '';
  }

  updateDealComputedFromPay();
  refreshDealValidation();
  setDealModalOpen(true);
  dealPayAmount?.focus();
}

function closeDealModal() {
  setDealModalOpen(false);
  activeDealOffer = null;
  if (dealPayAmount) {
    dealPayAmount.value = '';
  }
  if (dealReceiveAmount) {
    dealReceiveAmount.value = '';
  }
}

function setKycFileMeta(metaEl, file, defaultText) {
  if (!metaEl) {
    return;
  }
  if (!file) {
    metaEl.textContent = defaultText;
    return;
  }
  metaEl.textContent = `${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB)`;
}

function closeKycModal() {
  setKycModalOpen(false);
}

async function refreshCurrentUserKyc() {
  if (!currentUser) {
    return;
  }

  try {
    const response = await fetch('/api/p2p/kyc/status');
    const data = await response.json();
    if (!response.ok || !data?.kyc) {
      return;
    }
    updateCurrentUserKyc(data.kyc);
    loadProfilePanel();
  } catch (_) {
    // Keep existing KYC state when status API is unavailable.
  }
}

async function submitKycForm(event) {
  event.preventDefault();

  if (!currentUser) {
    requireLoginNotice();
    return;
  }

  const aadhaarNumber = String(kycAadhaarInput?.value || '')
    .replace(/\D/g, '')
    .slice(0, 12);
  if (!/^\d{12}$/.test(aadhaarNumber)) {
    setKycHint('Enter a valid 12-digit Aadhaar number.', 'error');
    return;
  }

  const aadhaarFile = kycAadhaarFrontInput?.files?.[0] || null;
  const selfieFile = kycSelfieInput?.files?.[0] || null;
  if (!aadhaarFile || !selfieFile) {
    setKycHint('Upload Aadhaar front and selfie with document.', 'error');
    return;
  }
  if (!kycConsent?.checked) {
    setKycHint('Please accept consent to continue.', 'error');
    return;
  }

  if (kycSubmitBtn) {
    kycSubmitBtn.disabled = true;
    kycSubmitBtn.textContent = 'Verifying...';
  }

  try {
    setKycHint('Optimizing document images...', '');
    const aadhaarFrontImage = await compressImageForKyc(aadhaarFile);
    const selfieWithDocumentImage = await compressImageForKyc(selfieFile);

    setKycHint('Running AI face match verification...', '');
    const response = await fetch('/api/p2p/kyc/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aadhaarNumber,
        aadhaarFrontImage,
        selfieWithDocumentImage,
        consent: true
      })
    });
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Unable to submit KYC right now.');
      error.code = String(data.code || '').trim().toUpperCase();
      throw error;
    }

    updateCurrentUserKyc(data.kyc || {});
    updateUserUi();
    await loadProfilePanel();

    const nextStatus = normalizeKycStatus(data?.kyc?.status);
    const serverMessage = String(data.message || '').trim();
    if (kycStatusText) {
      kycStatusText.textContent = serverMessage || getKycRequirementMessage(nextStatus);
    }

    if (nextStatus === 'VERIFIED') {
      setKycHint(serverMessage || 'KYC verified. You can place P2P buy orders now.', 'success');
      closeKycModal();
      setUserStatus('KYC verified. P2P buy is now enabled.', 'user-online');
      return;
    }

    if (nextStatus === 'REJECTED') {
      setKycHint(serverMessage || 'Face match failed. Upload clearer Aadhaar and selfie.', 'error');
      return;
    }

    setKycHint(serverMessage || 'KYC submitted. Verification is pending review.', 'success');
  } catch (error) {
    setKycHint(error.message || 'Unable to submit KYC right now.', 'error');
  } finally {
    if (kycSubmitBtn) {
      kycSubmitBtn.disabled = false;
      kycSubmitBtn.textContent = 'Submit KYC';
    }
  }
}

function applyTheme(mode, persist = true) {
  const resolved = mode === 'light' ? 'light' : 'dark';
  document.body.classList.toggle('p2p-theme-dark', resolved === 'dark');
  document.body.classList.toggle('p2p-theme-light', resolved === 'light');

  if (themeToggleBtn) {
    themeToggleBtn.textContent = resolved === 'dark' ? 'Light' : 'Dark';
  }

  if (persist) {
    try {
      localStorage.setItem(P2P_THEME_STORAGE_KEY, resolved);
    } catch (error) {
      // Ignore storage errors.
    }
  }
}

function initTheme() {
  let storedTheme = 'dark';
  try {
    const saved = localStorage.getItem(P2P_THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      storedTheme = saved;
    }
  } catch (error) {
    storedTheme = 'dark';
  }

  applyTheme(storedTheme, false);
}

function setAuthModalOpen(open) {
  if (open) { window.location.href = '/auth'; return; }
  if (!authModal) {
    return;
  }

  if (open) {
    authModal.classList.remove('hidden');
    authModal.setAttribute('aria-hidden', 'false');
  } else {
    authModal.classList.add('hidden');
    authModal.setAttribute('aria-hidden', 'true');
  }
  syncBodyInteractionState();
}

function updateUserUi() {
  if (currentUser) {
    const kycLabel = getKycStatusLabel(currentUser?.kyc?.status);
    if (normalizeKycStatus(currentUser?.kyc?.status) === 'VERIFIED') {
      setUserStatus(`P2P account active | KYC ${kycLabel}`, 'user-online');
    } else {
      setUserStatus(`P2P account active | KYC ${kycLabel} (required for buy)`, 'user-error');
    }
    if (emailInput) {
      emailInput.value = currentUser.email;
    }
    if (passwordInput) {
      passwordInput.value = '';
    }
  } else {
    setUserStatus('Login required to place or join P2P orders.');
  }

  if (logoutBtn) {
    logoutBtn.style.display = currentUser ? 'inline-flex' : 'none';
  }

  if (!currentUser) {
    if (myAdsList) {
      myAdsList.innerHTML = '<p class="empty-row">Login required to view your ads.</p>';
    }
  }

  loadProfilePanel();
}

function setModalOpen(open) {
  if (!orderModal) {
    return;
  }

  if (open) {
    document.body.classList.add('p2p-order-open');
    orderModal.classList.remove('hidden');
    orderModal.setAttribute('aria-hidden', 'false');
  } else {
    document.body.classList.remove('p2p-order-open');
    orderModal.classList.add('hidden');
    orderModal.setAttribute('aria-hidden', 'true');
  }
  syncBodyInteractionState();
}

function setPaymentPanelOpen(open) {
  if (!paymentPanel) {
    return;
  }
  const shouldOpen = Boolean(open);
  paymentPanel.classList.toggle('hidden', !shouldOpen);
}

function setCancelModalOpen(open) {
  if (!cancelModal) {
    return;
  }
  const shouldOpen = Boolean(open);
  cancelModal.classList.toggle('hidden', !shouldOpen);
  cancelModal.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  document.body.classList.toggle('p2p-cancel-open', shouldOpen);
  if (!shouldOpen && cancelReasonForm) {
    cancelReasonForm.reset();
  }
  if (!shouldOpen && cancelNoPaymentCheck) {
    cancelNoPaymentCheck.checked = false;
  }
  refreshCancelConfirmState();
  syncBodyInteractionState();
}

function refreshCancelConfirmState() {
  if (!cancelConfirmBtn) {
    return;
  }

  const reasonSelected = Boolean(cancelReasonForm?.querySelector('input[name="cancelReason"]:checked'));
  const noPaymentConfirmed = Boolean(cancelNoPaymentCheck?.checked);
  cancelConfirmBtn.disabled = !(reasonSelected && noPaymentConfirmed);
}

function getOrderRole(order) {
  if (!order || !currentUser) {
    return '';
  }

  var currentUserId = getCurrentUserId();
  if (currentUserId && currentUserId === order.buyerUserId) {
    return 'buyer';
  }
  if (currentUserId && currentUserId === order.sellerUserId) {
    return 'seller';
  }
  if (currentUser.username && currentUser.username === order.buyerUsername) {
    return 'buyer';
  }
  if (currentUser.username && currentUser.username === order.sellerUsername) {
    return 'seller';
  }
  return '';
}

function getOrderDisplaySide(order) {
  var rawSide = String(order && order.side || '').trim().toUpperCase();
  if (!rawSide) {
    return 'BUY';
  }
  var role = getOrderRole(order);
  if (role === 'seller') {
    if (rawSide === 'BUY') return 'SELL';
    if (rawSide === 'SELL') return 'BUY';
  }
  return rawSide;
}

function resetOrderWatch() {
  if (pollingIntervalId) {
    clearInterval(pollingIntervalId);
    pollingIntervalId = null;
  }
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }
  if (orderStream) {
    orderStream.close();
    orderStream = null;
  }
}

function closeOrderModal() {
  setModalOpen(false);
  setPaymentPanelOpen(false);
  setCancelModalOpen(false);
  setImagePreviewOpen(false);
  activeOrderId = null;
  activeOrderRole = '';
  activeOrderSnapshot = null;
  autoCancelRequested = false;
  messagePollTick = 0;
  resetOrderWatch();
  resetChatMessages();
  setChatUploading(false);
  if (chatInput) {
    chatInput.value = '';
    chatInput.disabled = false;
  }
  if (chatImageInput) {
    chatImageInput.value = '';
  }
  if (chatState) {
    chatState.textContent = 'Waiting for messages...';
  }
}

async function loadCurrentUser() {
  // ── Optimistic hint: if user was logged in previously, show logged-in state
  //    instantly while the real fetch is in-flight — eliminates refresh flicker ──
  try {
    const hint = localStorage.getItem('_p2p_hint');
    if (hint) {
      const hintUser = normalizeCurrentUserPayload(JSON.parse(hint));
      if (hintUser) {
        currentUser = hintUser;
        updateUserUi(); // show logged-in UI immediately, no waiting
        // Show cached orders instantly — no network fetch yet to avoid aborting the confirmed fetch below
        var _hintCache = _loadOrdCache();
        if (_hintCache.length) { _ordRenderAll(_hintCache, true); } else { _ordShowSkeleton(); }
      }
    }
  } catch(_) {}

  let _networkErr = false; // true only on real network/parse failure
  try {
    const response = await fetch('/api/p2p/me', { credentials: 'include' });
    const data = await response.json();
    var normalizedUser = normalizeCurrentUserPayload(data.user);
    if (data.loggedIn && normalizedUser) {
      var _prevId = getCurrentUserId();
      if (_prevId !== normalizedUser.id) {
        _clearOrdersCache({ preserveSnapshots: true }); // keep per-order snapshots for instant reloads
      }
      currentUser = normalizedUser;
      updateCurrentUserKyc(currentUser.kyc || {});
      try { localStorage.setItem('_p2p_hint', JSON.stringify({ id: getCurrentUserId(), username: currentUser.username, email: currentUser.email, role: currentUser.role, avatar: currentUser.avatar || '', createdAt: currentUser.createdAt || null })); } catch(_) {}
      // Single call — fetchOrdersSafe shows cache instantly then fetches fresh
      fetchOrdersSafe();
      _startFallbackPoll(); // 15s fallback poll in case SSE is down
    } else {
      currentUser = null;
      try { localStorage.removeItem('_p2p_hint'); } catch(_) {}
      _clearOrdersCache({ preserveSnapshots: true });
      fetchOrdersSafe(); // session expired — replace stuck skeleton with login prompt
    }
  } catch (error) {
    // Network/parse error — keep optimistic hint state, schedule retry
    _networkErr = true;
  }
  updateUserUi();

  // Only retry when there was a genuine network/server error (not when server explicitly
  // said loggedIn:false). This prevents the logged-out→logged-in visual flicker on refresh.
  if (!currentUser && _networkErr) {
    setTimeout(async function() {
      try {
        const r = await fetch('/api/p2p/me', { credentials: 'include' });
        const d = await r.json();
        var retryUser = normalizeCurrentUserPayload(d.user);
        if (d.loggedIn && retryUser) {
          currentUser = retryUser;
          updateCurrentUserKyc(currentUser.kyc || {});
          updateUserUi();
          // Re-run user-specific loads now that we have a valid session
          loadMyAds();
          loadProfilePanel({ refreshWallet: true });
          fetchOrdersSafe();
          // Re-render offers so "Buy" buttons appear (not "Login")
          loadOffers();
        }
      } catch (_) {}
    }, 2500);
  }
}

async function loginUser() {
  // Hard guard — prevents double-tap / multiple rapid clicks sending duplicate requests
  if (_loginInFlight) { console.log('[loginUser] blocked — already in flight'); return; }

  const email = String(emailInput?.value || '').trim();
  const password = String(passwordInput?.value || '').trim();
  if (!email || !password) { setUserStatus('Enter email and password', 'user-error'); return; }

  _loginInFlight = true;
  const origHtml = loginBtn ? loginBtn.innerHTML : '';
  if (loginBtn) {
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;">' +
      '<span style="width:14px;height:14px;border:2px solid rgba(0,0,0,0.3);border-top-color:#000;border-radius:50%;animation:ord-spin 0.7s linear infinite;display:inline-block;"></span>' +
      'Logging in…</span>';
  }
  console.log('[loginUser] POST /api/p2p/login email=' + email);

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    const response = await fetch('/api/p2p/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      signal: ctrl.signal,
      body: JSON.stringify({ email, password })
    });
    clearTimeout(timer);
    console.log('[loginUser] response', response.status);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed.');
    }

    // Always wipe all order state on login — guarantees zero cross-user contamination
    _clearOrdersCache({ preserveSnapshots: true });

    currentUser = normalizeCurrentUserPayload(data.user);
    if (!currentUser) {
      throw new Error('Login session payload is incomplete.');
    }
    updateCurrentUserKyc(currentUser?.kyc || {});
    // Persist a session hint so refresh shows logged-in UI instantly (no flicker)
    try { localStorage.setItem('_p2p_hint', JSON.stringify({ id: getCurrentUserId(), username: currentUser.username, email: currentUser.email, role: currentUser.role, avatar: currentUser.avatar || '', createdAt: currentUser.createdAt || null })); } catch(_) {}
    updateUserUi();
    setAuthModalOpen(false);
    setP2PNavOpen(false);
    // run all post-login loads in parallel — much faster
    Promise.all([loadOffers(), loadLiveOrders(), loadMyAds(), loadProfilePanel({ refreshWallet: true })]);
    // Single entry point — shows cache or skeleton, then fetches fresh
    fetchOrdersSafe();
    _startFallbackPoll(); // 15s fallback (SSE handles real-time; this is backup only)

    const redirectPath = getPostLoginRedirectPath();
    if (redirectPath) {
      window.location.href = redirectPath;
      return;
    }
  } catch (error) {
    console.warn('[loginUser] error:', error.message);
    setUserStatus(error.name === 'AbortError' ? 'Request timed out. Try again.' : (error.message || 'Login failed.'), 'user-error');
  } finally {
    // Always restore button — no matter what path was taken
    _loginInFlight = false;
    if (loginBtn) { loginBtn.disabled = false; loginBtn.innerHTML = origHtml; }
  }
}

function _clearOrdersCache(options) {
  options = options || {};
  var preserveSnapshots = options.preserveSnapshots === true;
  // Cancel any in-flight request immediately
  if (typeof _ordAbort !== 'undefined' && _ordAbort) {
    try { _ordAbort.abort(); } catch(_) {}
    _ordAbort = null;
  }
  if (typeof _ordHistoryAbort !== 'undefined' && _ordHistoryAbort) {
    try { _ordHistoryAbort.abort(); } catch(_) {}
    _ordHistoryAbort = null;
  }
  if (typeof _ordPollTimer !== 'undefined' && _ordPollTimer) {
    clearInterval(_ordPollTimer); _ordPollTimer = null;
  }
  // Wipe localStorage
  try { localStorage.removeItem(_ORD_CACHE_KEY || 'p2p_orders_cache'); } catch(_) {}
  if (!preserveSnapshots) {
    try {
      var toRemove = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.startsWith('p2p_order_')) toRemove.push(k);
      }
      toRemove.forEach(function(k) { localStorage.removeItem(k); });
    } catch(_) {}
  }
  // Reset all order state
  _ordAllOrders = [];
  _ordLoaded    = false;
  _ordFetching  = false;
  if (typeof _ordFailing  !== 'undefined') _ordFailing  = 0;
  if (typeof _ordReqId    !== 'undefined') _ordReqId    = (_ordReqId || 0) + 1; // invalidate pending requests
}

async function logoutUser() {
  try {
    await fetch('/api/p2p/logout', { method: 'POST' });
  } finally {
    currentUser = null;
    try { localStorage.removeItem('_p2p_hint'); } catch(_) {}
    _clearOrdersCache(); // cancels any in-flight request, wipes state + cache
    _stopFallbackPoll();
    mobileOrdersCache.clear();
    updateUserUi();
    Promise.all([loadOffers(), loadLiveOrders()]);
    renderMobileOrdersList();
    closeOrderModal();
    closeDealModal();
    closeKycModal();
  }
}

function requireLoginNotice() {
  setUserStatus('Please login first using email and password.', 'user-error');
  setAuthModalOpen(true);
}

async function loadExchangeTicker() {
  if (!exchangeTicker) {
    return;
  }

  try {
    const response = await fetch('/api/p2p/exchange-ticker?symbols=BTCUSDT,ETHUSDT,BNBUSDT,SOLUSDT,XRPUSDT');
    const data = await response.json();

    if (!response.ok || !Array.isArray(data.ticker)) {
      throw new Error('Ticker unavailable');
    }

    exchangeTicker.innerHTML = data.ticker
      .map((item) => {
        const up = Number(item.change24h) >= 0;
        return `
          <span class="${up ? 'up' : 'down'}">
            ${item.symbol} $${formatNumber(item.lastPrice)}
            (${up ? '+' : ''}${Number(item.change24h).toFixed(2)}%)
          </span>
        `;
      })
      .join('');
  } catch (error) {
    exchangeTicker.textContent = 'Exchange feed unavailable right now.';
  }
}

function getOfferPayments(offer) {
  if (!offer || !Array.isArray(offer.payments)) {
    return ['UPI'];
  }
  const payments = offer.payments
    .map((method) => String(method || '').trim())
    .filter((method) => method.length > 0);
  return payments.length ? payments : ['UPI'];
}

function renderOffers(data, append) {
  if (!append) offersMap = new Map();

  if (!Array.isArray(data.offers) || data.offers.length === 0) {
    if (!append) {
      if (rowsEl) rowsEl.innerHTML = '<tr><td colspan="6" class="empty-row">No active ads available</td></tr>';
      if (cardsEl) cardsEl.innerHTML = '<article class="p2p-offer-card"><p class="empty-row">No active ads available</p></article>';
    }
    return;
  }

  const rowsHtml = [];
  const cardsHtml = [];

  data.offers.forEach((offer, index) => {
    offersMap.set(offer.id, offer);

    const actionLabel = data.side === 'buy' ? 'Buy' : 'Sell';
    const isOwnAd = currentUser && offer.createdByUserId === getCurrentUserId();
    const offerPayments = getOfferPayments(offer);
    const payments = offerPayments
      .map((method, paymentIndex) => `<span class="pay-chip pay-chip-${paymentIndex % 4}">${escapeHtml(method)}</span>`)
      .join(' ');
    const quantity = `${formatNumber(offer.available)} ${offer.asset}`;
    const limits = `₹${formatNumber(offer.minLimit)} - ₹${formatNumber(offer.maxLimit)}`;
    const rowClass = index === 0 ? 'top-pick-row offer-highlight' : '';
    const topPickTag = index === 0 ? '<p class="top-pick-label">Top Picks for New Users</p>' : '';
    const actionText = isOwnAd ? 'Your Ad' : currentUser ? actionLabel : 'Login';
    const verificationBadge =
      Number(offer.completionRate || 0) >= 95
        ? '<span class="verification-badge" title="Verified">✔</span>'
        : '<span class="verification-badge muted" title="Basic">•</span>';
    const initial = String(offer.advertiser || 'U')
      .trim()
      .slice(0, 1)
      .toUpperCase();

    rowsHtml.push(`
      <tr class="${rowClass}">
        <td>
          <div class="table-user-cell">
            <span class="table-user-avatar">${escapeHtml(initial)}</span>
            <div>
              <p class="adv-name">${escapeHtml(offer.advertiser)} ${verificationBadge}</p>
              <p class="adv-meta">${(offer.reputation && offer.reputation.completedOrders != null) ? offer.reputation.completedOrders : offer.orders} Orders | ${(offer.reputation && offer.reputation.completionRate != null) ? offer.reputation.completionRate : offer.completionRate}%</p>
            </div>
          </div>
        </td>
        <td class="p2p-price">₹${formatNumber(offer.price)}</td>
        <td class="cell-main">${limits}</td>
        <td class="cell-main">${quantity}</td>
        <td><div class="payment-cell">${payments}</div></td>
        <td class="table-action-cell">
          ${topPickTag}
          <button
            type="button"
            class="offer-action-btn ${data.side === 'buy' ? 'buy-offer-btn' : 'sell-offer-btn'}"
            data-offer-id="${offer.id}"
            ${isOwnAd ? 'disabled' : ''}
          >
            ${actionText}
          </button>
        </td>
      </tr>
    `);

    const rep = offer.reputation || {};
    const repOrders = rep.completedOrders != null ? rep.completedOrders : (offer.orders || 0);
    const repRate = rep.completionRate != null ? rep.completionRate : (offer.completionRate || 100);
    const repTime = rep.avgReleaseMinutes != null ? rep.avgReleaseMinutes + ' min' : (offer.orders > 500 ? '10 min' : offer.orders > 100 ? '15 min' : '20 min');
    const paymentGate = offerPayments.map(m => `<span class="gt-pay">${escapeHtml(m)}</span>`).join('');

    cardsHtml.push(`
      <article class="gt-card">
        <div class="gt-left">
          <div class="gt-user-row">
            <span class="gt-username">${escapeHtml(offer.advertiser)}</span>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 6.5L8 15L2 6.5Z" fill="#2563eb"/><line x1="2" y1="6.5" x2="14" y2="6.5" stroke="white" stroke-width="1"/></svg>
          </div>
          <div class="gt-stats">
            <span>${repOrders} Orders</span>
            <span class="gt-div">|</span>
            <span>${repRate}%</span>
            <span class="gt-div">|</span>
            <span>⏱ ${repTime}</span>
          </div>
          <div class="gt-online"><span class="gt-dot"></span>Online</div>
          <p class="gt-price">₹${formatNumber(offer.price)} <span class="gt-cur">INR</span></p>
          <div class="gt-row"><span class="gt-lbl">Quantity</span><span class="gt-val">${quantity}</span></div>
          <div class="gt-row"><span class="gt-lbl">Limit</span><span class="gt-val">₹${formatNumber(offer.minLimit)}~₹${formatNumber(offer.maxLimit)}</span></div>
          <div class="gt-pays">${paymentGate}</div>
        </div>
        <div class="gt-right">
          <button
            type="button"
            class="gt-btn offer-action-btn ${data.side === 'sell' ? 'gt-btn-sell' : ''}"
            data-offer-id="${offer.id}"
            ${isOwnAd ? 'disabled' : ''}
          >${actionText}</button>
        </div>
      </article>
    `);
  });

  if (rowsEl) {
    if (append) rowsEl.insertAdjacentHTML('beforeend', rowsHtml.join(''));
    else rowsEl.innerHTML = rowsHtml.join('');
  }
  if (cardsEl) {
    if (append) cardsEl.insertAdjacentHTML('beforeend', cardsHtml.join(''));
    else cardsEl.innerHTML = cardsHtml.join('');
  }
}

function getDummyOffers(side) {
  const buyOffers = [
    { id: 'd1', advertiser: 'RajeshTrader', orders: 1240, completionRate: 99, price: 96.40, available: 8500, asset: 'USDT', minLimit: 1000, maxLimit: 500000, payments: ['UPI', 'IMPS', 'Bank Transfer'] },
    { id: 'd2', advertiser: 'CryptoKing_IN', orders: 873, completionRate: 98, price: 96.55, available: 3200, asset: 'USDT', minLimit: 500, maxLimit: 200000, payments: ['UPI', 'Paytm'] },
    { id: 'd3', advertiser: 'SunilP2P', orders: 456, completionRate: 97, price: 96.70, available: 1500, asset: 'USDT', minLimit: 2000, maxLimit: 100000, payments: ['NEFT', 'IMPS', 'Bank Transfer'] },
    { id: 'd4', advertiser: 'MumbaiExchange', orders: 2341, completionRate: 99, price: 96.80, available: 12000, asset: 'USDT', minLimit: 5000, maxLimit: 1000000, payments: ['UPI', 'IMPS'] },
    { id: 'd5', advertiser: 'AyushCrypto', orders: 312, completionRate: 96, price: 96.95, available: 950, asset: 'USDT', minLimit: 1000, maxLimit: 50000, payments: ['Paytm', 'UPI'] },
    { id: 'd6', advertiser: 'DelhiP2P', orders: 689, completionRate: 98, price: 97.10, available: 4000, asset: 'USDT', minLimit: 500, maxLimit: 300000, payments: ['Bank Transfer', 'NEFT'] },
    { id: 'd7', advertiser: 'PriyaFinance', orders: 145, completionRate: 95, price: 97.25, available: 600, asset: 'USDT', minLimit: 2000, maxLimit: 80000, payments: ['UPI', 'IMPS'] },
    { id: 'd8', advertiser: 'BinanceIndia', orders: 3102, completionRate: 99, price: 97.40, available: 25000, asset: 'USDT', minLimit: 1000, maxLimit: 2000000, payments: ['UPI', 'IMPS', 'NEFT', 'Bank Transfer'] },
  ];
  const sellOffers = [
    { id: 's1', advertiser: 'SwapMaster_IN', orders: 980, completionRate: 99, price: 95.80, available: 6000, asset: 'USDT', minLimit: 1000, maxLimit: 400000, payments: ['UPI', 'Bank Transfer'] },
    { id: 's2', advertiser: 'VikramTrades', orders: 554, completionRate: 97, price: 95.60, available: 2100, asset: 'USDT', minLimit: 500, maxLimit: 150000, payments: ['UPI', 'Paytm'] },
    { id: 's3', advertiser: 'KolkataP2P', orders: 234, completionRate: 96, price: 95.45, available: 800, asset: 'USDT', minLimit: 2000, maxLimit: 90000, payments: ['IMPS', 'NEFT'] },
    { id: 's4', advertiser: 'FastSeller99', orders: 1670, completionRate: 99, price: 95.30, available: 9000, asset: 'USDT', minLimit: 5000, maxLimit: 800000, payments: ['UPI', 'IMPS'] },
    { id: 's5', advertiser: 'NitinExchange', orders: 421, completionRate: 97, price: 95.20, available: 1300, asset: 'USDT', minLimit: 1000, maxLimit: 75000, payments: ['Bank Transfer', 'UPI'] },
    { id: 's6', advertiser: 'ChennaiCrypto', orders: 789, completionRate: 98, price: 95.10, available: 3500, asset: 'USDT', minLimit: 500, maxLimit: 250000, payments: ['Paytm', 'IMPS', 'UPI'] },
    { id: 's7', advertiser: 'TrustTrader_IN', orders: 163, completionRate: 95, price: 94.95, available: 500, asset: 'USDT', minLimit: 2000, maxLimit: 60000, payments: ['UPI'] },
    { id: 's8', advertiser: 'GlobalSwapIN', orders: 2210, completionRate: 99, price: 94.80, available: 18000, asset: 'USDT', minLimit: 1000, maxLimit: 1500000, payments: ['UPI', 'NEFT', 'Bank Transfer'] },
  ];
  return {
    side,
    asset: 'USDT',
    total: 8,
    updatedAt: new Date().toISOString(),
    offers: side === 'buy' ? buyOffers : sellOffers
  };
}

var _offersOffset = 0;
var _offersHasMore = false;
var _offersFetching = false; // in-flight lock — prevents stacked parallel calls
var _offersResponseCache = new Map();
var _OFFERS_CACHE_TTL_MS = 25 * 1000;
var _P2P_SELECTED_AD_CACHE_KEY = 'p2p_selected_ad';
var _orderFlowWarmPromise = null;
var _orderFlowWarmStartedAt = 0;
var _ORDER_FLOW_VERSION = '20260329b';
var _P2P_ORDERS_FOCUS_KEY = 'p2p_orders_focus_state';

function _consumeOrdersFocusState() {
  try {
    var raw = sessionStorage.getItem(_P2P_ORDERS_FOCUS_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(_P2P_ORDERS_FOCUS_KEY);
    var parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      main: String(parsed.main || '').trim().toLowerCase() || 'pending',
      sub: String(parsed.sub || '').trim().toLowerCase() || 'inprogress'
    };
  } catch (_) {
    return null;
  }
}

function _applyOrdersFocusState() {
  var focus = _consumeOrdersFocusState();
  if (!focus) return false;
  var main = focus.main === 'ended' ? 'ended' : 'pending';
  var sub = focus.sub;
  switchOrdMain(main);
  if (main === 'ended') {
    switchOrdSub(sub === 'canceled' ? 'canceled' : 'completed');
  } else {
    switchOrdSub(sub === 'dispute' ? 'dispute' : 'inprogress');
  }
  return true;
}

function _buildOrderFlowUrl(params) {
  var qs = new URLSearchParams(params || {});
  qs.set('v', _ORDER_FLOW_VERSION);
  return '/p2p-order-flow.html?' + qs.toString();
}

function _buildOffersCacheKey(params) {
  return params ? params.toString() : '';
}

function _readOffersCache(cacheKey) {
  if (!cacheKey || !_offersResponseCache.has(cacheKey)) {
    return null;
  }
  var entry = _offersResponseCache.get(cacheKey);
  if (!entry || !entry.ts || (Date.now() - entry.ts) > _OFFERS_CACHE_TTL_MS) {
    _offersResponseCache.delete(cacheKey);
    return null;
  }
  return entry.data || null;
}

function _writeOffersCache(cacheKey, data) {
  if (!cacheKey || !data || !Array.isArray(data.offers)) {
    return;
  }
  _offersResponseCache.set(cacheKey, {
    ts: Date.now(),
    data: {
      ...data,
      offers: data.offers.map(function(offer) { return { ...offer }; })
    }
  });
}

function cacheSelectedOffer(offer) {
  if (!offer || !offer.id) {
    return;
  }
  try {
    localStorage.setItem(_P2P_SELECTED_AD_CACHE_KEY, JSON.stringify({
      ts: Date.now(),
      offer: offer
    }));
  } catch (_) {}
}

function prefetchOrderFlowAssets() {
  if (_orderFlowWarmPromise) {
    return _orderFlowWarmPromise;
  }
  _orderFlowWarmStartedAt = Date.now();
  _orderFlowWarmPromise = Promise.allSettled([
    fetch(_buildOrderFlowUrl({}), { credentials: 'include', cache: 'force-cache' }),
    fetch(_buildOrderFlowUrl({ warm: '1' }), { credentials: 'include', cache: 'force-cache' })
  ]).catch(function() {
    return null;
  }).finally(function() {
    if (Date.now() - _orderFlowWarmStartedAt > 30000) {
      _orderFlowWarmPromise = null;
      _orderFlowWarmStartedAt = 0;
    }
  });
  return _orderFlowWarmPromise;
}

async function loadOffers(append) {
  // Prevent parallel non-append calls (append = "load more" button, always allow)
  if (!append && _offersFetching) {
    console.log('[loadOffers] skipped — already in flight');
    return;
  }
  if (!append) _offersOffset = 0;
  var loadMoreBtn = document.getElementById('loadMoreOffersBtn');

  const params = new URLSearchParams({
    side: currentSide,
    asset: currentAsset,
    limit: 10,
    offset: _offersOffset
  });

  if (paymentFilter?.value) params.set('payment', paymentFilter.value);
  if (amountFilter?.value) params.set('amount', amountFilter.value);
  if (advertiserFilter?.value.trim()) params.set('advertiser', advertiserFilter.value.trim());
  const cacheKey = append ? '' : _buildOffersCacheKey(params);
  const cachedResponse = !append ? _readOffersCache(cacheKey) : null;

  if (!append && cachedResponse) {
    renderOffers(cachedResponse, false);
    _offersOffset = Array.isArray(cachedResponse.offers) ? cachedResponse.offers.length : 0;
    _offersHasMore = Boolean(cachedResponse.hasMore);
    if (loadMoreBtn) {
      loadMoreBtn.style.display = _offersHasMore ? 'inline-block' : 'none';
      loadMoreBtn.textContent = 'Load More Ads';
    }
    if (metaEl) {
      metaEl.textContent = `${cachedResponse.side.toUpperCase()} ${cachedResponse.asset} offers: ${cachedResponse.total} | Updated ${new Date(cachedResponse.updatedAt).toLocaleTimeString()}`;
    }
  }

  if (!append && metaEl && !cachedResponse) metaEl.textContent = 'Loading offers...';
  if (loadMoreBtn) loadMoreBtn.textContent = 'Loading...';
  if (!append) _offersFetching = true;

  console.log('[loadOffers] fetching /api/p2p/offers side=' + currentSide + ' asset=' + currentAsset);

  // 12-second timeout via AbortController
  var _offerAbort = new AbortController();
  var _offerTimer = setTimeout(function() { _offerAbort.abort(); }, 12000);

  try {
    const response = await fetch(`/api/p2p/offers?${params.toString()}`, { signal: _offerAbort.signal });
    clearTimeout(_offerTimer);
    console.log('[loadOffers] response', response.status);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Unable to load offers.');

    if (!Array.isArray(data.offers) || data.offers.length === 0) {
      if (!append) {
        _offersFetching = false; // reset lock on empty result
        // p2pCards is the real mobile element (offerCards does not exist in HTML)
        var mobileEmpty = document.getElementById('p2pCards') || document.getElementById('offerCards');
        if (mobileEmpty) mobileEmpty.innerHTML = '<div class="p2p-empty-state"><p>No ads yet.<br>Be the first to post an ad!</p><button class="p2p-post-ad-cta" onclick="document.querySelector(\'[data-mob=\\\'post\\\']\')?.click()">Post Ad</button></div>';
        if (metaEl) metaEl.textContent = `${currentSide.toUpperCase()} USDT offers: 0`;
      }
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    if (!append) _offersFetching = false;
    if (!append) _writeOffersCache(cacheKey, data);
    console.log('[loadOffers] rendered', data.offers ? data.offers.length : 0, 'offers');
    renderOffers(data, append);
    _offersOffset += data.offers.length;
    _offersHasMore = Boolean(data.hasMore);
    if (loadMoreBtn) {
      loadMoreBtn.style.display = _offersHasMore ? 'inline-block' : 'none';
      loadMoreBtn.textContent = 'Load More Ads';
    }
    if (metaEl) {
      metaEl.textContent = `${data.side.toUpperCase()} ${data.asset} offers: ${data.total} | Updated ${new Date(data.updatedAt).toLocaleTimeString()}`;
    }
  } catch (error) {
    clearTimeout(_offerTimer);
    if (!append) _offersFetching = false; // always reset lock on error
    console.warn('[loadOffers] error:', error && error.message);
    if (!append) {
      // Show retry button in the real mobile element (p2pCards)
      var mobileErr = document.getElementById('p2pCards') || document.getElementById('offerCards');
      if (mobileErr) {
        mobileErr.innerHTML =
          '<div class="p2p-empty-state" style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 20px;">' +
          '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
          '<p style="color:rgba(255,255,255,0.45);font-size:14px;margin:0;text-align:center;">Could not load ads</p>' +
          '<button onclick="_offersFetching=false;loadOffers()" style="background:#00d4d4;color:#000;border:none;border-radius:8px;padding:10px 26px;font-size:14px;font-weight:700;cursor:pointer;">Retry</button>' +
          '</div>';
      }
      if (metaEl) metaEl.textContent = '';
    }
    if (loadMoreBtn) { loadMoreBtn.style.display = 'none'; loadMoreBtn.textContent = 'Load More Ads'; }
  }
}

var _loadMoreOffersBtn = document.getElementById('loadMoreOffersBtn');
if (_loadMoreOffersBtn) {
  _loadMoreOffersBtn.addEventListener('click', function() { loadOffers(true); });
}

async function createOrder(offerId, options = {}) {
  if (!currentUser) {
    requireLoginNotice();
    throw new Error('Please login first.');
  }

  const offer = offersMap.get(String(offerId || '').trim());
  if (!offer) {
    if (metaEl) metaEl.textContent = 'Offer unavailable. Refresh and retry.';
    throw new Error('Offer unavailable. Please refresh the page and try again.');
  }

  const amountValue = Number(options.amountInr ?? (amountFilter?.value || 0));
  const amountInr = amountValue > 0 ? amountValue : Number(offer.minLimit);
  const paymentMethod = String(options.paymentMethod || '').trim();
  const openAfterCreate = options.openAfterCreate !== false;

  const payload = { offerId: String(offerId).trim(), amountInr, paymentMethod };
  console.log('[createOrder] POST /api/p2p/orders payload:', JSON.stringify(payload));

  const ctrl = new AbortController();
  const tmr  = setTimeout(() => ctrl.abort(), 15000);

  try {
    const response = await fetch('/api/p2p/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      credentials: 'include',
      signal: ctrl.signal,
      body: JSON.stringify(payload)
    });
    clearTimeout(tmr);

    const data = await response.json().catch(() => ({}));
    console.log('[createOrder] response', response.status, JSON.stringify(data).slice(0, 300));

    if (!response.ok) {
      const error = new Error(data.message || `Order failed (${response.status})`);
      error.code = String(data.code || '').trim().toUpperCase();
      error.kyc  = data.kyc && typeof data.kyc === 'object' ? data.kyc : null;
      throw error;
    }

    if (!data.order) {
      throw new Error('Server returned success but no order object. Please contact support.');
    }

    if (data.existingOrder && metaEl) {
      metaEl.textContent = data.message || 'You already have an active order. Opening it now.';
    }

    if (openAfterCreate) {
      openOrder(data.order);
    }

    // ── Immediately inject new order into cache + orders screen ──
    var newOrd = data.order;
    var exists = _ordAllOrders.some(function(o) { return o.id === newOrd.id; });
    if (!exists) {
      _ordAllOrders.unshift(newOrd);
    } else {
      _ordAllOrders = _ordAllOrders.map(function(o) { return o.id === newOrd.id ? newOrd : o; });
    }
    try { localStorage.setItem('p2p_order_' + newOrd.id, JSON.stringify(newOrd)); } catch(_) {}
    _ordLoaded = true;
    _saveOrdCache(_ordAllOrders);

    // Re-render orders screen if open
    var ordScreen = document.getElementById('mobOrdersScreen');
    if (ordScreen && ordScreen.style.display !== 'none') {
      _showOrdList(_ordSubTab);
    }

    // Force fresh fetch after creating order — SSE will also trigger this
    fetchOrdersSafe();

    await loadLiveOrders();
    return data;
  } catch (error) {
    clearTimeout(tmr);
    const msg = error.name === 'AbortError' ? 'Request timed out. Try again.' : error.message;
    console.warn('[createOrder] FAILED:', msg);
    if (metaEl) metaEl.textContent = msg;
    error.message = msg;
    throw error;
  }
}

function openDealForOffer(offerId) {
  if (!currentUser) {
    requireLoginNotice();
    return;
  }
  const offer = offersMap.get(String(offerId || '').trim());
  if (!offer) {
    alert('Ad not found. Please refresh and try again.');
    return;
  }
  fillDealModal(offer);
}

async function submitDealOrder() {
  if (!currentUser) { requireLoginNotice(); return; }
  if (!activeDealOffer || !dealConfirmBtn || !dealPayAmount || !dealPaymentSelect) return;
  if (!refreshDealValidation()) return;

  // Hard lock prevents double-submit (double-tap on mobile)
  if (_dealSubmitLock) { console.log('[submitDealOrder] blocked — already in flight'); return; }
  _dealSubmitLock = true;

  const amountInr = Number(dealPayAmount.value || 0);
  const paymentMethod = String(dealPaymentSelect.value || '').trim();

  const prevHtml = dealConfirmBtn.innerHTML;
  dealConfirmBtn.disabled = true;
  dealConfirmBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;">' +
    '<span style="width:12px;height:12px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:ord-spin 0.7s linear infinite;display:inline-block;"></span>' +
    'Processing…</span>';

  console.log('[submitDealOrder] creating order offerId=' + activeDealOffer.id + ' amountInr=' + amountInr + ' paymentMethod=' + paymentMethod);
  try {
    const data = await createOrder(activeDealOffer.id, { amountInr, paymentMethod, openAfterCreate: false });
    if (!data?.order) throw new Error('Server did not return order. Please check Orders screen.');
    console.log('[submitDealOrder] order created ref=' + data.order.reference + ' id=' + data.order.id);
    setDealHint('Order created! Ref: ' + data.order.reference, 'success');
    closeDealModal();
    openOrder(data.order);
  } catch (error) {
    console.warn('[submitDealOrder] FAILED:', error.message, 'code=' + (error.code || 'none'));
    if (error.code === 'EMAIL_NOT_VERIFIED') {
      setDealHint('Please verify your email first.', 'error');
      setTimeout(function() { if (typeof window.openEmailVerifyModal === 'function') window.openEmailVerifyModal(); }, 400);
    } else {
      setDealHint(error.message || 'Unable to create order.', 'error');
    }
  } finally {
    _dealSubmitLock = false;
    dealConfirmBtn.disabled = false;
    dealConfirmBtn.innerHTML = prevHtml;
  }
}

function renderLiveOrders(orders) {
  const incomingOrders = Array.isArray(orders) ? orders : [];
  const currentUserId = String(currentUser?.id || '').trim();
  const hydratedOrders = _ordMergeById(incomingOrders, _ordLoadSavedSnapshots({ activeOnly: true }));
  const participantOrders = hydratedOrders
    .map((order) => {
      if (!order || typeof order !== 'object') {
        return null;
      }

      const buyerUserId = String(order.buyerUserId || '').trim();
      const sellerUserId = String(order.sellerUserId || '').trim();
      const inferredParticipant =
        _ordBelongsToCurrentUser(order) ||
        (Boolean(currentUserId) && (buyerUserId === currentUserId || sellerUserId === currentUserId));

      return {
        ...order,
        isParticipant:
          typeof order.isParticipant === 'boolean' ? order.isParticipant : inferredParticipant
      };
    })
    .filter((order) => Boolean(order?.isParticipant));
  participantOrders.forEach((order) => storeOrderForMobile(order));
  pruneMobileOrdersCache();
  const visibleOrders = participantOrders.filter((order) => isOngoingOrderStatus(order.status));

  if (!visibleOrders.length) {
    if (liveOrdersRows) {
      liveOrdersRows.innerHTML = '<tr><td colspan="6" class="empty-row">No ongoing orders available.</td></tr>';
    }
    if (liveOrdersCards) {
      liveOrdersCards.innerHTML = '<article class="p2p-live-order-card"><p class="empty-row">No ongoing orders available.</p></article>';
    }
    renderMobileOrdersList();
    loadProfilePanel();
    return 0;
  }

  if (liveOrdersRows) {
    liveOrdersRows.innerHTML = visibleOrders
      .map((order) => {
        return `
          <tr>
            <td>${order.reference}</td>
            <td>${getOrderDisplaySide(order)} ${order.asset}</td>
            <td>₹${formatNumber(order.amountInr)}</td>
            <td><span class="status-pill ${statusClass(order.status)}">${statusLabel(order.status)}</span></td>
            <td>${escapeHtml(order.participantsLabel)}</td>
            <td>
              <button type="button" class="secondary-btn open-order-btn" data-order-id="${order.id}">
                Open
              </button>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  if (liveOrdersCards) {
    liveOrdersCards.innerHTML = visibleOrders
      .map(
        (order) => `
          <article class="p2p-live-order-card">
            <div class="p2p-card-top">
              <p class="p2p-card-title">${order.reference}</p>
              <span class="status-pill ${statusClass(order.status)}">${statusLabel(order.status)}</span>
            </div>
            <div class="p2p-card-grid">
              <p>Type<strong>${getOrderDisplaySide(order)} ${order.asset}</strong></p>
              <p>Amount<strong>₹${formatNumber(order.amountInr)}</strong></p>
              <p>Participants<strong>${escapeHtml(order.participantsLabel)}</strong></p>
              <p>Counterparty<strong>${escapeHtml(order.advertiser || '--')}</strong></p>
            </div>
            <div class="p2p-card-actions">
              <button type="button" class="secondary-btn open-order-btn" data-order-id="${order.id}">
                Open
              </button>
            </div>
          </article>
        `
      )
      .join('');
  }

  renderMobileOrdersList();
  loadProfilePanel();
  return visibleOrders.length;
}

async function loadLiveOrders() {
  if (!liveOrdersMeta) {
    return;
  }

  if (!currentUser) {
    if (liveOrdersRows) {
      liveOrdersRows.innerHTML = '<tr><td colspan="6" class="empty-row">Login to view ongoing orders.</td></tr>';
    }
    if (liveOrdersCards) {
      liveOrdersCards.innerHTML = '<article class="p2p-live-order-card"><p class="empty-row">Login to view ongoing orders.</p></article>';
    }
    liveOrdersMeta.textContent = 'Ongoing Orders: login required';
    if (mobileOrdersList) {
      mobileOrdersList.innerHTML = '<p class="empty-row">Login to view orders.</p>';
    }
    loadProfilePanel();
    return;
  }

  try {
    if (_ordLoaded && Array.isArray(_ordAllOrders) && _ordAllOrders.length) {
      const warmVisibleCount = renderLiveOrders(_ordAllOrders);
      if (warmVisibleCount > 0) {
        liveOrdersMeta.textContent = `Ongoing Orders: ${warmVisibleCount}`;
      }
    }

    const response = await fetch('/api/p2p/orders/my-active', {
      credentials: 'include',
      headers: { 'Cache-Control': 'no-store' }
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Unable to load ongoing orders.');
    }

    let orders = Array.isArray(data) ? data : (data.orders || []);
    if (!orders.length) {
      orders = _ordLoadSavedSnapshots({ activeOnly: true });
    }
    const visibleCount = renderLiveOrders(orders);
    liveOrdersMeta.textContent = `Ongoing Orders: ${visibleCount}`;
  } catch (error) {
    const snapshotOrders = _ordLoadSavedSnapshots({ activeOnly: true });
    if (snapshotOrders.length) {
      const visibleCount = renderLiveOrders(snapshotOrders);
      liveOrdersMeta.textContent = `Ongoing Orders: ${visibleCount}`;
    } else {
      if (liveOrdersRows) {
        liveOrdersRows.innerHTML = '<tr><td colspan="6" class="empty-row">Unable to load ongoing orders.</td></tr>';
      }
      if (liveOrdersCards) {
        liveOrdersCards.innerHTML = '<article class="p2p-live-order-card"><p class="empty-row">Unable to load ongoing orders.</p></article>';
      }
      liveOrdersMeta.textContent = error.message;
      renderMobileOrdersList();
    }
  }
}

function updateOrderUi(order) {
  if (!order) {
    return;
  }

  activeOrderSnapshot = order;
  _ordSyncSingleOrder(order);
  renderMobileOrdersList();
  loadProfilePanel();
  activeOrderRole = getOrderRole(order);
  const normalizedStatus = normalizeStatusForUi(order.status);
  const counterpartyName =
    activeOrderRole === 'buyer'
      ? order.sellerUsername || order.advertiser || 'Seller'
      : order.buyerUsername || 'Buyer';

  orderRef.textContent = order.reference;
  orderStatus.className = `status-pill ${statusClass(order.status)}`;
  orderStatus.textContent = statusLabel(order.status).toUpperCase();
  orderMerchant.textContent = counterpartyName;
  if (orderCounterpartyName) {
    orderCounterpartyName.textContent = counterpartyName;
  }
  if (orderCounterpartyMeta) {
    orderCounterpartyMeta.textContent = 'Order with verified counterparty';
  }
  // Update avatar in redesigned modal
  var merchantAvatar = document.getElementById('orderMerchantAvatar');
  if (merchantAvatar) {
    merchantAvatar.textContent = String(counterpartyName || 'S').slice(0, 1).toUpperCase();
  }
  // Update order title based on status
  var normalizedSt = normalizeStatusForUi(order.status);
  var titleMap = {
    CREATED: 'Order generated. Proceed to payment.',
    PAID: 'Payment sent — waiting for seller to release.',
    RELEASED: 'Order completed! Crypto released.',
    CANCELLED: 'Order cancelled.',
    DISPUTED: 'Order under dispute. Admin reviewing.',
    EXPIRED: 'Order expired.'
  };
  if (orderTitle) orderTitle.textContent = titleMap[normalizedSt] || 'Order in progress.';
  orderPrice.textContent = `₹${formatNumber(order.price)} / ${order.asset}`;
  orderAmount.textContent = `₹${formatNumber(order.amountInr)}`;
  orderAssetAmount.textContent = `${formatNumber(order.assetAmount)} ${order.asset}`;
  if (orderFee) {
    orderFee.textContent = `0 USDT`;
  }
  orderPayment.textContent = order.paymentMethod;
  orderParticipants.textContent = order.participantsLabel;
  if (orderTime) {
    orderTime.textContent = formatDateTime(order.createdAt);
  }
  if (paymentAmountDisplay) {
    paymentAmountDisplay.textContent = `₹${formatNumber(order.amountInr)}`;
  }
  if (paymentMethodDisplay) {
    paymentMethodDisplay.textContent = `Payment method: ${order.paymentMethod}`;
  }
  if (paymentInstructions) {
    paymentInstructions.textContent =
      'Transfer exact amount from your own account and click “I have paid”.';
  }

  remainingSeconds = Number(order.remainingSeconds || 0);
  orderTimer.textContent = formatTimer(remainingSeconds);
  if (paymentCountdown) {
    paymentCountdown.textContent = formatTimer(remainingSeconds);
  }

  const isCreated = normalizedStatus === 'CREATED';
  const isPaid = normalizedStatus === 'PAID';
  const isReleased = normalizedStatus === 'RELEASED';
  const isClosed = ['RELEASED', 'CANCELLED', 'EXPIRED'].includes(normalizedStatus);

  if (markPaidBtn) {
    if (activeOrderRole === 'seller' && isPaid) {
      markPaidBtn.dataset.action = 'release';
      markPaidBtn.textContent = 'Release';
      markPaidBtn.disabled = false;
      markPaidBtn.classList.add('release-mode');
    } else if (activeOrderRole === 'buyer' && isCreated) {
      markPaidBtn.dataset.action = 'pay';
      markPaidBtn.textContent = 'Pay';
      markPaidBtn.disabled = false;
      markPaidBtn.classList.remove('release-mode');
    } else if (activeOrderRole === 'buyer' && isPaid) {
      markPaidBtn.dataset.action = 'none';
      markPaidBtn.textContent = 'Payment Sent';
      markPaidBtn.disabled = true;
      markPaidBtn.classList.remove('release-mode');
    } else if (isReleased) {
      markPaidBtn.dataset.action = 'none';
      markPaidBtn.textContent = 'Released';
      markPaidBtn.disabled = true;
      markPaidBtn.classList.remove('release-mode');
    } else {
      markPaidBtn.dataset.action = 'none';
      markPaidBtn.textContent = 'Pay';
      markPaidBtn.disabled = true;
      markPaidBtn.classList.remove('release-mode');
    }
  }

  if (cancelOrderBtn) {
    const canCancel = isCreated;
    cancelOrderBtn.disabled = !canCancel;
    cancelOrderBtn.style.opacity = canCancel ? '1' : '0.4';
  }
  if (paidConfirmBtn) {
    paidConfirmBtn.disabled = !(activeOrderRole === 'buyer' && isCreated);
  }

  // Update timer label to reflect current state contextually
  var timerLabel = document.getElementById('orderTimerLabel');
  if (timerLabel) {
    if (normalizedStatus === 'CREATED' && activeOrderRole === 'buyer') {
      timerLabel.textContent = 'Pay before timer expires';
    } else if (normalizedStatus === 'CREATED' && activeOrderRole === 'seller') {
      timerLabel.textContent = 'Waiting for buyer payment';
    } else if (normalizedStatus === 'PAID' && activeOrderRole === 'seller') {
      timerLabel.textContent = 'Release payment to buyer';
      timerLabel.style.color = '#f0b90b';
    } else if (normalizedStatus === 'PAID' && activeOrderRole === 'buyer') {
      timerLabel.textContent = 'Waiting for seller to release';
      timerLabel.style.color = '#fff';
    } else {
      timerLabel.textContent = '';
    }
  }
  if (chatInput) {
    chatInput.disabled = isClosed;
  }
  if (isClosed || isPaid || activeOrderRole !== 'buyer') {
    setPaymentPanelOpen(false);
  }

  // Dispute button: show when PAID (buyer waiting for release) or DISPUTED
  if (disputeBtn) {
    var isDisputed = normalizedStatus === 'DISPUTED';
    var canDispute = isPaid && !isClosed;
    if (canDispute || isDisputed) {
      disputeBtn.classList.remove('hidden');
      disputeBtn.disabled = isDisputed;
      disputeBtn.textContent = isDisputed ? 'Dispute Active' : 'Raise Dispute';
    } else {
      disputeBtn.classList.add('hidden');
    }
  }
}

async function fetchMessages(options = {}) {
  if (!activeOrderId) {
    return;
  }

  try {
    const response = await fetch(`/api/p2p/orders/${activeOrderId}/messages`, { credentials: 'include' });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to load messages.');
    }

    renderMessages(data.messages, options);
    chatState.textContent = `Messages: ${data.messages.length}`;
  } catch (error) {
    chatState.textContent = error.message;
  }
}

async function postChatPayload(payload) {
  const response = await fetch(`/api/p2p/orders/${activeOrderId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ text: encodeChatPayload(payload) })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Message failed.');
  }
  return data.messages;
}

async function sendMessageHandler(event) {
  event.preventDefault();

  if (!activeOrderId || !chatInput || !chatSendBtn || chatUploading) {
    return;
  }

  const text = String(chatInput.value || '').trim();
  if (!text) {
    return;
  }

  const clientId = generateClientId();
  const createdAt = new Date().toISOString();
  const optimisticMessage = {
    id: '',
    sender: currentUser?.username || 'You',
    createdAt,
    clientId,
    messageType: 'text',
    text,
    imageUrl: ''
  };

  appendMessage(optimisticMessage, { optimistic: true, smooth: true });
  chatInput.value = '';
  chatState.textContent = 'Sending...';

  const encodedPayload = encodeChatPayload({
    messageType: 'text',
    text,
    imageUrl: '',
    clientId,
    createdAt
  });

  try {
    const messages = await postChatPayload({
      messageType: 'text',
      text: encodedPayload,
      imageUrl: '',
      clientId,
      createdAt
    });
    renderMessages(messages, { smoothScroll: true, forceScroll: true });
    chatState.textContent = 'Message delivered';
  } catch (error) {
    const key = messageKeyFromMessage(optimisticMessage);
    const existing = chatMessageMap.get(key);
    if (existing) {
      existing.pending = false;
      existing.failed = true;
      chatMessageMap.set(key, existing);
      const existingNode = chatMessageNodes.get(key);
      if (existingNode) {
        updateMessageNode(existingNode, existing);
      }
    }
    chatState.textContent = error.message;
  }
}

function setImagePreviewOpen(open, src = '') {
  if (!imagePreviewModal) {
    return;
  }
  const shouldOpen = Boolean(open);
  imagePreviewModal.classList.toggle('hidden', !shouldOpen);
  imagePreviewModal.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  if (imagePreviewEl) {
    imagePreviewEl.src = shouldOpen ? src : '';
  }
  syncBodyInteractionState();
}

async function handleChatImageSelected(event) {
  const file = event.target?.files?.[0];
  if (!file || !activeOrderId || chatUploading) {
    return;
  }

  if (!CHAT_IMAGE_ALLOWED_TYPES.includes(file.type)) {
    chatState.textContent = 'Only JPG, JPEG, PNG, or WEBP images are allowed.';
    event.target.value = '';
    return;
  }

  if (file.size > CHAT_IMAGE_MAX_SIZE) {
    chatState.textContent = 'Image size must be 3MB or less.';
    event.target.value = '';
    return;
  }

  setChatUploading(true, 'Uploading image...');

  let safeImageUrl = '';
  try {
    const compressedDataUrl = await compressImageForChat(file);
    safeImageUrl = sanitizeImageUrl(compressedDataUrl);
    if (!safeImageUrl) {
      throw new Error('Invalid image format.');
    }
  } catch (error) {
    chatState.textContent = error.message || 'Failed to process image.';
    setChatUploading(false);
    event.target.value = '';
    return;
  }

  const clientId = generateClientId();
  const optimisticMessage = {
    id: '',
    sender: currentUser?.username || 'You',
    createdAt: new Date().toISOString(),
    clientId,
    messageType: 'image',
    text: 'Payment screenshot',
    imageUrl: safeImageUrl
  };

  appendMessage(optimisticMessage, { optimistic: true, smooth: true });
  chatState.textContent = 'Uploading image...';

  try {
    const messages = await postChatPayload({
      messageType: 'image',
      text: 'Payment screenshot',
      imageUrl: safeImageUrl,
      clientId,
      createdAt: new Date().toISOString()
    });
    renderMessages(messages, { smoothScroll: true, forceScroll: true });
    chatState.textContent = 'Image sent';
  } catch (error) {
    const key = messageKeyFromMessage(optimisticMessage);
    const existing = chatMessageMap.get(key);
    if (existing) {
      existing.pending = false;
      existing.failed = true;
      chatMessageMap.set(key, existing);
      const existingNode = chatMessageNodes.get(key);
      if (existingNode) {
        updateMessageNode(existingNode, existing);
      }
    }
    chatState.textContent = error.message;
  } finally {
    setChatUploading(false);
    event.target.value = '';
  }
}

async function loadOrderDetails() {
  if (!activeOrderId) {
    return;
  }

  try {
    const response = await fetch(`/api/p2p/orders/${activeOrderId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to load order.');
    }
    updateOrderUi(data.order);
  } catch (error) {
    chatState.textContent = error.message;
  }
}

function openOrder(order) {
  // Close any previous stream before opening new one
  if (orderStream) { try { orderStream.close(); } catch(e){} orderStream = null; }

  activeOrderId = order.id;
  autoCancelRequested = false;
  messagePollTick = 0;
  resetChatMessages();
  setChatUploading(false);
  setModalOpen(true);
  setPaymentPanelOpen(false);
  setCancelModalOpen(false);
  updateOrderUi(order);
  fetchMessages({ forceScroll: true });

  resetOrderWatch();

  pollingIntervalId = setInterval(() => {
    messagePollTick += 1;
    fetchMessages();
    if (messagePollTick % 2 === 0) {
      loadOrderDetails();
    }
    loadLiveOrders();
    // Keep orders screen in sync too
    var ordScreen = document.getElementById('mobOrdersScreen');
    if (ordScreen && ordScreen.style.display !== 'none') {
      loadBybitorOrders();
    }
  }, 3000);

  countdownIntervalId = setInterval(() => {
    remainingSeconds = Math.max(0, remainingSeconds - 1);
    orderTimer.textContent = formatTimer(remainingSeconds);
    if (paymentCountdown) {
      paymentCountdown.textContent = formatTimer(remainingSeconds);
    }

    const normalizedStatus = normalizeStatusForUi(activeOrderSnapshot?.status);
    if (remainingSeconds <= 0 && normalizedStatus === 'CREATED' && !autoCancelRequested) {
      autoCancelRequested = true;
      updateOrderStatus('cancel', { skipNotification: true }).catch(() => {
        autoCancelRequested = false;
      });
    }
  }, 1000);

  orderStream = new EventSource(`/api/p2p/orders/${order.id}/stream`);
  orderStream.addEventListener('order_update', (event) => {
    try {
      const payload = JSON.parse(event.data || '{}');
      if (payload.order) {
        var nextOrder = _ordSyncSingleOrder(payload.order, { seedOrderList: true });
        updateOrderUi(nextOrder || payload.order);
      }
    } catch(e) { console.error('[orderStream] order_update error:', e); _ordFetching = false; }
  });
  orderStream.addEventListener('message_update', (event) => {
    try {
      const payload = JSON.parse(event.data || '{}');
      if (payload.messages) {
        renderMessages(payload.messages, { smoothScroll: true });
        chatState.textContent = `Messages: ${payload.messages.length}`;
      }
    } catch(e) { console.error('[orderStream] message_update error:', e); _ordFetching = false; }
  });
  orderStream.onerror = function() {
    // SSE failed — polling fallback continues, no action needed
  };
}

async function openOrderById(orderId) {
  if (!liveOrdersMeta) {
    return;
  }

  if (!currentUser) {
    requireLoginNotice();
    return;
  }

  try {
    const response = await fetch(`/api/p2p/orders/${orderId}`, {
      credentials: 'include',
      headers: { 'Cache-Control': 'no-store' }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Unable to open order.');
    }
    if (!isOngoingOrderStatus(data?.order?.status)) {
      throw new Error('Only ongoing orders can be opened.');
    }
    openOrder(data.order);
    await loadLiveOrders();
  } catch (error) {
    liveOrdersMeta.textContent = error.message;
  }
}

async function sendOrderMessage(text) {
  if (!activeOrderId || !String(text || '').trim()) {
    return;
  }

  const response = await fetch(`/api/p2p/orders/${activeOrderId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: String(text).trim() })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Message failed.');
  }
  renderMessages(data.messages, { smoothScroll: true });
}

async function updateOrderStatus(action, options = {}) {
  if (!activeOrderId) return;

  // Global lock — prevents double-tap sending two API calls for same action
  if (_orderActionLock) { console.log('[updateOrderStatus] blocked — action in flight'); return; }
  _orderActionLock = true;
  console.log('[updateOrderStatus] action=' + action + ' orderId=' + activeOrderId);

  // Visually lock the triggering button
  var _lockedBtn = null;
  var _lockedBtnOrigHtml = '';
  var _spinHtml = '<span style="display:inline-flex;align-items:center;gap:6px;">' +
    '<span style="width:12px;height:12px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:ord-spin 0.7s linear infinite;display:inline-block;"></span>' +
    'Processing…</span>';
  if (action === 'release' && markPaidBtn)       { _lockedBtn = markPaidBtn; }
  else if (action === 'mark_paid' && paidConfirmBtn) { _lockedBtn = paidConfirmBtn; }
  else if (action === 'cancel' && cancelConfirmBtn)  { _lockedBtn = cancelConfirmBtn; }
  else if (action === 'dispute' && disputeBtn)       { _lockedBtn = disputeBtn; }
  if (_lockedBtn) { _lockedBtnOrigHtml = _lockedBtn.innerHTML; _lockedBtn.disabled = true; _lockedBtn.innerHTML = _spinHtml; }

  try {
    const ctrl = new AbortController();
    const tmr  = setTimeout(() => ctrl.abort(), 15000);
    const response = await fetch(`/api/p2p/orders/${activeOrderId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      signal: ctrl.signal,
      body: JSON.stringify({
        action,
        reason: String(options.reason || '').trim()
      })
    });
    clearTimeout(tmr);
    console.log('[updateOrderStatus]', action, 'response', response.status);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Unable to update order.');
    }

    var nextOrder = _ordSyncSingleOrder(data.order, {
      seedOrderList: true,
      focusBucket: action === 'cancel' || action === 'expire' || action === 'release'
    });
    updateOrderUi(nextOrder || data.order);
    if (action === 'mark_paid' && !options.skipNotification) {
      await sendOrderMessage('Payment done from buyer side. Please verify and release crypto.');
    }
    await fetchMessages();
    await loadLiveOrders();
    await loadProfilePanel({ refreshWallet: true });
    if (action === 'cancel' || action === 'expire' || action === 'release') {
      fetchOrdersSafe();
    }
  } catch (error) {
    console.warn('[updateOrderStatus] error:', error.message);
    if (chatState) chatState.textContent = error.name === 'AbortError' ? 'Request timed out. Try again.' : error.message;
    // Restore button on failure so user can retry
    if (_lockedBtn) { _lockedBtn.disabled = false; _lockedBtn.innerHTML = _lockedBtnOrigHtml; }
    throw error;
  } finally {
    _orderActionLock = false;
    // updateOrderUi() will set correct button state on success — only restore on error (handled above)
  }
}

function bindOfferActionDelegation(container) {
  if (!container) return;

  function primeOfferNavigation(event) {
    const actionBtn = event.target.closest('.offer-action-btn, .gt-btn[data-offer-id]');
    if (!actionBtn) return;
    const offer = offersMap.get(String(actionBtn.dataset.offerId || '').trim());
    if (offer) {
      cacheSelectedOffer(offer);
    }
    prefetchOrderFlowAssets();
  }

  container.addEventListener('mouseenter', primeOfferNavigation, true);
  container.addEventListener('touchstart', primeOfferNavigation, { passive: true });
  container.addEventListener('pointerdown', primeOfferNavigation);

  container.addEventListener('click', (event) => {
    const actionBtn = event.target.closest('.offer-action-btn, .gt-btn[data-offer-id]');
    if (!actionBtn || actionBtn.disabled) return;

    // Visual click feedback — scale down briefly like Bitget/Bybit
    actionBtn.style.transform = 'scale(0.93)';
    actionBtn.style.transition = 'transform 0.1s ease';
    setTimeout(function() { actionBtn.style.transform = ''; }, 160);

    const offer = offersMap.get(String(actionBtn.dataset.offerId || '').trim());
    if (offer) {
      cacheSelectedOffer(offer);
    }

    openDealForOffer(actionBtn.dataset.offerId);
  });
}

bindOfferActionDelegation(rowsEl);
bindOfferActionDelegation(cardsEl);

function bindOpenOrderDelegation(container) {
  if (!container) {
    return;
  }

  container.addEventListener('click', (event) => {
    const openBtn = event.target.closest('.open-order-btn');
    if (!openBtn) {
      return;
    }
    openOrderById(openBtn.dataset.orderId);
  });
}

bindOpenOrderDelegation(liveOrdersRows);
bindOpenOrderDelegation(liveOrdersCards);
if (mobileOrdersList && mobileOrdersList !== liveOrdersCards) {
  bindOpenOrderDelegation(mobileOrdersList);
}

// ===== MOBILE ORDERS TAB LOGIC =====
var _mobOrderTab = 'active'; // 'active' or 'history'
var _mobHistoryLoaded = false;
var _mobHistoryData = [];

function renderMobileActiveOrders() {
  var list = document.getElementById('mobileOrdersList');
  if (!list) return;
  var orders = filteredMobileOrders();
  if (!orders.length) {
    list.innerHTML = '<div style="text-align:center;padding:2.5rem 1rem;"><div style="font-size:2rem;margin-bottom:0.5rem;">📋</div><p style="color:rgba(255,255,255,0.4);font-size:0.9rem;">No active orders</p></div>';
    return;
  }
  list.innerHTML = orders.map(function(order) {
    var sideLabel = (order.side || '').toUpperCase();
    var amtLabel = '₹' + formatNumber(order.amountInr || 0);
    var statusCls = statusClass(order.status);
    var statusTxt = statusLabel(order.status);
    var counterparty = order.participantsLabel || '--';
    return '<article class="mobile-order-card" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:1rem;margin-bottom:0.75rem;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">' +
        '<span style="font-size:0.8rem;color:rgba(255,255,255,0.5);">' + escapeHtml(order.reference || order.id) + '</span>' +
        '<span class="status-pill ' + statusCls + '">' + statusTxt + '</span>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 1rem;font-size:0.87rem;margin-bottom:0.75rem;">' +
        '<div><span style="color:rgba(255,255,255,0.45);">Type</span><br/><strong style="color:' + (sideLabel==='BUY'?'#16a34a':'#f0b90b') + ';">' + sideLabel + ' ' + escapeHtml(order.asset || 'USDT') + '</strong></div>' +
        '<div><span style="color:rgba(255,255,255,0.45);">Amount</span><br/><strong>' + amtLabel + '</strong></div>' +
        '<div><span style="color:rgba(255,255,255,0.45);">Price</span><br/><strong>₹' + formatNumber(order.price || 0) + '</strong></div>' +
        '<div><span style="color:rgba(255,255,255,0.45);">Payment</span><br/><strong>' + escapeHtml(order.paymentMethod || '--') + '</strong></div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;">' +
        '<span style="font-size:0.8rem;color:rgba(255,255,255,0.4);">With: ' + escapeHtml(counterparty) + '</span>' +
        '<button type="button" class="secondary-btn open-order-btn" data-order-id="' + escapeHtml(order.id) + '" style="padding:6px 16px;font-size:0.82rem;">Open →</button>' +
      '</div>' +
    '</article>';
  }).join('');
}

async function loadMobileActiveOrdersDirect() {
  // Directly fetches current user's active orders (bypasses the 20-order live feed limit)
  if (!currentUser) return;
  try {
    var resp = await fetch('/api/p2p/orders/my-active', { credentials: 'include', headers: { 'Cache-Control': 'no-store' } });
    if (!resp.ok) return;
    var data = await resp.json();
    var orders = Array.isArray(data) ? data : (data.orders || []);
    console.log('ORDERS API RESPONSE (active-direct):', { count: orders.length });
    orders.forEach(function(o) { storeOrderForMobile(o); });
    renderMobileActiveOrders();
  } catch(e) { /* silent — fallback to cached orders */ }
}

async function loadMobileOrderHistory() {
  var list = document.getElementById('mobileHistoryList');
  if (!list) return;
  if (!currentUser) { list.innerHTML = '<p style="text-align:center;padding:2rem;color:rgba(255,255,255,0.4);">Login to view history</p>'; return; }
  list.innerHTML = '<p style="text-align:center;padding:2rem;color:rgba(255,255,255,0.4);">Loading...</p>';
  try {
    var resp = await fetch('/api/p2p/orders/history?limit=20&offset=0', { credentials: 'include', headers: { 'Cache-Control': 'no-store' } });
    if (!resp.ok) {
      var errData = await resp.json().catch(function(){ return {}; });
      console.warn('ORDERS API RESPONSE (history):', resp.status, errData.code || errData.message);
      list.innerHTML = '<div style="text-align:center;padding:2rem;color:rgba(255,255,255,0.4);">' +
        (resp.status === 404 ? 'API route missing' : 'Could not load history') +
        ' <button onclick="loadMobileOrderHistory()" style="background:#00d4d4;color:#000;border:none;border-radius:6px;padding:6px 16px;font-size:13px;cursor:pointer;margin-left:8px;">Retry</button></div>';
      return;
    }
    var data = await resp.json();
    var orders = Array.isArray(data) ? data : (data.orders || []);
    console.log('ORDERS API RESPONSE (history):', { count: orders.length });
    if (!orders.length) {
      list.innerHTML = '<div style="text-align:center;padding:2.5rem 1rem;"><div style="font-size:2rem;margin-bottom:0.5rem;">📜</div><p style="color:rgba(255,255,255,0.4);font-size:0.9rem;">No completed orders yet</p></div>';
      return;
    }
    list.innerHTML = orders.map(function(order) {
      var sideLabel = (order.side || '').toUpperCase();
      var statusCls = statusClass(order.status);
      var statusTxt = statusLabel(order.status);
      var date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '--';
      return '<article style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:0.85rem 1rem;margin-bottom:0.6rem;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">' +
          '<span style="font-size:0.78rem;color:rgba(255,255,255,0.4);">' + escapeHtml(order.reference || order.id) + '</span>' +
          '<span class="status-pill ' + statusCls + '">' + statusTxt + '</span>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;font-size:0.87rem;">' +
          '<span><strong style="color:' + (sideLabel==='BUY'?'#16a34a':'#f0b90b') + ';">' + sideLabel + '</strong> ₹' + formatNumber(order.amountInr || 0) + '</span>' +
          '<span style="color:rgba(255,255,255,0.4);">' + date + '</span>' +
        '</div>' +
      '</article>';
    }).join('');
    if (data.total > orders.length) {
      list.innerHTML += '<p style="text-align:center;font-size:0.82rem;color:rgba(255,255,255,0.4);padding:0.5rem;">Showing 20 of ' + data.total + ' orders</p>';
    }
  } catch(e) {
    list.innerHTML = '<p style="text-align:center;padding:2rem;color:rgba(255,255,255,0.4);">Failed to load history</p>';
  }
}

function switchMobileOrderTab(tab) {
  _mobOrderTab = tab;
  var activeList = document.getElementById('mobileOrdersList');
  var histList = document.getElementById('mobileHistoryList');
  var tabs = document.getElementById('mobileOrdersTabs');
  if (!activeList || !histList) return;
  if (tab === 'active') {
    activeList.style.display = '';
    histList.style.display = 'none';
    if (typeof loadMobileActiveOrdersDirect === 'function') {
      loadMobileActiveOrdersDirect();
    } else {
      renderMobileActiveOrders();
    }
  } else {
    activeList.style.display = 'none';
    histList.style.display = '';
    loadMobileOrderHistory();
  }
  if (tabs) {
    tabs.querySelectorAll('[data-order-filter]').forEach(function(btn) {
      var isActive = btn.dataset.orderFilter === tab;
      btn.style.color = isActive ? '#f0b90b' : 'rgba(255,255,255,0.5)';
      btn.style.borderBottom = isActive ? '2px solid #f0b90b' : '2px solid transparent';
      btn.style.fontWeight = isActive ? '600' : '400';
    });
  }
}

if (mobileOrdersTabs) {
  mobileOrdersTabs.addEventListener('click', function(event) {
    var target = event.target.closest('[data-order-filter]');
    if (!target) return;
    switchMobileOrderTab(target.dataset.orderFilter);
  });
}

// ===== END MOBILE ORDERS TAB LOGIC =====

// ===== BYBIT-STYLE ORDERS SCREEN =====
var _ordMainTab = 'pending';
var _ordSubTab = 'inprogress';
var _ordAllOrders = [];
var _ordLoaded = false;

var _ORD_LIST_IDS = { inprogress: 'ordListInprogress', dispute: 'ordListDispute', completed: 'ordListCompleted', canceled: 'ordListCanceled' };
var _ORD_STATUS_MAP = {
  inprogress: ['CREATED','PENDING','PAID','PAYMENT_SENT'],
  dispute:    ['DISPUTED'],
  completed:  ['RELEASED','COMPLETED'],
  canceled:   ['CANCELLED','CANCELED','EXPIRED']
};

function _ordCard(order) {
  var side = getOrderDisplaySide(order);
  var sideColor = side === 'BUY' ? '#2ebd85' : '#f6465d';
  var d = order.createdAt ? new Date(order.createdAt) : null;
  var pad = function(n) { return n < 10 ? '0' + n : '' + n; };
  var dt = d ? d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds()) : '--';
  var qty = Number(order.assetAmount || 0);
  var qtyStr = qty % 1 === 0 ? qty.toString() : parseFloat(qty.toFixed(4)).toString();
  var fmt = function(n) { return formatNumber ? formatNumber(n) : n; };
  // Show only the OTHER person's name — not both participants
  var _myId = getCurrentUserId();
  var _myName = currentUser && currentUser.username;
  var _isBuyer = (_myId && (order.buyerUserId === _myId || order.buyerId === _myId)) ||
                 (_myName && order.buyerUsername === _myName);
  var _rawCounterparty = _isBuyer
    ? (order.sellerUsername || 'Seller')
    : (order.buyerUsername || 'Buyer');
  var counterparty = escapeHtml ? escapeHtml(_rawCounterparty) : _rawCounterparty;
  var rawId = order.id || '';
  var rawIdAttr = escapeHtml ? escapeHtml(rawId) : rawId;
  var ordId = encodeURIComponent(rawId);
  // store order in localStorage so order-flow page can show instantly
  // only write if status changed to avoid redundant writes on every poll cycle
  try {
    var _lsKey = 'p2p_order_' + rawId;
    var _existing = localStorage.getItem(_lsKey);
    var _newStatus = order.status || '';
    if (!_existing || JSON.parse(_existing).status !== _newStatus) {
      localStorage.setItem(_lsKey, JSON.stringify(order));
    }
  } catch(e){}
  var orderUrl = _buildOrderFlowUrl({ orderId: ordId, source: 'orders' });
  var chatUrl  = _buildOrderFlowUrl({ orderId: ordId, source: 'orders', openChat: '1' });
  var status = String(order.status || '').toUpperCase();
  var isEnded = ['RELEASED','COMPLETED','CANCELLED','CANCELED','EXPIRED'].indexOf(status) !== -1;
  var chatBtn = '<a href="'+chatUrl+'" class="ord-open-link" data-order-id="'+rawIdAttr+'" data-open-chat="1" data-url="'+chatUrl+'" style="display:flex;align-items:center;gap:5px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:5px 12px;color:rgba(255,255,255,0.8);font-size:12px;text-decoration:none;-webkit-tap-highlight-color:rgba(240,185,11,0.15);">'+
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Chat</a>';
  // Amount + chat row:
  // Active: left=info cols, right=amount. Below: left=counterparty, right=Chat
  // Ended: left=info cols, right= Chat (above) + amount (below). No counterparty.
  var amountAndActionHtml = isEnded
    ? '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">'+
        chatBtn+
        '<div style="font-size:18px;font-weight:700;color:#fff;">₹'+fmt(order.amountInr||0)+'</div>'+
      '</div>'
    : '<div style="font-size:18px;font-weight:700;color:#fff;">₹'+fmt(order.amountInr||0)+'</div>';
  var bottomRowHtml = isEnded
    ? '' // no bottom row for ended orders (no username, no download receipt)
    : '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;">'+
        '<span style="font-size:13px;color:rgba(255,255,255,0.65);">'+counterparty+'</span>'+
        chatBtn+
      '</div>';
  return '<article class="ord-open-link" data-order-id="'+rawIdAttr+'" data-open-chat="0" data-url="'+orderUrl+'" role="button" tabindex="0" style="display:block;text-decoration:none;color:inherit;padding:16px;border-bottom:1px solid rgba(255,255,255,0.06);-webkit-tap-highlight-color:rgba(255,255,255,0.04);cursor:pointer;">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">'+
      '<span style="font-size:15px;font-weight:700;"><span style="color:'+sideColor+';">'+side+'</span> '+(order.asset||'USDT')+'</span>'+
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'+
    '</div>'+
    '<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:10px;">'+dt+'</div>'+
    '<div style="display:flex;justify-content:space-between;align-items:flex-end;">'+
      '<div style="display:flex;flex-direction:column;gap:3px;">'+
        '<span style="font-size:12px;color:rgba(255,255,255,0.5);">Price <span style="color:rgba(255,255,255,0.85);">₹'+fmt(order.price||0)+'</span></span>'+
        '<span style="font-size:12px;color:rgba(255,255,255,0.5);">Quantity <span style="color:rgba(255,255,255,0.85);">'+qtyStr+'</span></span>'+
        '<span style="font-size:12px;color:rgba(255,255,255,0.5);">Fee <span style="color:rgba(255,255,255,0.85);">0 USDT</span></span>'+
      '</div>'+
      amountAndActionHtml+
    '</div>'+
    bottomRowHtml+
  '</article>';
}

function _ordEmpty(msg) {
  return '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:70px 20px;gap:14px;">'+
    '<svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'+
    '<p style="color:rgba(255,255,255,0.35);font-size:14px;margin:0;">'+msg+'</p>'+
  '</div>';
}

function _ordLoadingHtml() {
  var skRow = '<div style="padding:16px;border-bottom:1px solid rgba(255,255,255,0.06);">' +
    '<div style="display:flex;justify-content:space-between;margin-bottom:8px;">' +
      '<div style="width:80px;height:16px;background:rgba(255,255,255,0.07);border-radius:4px;"></div>' +
      '<div style="width:60px;height:16px;background:rgba(255,255,255,0.07);border-radius:4px;"></div>' +
    '</div>' +
    '<div style="width:130px;height:12px;background:rgba(255,255,255,0.04);border-radius:4px;margin-bottom:12px;"></div>' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-end;">' +
      '<div style="display:flex;flex-direction:column;gap:6px;">' +
        '<div style="width:110px;height:11px;background:rgba(255,255,255,0.04);border-radius:4px;"></div>' +
        '<div style="width:85px;height:11px;background:rgba(255,255,255,0.04);border-radius:4px;"></div>' +
      '</div>' +
      '<div style="width:75px;height:20px;background:rgba(255,255,255,0.07);border-radius:4px;"></div>' +
    '</div>' +
  '</div>';
  return '<style>@keyframes _sk{0%,100%{opacity:.45}50%{opacity:1}}[data-sk]{animation:_sk 1.4s ease-in-out infinite}</style>' +
    '<div data-sk>' + skRow + skRow + skRow + '</div>';
}

function _setOrdSubPill(activeId, inactiveIds) {
  [activeId].concat(inactiveIds).forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var isActive = id === activeId;
    el.style.background = isActive ? '#fff' : 'rgba(255,255,255,0.08)';
    el.style.color = isActive ? '#000' : 'rgba(255,255,255,0.6)';
    el.style.fontWeight = isActive ? '600' : '400';
  });
}

// Show/hide the correct list div and render its content
function _showOrdList(sub) {
  // Always show/hide the correct divs first (even before data loaded)
  Object.keys(_ORD_LIST_IDS).forEach(function(k) {
    var el = document.getElementById(_ORD_LIST_IDS[k]);
    if (el) el.style.display = k === sub ? 'block' : 'none';
  });
  if (!_ordLoaded) return; // loadBybitorOrders will render content when done
  var el = document.getElementById(_ORD_LIST_IDS[sub]);
  if (!el) return;
  var statuses = _ORD_STATUS_MAP[sub] || [];
  var filtered = _ordAllOrders.filter(function(o) {
    return statuses.indexOf((o.status || '').toUpperCase()) !== -1;
  });
  try {
    el.innerHTML = filtered.length ? filtered.map(_ordCard).join('') : _ordEmpty('No orders');
  } catch(e) {
    console.error('[_showOrdList] _ordCard error sub=' + sub + ':', e);
    el.innerHTML = _ordEmpty('No orders');
  }
  el.style.display = 'block'; // ensure visible after content set
}

function switchOrdMain(tab) {
  _ordMainTab = tab;
  // Update main tab styles
  var tabPend = document.getElementById('ordTabPending');
  var tabEnd = document.getElementById('ordTabEnded');
  if (tabPend) {
    tabPend.style.borderBottomColor = tab === 'pending' ? '#f0b90b' : 'transparent';
    tabPend.style.color = tab === 'pending' ? '#fff' : 'rgba(255,255,255,0.4)';
    tabPend.style.fontWeight = tab === 'pending' ? '700' : '500';
  }
  if (tabEnd) {
    tabEnd.style.borderBottomColor = tab === 'ended' ? '#f0b90b' : 'transparent';
    tabEnd.style.color = tab === 'ended' ? '#fff' : 'rgba(255,255,255,0.4)';
    tabEnd.style.fontWeight = tab === 'ended' ? '700' : '500';
  }
  // Toggle sub-tab rows
  var pendSub = document.getElementById('pendingSubTabs');
  var endSub = document.getElementById('endedSubTabs');
  if (pendSub) pendSub.style.display = tab === 'pending' ? 'flex' : 'none';
  if (endSub) endSub.style.display = tab === 'ended' ? 'flex' : 'none';
  // Switch to default sub-tab
  if (tab === 'pending') {
    switchOrdSub('inprogress');
  } else {
    switchOrdSub('completed');
  }
}

function switchOrdSub(sub) {
  _ordSubTab = sub;
  // Update pill styles
  if (sub === 'inprogress') _setOrdSubPill('ordSubInprogress', ['ordSubDispute']);
  else if (sub === 'dispute') _setOrdSubPill('ordSubDispute', ['ordSubInprogress']);
  else if (sub === 'completed') _setOrdSubPill('ordSubCompleted', ['ordSubCanceled']);
  else if (sub === 'canceled') _setOrdSubPill('ordSubCanceled', ['ordSubCompleted']);
  // Show correct list
  _showOrdList(sub);
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS ENGINE v2 — clean architecture
//  • fetchOrdersSafe()  single entry point, AbortController race protection
//  • SSE-first updates  (fallback 15s poll only when SSE is down)
//  • visibilitychange   refresh on tab focus
//  • loadBybitorOrders  alias kept for any legacy call sites
// ─────────────────────────────────────────────────────────────────────────────

// ── state ──────────────────────────────────────────────────────────────────
var _ordReqId     = 0;      // incremented each call; stale responses are discarded
var _ordAbort     = null;   // AbortController for the in-flight request
var _ordHistoryAbort = null; // background history request controller
var _ordFailing   = 0;      // consecutive failure count (reset on success / user change)
var _ordPollTimer = null;   // single fallback-poll timer (only when SSE is down)
var _ordFetching  = false;  // legacy compat flag — mirrors !!_ordAbort
var _ordRefreshQueued = false; // another refresh was requested while one was in progress

// ── cache ──────────────────────────────────────────────────────────────────
var _ORD_CACHE_KEY    = 'p2p_orders_cache';
var _ORD_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function _saveOrdCache(orders) {
  var currentUserId = getCurrentUserId();
  if (!currentUserId) return;
  try {
    localStorage.setItem(_ORD_CACHE_KEY, JSON.stringify({
      ts: Date.now(), userId: currentUserId, orders: orders
    }));
  } catch(_) {}
}
function _loadOrdCache() {
  try {
    var raw = JSON.parse(localStorage.getItem(_ORD_CACHE_KEY) || 'null');
    var currentUserId = getCurrentUserId();
    if (!raw) return [];
    if (!currentUserId || raw.userId !== currentUserId) {
      localStorage.removeItem(_ORD_CACHE_KEY);
      return [];
    }
    if (!raw.ts || (Date.now() - raw.ts) > _ORD_CACHE_TTL_MS) {
      localStorage.removeItem(_ORD_CACHE_KEY);
      return [];
    }
    return Array.isArray(raw.orders) ? raw.orders : [];
  } catch(_) { return []; }
}

function _ordPersistSnapshots(orders) {
  try {
    (Array.isArray(orders) ? orders : []).forEach(function(order) {
      if (!order || !order.id) return;
      localStorage.setItem('p2p_order_' + order.id, JSON.stringify(order));
    });
  } catch (_) {}
}

function _ordBelongsToCurrentUser(order) {
  if (!order || !currentUser) {
    return false;
  }

  var currentUserId = getCurrentUserId();
  var currentUserEmail = String(currentUser.email || '').trim().toLowerCase();
  var currentUserName = String(currentUser.username || '').trim().toLowerCase();
  var hasMatch = false;

  function normalized(value) {
    return String(value || '').trim().toLowerCase();
  }

  function checkId(value) {
    return Boolean(currentUserId) && String(value || '').trim() === currentUserId;
  }

  function checkName(value) {
    return Boolean(currentUserName) && normalized(value) === currentUserName;
  }

  function checkEmail(value) {
    return Boolean(currentUserEmail) && normalized(value) === currentUserEmail;
  }

  [
    order.buyerUserId,
    order.buyerId,
    order.sellerUserId,
    order.sellerId
  ].forEach(function(value) {
    if (!hasMatch && checkId(value)) {
      hasMatch = true;
    }
  });

  if (hasMatch) {
    return true;
  }

  [
    order.buyerUsername,
    order.sellerUsername
  ].forEach(function(value) {
    if (!hasMatch && checkName(value)) {
      hasMatch = true;
    }
  });

  if (hasMatch) {
    return true;
  }

  [
    order.buyerEmail,
    order.sellerEmail
  ].forEach(function(value) {
    if (!hasMatch && checkEmail(value)) {
      hasMatch = true;
    }
  });

  if (hasMatch) {
    return true;
  }

  if (Array.isArray(order.participants)) {
    order.participants.forEach(function(participant) {
      if (hasMatch) return;
      if (checkId(participant && participant.id)) hasMatch = true;
      else if (checkName(participant && participant.username)) hasMatch = true;
      else if (checkEmail(participant && participant.email)) hasMatch = true;
    });
  }

  return hasMatch;
}

function _ordLoadSavedSnapshots(options) {
  options = options || {};
  var activeOnly = options.activeOnly !== false;
  if (!currentUser || !window.localStorage) {
    return [];
  }

  var orders = [];
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (!key || key.indexOf('p2p_order_') !== 0) continue;
      var raw = localStorage.getItem(key);
      if (!raw) continue;
      var order = JSON.parse(raw);
      if (!order || !order.id || !_ordBelongsToCurrentUser(order)) continue;
      if (activeOnly && !isOngoingOrderStatus(order.status)) continue;
      orders.push(order);
    }
  } catch (_) {
    return [];
  }

  return orders.sort(function(a, b) {
    var left = new Date(a.updatedAt || a.createdAt || 0).getTime();
    var right = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return right - left;
  });
}

function _ordPrimeOrderOpen(orderId) {
  if (!orderId) {
    return;
  }
  try {
    var match = (_ordAllOrders || []).find(function(order) {
      return order && String(order.id || '').trim() === String(orderId || '').trim();
    });
    if (match) {
      localStorage.setItem('p2p_order_' + match.id, JSON.stringify(match));
    }
  } catch (_) {}
}

function _ordFocusBucketForStatus(status) {
  var normalizedStatus = normalizeStatusForUi(status);
  if (normalizedStatus === 'RELEASED') {
    switchOrdMain('ended');
    switchOrdSub('completed');
    return;
  }
  if (normalizedStatus === 'CANCELLED' || normalizedStatus === 'EXPIRED') {
    switchOrdMain('ended');
    switchOrdSub('canceled');
  }
}

function _ordSyncSingleOrder(order, options) {
  options = options || {};
  if (!order || !order.id) {
    return null;
  }

  var normalizedOrder = Object.assign({}, order, {
    status: normalizeStatusForUi(order.status),
    updatedAt: order.updatedAt || order.createdAt || new Date().toISOString(),
    createdAt: order.createdAt || order.updatedAt || new Date().toISOString()
  });

  storeOrderForMobile(normalizedOrder);
  try {
    localStorage.setItem('p2p_order_' + normalizedOrder.id, JSON.stringify(normalizedOrder));
  } catch (_) {}

  var found = false;
  _ordAllOrders = (Array.isArray(_ordAllOrders) ? _ordAllOrders : []).map(function(existing) {
    if (existing && existing.id === normalizedOrder.id) {
      found = true;
      return Object.assign({}, existing, normalizedOrder);
    }
    return existing;
  });

  if (!found) {
    _ordAllOrders = _ordMergeById([normalizedOrder], _ordAllOrders);
  }

  if (_ordLoaded || options.seedOrderList) {
    _ordLoaded = true;
    _ordRenderAll(_ordAllOrders, false);
  } else {
    _saveOrdCache(_ordAllOrders);
  }

  if (options.focusBucket) {
    _ordFocusBucketForStatus(normalizedOrder.status);
  }

  return normalizedOrder;
}

// ── UI helpers ─────────────────────────────────────────────────────────────
function _ordRenderAll(allOrders, fromCache) {
  var map = {};
  allOrders.forEach(function(o) { if (o && o.id) map[o.id] = o; });
  _ordAllOrders = Object.keys(map).map(function(k) { return map[k]; })
    .sort(function(a, b) { return (b.createdAt || 0) > (a.createdAt || 0) ? 1 : -1; });
  _ordAllOrders.forEach(function(order) {
    storeOrderForMobile(order);
  });
  pruneMobileOrdersCache();
  _ordPersistSnapshots(_ordAllOrders);
  if (!fromCache) _saveOrdCache(_ordAllOrders);
  _ordLoaded  = true;
  _ordFetching = false;
  _ordFailing  = 0;
  Object.keys(_ORD_LIST_IDS).forEach(function(sub) {
    var el = document.getElementById(_ORD_LIST_IDS[sub]);
    if (!el) return;
    var filtered = _ordAllOrders.filter(function(o) {
      return (_ORD_STATUS_MAP[sub] || []).indexOf((o.status || '').toUpperCase()) !== -1;
    });
    try {
      el.innerHTML = filtered.length ? filtered.map(_ordCard).join('') : _ordEmpty('No orders');
    } catch(e) { el.innerHTML = _ordEmpty('No orders'); }
    el.style.display = sub === _ordSubTab ? 'block' : 'none';
  });
  var activeEl = document.getElementById(_ORD_LIST_IDS[_ordSubTab]);
  if (activeEl) activeEl.style.display = 'block';
}

function _ordMergeById(primaryOrders, secondaryOrders) {
  var map = {};
  [].concat(primaryOrders || [], secondaryOrders || []).forEach(function(order) {
    if (!order || !order.id) return;
    map[order.id] = Object.assign({}, map[order.id] || {}, order);
  });
  return Object.keys(map).map(function(id) { return map[id]; });
}

function _ordEndedOrders(orders) {
  return (Array.isArray(orders) ? orders : []).filter(function(order) {
    var status = String(order && order.status || '').toUpperCase();
    return ['RELEASED', 'COMPLETED', 'CANCELLED', 'CANCELED', 'EXPIRED'].indexOf(status) !== -1;
  });
}

function _ordCachedEndedOrders() {
  return _ordEndedOrders(
    _ordMergeById(
      _ordAllOrders,
      _ordMergeById(_loadOrdCache(), _ordLoadSavedSnapshots({ activeOnly: false }))
    )
  );
}

function _ordFetchWithTimeout(url, fetchOpts, timeoutMs) {
  var timeoutId;
  var timeoutPromise = new Promise(function(_, reject) {
    timeoutId = setTimeout(function() { reject(new Error('timeout')); }, timeoutMs || 15000);
  });
  return Promise.race([fetch(url, fetchOpts), timeoutPromise]).then(
    function(result) {
      clearTimeout(timeoutId);
      return result;
    },
    function(error) {
      clearTimeout(timeoutId);
      throw error;
    }
  );
}

function _ordExtractOrders(data) {
  return Array.isArray(data) ? data : (data && (data.orders || data.data) || []);
}

function _ordExtractBootstrapOrders(data) {
  if (!data || typeof data !== 'object') {
    return [];
  }
  if (Array.isArray(data.orders) && data.orders.length) {
    return data.orders;
  }
  return _ordMergeById(data.activeOrders || [], data.historyOrders || []);
}

function _ordFilterActiveOrders(orders) {
  return (Array.isArray(orders) ? orders : []).filter(function(order) {
    return isOngoingOrderStatus(order && order.status);
  });
}

function _ordFetchActiveOrdersFallback(fetchOpts, parentReqId) {
  return _ordFetchWithTimeout('/api/p2p/orders/history?limit=50&offset=0', fetchOpts, 20000)
    .then(function(response) {
      if (parentReqId !== _ordReqId) return null;
      if (!response || !response.ok) return null;
      return response.json().catch(function() { return null; });
    })
    .then(function(data) {
      if (!data || parentReqId !== _ordReqId) return null;
      return {
        degraded: true,
        orders: _ordFilterActiveOrders(_ordExtractOrders(data))
      };
    })
    .catch(function(error) {
      if (error && error.name === 'AbortError') return null;
      return null;
    });
}

function _ordFetchMyActive(fetchOpts, parentReqId) {
  return _ordFetchWithTimeout('/api/p2p/orders/my-active', fetchOpts, 8000)
    .then(function(response) {
      if (parentReqId !== _ordReqId) return null;
      if (!response) return null;
      if (response.status === 401) {
        _ordShowLogin();
        return null;
      }
      if (!response.ok) return null;
      return response.json().catch(function() { return null; });
    })
    .then(function(data) {
      if (!data || parentReqId !== _ordReqId) return null;
      return {
        total: Number(data.total || 0),
        orders: _ordFilterActiveOrders(_ordExtractOrders(data))
      };
    })
    .catch(function(error) {
      if (error && error.name === 'AbortError') return null;
      return null;
    });
}

function _fetchOrderHistoryInBackground(parentReqId) {
  if (!getCurrentUserId()) return;
  if (_ordHistoryAbort) { try { _ordHistoryAbort.abort(); } catch(_) {} }

  var historyCtrl = window.AbortController ? new AbortController() : null;
  _ordHistoryAbort = historyCtrl;
  var historyFetchOpts = { credentials: 'include', headers: { 'Cache-Control': 'no-store' } };
  if (historyCtrl) historyFetchOpts.signal = historyCtrl.signal;

  _ordFetchWithTimeout('/api/p2p/orders/history?limit=50&offset=0', historyFetchOpts, 20000)
    .then(function(response) {
      if (parentReqId !== _ordReqId) return null;
      if (!response || !response.ok) return null;
      return response.json().catch(function() { return null; });
    })
    .then(function(data) {
      if (!data || parentReqId !== _ordReqId) return;
      var historyOrders = Array.isArray(data) ? data : (data.orders || []);
      _ordRenderAll(_ordMergeById(_ordAllOrders, historyOrders), false);
    })
    .catch(function(error) {
      if (error && error.name === 'AbortError') return;
    })
    .finally(function() {
      if (_ordHistoryAbort === historyCtrl) {
        _ordHistoryAbort = null;
      }
    });
}

function _ordShowSkeleton() {
  Object.keys(_ORD_LIST_IDS).forEach(function(sub) {
    var el = document.getElementById(_ORD_LIST_IDS[sub]);
    if (el) el.style.display = 'none';
  });
  var el = document.getElementById(_ORD_LIST_IDS[_ordSubTab]);
  if (el) { el.style.display = 'block'; el.innerHTML = _ordLoadingHtml(); }
}
function _ordShowRetry(msg) {
  _ordLoaded   = true;
  _ordFetching = false;
  var el = document.getElementById(_ORD_LIST_IDS[_ordSubTab]);
  if (!el) return;
  el.style.display = 'block';
  el.innerHTML =
    '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:14px;">' +
    '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
    '<p style="color:rgba(255,255,255,0.45);font-size:14px;margin:0;text-align:center;">' + (msg || 'Could not load orders') + '</p>' +
    '<button onclick="fetchOrdersSafe()" style="background:#00d4d4;color:#000;border:none;border-radius:8px;padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer;min-width:120px;">Retry</button>' +
    '</div>';
}
function _ordShowLogin() {
  _ordLoaded   = true;
  _ordFetching = false;
  Object.keys(_ORD_LIST_IDS).forEach(function(sub) {
    var el = document.getElementById(_ORD_LIST_IDS[sub]);
    if (el) el.style.display = 'none';
  });
  var el = document.getElementById('ordListInprogress');
  if (!el) return;
  el.style.display = 'block';
  el.innerHTML =
    '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:16px;">' +
    '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>' +
    '<p style="color:rgba(255,255,255,0.45);font-size:14px;margin:0;text-align:center;">Login to view your orders</p>' +
    '<button onclick="requireLoginNotice()" style="background:#f0b90b;color:#000;border:none;border-radius:8px;padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer;min-width:120px;">Login</button>' +
    '</div>';
}

function _ordDrainQueuedRefresh() {
  if (!_ordRefreshQueued || !getCurrentUserId()) {
    return;
  }
  _ordRefreshQueued = false;
  setTimeout(function() {
    if (getCurrentUserId()) {
      fetchOrdersSafe();
    }
  }, 80);
}

// ── SINGLE ENTRY POINT ─────────────────────────────────────────────────────
// fetchOrdersSafe() — race-protected, abort-controller guarded, retry-capped
function fetchOrdersSafe() {
  if (!getCurrentUserId()) { _ordShowLogin(); return; }

  if (_ordFetching) {
    _ordRefreshQueued = true;
    return;
  }

  // Show cache/skeleton only for the initial unresolved load.
  if (!_ordLoaded) {
    var cached = _loadOrdCache();
    if (cached.length) {
      _ordRenderAll(cached, true);
    } else {
      var snapshots = _ordLoadSavedSnapshots({ activeOnly: true });
      if (!snapshots.length) {
        snapshots = _ordLoadSavedSnapshots({ activeOnly: false });
      }
      if (snapshots.length) {
        _ordRenderAll(snapshots, false);
      } else {
        _ordShowSkeleton();
      }
    }
  }

  // Keep only one background history request active.
  if (_ordHistoryAbort) { try { _ordHistoryAbort.abort(); } catch(_) {} }
  var ctrl = window.AbortController ? new AbortController() : null;
  _ordAbort    = ctrl;
  _ordFetching = true;
  _ordRefreshQueued = false;
  var myReqId  = ++_ordReqId;

  var fetchOpts = { credentials: 'include', headers: { 'Cache-Control': 'no-store' } };
  if (ctrl) fetchOpts.signal = ctrl.signal;

  _ordFetchMyActive(fetchOpts, myReqId)
  .then(function(activeData) {
    if (myReqId !== _ordReqId) return null;
    _ordAbort    = null;
    _ordFetching = false;

    if (activeData && activeData.orders && activeData.orders.length) {
      _ordFailing = 0;
      _ordRenderAll(_ordMergeById(activeData.orders, _ordCachedEndedOrders()), false);
      _fetchOrderHistoryInBackground(myReqId);
      _ordDrainQueuedRefresh();
      return null;
    }

    return _ordFetchWithTimeout('/api/p2p/orders/bootstrap?activeLimit=50&historyLimit=50', fetchOpts, 12000)
      .then(function(r) {
        if (myReqId !== _ordReqId) return null;
        if (r.status === 401) { _ordShowLogin(); return null; }
        if (!r.ok) {
          return _ordFetchActiveOrdersFallback(fetchOpts, myReqId).then(function(fallbackData) {
            if (fallbackData) {
              _ordFailing = 0;
              _ordRenderAll(_ordMergeById(fallbackData.orders || [], _ordCachedEndedOrders()), false);
              _fetchOrderHistoryInBackground(myReqId);
              _ordDrainQueuedRefresh();
              return null;
            }
            _ordFailing++;
            if (_ordFailing <= 3) {
              setTimeout(fetchOrdersSafe, _ordFailing * 2000);
            } else {
              _ordShowRetry('Could not load orders — tap to retry');
            }
            _ordDrainQueuedRefresh();
            return null;
          });
        }
        _ordFailing = 0;
        return r.json().catch(function() { return null; });
      });
  })
  .then(function(data) {
    if (!data) return;
    if (myReqId !== _ordReqId) return; // race check after json parse
    var mergedOrders = _ordExtractBootstrapOrders(data);
    if (!mergedOrders.length) {
      var recoveredOrders = _ordMergeById(_ordLoadSavedSnapshots({ activeOnly: true }), _ordCachedEndedOrders());
      if (!recoveredOrders.length) {
        recoveredOrders = _ordLoadSavedSnapshots({ activeOnly: false });
      }
      _ordRenderAll(recoveredOrders, false);
    } else {
      _ordRenderAll(_ordMergeById(mergedOrders, _ordLoadSavedSnapshots({ activeOnly: true })), false);
      _fetchOrderHistoryInBackground(myReqId);
    }
    _ordDrainQueuedRefresh();
  })
  .catch(function(e) {
    if (e && e.name === 'AbortError') return; // intentionally cancelled — ignore
    if (myReqId !== _ordReqId) return;
    _ordAbort    = null;
    _ordFetching = false;
    _ordFetchActiveOrdersFallback(fetchOpts, myReqId).then(function(fallbackData) {
      if (fallbackData && myReqId === _ordReqId) {
        _ordRenderAll(_ordMergeById(fallbackData.orders || [], _ordCachedEndedOrders()), false);
        _fetchOrderHistoryInBackground(myReqId);
        _ordDrainQueuedRefresh();
        return;
      }
      _ordFailing++;
      if (_ordFailing <= 3) {
        setTimeout(fetchOrdersSafe, _ordFailing * 2000);
      } else {
        _ordShowRetry('Connection error — tap to retry');
      }
      _ordDrainQueuedRefresh();
    });
  });
}

// backward-compat alias — all legacy call sites still work
var loadBybitorOrders = fetchOrdersSafe;

// ── FALLBACK POLL — only used when SSE is disconnected ─────────────────────
function _startFallbackPoll() {
  if (_ordPollTimer) return; // already running
  _ordPollTimer = setInterval(function() {
    if (currentUser && !_ordAbort) fetchOrdersSafe();
  }, 15000);
}
function _stopFallbackPoll() {
  if (_ordPollTimer) { clearInterval(_ordPollTimer); _ordPollTimer = null; }
}

// ── KEPT for call-site compatibility (showMobScreen calls startOrdPolling) ─
function startOrdPolling()   {
  if (!_ordLoaded) {
    var snapshots = _ordLoadSavedSnapshots({ activeOnly: false });
    if (snapshots.length) {
      _ordRenderAll(snapshots, false);
    }
  }
  fetchOrdersSafe();
}
function stopOrdPolling()    { /* no-op — SSE handles real-time */ }
function startBgOrdPolling() { _startFallbackPoll(); }
function stopBgOrdPolling()  { _stopFallbackPoll(); }

// ── VISIBILITY — refresh when tab/app comes back into focus ────────────────
document.addEventListener('visibilitychange', function() {
  if (!document.hidden && currentUser && !_ordFetching) fetchOrdersSafe();
});

// Wire orders screen tab buttons (click + touchend for iOS)
(function() {
  function wireOrdBtn(id, fn) {
    var el = document.getElementById(id);
    if (!el) return;
    var fired = false;
    el.addEventListener('touchend', function(e) {
      e.preventDefault();
      if (fired) return;
      fired = true;
      setTimeout(function() { fired = false; }, 400);
      fn();
    }, { passive: false });
    el.addEventListener('click', function() {
      if (fired) return;
      fn();
    });
  }
  wireOrdBtn('ordTabPending',    function() { switchOrdMain('pending'); });
  wireOrdBtn('ordTabEnded',      function() { switchOrdMain('ended'); });
  wireOrdBtn('ordSubInprogress', function() { switchOrdSub('inprogress'); });
  wireOrdBtn('ordSubDispute',    function() { switchOrdSub('dispute'); });
  wireOrdBtn('ordSubCompleted',  function() { switchOrdSub('completed'); });
  wireOrdBtn('ordSubCanceled',   function() { switchOrdSub('canceled'); });
})();


if (sideTabs) {
  sideTabs.addEventListener('click', (event) => {
    const tab = event.target.closest('.side-tab, .gt-side-tab');
    if (!tab) {
      return;
    }

    currentSide = tab.dataset.side === 'sell' ? 'sell' : 'buy';
    sideTabs.querySelectorAll('.side-tab, .gt-side-tab').forEach((btn) => {
      btn.classList.toggle('active', btn === tab);
    });
    closeDealModal();
    loadOffers();
    loadLiveOrders();
  });
}

if (assetChipRow) {
  assetChipRow.addEventListener('click', (event) => {
    const chip = event.target.closest('.asset-chip');
    if (!chip) {
      return;
    }

    currentAsset = chip.dataset.asset;
    if (assetFilter) {
      assetFilter.value = currentAsset;
    }

    assetChipRow.querySelectorAll('.asset-chip').forEach((btn) => {
      btn.classList.toggle('active', btn === chip);
    });

    closeDealModal();
    loadOffers();
    loadLiveOrders();
  });
}

if (assetFilter) {
  assetFilter.addEventListener('change', () => {
    currentAsset = String(assetFilter.value || 'USDT').toUpperCase();

    if (assetChipRow) {
      assetChipRow.querySelectorAll('.asset-chip').forEach((btn) => {
        btn.classList.toggle('active', String(btn.dataset.asset || '').toUpperCase() === currentAsset);
      });
    }

    closeDealModal();
    loadOffers();
    loadLiveOrders();
  });
}

if (applyFilters) {
  applyFilters.addEventListener('click', () => {
    loadOffers();
    loadLiveOrders();
  });
}

if (refreshOffers) {
  refreshOffers.addEventListener('click', () => {
    loadOffers();
    loadLiveOrders();
    loadExchangeTicker();
  });
}

// ===== PASSWORD RESET =====
(function() {
  var stepLogin = document.getElementById('authStepLogin');
  var stepForgot = document.getElementById('authStepForgot');
  var stepReset = document.getElementById('authStepReset');
  var forgotLink = document.getElementById('forgotPasswordLink');
  var backToLoginBtn = document.getElementById('backToLoginBtn');
  var backToForgotBtn = document.getElementById('backToForgotBtn');
  var sendResetCodeBtn = document.getElementById('sendResetCodeBtn');
  var doResetBtn = document.getElementById('doResetBtn');
  var resetEmailInput = document.getElementById('resetEmailInput');
  var resetCodeInput = document.getElementById('resetCodeInput');
  var newPasswordInput = document.getElementById('newPasswordInput');
  var confirmPasswordInput = document.getElementById('confirmPasswordInput');
  var forgotMsg = document.getElementById('forgotMsg');
  var resetMsg = document.getElementById('resetMsg');
  var _resetEmail = '';

  function showStep(step) {
    if (stepLogin) stepLogin.style.display = step === 'login' ? '' : 'none';
    if (stepForgot) stepForgot.style.display = step === 'forgot' ? '' : 'none';
    if (stepReset) stepReset.style.display = step === 'reset' ? '' : 'none';
  }

  if (forgotLink) forgotLink.addEventListener('click', function() { showStep('forgot'); if (forgotMsg) forgotMsg.textContent = ''; });
  if (backToLoginBtn) backToLoginBtn.addEventListener('click', function() { showStep('login'); });
  if (backToForgotBtn) backToForgotBtn.addEventListener('click', function() { showStep('forgot'); });

  if (sendResetCodeBtn) sendResetCodeBtn.addEventListener('click', async function() {
    var email = resetEmailInput ? resetEmailInput.value.trim() : '';
    if (!email) { if (forgotMsg) forgotMsg.textContent = 'Enter your email.'; return; }
    sendResetCodeBtn.disabled = true; sendResetCodeBtn.textContent = 'Sending...';
    if (forgotMsg) forgotMsg.textContent = '';
    try {
      var res = await fetch('/api/p2p/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      var data = await res.json();
      if (forgotMsg) { forgotMsg.style.color = res.ok ? '#16c784' : '#f6465d'; forgotMsg.textContent = data.message || 'Code sent.'; }
      if (res.ok) { _resetEmail = email; showStep('reset'); if (resetMsg) resetMsg.textContent = ''; }
    } catch(e) { if (forgotMsg) { forgotMsg.style.color='#f6465d'; forgotMsg.textContent = 'Network error.'; } }
    finally { sendResetCodeBtn.disabled = false; sendResetCodeBtn.textContent = 'Send Code'; }
  });

  if (doResetBtn) doResetBtn.addEventListener('click', async function() {
    var code = resetCodeInput ? resetCodeInput.value.trim() : '';
    var newPass = newPasswordInput ? newPasswordInput.value.trim() : '';
    var confirmPass = confirmPasswordInput ? confirmPasswordInput.value.trim() : '';
    if (!code || !newPass) { if (resetMsg) { resetMsg.style.color='#f6465d'; resetMsg.textContent = 'Fill all fields.'; } return; }
    if (newPass !== confirmPass) { if (resetMsg) { resetMsg.style.color='#f6465d'; resetMsg.textContent = 'Passwords do not match.'; } return; }
    if (newPass.length < 8) { if (resetMsg) { resetMsg.style.color='#f6465d'; resetMsg.textContent = 'Password must be at least 8 characters.'; } return; }
    doResetBtn.disabled = true; doResetBtn.textContent = 'Resetting...';
    if (resetMsg) resetMsg.textContent = '';
    try {
      var res = await fetch('/api/p2p/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: _resetEmail, code, newPassword: newPass }) });
      var data = await res.json();
      if (resetMsg) { resetMsg.style.color = res.ok ? '#16c784' : '#f6465d'; resetMsg.textContent = data.message; }
      if (res.ok) { setTimeout(function(){ showStep('login'); if (emailInput) emailInput.value = _resetEmail; }, 1800); }
    } catch(e) { if (resetMsg) { resetMsg.style.color='#f6465d'; resetMsg.textContent = 'Network error.'; } }
    finally { doResetBtn.disabled = false; doResetBtn.textContent = 'Reset Password'; }
  });
})();

if (loginBtn) {
  loginBtn.addEventListener('click', loginUser);
  loginBtn.addEventListener('touchend', function(e) { e.preventDefault(); loginUser(); });
}
if (logoutBtn) {
  logoutBtn.addEventListener('click', logoutUser);
}
if (openAuthBtn) {
  openAuthBtn.addEventListener('click', () => { window.location.href = '/auth'; });
}
if (openAuthBtnDrawer) {
  openAuthBtnDrawer.addEventListener('click', () => { window.location.href = '/auth'; });
}
if (closeAuthBtn) {
  closeAuthBtn.addEventListener('click', () => setAuthModalOpen(false));
}
if (authBackdrop) {
  authBackdrop.addEventListener('click', () => setAuthModalOpen(false));
}
if (emailInput) {
  emailInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      loginUser();
    }
  });
}
if (passwordInput) {
  passwordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      loginUser();
    }
  });
}

if (dealPayAmount) {
  dealPayAmount.addEventListener('input', () => {
    if (dealSyncLock) {
      return;
    }
    updateDealComputedFromPay();
    refreshDealValidation();
  });
}

if (dealReceiveAmount) {
  dealReceiveAmount.addEventListener('input', () => {
    if (dealSyncLock) {
      return;
    }
    updateDealComputedFromReceive();
    refreshDealValidation();
  });
}

if (dealPaymentSelect) {
  dealPaymentSelect.addEventListener('change', () => {
    if (dealPaymentPreview) {
      dealPaymentPreview.textContent = dealPaymentSelect.value || '--';
    }
    refreshDealValidation();
  });
}

if (dealConfirmBtn) {
  dealConfirmBtn.addEventListener('click', submitDealOrder);
}

if (dealCancelBtn) {
  dealCancelBtn.addEventListener('click', closeDealModal);
}

if (dealBackdrop) {
  dealBackdrop.addEventListener('click', closeDealModal);
}

if (kycCloseBtn) {
  kycCloseBtn.addEventListener('click', closeKycModal);
}

if (kycBackdrop) {
  kycBackdrop.addEventListener('click', closeKycModal);
}

if (kycAadhaarInput) {
  kycAadhaarInput.addEventListener('input', () => {
    const digits = String(kycAadhaarInput.value || '')
      .replace(/\D/g, '')
      .slice(0, 12);
    kycAadhaarInput.value = digits;
  });
}

if (kycAadhaarFrontInput) {
  kycAadhaarFrontInput.addEventListener('change', () => {
    const file = kycAadhaarFrontInput.files?.[0] || null;
    setKycFileMeta(kycAadhaarFrontMeta, file, 'Upload clear front side image.');
  });
}

if (kycSelfieInput) {
  kycSelfieInput.addEventListener('change', () => {
    const file = kycSelfieInput.files?.[0] || null;
    setKycFileMeta(kycSelfieMeta, file, 'Face and document must be clearly visible in one frame.');
  });
}

if (kycForm) {
  kycForm.addEventListener('submit', submitKycForm);
}

if (adCreateForm) {
  adCreateForm.addEventListener('submit', handleAdCreate);
}

if (refreshMyAdsBtn) {
  refreshMyAdsBtn.addEventListener('click', () => {
    loadMyAds();
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeOrderModal);
}
if (closeModalBackdrop) {
  closeModalBackdrop.addEventListener('click', closeOrderModal);
}
if (markPaidBtn) {
  markPaidBtn.addEventListener('click', async () => {
    const action = markPaidBtn.dataset.action;
    markPaidBtn.style.transform = 'scale(0.95)';
    markPaidBtn.style.transition = 'transform 0.1s ease';
    setTimeout(function() { markPaidBtn.style.transform = ''; }, 150);
    if (action === 'release') {
      try {
        await updateOrderStatus('release');
      } catch (error) {
        // Status message already updated by updateOrderStatus.
      }
      return;
    }
    if (action === 'pay') {
      setPaymentPanelOpen(true);
      return;
    }
  });
}
if (cancelOrderBtn) {
  cancelOrderBtn.addEventListener('click', () => setCancelModalOpen(true));
}
if (disputeBtn) {
  disputeBtn.addEventListener('click', async () => {
    if (disputeBtn.disabled) return;
    if (!confirm('Are you sure you want to raise a dispute? An admin will review this order.')) return;
    disputeBtn.disabled = true;
    disputeBtn.textContent = 'Raising...';
    try {
      await updateOrderStatus('dispute');
    } catch (err) {
      disputeBtn.disabled = false;
      disputeBtn.textContent = 'Raise Dispute';
      alert(err.message || 'Failed to raise dispute.');
    }
  });
}
if (paidConfirmBtn) {
  paidConfirmBtn.addEventListener('click', async () => {
    if (paidConfirmBtn.disabled) {
      return;
    }
    paidConfirmBtn.disabled = true;
    try {
      await updateOrderStatus('mark_paid');
      setPaymentPanelOpen(false);
    } catch (error) {
      // Status message already updated by updateOrderStatus.
    } finally {
      if (!['PAID', 'RELEASED', 'CANCELLED', 'EXPIRED'].includes(normalizeStatusForUi(activeOrderSnapshot?.status))) {
        paidConfirmBtn.disabled = false;
      }
    }
  });
}
if (orderChatBtn) {
  orderChatBtn.addEventListener('click', () => {
    if (!activeOrderId) {
      if (chatState) {
        chatState.textContent = 'Order is not ready for chat yet.';
      }
      return;
    }
    window.location.href = `/p2p-chat.html?orderId=${encodeURIComponent(activeOrderId)}`;
  });
}
if (cancelModalBackdrop) {
  cancelModalBackdrop.addEventListener('click', () => setCancelModalOpen(false));
}
if (cancelModalCloseBtn) {
  cancelModalCloseBtn.addEventListener('click', () => setCancelModalOpen(false));
}
if (cancelReasonForm) {
  cancelReasonForm.addEventListener('change', refreshCancelConfirmState);
}
if (cancelNoPaymentCheck) {
  cancelNoPaymentCheck.addEventListener('change', refreshCancelConfirmState);
}
if (cancelConfirmBtn) {
  cancelConfirmBtn.addEventListener('click', async () => {
    if (cancelConfirmBtn.disabled) {
      return;
    }
    const selectedReason = cancelReasonForm?.querySelector('input[name="cancelReason"]:checked')?.value || '';
    cancelConfirmBtn.disabled = true;
    try {
      await updateOrderStatus('cancel', { reason: selectedReason });
      setCancelModalOpen(false);
      setPaymentPanelOpen(false);
    } catch (error) {
      // Status message already updated by updateOrderStatus.
    } finally {
      refreshCancelConfirmState();
    }
  });
}

if (chatForm) {
  chatForm.addEventListener('submit', sendMessageHandler);
}
if (chatImageBtn && chatImageInput) {
  chatImageBtn.addEventListener('click', () => {
    if (!activeOrderId || chatUploading) {
      return;
    }
    chatImageInput.click();
  });
}
if (chatImageInput) {
  chatImageInput.addEventListener('change', handleChatImageSelected);
}
if (chatMessages) {
  chatMessages.addEventListener('click', (event) => {
    const previewButton = event.target.closest('.chat-image-link');
    if (!previewButton) {
      return;
    }
    const previewSrc = sanitizeImageUrl(previewButton.getAttribute('data-preview-src') || '');
    if (previewSrc) {
      setImagePreviewOpen(true, previewSrc);
    }
  });
}
if (imagePreviewBackdrop) {
  imagePreviewBackdrop.addEventListener('click', () => setImagePreviewOpen(false));
}
if (imagePreviewCloseBtn) {
  imagePreviewCloseBtn.addEventListener('click', () => setImagePreviewOpen(false));
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('p2p-theme-dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

if (mobileCurrencyBtn) {
  mobileCurrencyBtn.addEventListener('click', () => {
    if (!currencyFilter) {
      return;
    }
    currencyFilter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    currencyFilter.focus({ preventScroll: true });
  });
}

if (profileDepositBtn) {
  profileDepositBtn.addEventListener('click', () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    window.location.href = '/assets/';
  });
}

if (profileEditBtn) {
  profileEditBtn.addEventListener('click', () => {
    openProfileEditModal();
  });
}

p2pMenuToggle?.addEventListener('click', () => setP2PNavOpen(true));
p2pNavClose?.addEventListener('click', () => setP2PNavOpen(false));
p2pNavOverlay?.addEventListener('click', () => setP2PNavOpen(false));

p2pNavDrawer?.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (link) {
    setP2PNavOpen(false);
  }
});

if (p2pMobileBottomNav) {
  p2pMobileBottomNav.addEventListener('click', (event) => {
    const targetLink = event.target.closest('a[data-mobile-tab], a[data-mob]');
    if (!targetLink) {
      return;
    }
    if (isMobileViewport()) {
      event.preventDefault();
      setMobileTab(getMobileNavTabValue(targetLink));
    }
  });
}

document.querySelectorAll('[data-mobile-tab-target]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (!isMobileViewport()) {
      return;
    }
    const tab = normalizeMobileTabName(link.getAttribute('data-mobile-tab-target'));
    event.preventDefault();
    setMobileTab(tab);
  });
});

window.addEventListener('hashchange', () => {
  syncMobileTabFromHash({ refreshP2P: false });
});

window.addEventListener('resize', () => {
  if (!isMobileViewport()) {
    setMobileNavActive('p2p');
    document.body.dataset.mobileTab = 'p2p';
    return;
  }
  syncMobileTabFromHash({ refreshP2P: false });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (imagePreviewModal && !imagePreviewModal.classList.contains('hidden')) {
      setImagePreviewOpen(false);
      return;
    }
    if (cancelModal && !cancelModal.classList.contains('hidden')) {
      setCancelModalOpen(false);
      return;
    }
    if (dealModal && !dealModal.classList.contains('hidden')) {
      closeDealModal();
      return;
    }
    if (kycModal && !kycModal.classList.contains('hidden')) {
      closeKycModal();
      return;
    }
    if (orderModal && !orderModal.classList.contains('hidden')) {
      closeOrderModal();
      return;
    }
    if (authModal && !authModal.classList.contains('hidden')) {
      setAuthModalOpen(false);
      return;
    }
    setP2PNavOpen(false);
  }
});

window.addEventListener('pagehide', () => {
  document.body.style.overflow = 'auto';
  document.body.style.pointerEvents = 'auto';
});

(async function init() {
  initTheme();
  // loadCurrentUser MUST complete first so currentUser is set before other loads
  await loadCurrentUser();
  console.log('[init] loadCurrentUser done, currentUser:', currentUser ? currentUser.email : 'null');

  // Run all data loads in PARALLEL — sequential await caused one hanging call
  // to block all subsequent loads (including the orders prefetch setTimeout below)
  Promise.allSettled([
    loadOffers(),
    loadLiveOrders(),
    loadMyAds(),
    loadProfilePanel({ refreshWallet: true }),
    loadExchangeTicker()
  ]).then(function(results) {
    results.forEach(function(r, i) {
      if (r.status === 'rejected') console.warn('[init] parallel load #' + i + ' failed:', r.reason);
    });
  });

  syncMobileTabFromHash();
  syncBodyInteractionState();
  // loadCurrentUser() above already called loadBybitorOrders() for logged-in users.
  // For non-logged-in users, showLoginPrompt is shown when they open the orders screen.
})();

// ── Keep Render free-tier server awake ──────────────────────────────
// Render sleeps after 15 min idle → causes ~50s cold start next visit.
// Ping /healthz every 13 min while tab is active to prevent that.
setInterval(function() {
  if (document.visibilityState !== 'hidden') {
    fetch('/healthz').catch(function() {});
  }
}, 13 * 60 * 1000);

setInterval(() => {
  if (currentUser && !activeOrderId && liveOrdersMeta) {
    loadLiveOrders();
  }
}, 20000); // 20s — was 1.5s; reduces server hammering; SSE handles real-time

setInterval(loadExchangeTicker, 7000);

// Auto-refresh KYC status every 20s so profile updates immediately after admin approves
setInterval(() => {
  if (currentUser) refreshCurrentUserKyc();
}, 20000);

// ===== KYC FULL-PAGE SCREENS =====
// ===== PAYMENT METHODS =====
function openPaymentMethodsScreen() {
  var legacy = document.getElementById('pmScreen');
  if (legacy) legacy.remove();
  if (!currentUser) {
    requireLoginNotice();
    return;
  }
  if (typeof showMobScreen === 'function') {
    showMobScreen('mobPaymentMethodsScreen');
  }
  renderPaymentMethodsList([]);
  loadPaymentMethods();
}

function getPaymentMethodOptionConfig(input) {
  var key = String(input || '').trim().toLowerCase();
  var direct = PAYMENT_METHOD_OPTIONS.find(function(option) {
    return String(option.key || '').trim().toLowerCase() === key || String(option.label || '').trim().toLowerCase() === key;
  });
  if (direct) {
    return direct;
  }
  if (key === 'bank' || key === 'imps') {
    return { key: 'Bank Transfer(India)', label: 'Bank Transfer(India)', category: 'BANK', chip: 'BK' };
  }
  if (!key || key === 'upi') {
    return PAYMENT_METHOD_OPTIONS[0];
  }
  return { key: input, label: String(input || 'Payment method').trim(), category: 'OTHER', chip: String(input || 'PM').trim().slice(0, 2).toUpperCase() || 'PM' };
}

function getPaymentMethodDisplayLabel(method) {
  if (!method) {
    return 'Payment method';
  }
  return String(method.provider || method.nickname || method.type || 'Payment method').trim() || 'Payment method';
}

function getPaymentMethodDetailText(method) {
  if (!method) {
    return '--';
  }
  var owner = String(method.accountHolder || '').trim();
  var identifier = String(method.upiId || method.accountNumber || method.details || '').trim();
  if (owner && identifier) {
    return owner + ' • ' + identifier;
  }
  if (identifier) {
    return identifier;
  }
  if (owner) {
    return owner;
  }
  return '--';
}

function showProfileFlowScreen(screenId, hashValue) {
  if (typeof showMobScreen === 'function') {
    showMobScreen(screenId);
  } else {
    document.querySelectorAll('.mob-screen').forEach(function(screen) {
      screen.style.display = 'none';
    });
    var target = document.getElementById(screenId);
    if (target) {
      target.style.setProperty('display', 'flex', 'important');
      target.style.flexDirection = 'column';
    }
    document.body.classList.add('mob-screen-open', 'mob-profile-open');
    document.body.dataset.mobileTab = 'profile';
    setMobileNavActive('profile');
  }
  if (hashValue) {
    history.replaceState(null, '', '/p2p#' + hashValue);
  }
}

function renderPaymentMethodsList(methods) {
  var list = document.getElementById('mobPaymentMethodsList');
  var empty = document.getElementById('mobPaymentMethodsEmpty');
  if (!list || !empty) {
    return;
  }
  list.innerHTML = '';
  if (!Array.isArray(methods) || !methods.length) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  methods.forEach(function(method) {
    var option = getPaymentMethodOptionConfig(method.provider || method.type);
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'mob-payment-method-card';
    button.setAttribute('data-payment-edit', String(method.id || ''));
    var iconSvg = PM_ICONS[option.key] || '';
    var iconHtml = iconSvg
      ? '<span class="mob-payment-method-icon mob-payment-type-svg">' + iconSvg + '</span>'
      : '<span class="mob-payment-method-icon">' + escapeHtml(option.chip || 'PM') + '</span>';
    button.innerHTML =
      iconHtml +
      '<span class="mob-payment-method-copy">' +
        '<span class="mob-payment-method-title">' + escapeHtml(getPaymentMethodDisplayLabel(method)) + '</span>' +
        '<span class="mob-payment-method-subtitle">' + escapeHtml(getPaymentMethodDetailText(method)) + '</span>' +
      '</span>' +
      '<span class="mob-payment-method-arrow">›</span>';
    list.appendChild(button);
  });
}

async function loadPaymentMethods() {
  var list = document.getElementById('mobPaymentMethodsList');
  var empty = document.getElementById('mobPaymentMethodsEmpty');
  if (!list || !empty) return;
  if (!currentUser) {
    renderPaymentMethodsList([]);
    empty.classList.remove('hidden');
    empty.querySelector('p').textContent = 'Login required.';
    return;
  }
  list.innerHTML = '<div class="mob-payment-empty"><p>Loading...</p></div>';
  try {
    var res = await fetch('/api/p2p/payment-methods', { credentials: 'include' });
    var data = await res.json();
    var methods = data.methods || [];
    paymentMethodsCache = methods.slice();
    empty.querySelector('p').textContent = 'No data found.';
    renderPaymentMethodsList(methods);
  } catch(e) {
    renderPaymentMethodsList([]);
    empty.classList.remove('hidden');
    empty.querySelector('p').textContent = 'Failed to load. Try again.';
  }
}

function renderPaymentMethodTypes(query) {
  var container = document.getElementById('paymentMethodTypeList');
  if (!container) {
    return;
  }
  var needle = String(query || '').trim().toLowerCase();
  var filtered = PAYMENT_METHOD_OPTIONS.filter(function(option) {
    return !needle || String(option.label || '').toLowerCase().indexOf(needle) !== -1;
  });
  if (!filtered.length) {
    container.innerHTML = '<div class="mob-payment-empty" style="padding-top:3rem;"><p>No payment methods found.</p></div>';
    return;
  }
  container.innerHTML = filtered.map(function(option) {
    var iconSvg = PM_ICONS[option.key] || '';
    var chipHtml = iconSvg
      ? '<span class="mob-payment-type-chip mob-payment-type-svg">' + iconSvg + '</span>'
      : '<span class="mob-payment-type-chip" style="background:' + (option.color || '#888') + ';color:#fff;">' + escapeHtml(option.chip || 'PM') + '</span>';
    return (
      '<button type="button" class="mob-payment-type-row" data-payment-type="' + escapeHtml(option.key) + '">' +
        chipHtml +
        '<span class="mob-payment-type-label">' + escapeHtml(option.label) + '</span>' +
        '<span class="mob-payment-type-arrow">›</span>' +
      '</button>'
    );
  }).join('');
}

function openPaymentMethodPickerScreen() {
  showProfileFlowScreen('mobPaymentMethodTypesScreen', 'profile-payment-add');
  var searchInput = document.getElementById('paymentMethodSearchInput');
  if (searchInput) {
    searchInput.value = '';
  }
  renderPaymentMethodTypes('');
}

function openAddPaymentModal() {
  openPaymentMethodPickerScreen();
}

function getPaymentFormCopy(option) {
  if (!option) {
    return {
      title: 'Add payment method',
      identifierLabel: 'Payment ID',
      identifierPlaceholder: 'Enter payment ID'
    };
  }
  if (option.category === 'BANK') {
    return {
      title: 'Add ' + option.label,
      identifierLabel: 'Account number',
      identifierPlaceholder: 'Enter Account number'
    };
  }
  if (option.category === 'UPI') {
    return {
      title: 'Add ' + option.label,
      identifierLabel: 'UPI ID',
      identifierPlaceholder: 'Enter UPI ID'
    };
  }
  return {
    title: 'Add ' + option.label,
    identifierLabel: 'Payment ID',
    identifierPlaceholder: 'Enter payment ID'
  };
}

function renderPaymentQrPreview(dataUrl) {
  var preview = document.getElementById('paymentMethodQrPreview');
  var addBtn = document.getElementById('paymentMethodQrBtn');
  if (!preview || !addBtn) {
    return;
  }
  if (dataUrl) {
    preview.classList.remove('hidden');
    preview.style.backgroundImage = 'url("' + String(dataUrl).replace(/"/g, '%22') + '")';
    addBtn.querySelector('.mob-payment-qr-plus').textContent = '✓';
  } else {
    preview.classList.add('hidden');
    preview.style.backgroundImage = '';
    addBtn.querySelector('.mob-payment-qr-plus').textContent = '+';
  }
}

function openPaymentMethodFormFor(methodOrKey) {
  var editingMethod = methodOrKey && typeof methodOrKey === 'object' && methodOrKey.id ? methodOrKey : null;
  var option = getPaymentMethodOptionConfig(editingMethod ? (editingMethod.provider || editingMethod.type) : methodOrKey);
  var copy = getPaymentFormCopy(option);
  paymentMethodFormState = {
    methodId: editingMethod ? String(editingMethod.id || '') : '',
    provider: option.label,
    category: option.category,
    qrCode: editingMethod ? String(editingMethod.qrCode || '').trim() : '',
    mode: editingMethod ? 'edit' : 'create',
    backScreen: editingMethod ? 'methods' : 'types'
  };

  var title = document.getElementById('paymentMethodFormTitle');
  var label = document.getElementById('paymentMethodIdentifierLabel');
  var input = document.getElementById('paymentMethodIdentifierInput');
  var ownerInput = document.getElementById('paymentMethodOwnerInput');
  var meta = document.getElementById('paymentMethodFormMeta');
  var confirmBtn = document.getElementById('paymentMethodConfirmBtn');
  var backBtn = document.querySelector('#mobPaymentMethodFormScreen [data-payment-back]');
  if (title) title.textContent = editingMethod ? ('Edit ' + option.label) : copy.title;
  if (label) label.textContent = copy.identifierLabel;
  if (input) {
    input.placeholder = copy.identifierPlaceholder;
    input.value = editingMethod ? String(editingMethod.upiId || editingMethod.accountNumber || editingMethod.details || '').trim() : '';
  }
  if (ownerInput) {
    ownerInput.value = editingMethod ? String(editingMethod.accountHolder || '').trim() : String(currentUser?.username || '').trim();
  }
  if (meta) {
    meta.textContent = '';
  }
  if (confirmBtn) {
    confirmBtn.textContent = editingMethod ? 'Save Changes' : 'Confirm';
    confirmBtn.disabled = false;
  }
  if (backBtn) {
    backBtn.setAttribute('data-payment-back', paymentMethodFormState.backScreen);
  }
  // Show/hide bank-specific fields
  var bankFields = document.getElementById('bankExtraFields');
  var qrRow = document.querySelector('#mobPaymentMethodFormScreen .mob-payment-upload-row');
  if (option.category === 'BANK') {
    if (bankFields) {
      bankFields.style.display = 'block';
      var ifscInput = document.getElementById('paymentMethodIfscInput');
      var accTypeInput = document.getElementById('paymentMethodAccTypeInput');
      var bankNameInput = document.getElementById('paymentMethodBankNameInput');
      var branchInput = document.getElementById('paymentMethodBranchInput');
      if (ifscInput) ifscInput.value = editingMethod ? String(editingMethod.ifsc || '').trim() : '';
      if (accTypeInput) accTypeInput.value = editingMethod ? String(editingMethod.accountType || '').trim() : '';
      if (bankNameInput) bankNameInput.value = editingMethod ? String(editingMethod.bankName || '').trim() : '';
      if (branchInput) branchInput.value = editingMethod ? String(editingMethod.bankBranch || '').trim() : '';
    }
    if (qrRow) qrRow.style.display = 'none';
  } else {
    if (bankFields) bankFields.style.display = 'none';
    if (qrRow) qrRow.style.display = '';
  }
  renderPaymentQrPreview(paymentMethodFormState.qrCode);
  showProfileFlowScreen('mobPaymentMethodFormScreen', editingMethod ? 'profile-payment-edit' : 'profile-payment-form');
}

function openEditPaymentModal(pmId) {
  var editingMethod = paymentMethodsCache.find(function(item) {
    return item && String(item.id || '') === String(pmId || '');
  }) || null;
  if (!editingMethod) {
    showToast('Payment method not found');
    return;
  }
  openPaymentMethodFormFor(editingMethod);
}

function openPaymentQrSheet() {
  var sheet = document.getElementById('mobPaymentQrSheet');
  if (sheet) {
    sheet.classList.remove('hidden');
    sheet.setAttribute('aria-hidden', 'false');
  }
}

function closePaymentQrSheet() {
  var sheet = document.getElementById('mobPaymentQrSheet');
  if (sheet) {
    sheet.classList.add('hidden');
    sheet.setAttribute('aria-hidden', 'true');
  }
}

async function handlePaymentQrSelection(file) {
  if (!file) {
    return;
  }
  var meta = document.getElementById('paymentMethodFormMeta');
  try {
    paymentMethodFormState.qrCode = await compressImageFileToDataUrl(file, { maxEdge: 680, quality: 0.8 });
    renderPaymentQrPreview(paymentMethodFormState.qrCode);
    if (meta) {
      meta.textContent = 'QR code added.';
      meta.style.color = 'rgba(255,255,255,0.48)';
    }
  } catch (error) {
    if (meta) {
      meta.textContent = 'Unable to read that image. Try another file.';
      meta.style.color = '#f6465d';
    }
  } finally {
    closePaymentQrSheet();
  }
}

async function submitPaymentMethod(pmId) {
  var methodId = pmId || paymentMethodFormState.methodId;
  var ownerInput = document.getElementById('paymentMethodOwnerInput');
  var idInput = document.getElementById('paymentMethodIdentifierInput');
  var confirmBtn = document.getElementById('paymentMethodConfirmBtn');
  var meta = document.getElementById('paymentMethodFormMeta');
  var owner = String(ownerInput && ownerInput.value || '').trim();
  var identifier = String(idInput && idInput.value || '').trim();

  if (!owner || owner.length < 2) {
    if (meta) {
      meta.textContent = 'Enter the account holder name.';
      meta.style.color = '#f6465d';
    }
    return;
  }
  if (!identifier) {
    if (meta) {
      meta.textContent = paymentMethodFormState.category === 'UPI' ? 'UPI ID is required.' : 'Payment ID is required.';
      meta.style.color = '#f6465d';
    }
    return;
  }

  var body = {
    type: paymentMethodFormState.category,
    provider: paymentMethodFormState.provider,
    nickname: paymentMethodFormState.provider,
    accountHolder: owner,
    qrCode: paymentMethodFormState.qrCode || ''
  };
  if (paymentMethodFormState.category === 'UPI') {
    body.upiId = identifier;
  } else if (paymentMethodFormState.category === 'BANK') {
    body.accountNumber = identifier;
    body.details = identifier;
    var ifscVal = (document.getElementById('paymentMethodIfscInput') || {}).value || '';
    var accTypeVal = (document.getElementById('paymentMethodAccTypeInput') || {}).value || '';
    var bankNameVal = (document.getElementById('paymentMethodBankNameInput') || {}).value || '';
    var branchVal = (document.getElementById('paymentMethodBranchInput') || {}).value || '';
    body.ifsc = ifscVal.trim();
    body.accountType = accTypeVal.trim();
    body.bankName = bankNameVal.trim() || paymentMethodFormState.provider;
    body.bankBranch = branchVal.trim();
  } else {
    body.details = identifier;
  }

  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.textContent = methodId ? 'Saving...' : 'Adding...';
  }
  try {
    var url = methodId ? '/api/p2p/payment-methods/' + methodId : '/api/p2p/payment-methods';
    var method = methodId ? 'PATCH' : 'POST';
    var res = await fetch(url, { method: method, credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    var data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to save payment method.');
    }
    paymentMethodFormState = {
      methodId: '',
      provider: 'UPI',
      category: 'UPI',
      qrCode: '',
      mode: 'create',
      backScreen: 'methods'
    };
    await loadPaymentMethods();
    showProfileFlowScreen('mobPaymentMethodsScreen', 'profile-payment');
    showToast(methodId ? 'Payment method updated' : 'Payment method added');
  } catch(e) {
    if (meta) {
      meta.textContent = e.message || 'Network error.';
      meta.style.color = '#f6465d';
    }
  } finally {
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = methodId ? 'Save Changes' : 'Confirm';
    }
  }
}

async function deletePaymentMethod(pmId) {
  if (!confirm('Delete this payment method?')) return;
  try {
    var res = await fetch('/api/p2p/payment-methods/' + pmId, { method: 'DELETE', credentials: 'include' });
    var data = await res.json();
    if (!res.ok) { alert(data.message || 'Failed.'); return; }
    await loadPaymentMethods();
  } catch(e) { alert('Network error.'); }
}

(function initPaymentMethodUi() {
  var addBtn = document.getElementById('mobPaymentAddBtn');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      openPaymentMethodPickerScreen();
    });
  }

  var searchInput = document.getElementById('paymentMethodSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      renderPaymentMethodTypes(searchInput.value || '');
    });
  }

  var qrBtn = document.getElementById('paymentMethodQrBtn');
  if (qrBtn) {
    qrBtn.addEventListener('click', function() {
      openPaymentQrSheet();
    });
  }

  var confirmBtn = document.getElementById('paymentMethodConfirmBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function() {
      submitPaymentMethod();
    });
  }

  var cameraInput = document.getElementById('paymentMethodQrCameraInput');
  if (cameraInput) {
    cameraInput.addEventListener('change', function() {
      handlePaymentQrSelection(cameraInput.files && cameraInput.files[0]);
      cameraInput.value = '';
    });
  }

  var albumInput = document.getElementById('paymentMethodQrAlbumInput');
  if (albumInput) {
    albumInput.addEventListener('change', function() {
      handlePaymentQrSelection(albumInput.files && albumInput.files[0]);
      albumInput.value = '';
    });
  }

  var takePhotoBtn = document.getElementById('paymentMethodTakePhotoBtn');
  if (takePhotoBtn && cameraInput) {
    takePhotoBtn.addEventListener('click', function() {
      cameraInput.click();
    });
  }

  var selectAlbumBtn = document.getElementById('paymentMethodSelectAlbumBtn');
  if (selectAlbumBtn && albumInput) {
    selectAlbumBtn.addEventListener('click', function() {
      albumInput.click();
    });
  }

  var sheetBackdrop = document.getElementById('mobPaymentQrSheetBackdrop');
  if (sheetBackdrop) {
    sheetBackdrop.addEventListener('click', closePaymentQrSheet);
  }

  var sheetCancelBtn = document.getElementById('paymentMethodQrSheetCancelBtn');
  if (sheetCancelBtn) {
    sheetCancelBtn.addEventListener('click', closePaymentQrSheet);
  }

  document.addEventListener('click', function(event) {
    var typeRow = event.target.closest('[data-payment-type]');
    if (typeRow) {
      event.preventDefault();
      openPaymentMethodFormFor(typeRow.getAttribute('data-payment-type'));
      return;
    }
    var editRow = event.target.closest('[data-payment-edit]');
    if (editRow) {
      event.preventDefault();
      openEditPaymentModal(editRow.getAttribute('data-payment-edit'));
      return;
    }
    var paymentBack = event.target.closest('[data-payment-back]');
    if (paymentBack) {
      event.preventDefault();
      var target = paymentBack.getAttribute('data-payment-back');
      if (target === 'profile') {
        showProfileFlowScreen('mobProfileScreen', 'profile');
        if (typeof loadProfilePanel === 'function') {
          loadProfilePanel();
        }
      } else if (target === 'methods') {
        openPaymentMethodsScreen();
      } else {
        openPaymentMethodPickerScreen();
      }
    }
  });
})();
// ===== END PAYMENT METHODS =====

// ===== 3-DOT MENU =====
function closeDotMenu() {
  var dd = document.getElementById('p2pDotDropdown');
  if (dd) dd.classList.remove('open');
}
function openP2PScreen(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.style.setProperty('display','flex','important');
  el.style.flexDirection = 'column';
  document.body.classList.add('mob-screen-open');
}
function closeP2PScreen(id) {
  var el = document.getElementById(id);
  if (el) el.style.display = 'none';
  // only remove mob-screen-open if no other screen is open
  var any = document.querySelector('.mob-screen[style*="flex"]');
  if (!any) document.body.classList.remove('mob-screen-open');
}
function toggleFaqSection(head) {
  var section = head.parentElement;
  section.classList.toggle('open');
}
(function initDotMenu() {
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('#p2pDotBtn');
    var dd = document.getElementById('p2pDotDropdown');
    if (!dd) return;
    if (btn) { dd.classList.toggle('open'); e.stopPropagation(); return; }
    if (!e.target.closest('#p2pDotDropdown')) { dd.classList.remove('open'); }
  });
})();
// ===== END 3-DOT MENU =====

// ===== PROFILE FEATURE SCREENS =====

function closeMobScreen(fromId, toId) {
  var from = document.getElementById(fromId);
  var to   = document.getElementById(toId);
  if (from) { from.classList.add('hidden'); from.style.display = 'none'; }
  if (to) { to.classList.remove('hidden'); to.style.setProperty('display', 'flex', 'important'); to.style.flexDirection = 'column'; }
}

// ── Profile tab switcher ──
(function(){
  var tabs = document.querySelectorAll('[data-profile-tab]');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      ['trade','notifications','others'].forEach(function(name) {
        var el = document.getElementById('profileTab' + name.charAt(0).toUpperCase() + name.slice(1));
        if (el) el.classList.toggle('hidden', name !== tab.dataset.profileTab);
      });
    });
  });
})();

// ── Trading Data (More →) ──
function openTradingDataScreen() {
  var s = document.getElementById('mobTradingDataScreen');
  var p = document.getElementById('mobProfileScreen');
  if (!s) return;
  if (p) { p.classList.add('hidden'); p.style.display = 'none'; }
  s.classList.remove('hidden');
  s.style.setProperty('display', 'flex', 'important');
  s.style.flexDirection = 'column';

  // Copy 30D data from profile
  var map30 = {
    profileThirtyDayTradesMobile: 'td30dTrades',
    profileCompletionRateMobile: 'td30dCompletion',
    profileAvgReleaseTimeMobile: 'td30dRelease',
    profileAvgPaymentTimeMobile: 'td30dPayment',
    profile30dBuyCount: 'td30dBuy',
    profile30dSellCount: 'td30dSell'
  };
  Object.entries(map30).forEach(function(kv) {
    var src = document.getElementById(kv[0]);
    var dst = document.getElementById(kv[1]);
    if (src && dst) dst.textContent = src.textContent;
  });

  // Load all-time data from server
  fetch('/api/p2p/me', { credentials: 'include' })
    .then(function(r) { return r.ok ? r.json() : {}; })
    .then(function(d) {
      var u = d.user || d;
      var el;
      var totalBuy = Number(u.totalBuyTrades || u.p2pStats?.totalBuyTrades || 0);
      var totalSell = Number(u.totalSellTrades || u.p2pStats?.totalSellTrades || 0);
      var totalTrades = totalBuy + totalSell;
      if ((el = document.getElementById('tdAllTrades'))) el.textContent = totalTrades;
      if ((el = document.getElementById('tdAllBuy'))) el.textContent = totalBuy;
      if ((el = document.getElementById('tdAllSell'))) el.textContent = totalSell;
      if ((el = document.getElementById('tdPlatformFeedback'))) el.textContent = (u.feedbackRate || u.p2pStats?.feedbackRate || '100') + '%';
      if ((el = document.getElementById('tdRegisteredOn'))) {
        var dt = u.createdAt || u.registeredAt;
        el.textContent = dt ? new Date(dt).toISOString().slice(0,10).replace(/-/g,'/') : '--';
      }
    }).catch(function() {});
}

// ── Settings ──
function openProfileSettingsScreen() {
  var s = document.getElementById('mobProfileSettingsScreen');
  var p = document.getElementById('mobProfileScreen');
  if (!s) return;
  if (p) { p.classList.add('hidden'); p.style.display = 'none'; }
  s.classList.remove('hidden');
  s.style.setProperty('display', 'flex', 'important');
  s.style.flexDirection = 'column';
  // pre-fill
  fetch('/api/p2p/settings', { credentials: 'include' })
    .then(function(r){ return r.ok ? r.json() : {}; })
    .then(function(d) {
      var el;
      if ((el = document.getElementById('settingsNickname'))) el.value = d.nickname || (currentUser && currentUser.nickname) || '';
      if ((el = document.getElementById('settingsAutoReply'))) el.value = d.autoReply || '';
      if ((el = document.getElementById('settingsOnline'))) el.checked = d.onlineVisible !== false;
      if ((el = document.getElementById('settingsVerifiedOnly'))) el.checked = !!d.verifiedOnly;
      if ((el = document.getElementById('settingsCurrency'))) el.value = d.currency || 'INR';
    }).catch(function(){});
}

function saveProfileSettings() {
  var payload = {
    nickname:      (document.getElementById('settingsNickname') || {}).value || '',
    autoReply:     (document.getElementById('settingsAutoReply') || {}).value || '',
    onlineVisible: (document.getElementById('settingsOnline') || {}).checked !== false,
    verifiedOnly:  !!(document.getElementById('settingsVerifiedOnly') || {}).checked,
    currency:      (document.getElementById('settingsCurrency') || {}).value || 'INR'
  };
  var msg = document.getElementById('settingsSaveMsg');
  fetch('/api/p2p/settings', {
    method: 'PUT', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function(r){ return r.json(); }).then(function(d) {
    if (msg) { msg.style.color = '#00B4D8'; msg.textContent = '✓ Settings saved'; setTimeout(function(){ msg.textContent=''; }, 3000); }
  }).catch(function() {
    if (msg) { msg.style.color = '#f6465d'; msg.textContent = 'Failed to save'; }
  });
}

// ── Notifications ──
function saveNotifPref(key, val) {
  fetch('/api/p2p/notifications', {
    method: 'PUT', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ [key]: val })
  }).catch(function(){});
}

(function loadNotifPrefs() {
  fetch('/api/p2p/notifications', { credentials: 'include' })
    .then(function(r){ return r.ok ? r.json() : {}; })
    .then(function(d) {
      var map = { newOrders:'notifNewOrders', orderUpdates:'notifOrderUpdates', chat:'notifChat', priceAlerts:'notifPriceAlerts', email:'notifEmail', security:'notifSecurity' };
      Object.entries(map).forEach(function(kv) {
        var el = document.getElementById(kv[1]);
        if (el && d[kv[0]] !== undefined) el.checked = !!d[kv[0]];
      });
    }).catch(function(){});
})();

// ── Follow / Block ──
function openFollowBlockScreen() {
  var s = document.getElementById('mobFollowBlockScreen');
  var p = document.getElementById('mobProfileScreen');
  if (!s) return;
  if (p) { p.classList.add('hidden'); p.style.display = 'none'; }
  s.classList.remove('hidden');
  s.style.setProperty('display', 'flex', 'important');
  s.style.flexDirection = 'column';
  loadFollowList('following', s.querySelector('.mob-mtab'));
}

function loadFollowList(type, tabEl) {
  if (tabEl) {
    var tabs = tabEl.closest('.mob-menu-tabs');
    if (tabs) tabs.querySelectorAll('.mob-mtab').forEach(function(t){ t.classList.remove('active'); });
    tabEl.classList.add('active');
  }
  var container = document.getElementById('followBlockList');
  if (!container) return;
  container.innerHTML = '<div style="text-align:center;color:#555;padding:2rem;">Loading...</div>';
  fetch('/api/p2p/follow?type=' + type, { credentials: 'include' })
    .then(function(r){ return r.ok ? r.json() : []; })
    .then(function(list) {
      if (!list.length) {
        container.innerHTML = '<div style="text-align:center;color:#555;padding:2rem;">No ' + type + ' users yet.</div>';
        return;
      }
      container.innerHTML = list.map(function(u) {
        return '<div class="follow-user-row">' +
          '<div class="follow-user-avatar">' + (u.nickname || u.email || 'U').charAt(0).toUpperCase() + '</div>' +
          '<div><div class="follow-user-name">' + (u.nickname || u.email || 'Unknown') + '</div>' +
          '<div class="follow-user-meta">' + (u.totalTrades || 0) + ' trades</div></div>' +
          '<button class="follow-unfollow-btn" onclick="removeFollow(\'' + u._id + '\',\'' + type + '\')">' + (type === 'following' ? 'Unfollow' : 'Unblock') + '</button></div>';
      }).join('');
    }).catch(function() {
      container.innerHTML = '<div style="text-align:center;color:#555;padding:2rem;">Could not load list.</div>';
    });
}

function removeFollow(userId, type) {
  fetch('/api/p2p/follow/' + userId + '?type=' + type, { method: 'DELETE', credentials: 'include' })
    .then(function(){ loadFollowList(type, null); })
    .catch(function(){});
}

// ── Ad Code ──
function openAdCodeScreen() {
  var s = document.getElementById('mobAdCodeScreen');
  var p = document.getElementById('mobProfileScreen');
  if (!s) return;
  if (p) { p.classList.add('hidden'); p.style.display = 'none'; }
  s.classList.remove('hidden');
  s.style.setProperty('display', 'flex', 'important');
  s.style.flexDirection = 'column';
  var disp = document.getElementById('adCodeDisplay');
  if (disp) disp.textContent = 'Loading...';
  fetch('/api/p2p/ad-code', { credentials: 'include' })
    .then(function(r){ return r.ok ? r.json() : {}; })
    .then(function(d) { if (disp) disp.textContent = d.code || '------'; })
    .catch(function() { if (disp) disp.textContent = 'ERROR'; });
}

function copyAdCode() {
  var code = (document.getElementById('adCodeDisplay') || {}).textContent || '';
  if (!code || code === '------' || code === 'Loading...') return;
  navigator.clipboard.writeText(code).then(function() {
    var msg = document.getElementById('adCodeMsg');
    if (msg) { msg.textContent = '✓ Code copied!'; setTimeout(function(){ msg.textContent=''; }, 2000); }
  }).catch(function(){});
}

function regenerateAdCode() {
  var disp = document.getElementById('adCodeDisplay');
  fetch('/api/p2p/ad-code/regenerate', { method: 'POST', credentials: 'include' })
    .then(function(r){ return r.ok ? r.json() : {}; })
    .then(function(d) {
      if (disp) disp.textContent = d.code || '------';
      var msg = document.getElementById('adCodeMsg');
      if (msg) { msg.textContent = '✓ New code generated'; setTimeout(function(){ msg.textContent=''; }, 2500); }
    }).catch(function(){});
}

// ── Recently Viewed ──
function openRecentlyViewedScreen() {
  var s = document.getElementById('mobRecentlyViewedScreen');
  var p = document.getElementById('mobProfileScreen');
  if (!s) return;
  if (p) { p.classList.add('hidden'); p.style.display = 'none'; }
  s.classList.remove('hidden');
  s.style.setProperty('display', 'flex', 'important');
  s.style.flexDirection = 'column';
  loadRecentlyViewed();
}

function loadRecentlyViewed() {
  var container = document.getElementById('recentlyViewedList');
  if (!container) return;
  container.innerHTML = '<div style="text-align:center;color:#555;padding:2rem;">Loading...</div>';
  fetch('/api/p2p/recently-viewed', { credentials: 'include' })
    .then(function(r){ return r.ok ? r.json() : []; })
    .then(function(list) {
      if (!list.length) {
        container.innerHTML = '<div style="text-align:center;color:#555;padding:2rem;">No recently viewed ads.</div>';
        return;
      }
      container.innerHTML = list.map(function(item) {
        var side = item.side === 'sell' ? '🔴 Sell' : '🟢 Buy';
        return '<div class="rv-card" onclick="window.location.href=\'/p2p?ad=' + item.adId + '\'">' +
          '<div class="rv-card-icon">' + (item.asset || 'U') + '</div>' +
          '<div class="rv-card-info"><div class="rv-card-sym">' + side + ' ' + (item.asset || 'USDT') + '</div>' +
          '<div class="rv-card-meta">by ' + (item.sellerName || 'Merchant') + ' · ' + (item.timeAgo || '') + '</div></div>' +
          '<div class="rv-card-price">₹' + (item.price || '--') + '</div></div>';
      }).join('');
    }).catch(function() {
      container.innerHTML = '<div style="text-align:center;color:#555;padding:2rem;">Could not load.</div>';
    });
}

function clearRecentlyViewed() {
  fetch('/api/p2p/recently-viewed', { method: 'DELETE', credentials: 'include' })
    .then(function(){ loadRecentlyViewed(); })
    .catch(function(){});
}

// ── Fund Password ──
function openFundPasswordScreen() {
  var s = document.getElementById('mobFundPasswordScreen');
  var p = document.getElementById('mobProfileScreen');
  if (!s) return;
  if (p) { p.classList.add('hidden'); p.style.display = 'none'; }
  s.classList.remove('hidden');
  s.style.setProperty('display', 'flex', 'important');
  s.style.flexDirection = 'column';
  // check if user already has a fund password set
  fetch('/api/p2p/fund-password/status', { credentials: 'include' })
    .then(function(r){ return r.ok ? r.json() : {}; })
    .then(function(d) {
      var btn = s.querySelector('button[onclick="submitFundPassword()"]');
      var currentWrap = document.getElementById('fundPwdCurrentWrap');
      if (d.isSet) {
        if (btn) btn.textContent = 'Change Fund Password';
        if (currentWrap) currentWrap.style.display = 'block';
      } else {
        if (btn) btn.textContent = 'Set Fund Password';
        if (currentWrap) currentWrap.style.display = 'none';
      }
    }).catch(function(){});
}

function submitFundPassword() {
  var newPwd     = (document.getElementById('fundPwdNew') || {}).value || '';
  var confirmPwd = (document.getElementById('fundPwdConfirm') || {}).value || '';
  var currentPwd = (document.getElementById('fundPwdCurrent') || {}).value || '';
  var msg = document.getElementById('fundPwdMsg');

  if (newPwd.length !== 6 || !/^\d+$/.test(newPwd)) {
    if (msg) { msg.style.color='#f6465d'; msg.textContent='Fund password must be exactly 6 digits.'; } return;
  }
  if (newPwd !== confirmPwd) {
    if (msg) { msg.style.color='#f6465d'; msg.textContent='Passwords do not match.'; } return;
  }
  var payload = { newPassword: newPwd };
  if (currentPwd) payload.currentPassword = currentPwd;

  fetch('/api/p2p/fund-password/set', {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function(r){ return r.json(); }).then(function(d) {
    if (d.ok || d.success) {
      if (msg) { msg.style.color='#00B4D8'; msg.textContent='✓ Fund password set successfully.'; }
      ['fundPwdNew','fundPwdConfirm','fundPwdCurrent'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
    } else {
      if (msg) { msg.style.color='#f6465d'; msg.textContent = d.error || 'Failed. Try again.'; }
    }
  }).catch(function() {
    if (msg) { msg.style.color='#f6465d'; msg.textContent='Network error. Try again.'; }
  });
}

// ===== END PROFILE FEATURE SCREENS =====

function openKycScreen() {
  var kycStatus = normalizeKycStatus(currentUser && currentUser.kyc && currentUser.kyc.status);
  if (kycStatus === 'PENDING_REVIEW') {
    var el = document.getElementById('kycUnderReviewScreen');
    if (el) { el.style.setProperty('display','flex','important'); el.style.flexDirection='column'; }
    return;
  }
  if (kycStatus === 'REJECTED') {
    var rejScreen = document.getElementById('kycRejectedScreen');
    var rejReasonText = document.getElementById('kycRejectionReasonText');
    var rejReasonBox = document.getElementById('kycRejectionReasonBox');
    var rejReason = currentUser && currentUser.kyc && currentUser.kyc.rejectionReason || '';
    if (rejReasonText) rejReasonText.textContent = rejReason || 'No specific reason provided.';
    if (rejReasonBox) rejReasonBox.style.display = rejReason ? '' : 'none';
    if (rejScreen) { rejScreen.style.setProperty('display','flex','important'); rejScreen.style.flexDirection='column'; }
    return;
  }
  if (kycStatus === 'VERIFIED') {
    return;
  }
  document.getElementById('kycBasicScreen').style.setProperty('display','flex','important');
  document.getElementById('kycBasicScreen').style.flexDirection = 'column';
}

function closeKycScreens() {
  ['kycBasicScreen','kycAdvanceScreen'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });
}

function backToKycBasic() {
  document.getElementById('kycAdvanceScreen').style.display = 'none';
  document.getElementById('kycBasicScreen').style.setProperty('display','flex','important');
  document.getElementById('kycBasicScreen').style.flexDirection = 'column';
}

function kycFileChanged(input, hintId, thumbId, cardId) {
  var file = input && input.files && input.files[0];
  if(!file) return;
  var hint = document.getElementById(hintId);
  var thumb = document.getElementById(thumbId);
  var card = document.getElementById(cardId);
  if(hint) hint.textContent = file.name + ' (' + (file.size/1024).toFixed(0) + ' KB) ✓';
  var reader = new FileReader();
  reader.onload = function(e) {
    if(thumb){ thumb.src = e.target.result; thumb.style.display = 'block'; }
    if(card) card.classList.add('done');
  };
  reader.readAsDataURL(file);
}

function _kycHint(id, msg, type) {
  var el = document.getElementById(id);
  if(!el) return;
  el.textContent = msg;
  el.className = 'mob-kyc-fp-hint ' + (type||'');
}

function submitKycBasicAndNext() {
  var name  = ((document.getElementById('kycFullName')||{}).value||'').trim();
  var dob   = ((document.getElementById('kycDob')||{}).value||'').trim();
  var phone = ((document.getElementById('kycPhone')||{}).value||'').trim();
  if(!name)  { _kycHint('kycBasicHint','Please enter your full name.','error'); return; }
  if(!dob)   { _kycHint('kycBasicHint','Please enter your date of birth.','error'); return; }
  if(!phone) { _kycHint('kycBasicHint','Please enter your phone number.','error'); return; }
  // Update badge
  var badge = document.getElementById('kycStatusBadge');
  if(badge){ badge.textContent='Lv.1 Done'; badge.style.cssText='font-size:0.62rem;font-weight:700;padding:2px 7px;border-radius:999px;background:rgba(22,199,132,0.15);border:1px solid rgba(22,199,132,0.35);color:#16c784;margin-left:6px;'; }
  // Go to step 2
  document.getElementById('kycBasicScreen').style.display = 'none';
  document.getElementById('kycAdvanceScreen').style.setProperty('display','flex','important');
  document.getElementById('kycAdvanceScreen').style.flexDirection = 'column';
}

function submitKycAdvance() {
  var aadhaarNum = ((document.getElementById('kycAadhaarNumber')||{}).value||'').replace(/\s/g,'');
  var front   = (document.getElementById('kycAadhaarFront')||{}).files;
  var back    = (document.getElementById('kycAadhaarBack')||{}).files;
  var selfie  = (document.getElementById('kycSelfieDoc')||{}).files;
  var consent = (document.getElementById('kycL2Consent')||{}).checked;
  if(!aadhaarNum||aadhaarNum.length!==12||!/^\d{12}$/.test(aadhaarNum)) { _kycHint('kycAdvHint','Please enter valid 12-digit Aadhaar number.','error'); return; }
  if(!front||!front.length)  { _kycHint('kycAdvHint','Please upload Aadhaar front photo.','error'); return; }
  if(!back||!back.length)    { _kycHint('kycAdvHint','Please upload Aadhaar back photo.','error'); return; }
  if(!selfie||!selfie.length){ _kycHint('kycAdvHint','Please upload selfie with Aadhaar.','error'); return; }
  if(!consent){ _kycHint('kycAdvHint','Please accept the consent checkbox.','error'); return; }

  // Disable button while submitting
  var btn = document.querySelector('#kycAdvanceScreen [data-kyc-submit]');
  if(btn){ btn.disabled=true; btn.textContent='Uploading…'; }
  _kycHint('kycAdvHint','Uploading documents, please wait…','');

  // Compress + convert image to base64 JPEG (max 1200px, quality 0.75)
  function compressImage(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function(e) {
        var img = new Image();
        img.onerror = reject;
        img.onload = function() {
          var MAX = 1200;
          var w = img.width, h = img.height;
          if (w > MAX || h > MAX) {
            if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
            else       { w = Math.round(w * MAX / h); h = MAX; }
          }
          var canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  Promise.all([
    compressImage(front[0]),
    compressImage(back[0]),
    compressImage(selfie[0])
  ]).then(function(results) {
    var aadhaarFrontDataUrl = results[0];
    var aadhaarBackDataUrl  = results[1];
    var selfieDataUrl       = results[2];

    return fetch('/api/p2p/kyc/submit', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consent: true,
        aadhaarNumber: aadhaarNum,
        aadhaarFrontImage: aadhaarFrontDataUrl,
        aadhaarBackImage: aadhaarBackDataUrl,
        selfieWithDocumentImage: selfieDataUrl
      })
    });
  }).then(function(res) {
    return res.json().then(function(data){ return { ok: res.ok, data: data }; });
  }).then(function(result) {
    if (result.ok) {
      _kycHint('kycAdvHint','✅ Documents submitted! Review takes 24–48 hrs.','success');
      if (currentUser) {
        currentUser.kyc = Object.assign({}, currentUser.kyc || {}, {
          status: 'PENDING_REVIEW'
        });
      }
      var badge = document.getElementById('kycStatusBadge');
      if(badge){ badge.textContent='Under Review'; badge.style.cssText='font-size:0.62rem;font-weight:700;padding:2px 7px;border-radius:999px;background:rgba(240,185,11,0.12);border:1px solid rgba(240,185,11,0.3);color:#f0b90b;margin-left:6px;'; }
      if(btn){ btn.textContent='Submitted for Review ✓'; }
      loadProfilePanel({ refreshWallet: true });
      setTimeout(function() {
        closeKycScreens();
        var reviewScreen = document.getElementById('kycUnderReviewScreen');
        if (reviewScreen) {
          reviewScreen.style.setProperty('display','flex','important');
          reviewScreen.style.flexDirection = 'column';
        }
      }, 450);
    } else {
      var msg = (result.data && result.data.message) || 'Submission failed. Please try again.';
      _kycHint('kycAdvHint', msg, 'error');
      if(btn){ btn.disabled=false; btn.textContent='Submit for Verification'; }
    }
  }).catch(function(err) {
    _kycHint('kycAdvHint','Network error. Please check connection and retry.','error');
    if(btn){ btn.disabled=false; btn.textContent='Submit for Verification'; }
  });
}

// ===== MOBILE POST AD SCREEN =====
var _mobPostAdInited = false;
function initMobPostAdScreen() {
  // Load my ads list
  (async function() {
    var listEl = document.getElementById('mobMyAdsList');
    if (!listEl) return;
    if (!currentUser) { listEl.innerHTML = '<p class="mob-myads-empty">Login required.</p>'; return; }
    listEl.innerHTML = '<p class="mob-myads-empty">Loading...</p>';
    try {
      var res = await fetch('/api/p2p/my-ads');
      var data = await res.json();
      var offers = Array.isArray(data.offers) ? data.offers : (Array.isArray(data) ? data : []);
      if (!offers.length) { listEl.innerHTML = '<p class="mob-myads-empty">No ads posted yet.</p>'; return; }
      listEl.innerHTML = offers.map(function(o) {
        var isActive = o.status === 'ACTIVE';
        return '<div class="mob-myad-card">' +
          '<div class="mob-myad-row"><span class="mob-myad-type ' + (o.side === 'sell' ? 'sell' : 'buy') + '">' + (o.side === 'sell' ? 'SELL' : 'BUY') + '</span>' +
          '<span class="mob-myad-status ' + (isActive ? 'active' : 'paused') + '">' + (o.status || 'PAUSED') + '</span></div>' +
          '<div class="mob-myad-price">₹' + (o.price || 0) + ' / USDT</div>' +
          '<div class="mob-myad-meta">Available: ' + (o.available || 0) + ' USDT &nbsp;|&nbsp; ' + (o.minLimit || 0) + '–' + (o.maxLimit || 0) + ' INR</div>' +
          '<div class="mob-myad-actions">' +
            '<button class="mob-myad-btn" onclick="toggleMobAd(\'' + o.id + '\',\'' + (isActive ? 'PAUSED' : 'ACTIVE') + '\')">' + (isActive ? 'Pause' : 'Activate') + '</button>' +
            '<button class="mob-myad-btn danger" onclick="deleteMobAd(\'' + o.id + '\')">Delete</button>' +
          '</div></div>';
      }).join('');
    } catch(err) { listEl.innerHTML = '<p class="mob-myads-empty">Could not load ads.</p>'; }
  })();

  if (_mobPostAdInited) return;
  _mobPostAdInited = true;

  // Tab switching
  var tabBtns = document.querySelectorAll('.mob-ptab[data-ptab]');
  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      tabBtns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var target = btn.getAttribute('data-ptab');
      document.getElementById('mobPostAdCreate').style.display = target === 'create' ? 'block' : 'none';
      document.getElementById('mobPostAdMyads').style.display = target === 'myads' ? 'block' : 'none';
      if (target === 'myads') initMobPostAdScreen(); // refresh list
    });
  });

  // Form submit
  var form = document.getElementById('mobAdCreateForm');
  if (!form) return;
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    var meta = document.getElementById('mobAdCreateMeta');
    var btn = document.getElementById('mobAdCreateBtn');
    if (!currentUser) {
      if (meta) meta.textContent = 'Please login first.';
      authModal && authModal.classList.remove('hidden');
      return;
    }
    var payload = {
      type: document.getElementById('mobAdTypeInput').value,
      asset: document.getElementById('mobAdAssetInput').value,
      price: parseFloat(document.getElementById('mobAdPriceInput').value),
      available: parseFloat(document.getElementById('mobAdAvailableInput').value),
      minLimit: parseFloat(document.getElementById('mobAdMinLimitInput').value),
      maxLimit: parseFloat(document.getElementById('mobAdMaxLimitInput').value),
      payments: document.getElementById('mobAdPaymentsInput').value.split(',').map(function(s){ return s.trim(); }).filter(Boolean)
    };
    if (!payload.price || !payload.available || !payload.minLimit || !payload.maxLimit) {
      if (meta) meta.textContent = 'All fields are required.';
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = 'Posting...'; }
    if (meta) meta.textContent = '';
    try {
      var res = await fetch('/api/p2p/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      var data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to post ad.');
      if (meta) meta.textContent = 'Ad posted successfully!';
      form.reset();
      // Switch to My Ads tab
      var myadsTab = document.querySelector('.mob-ptab[data-ptab="myads"]');
      if (myadsTab) myadsTab.click();
      loadOffers();
    } catch(err) {
      if (meta) meta.textContent = err.message || 'Error posting ad.';
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Post Ad'; }
    }
  });
}

window.toggleMobAd = async function(offerId, newStatus) {
  try {
    var res = await fetch('/api/p2p/offers/' + offerId, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) { var d = await res.json(); throw new Error(d.message); }
    _mobPostAdInited = false;
    initMobPostAdScreen();
  } catch(err) { alert(err.message || 'Failed to update ad.'); }
};

window.deleteMobAd = async function(offerId) {
  if (!confirm('Delete this ad?')) return;
  try {
    var res = await fetch('/api/p2p/offers/' + offerId, {
      method: 'DELETE',
    });
    if (!res.ok) { var d = await res.json(); throw new Error(d.message); }
    _mobPostAdInited = false;
    initMobPostAdScreen();
    loadOffers();
  } catch(err) { alert(err.message || 'Failed to delete ad.'); }
};

// ===== MOB-SCREEN NAV (profile / orders screens) =====
(function initMobScreenNav() {
  var profileFlowScreens = new Set(['mobProfileScreen', 'mobPaymentMethodsScreen', 'mobPaymentMethodTypesScreen', 'mobPaymentMethodFormScreen']);
  function showMobScreen(screenId) {
    var all = document.querySelectorAll('.mob-screen');
    all.forEach(function(s){ s.style.display = 'none'; });
    var el = document.getElementById(screenId);
    if (el) { el.style.setProperty('display','flex','important'); el.style.flexDirection = 'column'; }
    if (profileFlowScreens.has(screenId) || screenId === 'mobOrdersScreen' || screenId === 'mobPostAdScreen') {
      document.body.classList.add('mob-screen-open');
      if (profileFlowScreens.has(screenId)) {
        document.body.dataset.mobileTab = 'profile';
        setMobileNavActive('profile');
        document.body.classList.add('mob-profile-open');
        if (screenId === 'mobProfileScreen') {
          history.replaceState(null,'','/p2p#profile');
        }
      } else if (screenId === 'mobOrdersScreen') {
        document.body.dataset.mobileTab = 'orders';
        setMobileNavActive('orders');
        history.replaceState(null,'','/p2p#orders');
        // Keep any already-rendered data visible; background refresh still runs.
        if (!_applyOrdersFocusState()) {
          switchOrdMain(_ordMainTab || 'pending');
        }
        startOrdPolling();
      } else if (screenId === 'mobPostAdScreen') {
        document.body.dataset.mobileTab = 'post';
        setMobileNavActive('post');
        history.replaceState(null,'','/p2p#ads');
      }
    }
  }
  window.showMobScreen = showMobScreen;
  window.hideMobScreens = function() { hideMobScreens(); };

  function hideMobScreens() {
    stopOrdPolling();
    var all = document.querySelectorAll('.mob-screen');
    all.forEach(function(s){ s.style.display = 'none'; });
    document.body.classList.remove('mob-screen-open', 'mob-profile-open');
    document.body.dataset.mobileTab = 'p2p';
    setMobileNavActive('p2p');
    ['kycBasicScreen','kycAdvanceScreen'].forEach(function(id){
      var el = document.getElementById(id);
      if(el) el.style.display = 'none';
    });
    history.replaceState(null,'','/p2p');
  }

  // Restore screen on refresh from hash
  (function restoreFromHash() {
    var hash = window.location.hash.replace('#','');
    if (hash === 'profile') { showMobScreen('mobProfileScreen'); setTimeout(function(){ loadProfilePanel && loadProfilePanel(); }, 300); }
    else if (hash === 'profile-payment') { openPaymentMethodsScreen(); }
    else if (hash === 'profile-payment-add') { openPaymentMethodPickerScreen(); }
    else if (hash === 'orders') { showMobScreen('mobOrdersScreen'); }
  })();

  // Unified click handler — nav tabs + back + KYC actions
  document.addEventListener('click', function(e) {
    // Bottom nav tabs
    var tab = e.target.closest('.mob-tab[data-mob]');
    if (tab) {
      e.preventDefault();
      var mob = tab.getAttribute('data-mob');
      document.querySelectorAll('.mob-tab').forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      if (mob === 'profile') showMobScreen('mobProfileScreen');
      else if (mob === 'orders') showMobScreen('mobOrdersScreen');
      else if (mob === 'post') { showMobScreen('mobPostAdScreen'); initMobPostAdScreen(); }
      else hideMobScreens();
      return;
    }
    // Back to main
    var back = e.target.closest('[data-mob-back]');
    if (back) { e.preventDefault(); hideMobScreens(); return; }
    // Open Payment Methods from profile menu
    var pmRow = e.target.closest('[data-open-payment]');
    if (pmRow) { if (window._pmJustClosed && Date.now() - window._pmJustClosed < 500) return; e.preventDefault(); openPaymentMethodsScreen(); return; }
    // Open KYC from profile menu
    var kycRow = e.target.closest('[data-open-kyc]');
    if (kycRow) { e.preventDefault(); openKycScreen(); return; }
    // KYC Step 1 → Step 2
    var kycNext = e.target.closest('[data-kyc-next]');
    if (kycNext) { e.preventDefault(); submitKycBasicAndNext(); return; }
    // KYC Submit
    var kycSubmit = e.target.closest('[data-kyc-submit]');
    if (kycSubmit) { e.preventDefault(); submitKycAdvance(); return; }
    // Close KYC (back from step 1 to profile)
    var kycClose = e.target.closest('[data-kyc-close]');
    if (kycClose) { e.preventDefault(); closeKycScreens(); return; }
    // Back to step 1 from step 2
    var kycBack = e.target.closest('[data-kyc-back]');
    if (kycBack) { e.preventDefault(); backToKycBasic(); return; }
  });

  // iOS touchend — ensures taps work inside fixed/overflow elements
  document.addEventListener('touchend', function(e) {
    var pmRow = e.target.closest('[data-open-payment]');
    if (pmRow) { if (window._pmJustClosed && Date.now() - window._pmJustClosed < 500) return; e.preventDefault(); openPaymentMethodsScreen(); return; }
    var kycRow = e.target.closest('[data-open-kyc]');
    if (kycRow) { e.preventDefault(); openKycScreen(); return; }
    var kycNext = e.target.closest('[data-kyc-next]');
    if (kycNext) { e.preventDefault(); submitKycBasicAndNext(); return; }
    var kycSubmit = e.target.closest('[data-kyc-submit]');
    if (kycSubmit) { e.preventDefault(); submitKycAdvance(); return; }
    var kycClose = e.target.closest('[data-kyc-close]');
    if (kycClose) { e.preventDefault(); closeKycScreens(); return; }
    var kycBack = e.target.closest('[data-kyc-back]');
    if (kycBack) { e.preventDefault(); backToKycBasic(); return; }
  }, { passive: false });
})();

// ===================================================================
// BYBIT/BITGET-STYLE MULTI-STEP BUY FLOW  (pixel-perfect clone)
// ===================================================================
(function initBuyFlow() {
  var _bfOffer = null;
  var _bfOrder = null;
  var _bfTimerTick = null;
  var _bfPaidSel = 0;

  // ── Helpers ──────────────────────────────────────────────────────
  function fmt(n) { return typeof formatNumber === 'function' ? formatNumber(n) : Number(n || 0).toLocaleString('en-IN'); }
  function esc(s) { return typeof escapeHtml === 'function' ? escapeHtml(s) : String(s || '').replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  // ── Timer ────────────────────────────────────────────────────────
  function bfTimerFmt(secs) {
    var s = Math.max(0, secs || 0);
    var m = Math.floor(s / 60), ss = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss + 's';
  }
  function bfStartTimer() {
    if (_bfTimerTick) clearInterval(_bfTimerTick);
    _bfTimerTick = setInterval(function() {
      var secs = typeof remainingSeconds !== 'undefined' ? remainingSeconds : 0;
      var txt = bfTimerFmt(secs);
      ['bfOrderTimer','bfPayTimer'].forEach(function(id) { var el = document.getElementById(id); if (el) el.textContent = txt; });
    }, 500);
  }
  function bfStopTimer() { if (_bfTimerTick) { clearInterval(_bfTimerTick); _bfTimerTick = null; } }

  // ── Screen management ─────────────────────────────────────────────
  function bfShow(id) {
    ['bfBuyScreen','bfOrderScreen','bfPayScreen'].forEach(function(sid) {
      var el = document.getElementById(sid);
      if (el) el.style.display = sid === id ? 'flex' : 'none';
    });
    document.body.style.overflow = id ? 'hidden' : '';
    document.body.classList.toggle('bf-open', !!id);
  }
  function bfClose() {
    ['bfBuyScreen','bfOrderScreen','bfPayScreen'].forEach(function(sid) {
      var el = document.getElementById(sid); if (el) el.style.display = 'none';
    });
    var sheet = document.getElementById('bfPaidSheet'); if (sheet) sheet.style.display = 'none';
    document.body.style.overflow = ''; document.body.classList.remove('bf-open'); bfStopTimer();
  }
  function bfShowOldOrderModal() {
    bfClose();
    var om = document.getElementById('orderModal');
    if (om) { om.classList.remove('hidden'); om.setAttribute('aria-hidden','false'); }
    document.body.classList.add('p2p-order-open'); document.body.style.overflow = 'hidden';
  }

  // ── Copy SVG icon ─────────────────────────────────────────────────
  function copyBtn(val) {
    var v = String(val || '').replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    return '<span onclick="(function(t){if(navigator.clipboard)navigator.clipboard.writeText(t).catch(function(){})})(\''+v+'\')" style="cursor:pointer;margin-left:6px;display:inline-flex;align-items:center;vertical-align:middle;opacity:0.5;">'
      + '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>'
      + '</span>';
  }

  // ── Row builder ───────────────────────────────────────────────────
  function makeRow(label, valueHtml, copyVal) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.52rem 0;border-bottom:1px solid #1e1e1e;">'
      + '<span style="color:rgba(255,255,255,0.42);font-size:0.79rem;flex-shrink:0;margin-right:0.6rem;">' + label + '</span>'
      + '<span style="color:#fff;font-weight:600;font-size:0.82rem;display:flex;align-items:center;text-align:right;">' + valueHtml + (copyVal ? copyBtn(copyVal) : '') + '</span>'
      + '</div>';
  }

  // ── Payment method pill ───────────────────────────────────────────
  function pmPill(method) {
    return '<span style="display:inline-flex;align-items:center;gap:5px;">'
      + '<span style="width:8px;height:8px;border-radius:2px;background:#00c2b2;display:inline-block;flex-shrink:0;"></span>'
      + esc(method || 'UPI') + '</span>';
  }

  // ── Seller row (name badge) ───────────────────────────────────────
  function sellerRowHtml(name) {
    var init = String(name || 'S').slice(0,1).toUpperCase();
    return '<div style="display:inline-flex;align-items:center;gap:7px;">'
      + '<div style="width:24px;height:24px;border-radius:5px;background:#2c2c2c;color:#fff;font-size:0.75rem;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' + init + '.</div>'
      + '<span style="font-weight:700;font-size:0.9rem;">' + esc(name || '--') + '</span>'
      + '<span style="background:#1565ff;color:#fff;font-size:0.6rem;font-weight:800;padding:1px 5px;border-radius:3px;line-height:1.5;letter-spacing:0.02em;">+</span>'
      + '</div>';
  }

  // ── Chat icon button ──────────────────────────────────────────────
  function chatBtnHtml(btnId, prevScreen) {
    return '<button id="' + btnId + '" data-chat-prev="' + prevScreen + '" style="position:relative;width:38px;height:38px;border-radius:9px;background:#1e1e1e;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'
      + '<svg width="18" height="17" viewBox="0 0 24 23" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>'
      + '<span style="position:absolute;top:6px;right:6px;width:7px;height:7px;border-radius:50%;background:#00c2b2;border:1.5px solid #0d0d0d;"></span>'
      + '</button>';
  }

  // ── Inject all screen HTML ────────────────────────────────────────
  function injectHTML() {
    var SCR = 'position:fixed;inset:0;z-index:620;background:#0d0d0d;flex-direction:column;font-family:Manrope,sans-serif;overflow:hidden;';
    var BACK = 'background:none;border:none;color:#fff;font-size:1.3rem;cursor:pointer;padding:0.25rem 0.5rem 0.25rem 0;line-height:1;';
    var BODY = 'flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0 1.1rem;';
    var FOOT = 'flex-shrink:0;padding:0.9rem 1.1rem;padding-bottom:calc(0.9rem + env(safe-area-inset-bottom));background:#0d0d0d;border-top:1px solid #191919;display:flex;flex-direction:column;gap:0.5rem;';
    var PBTN = 'width:100%;padding:1rem;border:none;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;font-family:Manrope,sans-serif;background:#fff;color:#0d0d0d;';
    var GBTN = 'width:100%;padding:0.85rem;background:transparent;color:#fff;border:none;font-size:0.95rem;font-weight:600;cursor:pointer;font-family:Manrope,sans-serif;';
    var CARD = 'background:#181818;border-radius:12px;padding:1rem 1.1rem;margin-bottom:0.85rem;';

    var html = [
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SCREEN 1  ─  Buy USDT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    '<div id="bfBuyScreen" style="display:none;' + SCR + '">',
      // Header
      '<div style="display:flex;align-items:center;padding:1rem 1rem 0.7rem;flex-shrink:0;">',
        '<button id="bfBuyBack" style="' + BACK + '">←</button>',
        '<h2 style="flex:1;text-align:center;margin:0;font-size:1rem;font-weight:700;color:#fff;">Buy USDT</h2>',
        '<div style="width:1.8rem;"></div>',
      '</div>',
      // Body
      '<div style="' + BODY + 'padding-top:0.2rem;">',
        // Crypto / Fiat tabs + price
        '<div style="display:flex;align-items:flex-end;justify-content:space-between;border-bottom:1px solid #1e1e1e;margin-bottom:1.1rem;">',
          '<div style="display:flex;gap:1.6rem;">',
            '<span style="padding-bottom:0.6rem;font-size:0.88rem;font-weight:600;color:rgba(255,255,255,0.32);cursor:pointer;">Crypto</span>',
            '<span style="padding-bottom:0.6rem;font-size:0.88rem;font-weight:700;color:#fff;border-bottom:2px solid #00c2b2;position:relative;top:1px;">Fiat</span>',
          '</div>',
          '<span id="bfPriceTag" style="font-size:0.76rem;color:rgba(255,255,255,0.38);padding-bottom:0.6rem;display:flex;align-items:center;gap:4px;">Price ₹-- <span style="color:#00c2b2;font-size:0.82rem;">↻</span></span>',
        '</div>',
        // Amount input
        '<div style="background:#181818;border-radius:10px;padding:0.8rem 1rem;display:flex;align-items:center;gap:0.65rem;margin-bottom:0.4rem;">',
          '<input id="bfPayInput" type="number" inputmode="decimal" placeholder="Enter amount" style="flex:1;background:none;border:none;color:#fff;font-size:1.15rem;font-weight:600;outline:none;font-family:Manrope,sans-serif;min-width:0;"/>',
          '<span style="color:rgba(255,255,255,0.38);font-size:0.84rem;font-weight:700;flex-shrink:0;">INR</span>',
          '<button id="bfMaxBtn" style="background:transparent;border:1px solid #00c2b2;color:#00c2b2;font-size:0.72rem;font-weight:700;padding:4px 11px;border-radius:5px;cursor:pointer;flex-shrink:0;font-family:Manrope,sans-serif;">Max</button>',
        '</div>',
        '<div id="bfLimitInfo" style="font-size:0.74rem;color:rgba(255,255,255,0.36);margin-bottom:0.18rem;padding-left:2px;">Limit ₹-- - ₹--</div>',
        '<div id="bfUsdtCalc" style="font-size:0.77rem;color:rgba(255,255,255,0.42);margin-bottom:1rem;padding-left:2px;">≈ -- USDT</div>',
        // Payment method
        '<div style="background:#181818;border-radius:10px;padding:0.78rem 1rem;display:flex;align-items:center;gap:0.65rem;margin-bottom:1.1rem;">',
          '<span style="width:9px;height:9px;border-radius:2px;background:#00c2b2;flex-shrink:0;"></span>',
          '<select id="bfPayMethod" style="flex:1;background:none;border:none;color:#fff;font-size:0.89rem;font-family:Manrope,sans-serif;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;"></select>',
          '<span style="color:rgba(255,255,255,0.28);font-size:0.75rem;">▼</span>',
        '</div>',
        // Advertiser terms
        '<div style="margin-bottom:1.2rem;">',
          '<div style="font-size:0.8rem;color:rgba(255,255,255,0.48);font-weight:600;margin-bottom:0.32rem;">Advertiser terms</div>',
          '<div id="bfTerms" style="font-size:0.82rem;color:rgba(255,255,255,0.7);line-height:1.55;"></div>',
        '</div>',
        // Seller card
        '<div style="' + CARD + '">',
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">',
            '<div id="bfSellerRow"></div>',
            '<span style="color:rgba(255,255,255,0.28);font-size:0.9rem;margin-left:0.5rem;">→</span>',
          '</div>',
          '<div style="display:grid;gap:0.5rem;font-size:0.78rem;">',
            '<div style="display:flex;justify-content:space-between;">',
              '<span style="color:rgba(255,255,255,0.4);">Pay within</span>',
              '<span id="bfDuration" style="color:#fff;font-weight:600;">15 minute(s)</span>',
            '</div>',
            '<div style="display:flex;justify-content:space-between;">',
              '<span style="color:rgba(255,255,255,0.4);">Historical orders</span>',
              '<span id="bfHistOrders" style="color:#fff;font-weight:600;">--</span>',
            '</div>',
            '<div style="display:flex;justify-content:space-between;">',
              '<span style="color:rgba(255,255,255,0.4);">30D average release time</span>',
              '<span style="color:#fff;font-weight:600;">1 min</span>',
            '</div>',
            '<div style="display:flex;justify-content:space-between;">',
              '<span style="color:rgba(255,255,255,0.4);">Completed orders (both parties)</span>',
              '<span id="bfCompletedOrds" style="color:#fff;font-weight:600;">0</span>',
            '</div>',
            '<div style="display:flex;justify-content:space-between;">',
              '<span style="color:rgba(255,255,255,0.4);">Account signup time</span>',
              '<span id="bfSignupDate" style="color:#fff;font-weight:600;">2024.01.01</span>',
            '</div>',
          '</div>',
        '</div>',
        '<div style="height:0.5rem;"></div>',
      '</div>',
      // Footer
      '<div style="' + FOOT + '">',
        '<div id="bfBuyHint" style="font-size:0.78rem;color:#f6465d;min-height:1em;text-align:center;"></div>',
        '<button id="bfBuyBtn" style="' + PBTN + 'background:#00c2b2;color:#0d0d0d;">Buy USDT with 0 fees</button>',
      '</div>',
    '</div>',

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SCREEN 2  ─  Order Generated
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    '<div id="bfOrderScreen" style="display:none;' + SCR + '">',
      '<div style="display:flex;align-items:center;padding:1rem 1rem 0.6rem;flex-shrink:0;">',
        '<button id="bfOrderBack" style="' + BACK + '">←</button>',
      '</div>',
      '<div style="' + BODY + 'padding-top:0.1rem;">',
        '<h2 style="margin:0 0 0.4rem;font-size:1.25rem;font-weight:800;line-height:1.35;color:#fff;">The order has been generated.<br>Proceed to payment.</h2>',
        '<p style="margin:0 0 1.25rem;font-size:0.82rem;color:rgba(255,255,255,0.42);">Please pay within <span id="bfOrderTimer" style="color:#00c2b2;font-weight:700;">15:00s</span></p>',
        // Seller card with chat btn
        '<div style="' + CARD + 'display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;">',
          '<div style="flex:1;min-width:0;">',
            '<div id="bfOrdSellerRow" style="margin-bottom:0.8rem;"></div>',
          '</div>',
          '<div id="bfOrdChatWrap" style="flex-shrink:0;"></div>',
        '</div>',
        // Order details card
        '<div style="' + CARD + '">',
          // Tether T + Buy USDT header
          '<div style="display:flex;align-items:center;gap:0.6rem;padding-bottom:0.8rem;border-bottom:1px solid #222;margin-bottom:0.1rem;">',
            '<div style="width:26px;height:26px;border-radius:50%;background:#26a17b;display:flex;align-items:center;justify-content:center;flex-shrink:0;">',
              '<span style="color:#fff;font-weight:900;font-size:0.82rem;line-height:1;">T</span>',
            '</div>',
            '<span style="font-weight:700;font-size:0.9rem;color:#fff;">Buy USDT</span>',
          '</div>',
          '<div id="bfOrdDetails"></div>',
        '</div>',
        '<div style="height:0.5rem;"></div>',
      '</div>',
      '<div style="' + FOOT + '">',
        '<button id="bfNextBtn" style="' + PBTN + '">Next →</button>',
        '<button id="bfOrdCancelBtn" style="' + GBTN + '">Cancel</button>',
      '</div>',
    '</div>',

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SCREEN 3  ─  Payment Instructions
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    '<div id="bfPayScreen" style="display:none;' + SCR + '">',
      '<div style="display:flex;align-items:center;padding:1rem 1rem 0.6rem;flex-shrink:0;">',
        '<button id="bfPayBack" style="' + BACK + '">←</button>',
      '</div>',
      '<div style="' + BODY + 'padding-top:0.1rem;">',
        '<h2 id="bfPayTitle" style="margin:0 0 0.4rem;font-size:1.2rem;font-weight:800;line-height:1.35;color:#fff;">Please use UPI to transfer funds</h2>',
        '<p style="margin:0 0 1.25rem;font-size:0.82rem;color:rgba(255,255,255,0.42);">Please pay within <span id="bfPayTimer" style="color:#00c2b2;font-weight:700;">15:00s</span></p>',
        // Seller row + chat
        '<div style="' + CARD + 'display:flex;align-items:center;justify-content:space-between;gap:0.75rem;">',
          '<div id="bfPaySellerRow"></div>',
          '<div id="bfPayChatWrap" style="flex-shrink:0;"></div>',
        '</div>',
        // ◆ Exit instruction
        '<div style="display:flex;gap:0.7rem;margin-bottom:0.7rem;">',
          '<span style="color:#f0a500;font-size:1rem;flex-shrink:0;margin-top:3px;">◆</span>',
          '<div>',
            '<p style="margin:0 0 0.4rem;font-size:0.85rem;color:#fff;font-weight:600;line-height:1.5;">Exit the App and transfer funds to the following recipient\'s account.</p>',
            '<p style="margin:0;font-size:0.74rem;color:rgba(255,255,255,0.38);line-height:1.55;">During the transfer, please avoid using terms like BTC, USDT, Bitget, or similar, in the remarks, to prevent issues like the payment being intercepted or the account being frozen.</p>',
          '</div>',
        '</div>',
        // Transfer details table
        '<div style="background:#151515;border-radius:10px;padding:0.2rem 1rem;margin-bottom:0.8rem;">',
          '<div id="bfPayDetails"></div>',
        '</div>',
        // Warning text
        '<p id="bfPayWarn" style="font-size:0.74rem;color:rgba(255,255,255,0.38);line-height:1.55;margin:0 0 0.9rem;"></p>',
        // ◆ Tap Paid
        '<div style="display:flex;gap:0.7rem;margin-bottom:1rem;">',
          '<span style="color:#f0a500;font-size:1rem;flex-shrink:0;margin-top:3px;">◆</span>',
          '<p style="margin:0;font-size:0.85rem;color:#fff;line-height:1.5;">After completing the transfer, tap the <strong>Paid</strong> button</p>',
        '</div>',
        '<div style="height:0.5rem;"></div>',
      '</div>',
      '<div style="' + FOOT + '">',
        '<button id="bfPaidBtn" style="' + PBTN + '">Paid</button>',
        '<button id="bfPayCancelBtn" style="' + GBTN + '">Cancel</button>',
      '</div>',
    '</div>',

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PAID BOTTOM SHEET
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    '<div id="bfPaidSheet" style="display:none;position:fixed;inset:0;z-index:700;background:rgba(0,0,0,0.55);align-items:flex-end;font-family:Manrope,sans-serif;">',
      '<div style="background:#141414;border-radius:18px 18px 0 0;width:100%;padding-bottom:calc(1.4rem + env(safe-area-inset-bottom));">',
        // drag handle
        '<div style="padding:0.8rem 0 0.2rem;display:flex;justify-content:center;">',
          '<div style="width:36px;height:4px;border-radius:2px;background:rgba(255,255,255,0.18);"></div>',
        '</div>',
        '<div style="padding:0.9rem 1.1rem 0;">',
          '<h3 style="margin:0 0 1rem;font-size:1.05rem;font-weight:700;color:#fff;">Paid</h3>',
          // warning box
          '<div style="background:rgba(240,165,0,0.07);border:1px solid rgba(240,165,0,0.28);border-radius:9px;padding:0.7rem 0.85rem;margin-bottom:0.9rem;display:flex;gap:0.5rem;align-items:flex-start;">',
            '<span style="color:#f0a500;font-size:0.88rem;flex-shrink:0;">ℹ</span>',
            '<p style="margin:0;font-size:0.76rem;color:rgba(255,255,255,0.62);line-height:1.5;">Complete the payment before clicking "Paid". False actions may lead to account restrictions.</p>',
          '</div>',
          // option 1
          '<div id="bfPaidOpt1" onclick="bfSelectPaidOpt(1)" style="background:#1c1c1c;border:1.5px solid #2a2a2a;border-radius:10px;padding:0.9rem 1rem;margin-bottom:0.45rem;cursor:pointer;transition:border-color 0.15s,background 0.15s;">',
            '<span id="bfPaidOpt1Text" style="font-size:0.86rem;color:#fff;line-height:1.4;display:block;">I have transferred the amount to the above account.</span>',
          '</div>',
          // option 2
          '<div id="bfPaidOpt2" onclick="bfSelectPaidOpt(2)" style="background:#1c1c1c;border:1.5px solid #2a2a2a;border-radius:10px;padding:0.9rem 1rem;margin-bottom:1rem;cursor:pointer;transition:border-color 0.15s,background 0.15s;">',
            '<span style="font-size:0.86rem;color:#fff;line-height:1.4;display:block;">I have not made the payment yet.</span>',
          '</div>',
          // confirm btn
          '<button id="bfPaidConfirmBtn" disabled style="width:100%;padding:1rem;background:#222;color:rgba(255,255,255,0.22);border:none;border-radius:12px;font-size:1rem;font-weight:700;cursor:not-allowed;font-family:Manrope,sans-serif;transition:all 0.15s;">Confirm</button>',
        '</div>',
      '</div>',
    '</div>',
    ].join('');

    var w = document.createElement('div'); w.innerHTML = html; document.body.appendChild(w);
  }

  // ── Fill Screen 1 ─────────────────────────────────────────────────
  function bfFillBuy(offer) {
    _bfOffer = offer;
    var el;
    var sellerRow = document.getElementById('bfSellerRow');
    if (sellerRow) sellerRow.innerHTML = sellerRowHtml(offer.advertiser || '--');
    el = document.getElementById('bfPriceTag');
    if (el) el.innerHTML = 'Price ₹' + fmt(offer.price) + ' <span style="color:#00c2b2;font-size:0.82rem;">↻</span>';
    el = document.getElementById('bfLimitInfo');
    if (el) el.textContent = 'Limit ₹' + fmt(offer.minLimit) + ' - ₹' + fmt(offer.maxLimit);
    el = document.getElementById('bfTerms');
    if (el) el.textContent = offer.remark || 'Standard P2P terms apply.';
    el = document.getElementById('bfHistOrders');
    if (el) el.textContent = 'Buy ' + (offer.orders || 0) + ' Sell 0';
    el = document.getElementById('bfCompletedOrds');
    if (el) el.textContent = offer.orders || 0;
    var pm = document.getElementById('bfPayMethod');
    if (pm) pm.innerHTML = getOfferPayments(offer).map(function(m) { return '<option value="' + esc(m) + '">' + esc(m) + '</option>'; }).join('');
    var pi = document.getElementById('bfPayInput');
    if (pi) { pi.value = offer.minLimit || ''; bfUpdateCalc(); }
    el = document.getElementById('bfBuyHint'); if (el) el.textContent = '';
    bfShow('bfBuyScreen');
    if (pi) setTimeout(function() { pi.focus(); }, 350);
  }

  function bfUpdateCalc() {
    var pi = document.getElementById('bfPayInput'), uc = document.getElementById('bfUsdtCalc');
    if (!pi || !_bfOffer) return;
    var amt = Number(pi.value || 0), usdt = _bfOffer.price > 0 ? amt / _bfOffer.price : 0;
    if (uc) uc.textContent = amt > 0 ? ('≈ ' + usdt.toFixed(2) + 'USDT') : '≈ -- USDT';
  }

  // ── Fill Screen 2 ─────────────────────────────────────────────────
  function bfFillOrder(order) {
    _bfOrder = order;
    var sellerName = order.sellerUsername || (_bfOffer && _bfOffer.advertiser) || '--';
    var el = document.getElementById('bfOrdSellerRow');
    if (el) el.innerHTML = sellerRowHtml(sellerName);
    var cw = document.getElementById('bfOrdChatWrap');
    if (cw) cw.innerHTML = chatBtnHtml('bfOrdChatBtn', 'bfOrderScreen');

    var det = document.getElementById('bfOrdDetails');
    if (det) {
      var remark = order.notes || order.remark || (_bfOffer && _bfOffer.remark) || '';
      var dt = new Date(order.createdAt || Date.now());
      var pad = function(n) { return (n < 10 ? '0' : '') + n; };
      var dtStr = dt.getFullYear() + '-' + pad(dt.getMonth()+1) + '-' + pad(dt.getDate()) + ' ' + pad(dt.getHours()) + ':' + pad(dt.getMinutes()) + ':' + pad(dt.getSeconds());
      var refStr = String(order.reference || order.id || '--');
      var price = order.price || (_bfOffer && _bfOffer.price) || 0;
      var qty = order.assetAmount || (price > 0 ? (order.amountInr / price) : 0);
      det.innerHTML =
        makeRow('Trading amount', '₹ ' + fmt(order.amountInr || 0), String(order.amountInr || '')) +
        makeRow('Price', '₹' + fmt(price), null) +
        makeRow('Quantity', Number(qty).toFixed(2) + ' USDT', null) +
        makeRow('Fee', '0 USDT', null) +
        makeRow('Payment method', pmPill(order.paymentMethod || (_bfOffer && _bfOffer.payments && _bfOffer.payments[0]) || 'UPI'), null) +
        '<div style="border-top:1px solid #222;margin:0.5rem 0;"></div>' +
        makeRow('Order No', '<span style="font-size:0.74rem;">' + esc(refStr) + '</span>', refStr) +
        makeRow('Order time', dtStr, null) +
        (remark ? makeRow('Notes', '<span style="font-size:0.76rem;color:rgba(255,255,255,0.55);">' + esc(remark) + '</span>', null) : '');
    }
    var secs = typeof remainingSeconds !== 'undefined' ? remainingSeconds : 900;
    var t = document.getElementById('bfOrderTimer'); if (t) t.textContent = bfTimerFmt(secs);
    bfStartTimer();
    bfShow('bfOrderScreen');
  }

  // ── Fill Screen 3 ─────────────────────────────────────────────────
  function bfFillPay() {
    if (!_bfOrder) return;
    var order = _bfOrder;
    var method = order.paymentMethod || (_bfOffer && _bfOffer.payments && _bfOffer.payments[0]) || 'UPI';
    var sellerName = order.sellerUsername || (_bfOffer && _bfOffer.advertiser) || '--';
    var el;
    el = document.getElementById('bfPayTitle');
    if (el) el.textContent = 'Please use ' + method + ' to transfer funds';
    el = document.getElementById('bfPaySellerRow');
    if (el) el.innerHTML = sellerRowHtml(sellerName);
    var cw = document.getElementById('bfPayChatWrap');
    if (cw) cw.innerHTML = chatBtnHtml('bfPayChatBtn', 'bfPayScreen');

    var det = document.getElementById('bfPayDetails');
    if (det) {
      det.innerHTML =
        makeRow('Trading amount', '₹ ' + fmt(order.amountInr || 0), String(order.amountInr || '')) +
        makeRow('Recipient name', esc(sellerName), sellerName) +
        makeRow('Payment method', pmPill(method), null) +
        makeRow(method + ' wallet VPA', '<span style="color:rgba(255,255,255,0.4);">ask in chat</span>', null);
    }
    var myName = (typeof currentUser !== 'undefined' && currentUser) ? (currentUser.username || currentUser.name || 'you') : 'you';
    el = document.getElementById('bfPayWarn');
    if (el) el.textContent = 'Please use an account under your name (' + myName + ') to make the transfer. If the paying account and your personal information do not match, the seller may request a refund or cancel the order.';
    bfShow('bfPayScreen');
  }

  // ── Paid sheet ─────────────────────────────────────────────────────
  function bfShowPaidSheet() {
    _bfPaidSel = 0;
    var o1 = document.getElementById('bfPaidOpt1'), o2 = document.getElementById('bfPaidOpt2'), btn = document.getElementById('bfPaidConfirmBtn'), t1 = document.getElementById('bfPaidOpt1Text');
    if (o1) { o1.style.borderColor = '#2a2a2a'; o1.style.background = '#1c1c1c'; }
    if (o2) { o2.style.borderColor = '#2a2a2a'; o2.style.background = '#1c1c1c'; }
    if (btn) { btn.disabled = true; btn.style.background = '#222'; btn.style.color = 'rgba(255,255,255,0.22)'; btn.style.cursor = 'not-allowed'; }
    if (t1 && _bfOrder) t1.textContent = 'I have transferred ' + fmt(_bfOrder.amountInr || 0) + ' INR to the above account.';
    var sheet = document.getElementById('bfPaidSheet'); if (sheet) sheet.style.display = 'flex';
  }

  window.bfSelectPaidOpt = function(opt) {
    _bfPaidSel = opt;
    var o1 = document.getElementById('bfPaidOpt1'), o2 = document.getElementById('bfPaidOpt2'), btn = document.getElementById('bfPaidConfirmBtn');
    if (o1) { o1.style.borderColor = opt === 1 ? '#00c2b2' : '#2a2a2a'; o1.style.background = opt === 1 ? 'rgba(0,194,178,0.08)' : '#1c1c1c'; }
    if (o2) { o2.style.borderColor = opt === 2 ? 'rgba(255,255,255,0.25)' : '#2a2a2a'; o2.style.background = opt === 2 ? 'rgba(255,255,255,0.05)' : '#1c1c1c'; }
    if (btn) { var ok = opt === 1; btn.disabled = !ok; btn.style.background = ok ? '#fff' : '#222'; btn.style.color = ok ? '#0d0d0d' : 'rgba(255,255,255,0.22)'; btn.style.cursor = ok ? 'pointer' : 'not-allowed'; }
  };

  // ── Wire Events ───────────────────────────────────────────────────
  function wireEvents() {
    // Screen 1
    document.getElementById('bfBuyBack').onclick = function() { bfClose(); };
    document.getElementById('bfPayInput').oninput = bfUpdateCalc;
    document.getElementById('bfMaxBtn').onclick = function() {
      if (_bfOffer) { document.getElementById('bfPayInput').value = _bfOffer.maxLimit; bfUpdateCalc(); }
    };
    document.getElementById('bfBuyBtn').onclick = async function() {
      var btn = this, hint = document.getElementById('bfBuyHint');
      if (!_bfOffer) return;
      var payAmt = Number(document.getElementById('bfPayInput').value || 0);
      var method = document.getElementById('bfPayMethod').value;
      var min = Number(_bfOffer.minLimit || 0), max = Number(_bfOffer.maxLimit || Infinity);
      if (!payAmt || payAmt < min || payAmt > max) {
        if (hint) hint.textContent = 'Enter amount between ₹' + fmt(min) + ' and ₹' + fmt(max);
        return;
      }
      if (hint) hint.textContent = '';
      // Check 1 active order limit
      var hasActive = _ordAllOrders.some(function(o) {
        return ['CREATED','PENDING','PAID','PAYMENT_SENT'].indexOf((o.status || '').toUpperCase()) !== -1;
      });
      if (hasActive) {
        if (hint) hint.textContent = 'You already have an active order. Complete it first.';
        return;
      }
      if (btn._creating) return; // prevent double-submit
      btn._creating = true;
      btn.disabled = true;
      btn.style.transform = 'scale(0.95)';
      btn.style.transition = 'transform 0.1s ease';
      btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><span style="width:14px;height:14px;border:2px solid rgba(0,0,0,0.3);border-top-color:#000;border-radius:50%;animation:ord-spin 0.7s linear infinite;display:inline-block;"></span>Placing order...</span>';
      setTimeout(function() { btn.style.transform = ''; }, 150);
      // Show loading toast
      var toast = document.createElement('div');
      toast.id = 'bfToast';
      toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#00c2b2;color:#000;padding:10px 22px;border-radius:24px;font-size:13px;font-weight:700;z-index:99999;box-shadow:0 4px 16px rgba(0,194,178,0.4);';
      toast.textContent = '⏳ Placing your order...';
      document.body.appendChild(toast);
      try {
        var data = await createOrder(_bfOffer.id, { amountInr: payAmt, paymentMethod: method, openAfterCreate: false });
        if (!data || !data.order) throw new Error('Order creation failed.');
        toast.style.background = '#16a34a';
        toast.textContent = '✓ Order placed!';
        setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 2000);
        openOrder(data.order);
        var om = document.getElementById('orderModal');
        if (om) { om.classList.add('hidden'); om.setAttribute('aria-hidden','true'); }
        document.body.classList.remove('p2p-order-open');
        bfFillOrder(data.order);
      } catch(e) {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
        if (hint) hint.textContent = e.message || 'Failed to create order.';
      } finally {
        btn._creating = false;
        btn.disabled = false;
        btn.style.opacity = '';
        btn.textContent = 'Buy USDT with 0 fees';
      }
    };

    // Screen 2
    document.getElementById('bfOrderBack').onclick = function() {
      if (confirm('Go back? Your order will remain active.')) { bfClose(); bfShowOldOrderModal(); }
    };
    document.getElementById('bfNextBtn').onclick = function() { bfFillPay(); };
    document.getElementById('bfOrdCancelBtn').onclick = function() {
      bfClose();
      var om = document.getElementById('orderModal');
      if (om) { om.classList.remove('hidden'); om.setAttribute('aria-hidden','false'); }
      document.body.classList.add('p2p-order-open'); document.body.style.overflow = 'hidden';
      if (typeof setCancelModalOpen === 'function') setTimeout(function() { setCancelModalOpen(true); }, 100);
    };

    // Screen 3 – delegate chat btn clicks (injected dynamically)
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-chat-prev]');
      if (btn) { var prev = btn.getAttribute('data-chat-prev'); if (window.bfOpenChat) window.bfOpenChat(prev); }
    });

    document.getElementById('bfPayBack').onclick = function() { bfShow('bfOrderScreen'); };
    document.getElementById('bfPayCancelBtn').onclick = document.getElementById('bfOrdCancelBtn').onclick;
    document.getElementById('bfPaidBtn').onclick = function() { bfShowPaidSheet(); };

    // Paid sheet
    document.getElementById('bfPaidSheet').addEventListener('click', function(e) { if (e.target === this) this.style.display = 'none'; });
    document.getElementById('bfPaidConfirmBtn').onclick = async function() {
      if (_bfPaidSel !== 1) return;
      var btn = this;
      btn.disabled = true;
      btn.style.transform = 'scale(0.95)';
      btn.style.transition = 'transform 0.1s ease';
      btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><span style="width:14px;height:14px;border:2px solid rgba(0,0,0,0.3);border-top-color:#000;border-radius:50%;animation:ord-spin 0.7s linear infinite;display:inline-block;"></span>Processing...</span>';
      setTimeout(function() { btn.style.transform = ''; }, 150);
      // Optimistic: close sheet immediately, show waiting state
      var sheet = document.getElementById('bfPaidSheet'); if (sheet) sheet.style.display = 'none';
      bfClose(); bfShowOldOrderModal();
      try {
        await updateOrderStatus('mark_paid');
      } catch(e) {
        console.error('[bfPaidConfirm] error:', e.message);
        // Don't reopen — order may have been marked paid already
      }
    };
  }

  // ── Override fillDealModal ─────────────────────────────────────────
  var _origFillDeal = window.fillDealModal;
  window.fillDealModal = function(offer) {
    if (_origFillDeal) _origFillDeal(offer);
    var dm = document.getElementById('dealModal');
    if (dm) { dm.classList.add('hidden'); dm.setAttribute('aria-hidden','true'); }
    document.body.classList.remove('p2p-deal-open');
    bfFillBuy(offer);
  };

  // ── Init ──────────────────────────────────────────────────────────
  injectHTML();
  wireEvents();
})();

// ===================================================================
// BINANCE-STYLE CHAT SCREEN  (opens when 💬 is tapped)
// ===================================================================
(function initBfChatScreen() {
  var _chatPrevScreen = 'bfOrderScreen';
  var _chatPollTimer = null;
  var _chatRenderedIds = {};

  // ── helpers ──────────────────────────────────────────────────────
  function esc2(s) {
    return typeof escapeHtml === 'function' ? escapeHtml(s)
      : String(s || '').replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; });
  }

  function getOrderId() {
    return typeof activeOrderId !== 'undefined' ? activeOrderId : null;
  }

  function getMyName() {
    if (typeof currentUser !== 'undefined' && currentUser) return currentUser.username || currentUser.name || '';
    return '';
  }

  // ── inject HTML ──────────────────────────────────────────────────
  function injectChatHTML() {
    var div = document.createElement('div');
    div.innerHTML = [
      '<div id="bfChatScreen" style="display:none;position:fixed;inset:0;z-index:650;background:#0a0a0a;flex-direction:column;font-family:Manrope,sans-serif;overflow:hidden;">',
        // Header
        '<div id="bfChatHeader" style="display:flex;align-items:center;padding:0.85rem 1rem;gap:0.75rem;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,0.07);background:#111;">',
          '<button id="bfChatBackBtn" style="background:none;border:none;color:#fff;font-size:1.4rem;cursor:pointer;padding:0.2rem 0.4rem;line-height:1;">←</button>',
          '<div id="bfChatAvatar" style="width:34px;height:34px;border-radius:50%;background:#f0b90b;color:#000;font-weight:800;font-size:0.9rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;"></div>',
          '<div style="flex:1;min-width:0;">',
            '<div id="bfChatName" style="font-weight:700;font-size:0.92rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>',
            '<div style="font-size:0.72rem;color:rgba(255,255,255,0.4);">P2P Order Chat</div>',
          '</div>',
        '</div>',
        // Messages area
        '<div id="bfChatMsgs" style="flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0.9rem 1rem;display:flex;flex-direction:column;gap:0.55rem;"></div>',
        // Footer
        '<div style="flex-shrink:0;padding:0.7rem 1rem;padding-bottom:calc(0.7rem + env(safe-area-inset-bottom));background:#111;border-top:1px solid rgba(255,255,255,0.07);display:flex;align-items:flex-end;gap:0.55rem;">',
          '<label id="bfChatImgBtn" style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;font-size:1.1rem;" title="Send image">',
            '<span>📎</span>',
            '<input id="bfChatImgInput" type="file" accept="image/*" style="display:none;">',
          '</label>',
          '<textarea id="bfChatInput" rows="1" placeholder="Type a message..." style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:20px;color:#fff;font-size:0.9rem;font-family:Manrope,sans-serif;padding:0.6rem 1rem;outline:none;resize:none;max-height:100px;line-height:1.4;"></textarea>',
          '<button id="bfChatSendBtn" style="width:42px;height:42px;border-radius:50%;background:#00c2b2;border:none;color:#000;font-size:1.1rem;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700;">→</button>',
        '</div>',
      '</div>'
    ].join('');
    document.body.appendChild(div);
  }

  // ── render messages ──────────────────────────────────────────────
  function renderMsg(msg) {
    var myName = getMyName().toLowerCase();
    var sender = String(msg.sender || '').toLowerCase();
    var isMine = sender === myName;
    var isSystem = msg.messageType === 'system' || (!msg.sender);

    if (isSystem) {
      var sysEl = document.createElement('div');
      sysEl.style.cssText = 'text-align:center;padding:0.35rem 0.75rem;margin:4px 0;';
      sysEl.innerHTML = '<span style="display:inline-block;background:rgba(255,255,255,0.08);border-radius:20px;padding:4px 14px;font-size:0.75rem;font-weight:700;color:#fff;letter-spacing:0.01em;">' +
        (msg.text ? msg.text.replace(/[&<>"]/g, function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]||c;}) : '') + '</span>';
      return sysEl;
    }

    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:' + (isMine ? 'flex-end' : 'flex-start') + ';gap:2px;';

    var bubble = document.createElement('div');
    bubble.style.cssText = 'max-width:75%;padding:0.55rem 0.85rem;border-radius:' +
      (isMine ? '16px 4px 16px 16px' : '4px 16px 16px 16px') +
      ';font-size:0.87rem;line-height:1.45;word-break:break-word;' +
      (isMine ? 'background:#00c2b2;color:#000;' : 'background:rgba(255,255,255,0.1);color:#fff;');

    if (msg.messageType === 'image' && msg.imageUrl) {
      var img = document.createElement('img');
      img.src = msg.imageUrl;
      img.style.cssText = 'max-width:220px;border-radius:10px;display:block;';
      img.onclick = function() { window.open(msg.imageUrl, '_blank'); };
      bubble.appendChild(img);
      if (msg.text && msg.text !== 'Payment screenshot') {
        var cap = document.createElement('div');
        cap.style.cssText = 'margin-top:4px;font-size:0.78rem;';
        cap.textContent = msg.text;
        bubble.appendChild(cap);
      }
    } else {
      bubble.textContent = msg.text || '';
    }

    wrap.appendChild(bubble);

    var ts = document.createElement('div');
    var d = new Date(msg.createdAt || Date.now());
    ts.style.cssText = 'font-size:0.65rem;color:rgba(255,255,255,0.28);padding:0 4px;';
    ts.textContent = d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
    wrap.appendChild(ts);

    return wrap;
  }

  function appendMsg(msg, scroll) {
    var container = document.getElementById('bfChatMsgs');
    if (!container) return;
    var id = msg.id || (msg.clientId || '');
    if (id && _chatRenderedIds[id]) return; // deduplicate
    if (id) _chatRenderedIds[id] = true;
    container.appendChild(renderMsg(msg));
    if (scroll !== false) container.scrollTop = container.scrollHeight;
  }

  function showEmpty() {
    var container = document.getElementById('bfChatMsgs');
    if (!container) return;
    if (container.children.length === 0) {
      var e = document.createElement('p');
      e.id = 'bfChatEmpty';
      e.style.cssText = 'text-align:center;color:rgba(255,255,255,0.3);font-size:0.82rem;margin-top:2rem;';
      e.textContent = 'No messages yet. Say hello!';
      container.appendChild(e);
    }
  }

  function clearEmpty() {
    var e = document.getElementById('bfChatEmpty');
    if (e && e.parentNode) e.parentNode.removeChild(e);
  }

  // ── fetch & poll ──────────────────────────────────────────────────
  async function fetchMessages() {
    var orderId = getOrderId();
    if (!orderId) return;
    try {
      var resp = await fetch('/api/p2p/orders/' + orderId + '/messages', { credentials: 'include' });
      if (!resp.ok) return;
      var data = await resp.json();
      var msgs = data.messages || [];
      var container = document.getElementById('bfChatMsgs');
      if (!container) return;
      clearEmpty();
      msgs.forEach(function(m) { appendMsg(m, false); });
      container.scrollTop = container.scrollHeight;
      if (msgs.length === 0) showEmpty();
    } catch(e) { /* silent */ }
  }

  function startPolling() {
    stopPolling();
    fetchMessages();
    _chatPollTimer = setInterval(fetchMessages, 1000);
  }

  function stopPolling() {
    if (_chatPollTimer) { clearInterval(_chatPollTimer); _chatPollTimer = null; }
  }

  // ── send message ──────────────────────────────────────────────────
  async function sendMessage() {
    var input = document.getElementById('bfChatInput');
    var btn = document.getElementById('bfChatSendBtn');
    var orderId = getOrderId();
    if (!input || !orderId) return;
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.style.height = '';
    btn.disabled = true;
    // Optimistic render
    clearEmpty();
    appendMsg({ id: 'opt_' + Date.now(), sender: getMyName(), text: text, createdAt: new Date().toISOString() });
    try {
      await fetch('/api/p2p/orders/' + orderId + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: text })
      });
    } catch(e) { console.error('[bfChat] send error:', e); }
    btn.disabled = false;
  }

  // ── send image ─────────────────────────────────────────────────────
  async function sendImage(file) {
    var orderId = getOrderId();
    if (!file || !orderId) return;
    // Convert to base64
    var reader = new FileReader();
    reader.onload = async function(e) {
      var dataUrl = e.target.result;
      clearEmpty();
      // Optimistic preview
      appendMsg({ id: 'opt_img_' + Date.now(), sender: getMyName(), messageType: 'image', imageUrl: dataUrl, createdAt: new Date().toISOString() });
      try {
        // Try the existing image upload endpoint if available
        var formData = new FormData();
        formData.append('image', file);
        var resp = await fetch('/api/p2p/orders/' + orderId + '/messages/image', { method: 'POST', credentials: 'include', body: formData });
        if (!resp.ok) {
          // Fallback: send as text message with note
          await fetch('/api/p2p/orders/' + orderId + '/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ text: '[Image sent]' })
          });
        }
      } catch(e) {
        // fallback silent
      }
    };
    reader.readAsDataURL(file);
  }

  // ── wire events ───────────────────────────────────────────────────
  function wireChatEvents() {
    document.getElementById('bfChatBackBtn').onclick = function() {
      stopPolling();
      document.getElementById('bfChatScreen').style.display = 'none';
      var prev = document.getElementById(_chatPrevScreen);
      if (prev) prev.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };

    document.getElementById('bfChatSendBtn').onclick = function() { sendMessage(); };

    var input = document.getElementById('bfChatInput');
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    input.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });

    document.getElementById('bfChatImgInput').addEventListener('change', function() {
      var f = this.files && this.files[0];
      if (f) { sendImage(f); this.value = ''; }
    });
  }

  // ── public API ────────────────────────────────────────────────────
  window.bfOpenChat = function(prevScreenId) {
    _chatPrevScreen = prevScreenId || 'bfOrderScreen';
    // Hide other screens
    ['bfBuyScreen','bfOrderScreen','bfPayScreen'].forEach(function(id) {
      var el = document.getElementById(id); if (el) el.style.display = 'none';
    });

    // Fill counterparty info
    var snapshot = typeof activeOrderSnapshot !== 'undefined' ? activeOrderSnapshot : null;
    var myName = getMyName().toLowerCase();
    var counterparty = '';
    if (snapshot) {
      var buyer = String(snapshot.buyerUsername || '').trim();
      var seller = String(snapshot.sellerUsername || snapshot.advertiser || '').trim();
      counterparty = buyer.toLowerCase() === myName ? seller : buyer;
    }
    if (!counterparty && typeof _bfOffer !== 'undefined' && _bfOffer) {
      counterparty = _bfOffer.advertiser || '';
    }

    var avatar = document.getElementById('bfChatAvatar');
    var nameEl = document.getElementById('bfChatName');
    if (avatar) avatar.textContent = String(counterparty || 'S').slice(0,1).toUpperCase();
    if (nameEl) nameEl.textContent = (typeof maskEmail === 'function' ? maskEmail(counterparty) : counterparty) || 'Seller';

    // Reset message list (keep cache for dedup)
    var container = document.getElementById('bfChatMsgs');
    if (container) { container.innerHTML = ''; }
    _chatRenderedIds = {};

    var screen = document.getElementById('bfChatScreen');
    if (screen) screen.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    startPolling();

    // Focus input
    setTimeout(function() {
      var inp = document.getElementById('bfChatInput');
      if (inp) inp.focus();
    }, 350);
  };

  // ── init ──────────────────────────────────────────────────────────
  injectChatHTML();
  wireChatEvents();
})();

// ── Navigate to standalone order flow on Buy ──────────────────────
(function() {
  function orderOpenUrl(target) {
    return String(target.getAttribute('data-url') || target.getAttribute('href') || '').trim();
  }

  function handleOrderOpen(target) {
    if (!target) {
      return;
    }
    var orderId = String(target.getAttribute('data-order-id') || '').trim();
    var openChat = target.getAttribute('data-open-chat') === '1';
    var url = orderOpenUrl(target);
    if (!url) {
      return;
    }
    _ordPrimeOrderOpen(orderId);
    if (typeof prefetchOrderFlowAssets === 'function') {
      prefetchOrderFlowAssets();
    }
    if (typeof window._p2pNavSafe === 'function') {
      window._p2pNavSafe(url, openChat ? 'Opening chat...' : 'Opening order...');
      return;
    }
    window.location.href = url;
  }

  document.addEventListener('click', function(event) {
    var target = event.target && event.target.closest ? event.target.closest('.ord-open-link') : null;
    if (!target) {
      return;
    }
    event.preventDefault();
    handleOrderOpen(target);
  });

  document.addEventListener('touchstart', function(event) {
    var target = event.target && event.target.closest ? event.target.closest('.ord-open-link') : null;
    if (!target) {
      return;
    }
    _ordPrimeOrderOpen(target.getAttribute('data-order-id'));
    if (typeof prefetchOrderFlowAssets === 'function') {
      prefetchOrderFlowAssets();
    }
  }, { passive: true });

  document.addEventListener('keydown', function(event) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    var target = event.target && event.target.closest ? event.target.closest('article.ord-open-link') : null;
    if (!target) {
      return;
    }
    event.preventDefault();
    handleOrderOpen(target);
  });
})();

(function() {
  var _navLockTs = 0;
  var _navOverlay = null;
  var _navFailSafeTimer = null;

  function hideNavOverlay(resetLock) {
    if (_navFailSafeTimer) {
      clearTimeout(_navFailSafeTimer);
      _navFailSafeTimer = null;
    }
    if (_navOverlay) {
      _navOverlay.style.opacity = '0';
      _navOverlay.style.pointerEvents = 'none';
    }
    if (resetLock !== false) {
      _navLockTs = 0;
    }
  }

  function ensureNavOverlay() {
    if (_navOverlay && document.body.contains(_navOverlay)) {
      return _navOverlay;
    }
    var overlay = document.createElement('div');
    overlay.id = 'p2pNavOverlayFast';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.82);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.16s ease;';
    overlay.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:12px;color:#fff;font-family:Manrope,sans-serif;">' +
      '<div style="width:28px;height:28px;border:2px solid rgba(255,255,255,0.18);border-top-color:#8bf300;border-radius:50%;animation:ord-spin 0.7s linear infinite;"></div>' +
      '<div data-nav-label style="font-size:14px;font-weight:700;color:rgba(255,255,255,0.88);">Opening order...</div>' +
      '</div>';
    document.body.appendChild(overlay);
    _navOverlay = overlay;
    return overlay;
  }

  function _navSafe(url, label) {
    var now = Date.now();
    if (now - _navLockTs < 800) { console.log('[navSafe] blocked duplicate nav'); return; }
    _navLockTs = now;
    var overlay = ensureNavOverlay();
    if (overlay) {
      var labelEl = overlay.querySelector('[data-nav-label]');
      if (labelEl) {
        labelEl.textContent = label || 'Opening order...';
      }
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
    }
    _navFailSafeTimer = setTimeout(function() {
      hideNavOverlay(true);
    }, 1600);
    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(function() {
        window.location.assign(url);
      });
      return;
    }
    window.location.assign(url);
  }

  window.addEventListener('pageshow', function() {
    hideNavOverlay(true);
  });
  window.addEventListener('pagehide', function() {
    hideNavOverlay(true);
  });
  window.addEventListener('popstate', function() {
    hideNavOverlay(true);
  });
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      hideNavOverlay(true);
    }
  });
  window.fillDealModal = function(offer) {
    if (offer && offer.id) {
      cacheSelectedOffer(offer);
      _navSafe(_buildOrderFlowUrl({ adId: offer.id, source: 'ad' }), 'Opening buy flow...');
    }
  };
  window._p2pNavSafe = _navSafe; // expose for openOrder override below
})();

// ── Redirect all order opens to new order flow page ──────────────
(function() {
  var _navSafe = window._p2pNavSafe || function(url) { window.location.href = url; };

  var _origOpenOrder = openOrder;
  openOrder = function(order) {
    if (order && order.id) {
      _navSafe(_buildOrderFlowUrl({ orderId: order.id, source: 'orders' }), 'Opening order...');
      return;
    }
    _origOpenOrder.call(this, order);
  };

  var _origOpenOrderById = openOrderById;
  openOrderById = async function(orderId) {
    if (orderId) {
      _navSafe(_buildOrderFlowUrl({ orderId: orderId, source: 'orders' }), 'Opening order...');
      return;
    }
    return _origOpenOrderById.call(this, orderId);
  };
})();

// ── Real-time user SSE stream — instant new order notification ───
(function() {
  var _userStream = null;
  function connectUserStream() {
    if (_userStream) { _userStream.close(); _userStream = null; }
    _userStream = new EventSource('/api/p2p/me/stream', { withCredentials: true });
    _userStream.addEventListener('connected', function() {
      // SSE connected — stop fallback poll; only fetch if orders haven't loaded yet
      // (avoids aborting the in-flight fetch from loadCurrentUser confirmation)
      _stopFallbackPoll();
      if (!_ordLoaded) fetchOrdersSafe();
    });
    _userStream.addEventListener('new_order', function(e) {
      loadLiveOrders(); // refresh the marketplace listings too
      fetchOrdersSafe();
      // Auto-switch orders screen to pending tab if it's open
      var ordScreen = document.getElementById('mobOrdersScreen');
      if (ordScreen && ordScreen.style.display !== 'none') switchOrdMain('pending');
    });
    _userStream.addEventListener('order_updated', function(e) {
      // Instantly update the per-order localStorage entry with new status
      try {
        var payload = JSON.parse(e.data || '{}');
        if (payload.orderId && payload.status) {
          try {
            var lsKey = 'p2p_order_' + payload.orderId;
            var raw = localStorage.getItem(lsKey);
            if (raw) {
              var obj = JSON.parse(raw);
              obj.status = payload.status;
              localStorage.setItem(lsKey, JSON.stringify(obj));
            }
          } catch(_) {}
        }
      } catch(_) {}
      fetchOrdersSafe(); // re-render orders list with fresh server data
    });
    _userStream.onerror = function() {
      // SSE dropped — start fallback poll so orders still refresh
      if (_userStream) { _userStream.close(); _userStream = null; }
      _startFallbackPoll();
      setTimeout(function() { if (currentUser) connectUserStream(); }, 3000);
    };
  }

  // Hook into loadCurrentUser — start SSE after session confirmed, stop on logout
  var _origLoadCurrentUser = loadCurrentUser;
  loadCurrentUser = async function() {
    await _origLoadCurrentUser.apply(this, arguments);
    if (currentUser) {
      connectUserStream();
    } else {
      if (_userStream) { _userStream.close(); _userStream = null; }
      _stopFallbackPoll();
    }
  };

  document.addEventListener('p2p:login', function() { if (currentUser) connectUserStream(); });
})();

// ── WebSocket real-time order push ────────────────────────────────────────────
// Connects to /ws/p2p after login. Receives new_order and order_updated events
// pushed directly from the server — zero-latency, no polling needed.
(function() {
  var _ws = null;
  var _wsRetryTimer = null;
  var _wsActive = false;

  function connectWs() {
    if (_ws && (_ws.readyState === WebSocket.OPEN || _ws.readyState === WebSocket.CONNECTING)) return;
    if (!currentUser) return;
    var proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    try {
      _ws = new WebSocket(proto + '//' + location.host + '/ws/p2p');
    } catch(e) { return; }

    _ws.onopen = function() {
      _wsActive = true;
      // WS connected — stop fallback poll; SSE+WS handle real-time
      _stopFallbackPoll();
    };

    _ws.onmessage = function(evt) {
      try {
        var msg = JSON.parse(evt.data || '{}');
        var event = msg.event;
        var data  = msg.data || {};
        if (event === 'new_order') {
          loadLiveOrders();
          fetchOrdersSafe();
          var ordScreen = document.getElementById('mobOrdersScreen');
          if (ordScreen && ordScreen.style.display !== 'none') switchOrdMain('pending');
        } else if (event === 'order_updated') {
          if (data.orderId && data.status) {
            try {
              var lsKey = 'p2p_order_' + data.orderId;
              var raw = localStorage.getItem(lsKey);
              if (raw) {
                var obj = JSON.parse(raw);
                obj.status = data.status;
                localStorage.setItem(lsKey, JSON.stringify(obj));
              }
            } catch(_) {}
          }
          fetchOrdersSafe();
        }
      } catch(_) {}
    };

    _ws.onerror = function() { /* handled by onclose */ };

    _ws.onclose = function() {
      _ws = null;
      _wsActive = false;
      // WS dropped — start fallback poll and retry WS after 4s
      _startFallbackPoll();
      if (currentUser) {
        clearTimeout(_wsRetryTimer);
        _wsRetryTimer = setTimeout(connectWs, 4000);
      }
    };
  }

  function disconnectWs() {
    clearTimeout(_wsRetryTimer);
    if (_ws) { try { _ws.close(); } catch(_) {} _ws = null; }
    _wsActive = false;
  }

  // Hook into loadCurrentUser — connect WS after session confirmed
  var _origLcu = loadCurrentUser;
  loadCurrentUser = async function() {
    await _origLcu.apply(this, arguments);
    if (currentUser) { connectWs(); } else { disconnectWs(); }
  };

  document.addEventListener('p2p:login',  function() { if (currentUser) connectWs(); });
  document.addEventListener('p2p:logout', function() { disconnectWs(); });
})();

// ── Withdrawal modal ─────────────────────────────────────────────────────────
(function() {
  var _withdrawPending = {};

  function showStep(step) {
    ['withdrawFormStep','withdrawOtpStep','withdrawSuccessStep'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    var target = document.getElementById(step);
    if (target) target.style.display = '';
  }

  window.openWithdrawModal = function() {
    var modal = document.getElementById('withdrawModal');
    if (!modal) return;
    modal.style.display = 'flex';
    showStep('withdrawFormStep');
    var balEl = document.getElementById('withdrawAvailBal');
    if (balEl) balEl.textContent = profileWalletBalance.toFixed(2);
    var err = document.getElementById('withdrawFormErr');
    if (err) { err.style.display = 'none'; }
    loadWithdrawHistory();
  };

  window.closeWithdrawModal = function() {
    var modal = document.getElementById('withdrawModal');
    if (modal) modal.style.display = 'none';
  };

  window.withdrawSetMax = function() {
    var input = document.getElementById('withdrawAmount');
    if (input) input.value = profileWalletBalance.toFixed(2);
  };

  window.withdrawBackToForm = function() {
    showStep('withdrawFormStep');
  };

  window.withdrawSendOtp = function(resend) {
    var address = (document.getElementById('withdrawAddress') || {}).value || '';
    var amount  = (document.getElementById('withdrawAmount') || {}).value || '';
    var asset   = (document.getElementById('withdrawAsset') || {}).value || 'USDT';
    var network = (document.getElementById('withdrawNetwork') || {}).value || 'TRC20';
    var errEl = document.getElementById('withdrawFormErr');
    if (!address.trim()) { if (errEl) { errEl.textContent = 'Enter wallet address.'; errEl.style.display = ''; } return; }
    if (!amount || Number(amount) <= 0) { if (errEl) { errEl.textContent = 'Enter a valid amount.'; errEl.style.display = ''; } return; }
    if (Number(amount) > profileWalletBalance) { if (errEl) { errEl.textContent = 'Insufficient balance.'; errEl.style.display = ''; } return; }
    if (errEl) errEl.style.display = 'none';
    _withdrawPending = { address: address.trim(), amount: amount, asset: asset, network: network };
    fetch('/api/withdrawals/send-otp', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: address.trim(), amount: amount, currency: asset })
    }).then(function(r) { return r.json(); }).then(function(d) {
      if (d.sent) {
        var desc = document.getElementById('withdrawOtpDesc');
        if (desc) desc.textContent = 'A 6-digit OTP was sent to your registered email. Enter it to confirm the withdrawal of ' + amount + ' ' + asset + '.';
        var otpInput = document.getElementById('withdrawOtpInput');
        if (otpInput) otpInput.value = '';
        var otpErr = document.getElementById('withdrawOtpErr');
        if (otpErr) otpErr.style.display = 'none';
        showStep('withdrawOtpStep');
        if (resend) alert('New OTP sent to your email.');
      } else {
        if (errEl) { errEl.textContent = d.message || 'Failed to send OTP.'; errEl.style.display = ''; }
      }
    }).catch(function() {
      if (errEl) { errEl.textContent = 'Network error. Please try again.'; errEl.style.display = ''; }
    });
  };

  window.withdrawConfirmOtp = function() {
    var otp = ((document.getElementById('withdrawOtpInput') || {}).value || '').trim();
    var errEl = document.getElementById('withdrawOtpErr');
    if (otp.length !== 6) { if (errEl) { errEl.textContent = 'Enter 6-digit OTP.'; errEl.style.display = ''; } return; }
    // verify OTP then submit withdrawal
    fetch('/api/withdrawals/verify-otp', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp: otp })
    }).then(function(r) { return r.json(); }).then(function(vd) {
      if (!vd.verified) {
        if (errEl) { errEl.textContent = vd.message || 'Invalid OTP.'; errEl.style.display = ''; }
        return;
      }
      // OTP verified — submit withdrawal request
      fetch('/api/withdrawals', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: _withdrawPending.amount,
          currency: _withdrawPending.asset,
          network: _withdrawPending.network,
          address: _withdrawPending.address
        })
      }).then(function(r) { return r.json(); }).then(function(wd) {
        if (wd.withdrawal || wd.message === 'Withdrawal request created.') {
          showStep('withdrawSuccessStep');
          // refresh history + balance
          loadWithdrawHistory();
        } else {
          if (errEl) { errEl.textContent = wd.message || 'Withdrawal failed.'; errEl.style.display = ''; }
        }
      }).catch(function() {
        if (errEl) { errEl.textContent = 'Network error. Please try again.'; errEl.style.display = ''; }
      });
    }).catch(function() {
      if (errEl) { errEl.textContent = 'Network error. Please try again.'; errEl.style.display = ''; }
    });
  };

  window.loadWithdrawHistory = function() {
    var listEl = document.getElementById('withdrawHistoryList');
    if (!listEl) return;
    listEl.textContent = 'Loading...';
    fetch('/api/withdrawals?limit=5', { credentials: 'include' })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        var items = d.withdrawals || [];
        if (!items.length) { listEl.innerHTML = '<span style="color:rgba(255,255,255,0.3);font-size:12px;">No withdrawals yet.</span>'; return; }
        var html = '';
        items.forEach(function(w) {
          var statusColor = w.status === 'approved' ? '#00d4d4' : w.status === 'rejected' ? '#ef4444' : '#f59e0b';
          var dt = w.createdAt ? new Date(w.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '';
          html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1a1a1a;">'
            + '<div><div style="font-size:13px;font-weight:600;">' + (w.amount || 0) + ' ' + (w.currency || 'USDT') + '</div>'
            + '<div style="font-size:11px;color:rgba(255,255,255,0.3);margin-top:2px;">' + dt + ' · ' + (w.network || '') + '</div></div>'
            + '<span style="font-size:11px;font-weight:700;color:' + statusColor + ';text-transform:uppercase;">' + (w.status || 'pending') + '</span></div>';
        });
        listEl.innerHTML = html;
      })
      .catch(function() { listEl.innerHTML = '<span style="color:rgba(255,255,255,0.3);font-size:12px;">Could not load history.</span>'; });
  };

  // Close on backdrop tap
  var modal = document.getElementById('withdrawModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) window.closeWithdrawModal();
    });
  }
})();

// ── Render free-tier keepalive ────────────────────────────────────────────────
// Render sleeps free-tier servers after 15 min idle. One ping every 14 min
// keeps it awake — eliminating the 30-90s cold start that causes 2-min delays.
(function() {
  function _pingServer() {
    fetch('/api/p2p/ping', { method: 'GET', credentials: 'include', cache: 'no-store' })
      .catch(function() {}); // fire-and-forget
  }
  // Ping on page load to wake any sleeping server immediately
  _pingServer();
  // Ping every 14 min to prevent Render from sleeping
  setInterval(_pingServer, 14 * 60 * 1000);
  // Ping on tab focus — user returning after idle tab means server may have slept
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) _pingServer();
  });
  // Also ping when network comes back online
  window.addEventListener('online', _pingServer);
})();
