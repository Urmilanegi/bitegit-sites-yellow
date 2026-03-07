-- Support Center + Help System schema (Binance/Bybit style workflow)

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  subject VARCHAR(255) NOT NULL,
  status ENUM('open', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'open',
  assigned_admin_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_support_tickets_user_id (user_id),
  INDEX idx_support_tickets_status (status)
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ticket_id BIGINT UNSIGNED NOT NULL,
  sender_type ENUM('user', 'admin', 'ai', 'system') NOT NULL DEFAULT 'user',
  message TEXT NOT NULL,
  attachment_urls JSON NULL,
  metadata_json JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ticket_messages_ticket_id (ticket_id),
  CONSTRAINT fk_ticket_messages_ticket_id FOREIGN KEY (ticket_id) REFERENCES support_tickets(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS p2p_orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(64) NOT NULL UNIQUE,
  buyer_user_id BIGINT UNSIGNED NOT NULL,
  seller_user_id BIGINT UNSIGNED NOT NULL,
  asset_symbol VARCHAR(32) NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  fiat_currency VARCHAR(16) NOT NULL DEFAULT 'INR',
  fiat_amount DECIMAL(20, 8) NOT NULL,
  status ENUM('open', 'coin_release_in_progress', 'appeal_in_progress', 'canceled', 'completed') NOT NULL DEFAULT 'open',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_p2p_orders_status (status)
);

CREATE TABLE IF NOT EXISTS p2p_disputes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  raised_by_user_id BIGINT UNSIGNED NOT NULL,
  dispute_reason VARCHAR(255) NOT NULL,
  dispute_status ENUM('coin_release_in_progress', 'appeal_in_progress', 'canceled', 'completed', 'max_appeal_limit') NOT NULL DEFAULT 'appeal_in_progress',
  resolution_note TEXT NULL,
  resolved_by_admin_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_p2p_disputes_status (dispute_status),
  CONSTRAINT fk_p2p_disputes_order_id FOREIGN KEY (order_id) REFERENCES p2p_orders(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  method_type VARCHAR(64) NOT NULL,
  account_label VARCHAR(255) NOT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crypto_assets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  icon_url VARCHAR(512) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deposit_status (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  asset_symbol VARCHAR(32) NOT NULL,
  network VARCHAR(32) NOT NULL,
  status ENUM('available', 'suspended', 'maintenance') NOT NULL DEFAULT 'available',
  maintenance_alert VARCHAR(255) NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_deposit_status_asset_symbol (asset_symbol),
  UNIQUE KEY uq_deposit_status_asset_network (asset_symbol, network)
);

CREATE TABLE IF NOT EXISTS withdraw_status (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  asset_symbol VARCHAR(32) NOT NULL,
  network VARCHAR(32) NOT NULL,
  status ENUM('available', 'suspended', 'maintenance') NOT NULL DEFAULT 'available',
  maintenance_alert VARCHAR(255) NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_withdraw_status_asset_symbol (asset_symbol),
  UNIQUE KEY uq_withdraw_status_asset_network (asset_symbol, network)
);

CREATE TABLE IF NOT EXISTS announcements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  starts_at DATETIME NULL,
  ends_at DATETIME NULL,
  created_by_admin_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_announcements_active (is_active)
);

CREATE TABLE IF NOT EXISTS help_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(120) NOT NULL,
  description VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS help_articles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NULL,
  body LONGTEXT NOT NULL,
  helpful_count INT NOT NULL DEFAULT 0,
  unhelpful_count INT NOT NULL DEFAULT 0,
  related_article_ids JSON NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_help_articles_category_id (category_id),
  FULLTEXT KEY ft_help_articles_title_body (title, body),
  CONSTRAINT fk_help_articles_category_id FOREIGN KEY (category_id) REFERENCES help_categories(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS knowledge_articles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  article_key VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  summary TEXT NULL,
  content LONGTEXT NOT NULL,
  tags JSON NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS help_feedback (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  article_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  is_helpful TINYINT(1) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_help_feedback_article_id (article_id),
  CONSTRAINT fk_help_feedback_article_id FOREIGN KEY (article_id) REFERENCES help_articles(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

INSERT IGNORE INTO help_categories (id, slug, title, description, sort_order) VALUES
  (1, 'account-management', 'Account Management', 'Account setup, profile changes, and account ownership checks.', 10),
  (2, 'security', 'Security', '2FA, anti-phishing, suspicious login, and recovery steps.', 20),
  (3, 'p2p-trading', 'P2P Trading', 'Orders, disputes, payment methods, and advertiser tools.', 30),
  (4, 'deposits', 'Deposits', 'Crypto and fiat deposit troubleshooting and processing.', 40),
  (5, 'withdrawals', 'Withdrawals', 'Withdrawal limits, failures, compliance checks, and ETA.', 50),
  (6, 'trading', 'Trading', 'Spot/futures order flow, fees, and risk controls.', 60),
  (7, 'api', 'API', 'API key management, auth signatures, and rate limits.', 70),
  (8, 'finance', 'Finance', 'Funding account, earn products, and statement exports.', 80),
  (9, 'nft', 'NFT', 'NFT deposits, withdrawals, listing, and transfer troubleshooting.', 90);

INSERT IGNORE INTO crypto_assets (symbol, name) VALUES
  ('BTC', 'Bitcoin'),
  ('ETH', 'Ethereum'),
  ('USDT', 'Tether'),
  ('USDC', 'USD Coin'),
  ('XRP', 'Ripple'),
  ('TRX', 'Tron'),
  ('SOL', 'Solana'),
  ('MNT', 'Mantle'),
  ('HMSTR', 'Hamster Kombat');

