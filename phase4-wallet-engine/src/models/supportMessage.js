import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const SupportMessage = sequelize.define(
  'SupportMessage',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    ticket_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    sender_type: {
      type: DataTypes.ENUM('user', 'admin', 'bot', 'system'),
      allowNull: false
    },
    sender_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_ai_generated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'support_messages',
    timestamps: false,
    indexes: [{ fields: ['ticket_id'] }, { fields: ['sender_type'] }, { fields: ['created_at'] }]
  }
);
