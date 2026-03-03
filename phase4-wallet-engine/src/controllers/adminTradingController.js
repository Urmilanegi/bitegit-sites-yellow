import { pauseTradingPair, updateTradingPair } from '../services/adminTradingService.js';
import { sendSuccess } from '../utils/response.js';

export const updateTradingPairController = async (req, res, next) => {
  try {
    const pair = await updateTradingPair({
      pairSymbol: req.body.pair_symbol,
      makerFee: req.body.maker_fee,
      takerFee: req.body.taker_fee,
      isEnabled: req.body.is_enabled,
      isPaused: req.body.is_paused,
      adminId: req.admin.id
    });

    return sendSuccess(res, 'Trading pair updated', { pair });
  } catch (error) {
    return next(error);
  }
};

export const pauseTradingPairController = async (req, res, next) => {
  try {
    const pair = await pauseTradingPair({
      pairSymbol: req.body.pair_symbol,
      isPaused: req.body.is_paused,
      adminId: req.admin.id
    });

    return sendSuccess(res, 'Trading pair pause state updated', { pair });
  } catch (error) {
    return next(error);
  }
};
