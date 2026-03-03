import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const KycRequest = sequelize.define(
  'KycRequest',
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
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    rejection_reason: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reviewed_by: {
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
    tableName: 'kyc_requests',
    timestamps: false,
    indexes: [{ fields: ['user_id'] }, { fields: ['status'] }]
  }
);
