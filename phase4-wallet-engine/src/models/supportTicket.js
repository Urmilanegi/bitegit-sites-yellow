import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const SupportTicket = sequelize.define(
  'SupportTicket',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'General Support'
    },
    status: {
      type: DataTypes.ENUM('open', 'in_progress', 'closed'),
      allowNull: false,
      defaultValue: 'open'
    },
    is_escalated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    assigned_admin_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    first_admin_response_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_user_message_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_admin_message_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    waiting_alert_sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'support_tickets',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['status'] },
      { fields: ['is_escalated'] },
      { fields: ['assigned_admin_id'] },
      { fields: ['last_user_message_at'] }
    ]
  }
);
