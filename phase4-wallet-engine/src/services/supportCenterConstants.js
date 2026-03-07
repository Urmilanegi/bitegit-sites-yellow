export const SUPPORT_CATEGORY_OPTIONS = Object.freeze([
  'Deposit & Withdrawals',
  'P2P Trading',
  'Account Verification (KYC)',
  'Security Issues',
  'Trading Issues',
  'Other Issues'
]);

export const SUPPORT_SUBCATEGORY_MAP = Object.freeze({
  'Deposit & Withdrawals': [
    'Deposit delayed',
    'Withdrawal pending',
    'Wrong network selected',
    'Deposit not credited',
    'Withdrawal rejected',
    'My issue is not listed above'
  ],
  'P2P Trading': [
    'Asset not available on P2P',
    'Asset frozen after P2P order closed',
    'Export P2P order data',
    'Issues adding P2P payment method',
    'P2P Advertiser inquiry',
    'How to post P2P advertisement',
    'Report other P2P users',
    'Completion rate appeal',
    'Change P2P nickname',
    'Remove negative reviews',
    'My issue is not listed above'
  ],
  'Account Verification (KYC)': [
    'KYC pending review',
    'KYC rejected',
    'Face verification failed',
    'Document mismatch',
    'My issue is not listed above'
  ],
  'Security Issues': [
    '2FA unavailable',
    'Suspicious login',
    'Account locked',
    'Withdrawal restriction after settings update',
    'My issue is not listed above'
  ],
  'Trading Issues': [
    'Spot order not filled',
    'Futures liquidation query',
    'PnL mismatch',
    'Trading fee dispute',
    'My issue is not listed above'
  ],
  'Other Issues': ['General inquiry', 'Feature request', 'My issue is not listed above']
});

export const DISPUTE_STATUS_OPTIONS = Object.freeze([
  'Coin release in progress',
  'Appeal in progress',
  'Canceled',
  'Completed',
  'Reached maximum appeal limit'
]);

export const SUPPORT_TIP_TEXT =
  'Useful Tips: Please transfer your assets to your Funding Account before using P2P trading. If you recently changed your security settings selling coins may be restricted for 24 hours.';

export const ALLOWED_ATTACHMENT_EXTENSIONS = Object.freeze(['pdf', 'png', 'jpg', 'jpeg', 'mp4']);

export const DEFAULT_HELP_TOPICS = Object.freeze({
  start_now: [
    {
      title: 'Complete KYC and secure your account',
      description: 'Set up 2FA, anti-phishing code, and complete identity verification in one flow.'
    },
    {
      title: 'Start your first deposit',
      description: 'Choose a coin, network, and copy your deposit address safely.'
    },
    {
      title: 'Start P2P buy/sell',
      description: 'Learn funding account rules, payment methods, and order protection steps.'
    }
  ],
  top_articles: [
    {
      title: 'Why withdrawals can be delayed after security updates',
      description: 'Explains 24-hour risk hold policy and how to remove delays.'
    },
    {
      title: 'P2P appeal process and expected response timeline',
      description: 'Appeal stages, evidence requirements, and final decision flow.'
    },
    {
      title: 'Deposit sent but balance not credited',
      description: 'How to validate TX hash, network, and confirmation count.'
    }
  ]
});

export const DEFAULT_COIN_STATUS_LIST = Object.freeze([
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'USDT', name: 'Tether' },
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'XRP', name: 'Ripple' },
  { symbol: 'TRX', name: 'Tron' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'MNT', name: 'Mantle' },
  { symbol: 'HMSTR', name: 'Hamster Kombat' }
]);

