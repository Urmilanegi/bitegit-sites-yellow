import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const SupportSession = sequelize.define(
  'SupportSession',
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
    status: {
      type: DataTypes.ENUM('open', 'assigned', 'closed'),
      allowNull: false,
      defaultValue: 'open'
    },
    assigned_admin_id: {
      type: DataTypes.BIGINT.UNSIGNED,
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
    tableName: 'support_sessions',
    timestamps: false,
    indexes: [{ fields: ['user_id'] }, { fields: ['status'] }, { fields: ['assigned_admin_id'] }, { fields: ['created_at'] }]
  }
);
