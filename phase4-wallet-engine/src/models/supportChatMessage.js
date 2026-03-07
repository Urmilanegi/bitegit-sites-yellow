import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const SupportChatMessage = sequelize.define(
  'SupportChatMessage',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    session_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    sender_type: {
      type: DataTypes.ENUM('user', 'admin', 'ai'),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    voice_url: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'support_chat_messages',
    timestamps: false,
    indexes: [{ fields: ['session_id'] }, { fields: ['sender_type'] }, { fields: ['created_at'] }]
  }
);
