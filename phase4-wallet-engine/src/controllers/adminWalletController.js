import { addWalletConfig, listWalletConfigs, updateWalletConfig } from '../services/adminWalletService.js';
import { sendSuccess } from '../utils/response.js';

export const listWalletConfigsController = async (req, res, next) => {
  try {
    const wallets = await listWalletConfigs();
    return sendSuccess(res, 'Wallet configs fetched', { wallets });
  } catch (error) {
    return next(error);
  }
};

export const addWalletConfigController = async (req, res, next) => {
  try {
    const wallet = await addWalletConfig({
      walletType: req.body.wallet_type,
      address: req.body.address,
      label: req.body.label,
      isActive: req.body.is_active,
      adminId: req.admin.id
    });

    return sendSuccess(res, 'Wallet config added', { wallet }, 201);
  } catch (error) {
    return next(error);
  }
};

export const updateWalletConfigController = async (req, res, next) => {
  try {
    const wallet = await updateWalletConfig({
      id: req.body.id,
      walletType: req.body.wallet_type,
      address: req.body.address,
      label: req.body.label,
      isActive: req.body.is_active,
      adminId: req.admin.id
    });

    return sendSuccess(res, 'Wallet config updated', { wallet });
  } catch (error) {
    return next(error);
  }
};
