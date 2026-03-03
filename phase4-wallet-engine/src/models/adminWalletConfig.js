import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const AdminWalletConfig = sequelize.define(
  'AdminWalletConfig',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    wallet_type: {
      type: DataTypes.ENUM('hot', 'cold'),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    label: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    tableName: 'wallet_configs',
    timestamps: false,
    indexes: [{ fields: ['wallet_type'] }, { fields: ['is_active'] }]
  }
);
