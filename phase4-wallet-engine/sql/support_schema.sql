-- Support system schema for Phase 4 wallet engine.

CREATE TABLE IF NOT EXISTS support_tickets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  subject VARCHAR(255) NOT NULL DEFAULT 'General Support',
  status ENUM('open', 'in_progress', 'closed') NOT NULL DEFAULT 'open',
  is_escalated TINYINT(1) NOT NULL DEFAULT 0,
  assigned_admin_id BIGINT UNSIGNED NULL,
  first_admin_response_at DATETIME NULL,
  last_user_message_at DATETIME NULL,
  last_admin_message_at DATETIME NULL,
  waiting_alert_sent_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_support_tickets_user (user_id),
  INDEX idx_support_tickets_status (status),
  INDEX idx_support_tickets_escalated (is_escalated),
  INDEX idx_support_tickets_assigned_admin (assigned_admin_id),
  INDEX idx_support_tickets_last_user_msg (last_user_message_at),
  CONSTRAINT fk_support_ticket_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_support_ticket_admin FOREIGN KEY (assigned_admin_id) REFERENCES admins(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS support_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ticket_id BIGINT UNSIGNED NOT NULL,
  sender_type ENUM('user', 'admin', 'bot', 'system') NOT NULL,
  sender_id BIGINT UNSIGNED NULL,
  message TEXT NOT NULL,
  is_ai_generated TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_support_messages_ticket (ticket_id),
  INDEX idx_support_messages_sender_type (sender_type),
  INDEX idx_support_messages_created (created_at),
  CONSTRAINT fk_support_messages_ticket FOREIGN KEY (ticket_id) REFERENCES support_tickets(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
