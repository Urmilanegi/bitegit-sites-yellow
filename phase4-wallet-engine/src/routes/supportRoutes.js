import { Router } from 'express';
import {
  closeSupportTicketController,
  createSupportTicketController,
  getSupportMessagesController,
  joinSupportTicketController,
  replySupportTicketController,
  sendSupportMessageController
} from '../controllers/supportController.js';
import { requireAdminAuth } from '../middleware/adminAuth.js';
import { requireAdminRoles } from '../middleware/adminRole.js';
import { requireAuth } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();
const allowSupportAndSuper = requireAdminRoles('super_admin', 'support_admin');

router.post('/support/tickets', requireAuth, requireFields(['message']), createSupportTicketController);
router.post('/support/tickets/:ticketId/messages', requireAuth, requireFields(['message']), sendSupportMessageController);
router.get('/support/tickets/:ticketId/messages', requireAuth, getSupportMessagesController);

router.post('/admin/support/tickets/:ticketId/join', requireAdminAuth, allowSupportAndSuper, joinSupportTicketController);
router.post(
  '/admin/support/tickets/:ticketId/reply',
  requireAdminAuth,
  allowSupportAndSuper,
  requireFields(['message']),
  replySupportTicketController
);
router.post('/admin/support/tickets/:ticketId/close', requireAdminAuth, allowSupportAndSuper, closeSupportTicketController);

export default router;
