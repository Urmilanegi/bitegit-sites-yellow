import { User } from './user.js';
import { Wallet } from './wallet.js';
import { Deposit } from './deposit.js';
import { Withdrawal } from './withdrawal.js';
import { AdminRole } from './adminRole.js';
import { Admin } from './admin.js';
import { AdminActivityLog } from './adminActivityLog.js';
import { AdminSetting } from './adminSetting.js';
import { AdminWalletConfig } from './adminWalletConfig.js';
import { AdminWithdrawControl } from './adminWithdrawControl.js';
import { UserSecurityFlag } from './userSecurityFlag.js';
import { KycRequest } from './kycRequest.js';
import { AdminTradingPair } from './adminTradingPair.js';
import { SupportTicket } from './supportTicket.js';
import { SupportMessage } from './supportMessage.js';

User.hasMany(Wallet, { foreignKey: 'user_id' });
Wallet.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Deposit, { foreignKey: 'user_id' });
Deposit.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Withdrawal, { foreignKey: 'user_id' });
Withdrawal.belongsTo(User, { foreignKey: 'user_id' });

AdminRole.hasMany(Admin, { foreignKey: 'role_id' });
Admin.belongsTo(AdminRole, { foreignKey: 'role_id' });

Admin.hasMany(AdminActivityLog, { foreignKey: 'admin_id' });
AdminActivityLog.belongsTo(Admin, { foreignKey: 'admin_id' });

User.hasOne(UserSecurityFlag, { foreignKey: 'user_id' });
UserSecurityFlag.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(KycRequest, { foreignKey: 'user_id' });
KycRequest.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(SupportTicket, { foreignKey: 'user_id' });
SupportTicket.belongsTo(User, { foreignKey: 'user_id' });

Admin.hasMany(SupportTicket, { foreignKey: 'assigned_admin_id', as: 'AssignedTickets' });
SupportTicket.belongsTo(Admin, { foreignKey: 'assigned_admin_id', as: 'AssignedAdmin' });

SupportTicket.hasMany(SupportMessage, { foreignKey: 'ticket_id' });
SupportMessage.belongsTo(SupportTicket, { foreignKey: 'ticket_id' });

export {
  User,
  Wallet,
  Deposit,
  Withdrawal,
  AdminRole,
  Admin,
  AdminActivityLog,
  AdminSetting,
  AdminWalletConfig,
  AdminWithdrawControl,
  UserSecurityFlag,
  KycRequest,
  AdminTradingPair,
  SupportTicket,
  SupportMessage
};
