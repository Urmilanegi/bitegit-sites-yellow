import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';
import { sendSuccess } from '../utils/response.js';
import {
  cancelOrder,
  createAd,
  createOrder,
  markAsPaid,
  raiseAppeal,
  releaseEscrow
} from '../services/p2pService.js';

const router = Router();

router.post('/ads', requireAuth, requireFields(['type', 'price', 'min_limit', 'max_limit', 'total_amount']), async (req, res, next) => {
  try {
    const ad = await createAd(req.user.id, req.body);
    return sendSuccess(res, 'P2P ad created', { ad }, 201);
  } catch (error) {
    return next(error);
  }
});

router.post('/orders', requireAuth, requireFields(['ad_id', 'amount']), async (req, res, next) => {
  try {
    const order = await createOrder(req.body.ad_id, req.user.id, req.body.amount);
    return sendSuccess(res, 'P2P order created', order, 201);
  } catch (error) {
    return next(error);
  }
});

router.post('/orders/:orderId/paid', requireAuth, async (req, res, next) => {
  try {
    const order = await markAsPaid(req.params.orderId);
    return sendSuccess(res, 'P2P order marked as paid', { order });
  } catch (error) {
    return next(error);
  }
});

router.post('/orders/:orderId/release', requireAuth, async (req, res, next) => {
  try {
    const result = await releaseEscrow(req.params.orderId);
    return sendSuccess(res, 'P2P escrow released', result);
  } catch (error) {
    return next(error);
  }
});

router.post('/orders/:orderId/cancel', requireAuth, async (req, res, next) => {
  try {
    const result = await cancelOrder(req.params.orderId);
    return sendSuccess(res, 'P2P order cancelled', result);
  } catch (error) {
    return next(error);
  }
});

router.post('/orders/:orderId/appeal', requireAuth, requireFields(['reason']), async (req, res, next) => {
  try {
    const result = await raiseAppeal(req.params.orderId, req.user.id, req.body.reason);
    return sendSuccess(res, 'P2P appeal raised', result, 201);
  } catch (error) {
    return next(error);
  }
});

export default router;
