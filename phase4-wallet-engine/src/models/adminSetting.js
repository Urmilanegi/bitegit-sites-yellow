import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const AdminSetting = sequelize.define(
  'AdminSetting',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    key: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    updated_by: {
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
    tableName: 'settings',
    timestamps: false
  }
);
