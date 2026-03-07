-- Binance/Bitget-style live support chat schema.

CREATE TABLE IF NOT EXISTS support_sessions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  status ENUM('open', 'assigned', 'closed') NOT NULL DEFAULT 'open',
  assigned_admin_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_support_sessions_user (user_id),
  INDEX idx_support_sessions_status (status),
  INDEX idx_support_sessions_admin (assigned_admin_id),
  CONSTRAINT fk_support_sessions_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_support_sessions_admin FOREIGN KEY (assigned_admin_id) REFERENCES admins(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS support_chat_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id BIGINT UNSIGNED NOT NULL,
  sender_type ENUM('user', 'admin', 'ai') NOT NULL,
  message TEXT NULL,
  voice_url VARCHAR(512) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_support_chat_messages_session (session_id),
  INDEX idx_support_chat_messages_sender_type (sender_type),
  INDEX idx_support_chat_messages_created_at (created_at),
  CONSTRAINT fk_support_chat_messages_session FOREIGN KEY (session_id) REFERENCES support_sessions(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
