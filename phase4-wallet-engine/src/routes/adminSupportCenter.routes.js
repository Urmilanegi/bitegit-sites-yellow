import { Router } from 'express';
import { requireAdminAuth } from '../middleware/adminAuth.js';
import { requireAdminRoles } from '../middleware/adminRole.js';
import {
  adminCreateAnnouncement,
  adminCreateHelpArticle,
  adminListHelpArticles,
  adminReplyToTicket,
  adminResolveP2PDispute,
  adminResolveTicket,
  adminReviewKycRequest,
  adminUpdateCryptoStatus,
  getAdminP2PDisputes,
  getAdminTicketDashboard,
  getAdminTicketDetails,
  getCryptoStatusMatrix
} from '../services/supportCenterService.js';
import { sendSuccess } from '../utils/response.js';

const router = Router();
const allowSupportAndSuper = requireAdminRoles('super_admin', 'support_admin');

router.get('/admin/support-center/tickets', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const payload = await getAdminTicketDashboard({
      status: String(req.query.status || ''),
      limit: req.query.limit
    });
    return sendSuccess(res, 'Support tickets fetched', payload);
  } catch (error) {
    return next(error);
  }
});

router.get('/admin/support-center/tickets/:ticketId', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const payload = await getAdminTicketDetails(req.params.ticketId);
    return sendSuccess(res, 'Support ticket details fetched', payload);
  } catch (error) {
    return next(error);
  }
});

router.post('/admin/support-center/tickets/:ticketId/reply', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const payload = await adminReplyToTicket({
      ticketId: req.params.ticketId,
      adminId: req.admin?.id,
      message: req.body.message
    });
    return sendSuccess(res, 'Ticket reply submitted', payload, 201);
  } catch (error) {
    return next(error);
  }
});

router.post('/admin/support-center/tickets/:ticketId/resolve', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const payload = await adminResolveTicket({
      ticketId: req.params.ticketId,
      adminId: req.admin?.id,
      note: req.body.note
    });
    return sendSuccess(res, 'Ticket resolved', payload);
  } catch (error) {
    return next(error);
  }
});

router.get('/admin/support-center/p2p/disputes', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const payload = await getAdminP2PDisputes();
    return sendSuccess(res, 'P2P disputes fetched', payload);
  } catch (error) {
    return next(error);
  }
});

router.post('/admin/support-center/p2p/disputes/:disputeId/resolve', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const payload = await adminResolveP2PDispute({
      disputeId: req.params.disputeId,
      adminId: req.admin?.id,
      disputeStatus: req.body.dispute_status,
      note: req.body.note
    });
    return sendSuccess(res, 'P2P dispute updated', payload);
  } catch (error) {
    return next(error);
  }
});

router.get('/admin/support-center/crypto/status', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const payload = await getCryptoStatusMatrix({
      search: String(req.query.search || ''),
      hideSuspended: false,
      onlySuspended: false
    });
    return sendSuccess(res, 'Crypto status list fetched', payload);
  } catch (error) {
    return next(error);
  }
});

router.post('/admin/support-center/crypto/status', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const payload = await adminUpdateCryptoStatus({
      symbol: req.body.symbol,
      network: req.body.network,
      depositStatus: req.body.deposit_status,
      withdrawStatus: req.body.withdraw_status,
      maintenanceAlert: req.body.maintenance_alert
    });
    return sendSuccess(res, 'Crypto status updated', payload);
  } catch (error) {
    return next(error);
  }
});

router.post('/admin/support-center/announcements', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const payload = await adminCreateAnnouncement({
      title: req.body.title,
      message: req.body.message,
      startsAt: req.body.starts_at,
      endsAt: req.body.ends_at,
      adminId: req.admin?.id
    });
    return sendSuccess(res, 'Announcement created', payload, 201);
  } catch (error) {
    return next(error);
  }
});

router.post('/admin/support-center/kyc/:userId/review', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const payload = await adminReviewKycRequest({
      userId: req.params.userId,
      action: req.body.action,
      note: req.body.note,
      adminId: req.admin?.id
    });
    return sendSuccess(res, 'KYC review action recorded', payload);
  } catch (error) {
    return next(error);
  }
});

router.get('/admin/support-center/help/articles', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const payload = await adminListHelpArticles();
    return sendSuccess(res, 'Help articles fetched', payload);
  } catch (error) {
    return next(error);
  }
});

router.post('/admin/support-center/help/articles', requireAdminAuth, allowSupportAndSuper, async (req, res, next) => {
  try {
    const payload = await adminCreateHelpArticle(req.body || {});
    return sendSuccess(res, 'Help article created', payload, 201);
  } catch (error) {
    return next(error);
  }
});

export default router;

