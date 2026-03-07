import { Router } from 'express';
import {
  approveDeposit,
  approveWithdraw,
  getDeposits,
  getWithdrawals
} from '../controllers/adminController.js';
import { loginAdminController, listAdminsController } from '../controllers/adminAuthController.js';
import { getAdminDashboardController } from '../controllers/adminDashboardController.js';
import { getSupportAnalyticsController } from '../controllers/adminSupportController.js';
import {
  creditAdminUserController,
  debitAdminUserController,
  freezeAdminUserController,
  listAdminUsersController
} from '../controllers/adminUserController.js';
import { getPendingKycController, reviewKycController } from '../controllers/adminKycController.js';
import {
  approveWithdrawalController,
  getPendingWithdrawalsController,
  getWithdrawControlController,
  rejectWithdrawalController,
  updateWithdrawControlController
} from '../controllers/adminWithdrawalController.js';
import {
  addWalletConfigController,
  listWalletConfigsController,
  updateWalletConfigController
} from '../controllers/adminWalletController.js';
import { pauseTradingPairController, updateTradingPairController } from '../controllers/adminTradingController.js';
import { disableP2PAdController, resolveP2PDisputeController } from '../controllers/adminP2PController.js';
import { getSystemSettingsController, updateSystemSettingsController } from '../controllers/adminSettingsController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { requireAdminAuth } from '../middleware/adminAuth.js';
import { requireAdminRoles } from '../middleware/adminRole.js';
import { requireFields, validateEmailField } from '../middleware/validate.js';

const router = Router();

// New admin auth flow.
router.post('/admin/auth/login', requireFields(['email', 'password']), validateEmailField('email'), loginAdminController);

const allowAllAdminRoles = requireAdminRoles('super_admin', 'finance_admin', 'support_admin');
const allowFinanceAndSuper = requireAdminRoles('super_admin', 'finance_admin');
const allowSupportAndSuper = requireAdminRoles('super_admin', 'support_admin');
const allowSuperOnly = requireAdminRoles('super_admin');

// Protected admin routes (JWT admin token based).
router.get('/admin/dashboard', requireAdminAuth, allowAllAdminRoles, getAdminDashboardController);
router.get('/admin/support/analytics', requireAdminAuth, allowSupportAndSuper, getSupportAnalyticsController);

router.get('/admin/admins', requireAdminAuth, allowSuperOnly, listAdminsController);

router.get('/admin/users', requireAdminAuth, allowAllAdminRoles, listAdminUsersController);
router.post('/admin/users/freeze', requireAdminAuth, allowAllAdminRoles, requireFields(['user_id', 'action']), freezeAdminUserController);
router.post('/admin/users/credit', requireAdminAuth, allowFinanceAndSuper, requireFields(['user_id', 'amount']), creditAdminUserController);
router.post('/admin/users/debit', requireAdminAuth, allowFinanceAndSuper, requireFields(['user_id', 'amount']), debitAdminUserController);

router.get('/admin/kyc/pending', requireAdminAuth, allowSupportAndSuper, getPendingKycController);
router.post('/admin/kyc/review', requireAdminAuth, allowSupportAndSuper, requireFields(['action']), reviewKycController);

router.get('/admin/withdrawals/pending', requireAdminAuth, allowFinanceAndSuper, getPendingWithdrawalsController);
router.post('/admin/withdrawals/approve', requireAdminAuth, allowFinanceAndSuper, requireFields(['withdrawal_id']), approveWithdrawalController);
router.post('/admin/withdrawals/reject', requireAdminAuth, allowFinanceAndSuper, requireFields(['withdrawal_id']), rejectWithdrawalController);
router.get('/admin/withdrawals/control', requireAdminAuth, allowFinanceAndSuper, getWithdrawControlController);
router.post('/admin/withdrawals/control', requireAdminAuth, allowFinanceAndSuper, updateWithdrawControlController);

router.get('/admin/wallets', requireAdminAuth, allowFinanceAndSuper, listWalletConfigsController);
router.post('/admin/wallets/add', requireAdminAuth, allowFinanceAndSuper, requireFields(['wallet_type', 'address']), addWalletConfigController);
router.post('/admin/wallets/update', requireAdminAuth, allowFinanceAndSuper, requireFields(['id']), updateWalletConfigController);

router.post('/admin/trading/pair/update', requireAdminAuth, allowFinanceAndSuper, requireFields(['pair_symbol']), updateTradingPairController);
router.post('/admin/trading/pair/pause', requireAdminAuth, allowFinanceAndSuper, requireFields(['pair_symbol', 'is_paused']), pauseTradingPairController);

router.post('/admin/p2p/disable-ad', requireAdminAuth, allowSupportAndSuper, requireFields(['ad_id']), disableP2PAdController);
router.post('/admin/p2p/resolve-dispute', requireAdminAuth, allowSupportAndSuper, requireFields(['resolution']), resolveP2PDisputeController);

router.get('/admin/settings', requireAdminAuth, allowAllAdminRoles, getSystemSettingsController);
router.post('/admin/settings/update', requireAdminAuth, allowSuperOnly, updateSystemSettingsController);

// Legacy admin endpoints (kept for backward compatibility with existing user-role admin tokens).
router.get('/admin/deposits', requireAuth, requireAdmin, getDeposits);
router.post('/admin/approve-deposit', requireAuth, requireAdmin, requireFields(['deposit_id', 'action']), approveDeposit);
router.get('/admin/withdrawals', requireAuth, requireAdmin, getWithdrawals);
router.post('/admin/approve-withdraw', requireAuth, requireAdmin, requireFields(['withdrawal_id', 'action']), approveWithdraw);

export default router;
