import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const UserSecurityFlag = sequelize.define(
  'UserSecurityFlag',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true
    },
    is_frozen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    login_disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    two_fa_reset_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    kyc_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'user_security_flags',
    timestamps: false,
    indexes: [{ fields: ['user_id'] }, { fields: ['is_frozen'] }, { fields: ['login_disabled'] }]
  }
);
