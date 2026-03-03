import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const AdminTradingPair = sequelize.define(
  'AdminTradingPair',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    pair_symbol: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true
    },
    maker_fee: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      defaultValue: 0.001
    },
    taker_fee: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      defaultValue: 0.001
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_paused: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    updated_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'admin_trading_pairs',
    timestamps: false,
    indexes: [{ fields: ['pair_symbol'] }, { fields: ['is_enabled'] }, { fields: ['is_paused'] }]
  }
);
