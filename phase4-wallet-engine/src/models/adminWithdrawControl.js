import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const AdminWithdrawControl = sequelize.define(
  'AdminWithdrawControl',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    is_paused: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    global_limit: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: true,
      defaultValue: null
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
    tableName: 'admin_withdraw_controls',
    timestamps: false
  }
);
