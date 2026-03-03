import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const AdminRole = sequelize.define(
  'AdminRole',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    role_name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: 'admin_roles',
    timestamps: false
  }
);
