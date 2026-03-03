-- Phase A-J Admin Control System Schema
-- Run on MySQL 8+

CREATE TABLE IF NOT EXISTS admin_roles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS admins (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id BIGINT UNSIGNED NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin_role_id (role_id),
  INDEX idx_admin_is_active (is_active),
  CONSTRAINT fk_admins_role FOREIGN KEY (role_id) REFERENCES admin_roles(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id BIGINT UNSIGNED NOT NULL,
  action VARCHAR(120) NOT NULL,
  target_id VARCHAR(120) NULL,
  metadata JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin_activity_admin (admin_id),
  INDEX idx_admin_activity_action (action),
  INDEX idx_admin_activity_created (created_at),
  CONSTRAINT fk_admin_activity_admin FOREIGN KEY (admin_id) REFERENCES admins(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(120) NOT NULL UNIQUE,
  `value` TEXT NOT NULL,
  updated_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_settings_key (`key`)
);

CREATE TABLE IF NOT EXISTS wallet_configs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  wallet_type ENUM('hot','cold') NOT NULL,
  address VARCHAR(255) NOT NULL,
  label VARCHAR(120) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_wallet_configs_type (wallet_type),
  INDEX idx_wallet_configs_active (is_active)
);

CREATE TABLE IF NOT EXISTS admin_withdraw_controls (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  is_paused TINYINT(1) NOT NULL DEFAULT 0,
  global_limit DECIMAL(18,8) NULL,
  updated_by BIGINT UNSIGNED NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_security_flags (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  is_frozen TINYINT(1) NOT NULL DEFAULT 0,
  login_disabled TINYINT(1) NOT NULL DEFAULT 0,
  two_fa_reset_required TINYINT(1) NOT NULL DEFAULT 0,
  kyc_verified TINYINT(1) NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_security_frozen (is_frozen),
  INDEX idx_user_security_login_disabled (login_disabled),
  CONSTRAINT fk_user_security_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS kyc_requests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  rejection_reason VARCHAR(255) NULL,
  reviewed_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_kyc_user (user_id),
  INDEX idx_kyc_status (status),
  CONSTRAINT fk_kyc_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin_trading_pairs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pair_symbol VARCHAR(32) NOT NULL UNIQUE,
  maker_fee DECIMAL(10,6) NOT NULL DEFAULT 0.001000,
  taker_fee DECIMAL(10,6) NOT NULL DEFAULT 0.001000,
  is_enabled TINYINT(1) NOT NULL DEFAULT 1,
  is_paused TINYINT(1) NOT NULL DEFAULT 0,
  updated_by BIGINT UNSIGNED NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_admin_trading_symbol (pair_symbol),
  INDEX idx_admin_trading_enabled (is_enabled),
  INDEX idx_admin_trading_paused (is_paused)
);

-- Optional compatibility columns on users table (for direct user-level flags).
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_frozen TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active TINYINT(1) NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS kyc_verified TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS two_fa_secret VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS two_fa_enabled TINYINT(1) NOT NULL DEFAULT 0;

INSERT INTO admin_roles (role_name)
VALUES ('super_admin'), ('finance_admin'), ('support_admin')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

INSERT INTO admin_withdraw_controls (id, is_paused, global_limit, updated_at)
VALUES (1, 0, NULL, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO settings (`key`, `value`, created_at, updated_at)
VALUES
  ('site_name', 'Bitegit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('support_email', 'support@bitegit.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('maintenance_mode', 'false', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('banner_message', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), updated_at = CURRENT_TIMESTAMP;
