import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const AdminActivityLog = sequelize.define(
  'AdminActivityLog',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    admin_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    target_id: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'admin_activity_logs',
    timestamps: false,
    indexes: [{ fields: ['admin_id'] }, { fields: ['action'] }, { fields: ['created_at'] }]
  }
);
