import Decimal from 'decimal.js';
import * as TronWebPackage from 'tronweb';
import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { AppError } from '../utils/appError.js';
import { assertPositiveAmount, toDbValue } from '../utils/decimal.js';
import {
  getUSDTBalance,
  TRON_MAINNET_RPC,
  USDT_TRC20_CONTRACT,
  validateTronAddress
} from './tronService.js';

const TronWeb = TronWebPackage.TronWeb || TronWebPackage.default?.TronWeb || TronWebPackage.default;

const TRC20_DECIMALS = 6;
const TRC20_BASE = new Decimal(10).pow(TRC20_DECIMALS);
const FEE_LIMIT_SUN = Math.max(
  1,
  Number.parseInt(String(process.env.TRON_TREASURY_FEE_LIMIT_SUN || '150000000'), 10) || 150000000
);
const MIN_TRX_FOR_GAS = new Decimal(String(process.env.TRON_TREASURY_MIN_TRX_FOR_GAS || '20'));
const HOT_WALLET_SWEEP_SUGGEST_THRESHOLD = new Decimal('5000');
const HOT_WALLET_LOW_LIQUIDITY_THRESHOLD = new Decimal('200');

const loadWalletAddresses = () => {
  const hotWalletAddress = String(process.env.HOT_WALLET_ADDRESS || '').trim();
  const coldWalletAddress = String(process.env.COLD_WALLET_ADDRESS || '').trim();

  if (!hotWalletAddress || !validateTronAddress(hotWalletAddress)) {
    throw new AppError('Valid HOT_WALLET_ADDRESS is required', 500);
  }

  if (!coldWalletAddress || !validateTronAddress(coldWalletAddress)) {
    throw new AppError('Valid COLD_WALLET_ADDRESS is required', 500);
  }

  if (hotWalletAddress === coldWalletAddress) {
    throw new AppError('HOT_WALLET_ADDRESS and COLD_WALLET_ADDRESS must be different', 422);
  }

  return { hotWalletAddress, coldWalletAddress };
};

const toBaseUnits = (amountDecimal) => {
  const scaled = amountDecimal.mul(TRC20_BASE);

  if (!scaled.isInteger()) {
    throw new AppError('Amount precision exceeds USDT decimals', 422);
  }

  if (scaled.lte(0)) {
    throw new AppError('Amount must be greater than zero', 422);
  }

  return scaled.toFixed(0);
};

const decodeBroadcastCode = (client, code) => {
  const raw = String(code || '').trim();
  if (!raw) {
    return '';
  }

  try {
    return String(client.toUtf8(raw) || '').trim() || raw;
  } catch {
    return raw;
  }
};

const ensureTreasuryLogsTable = async () => {
  try {
    await sequelize.query('SELECT id FROM treasury_logs LIMIT 1', { type: QueryTypes.SELECT });
  } catch (error) {
    const code = String(error?.original?.code || error?.code || '').trim();
    if (code === 'ER_NO_SUCH_TABLE') {
      throw new AppError('treasury_logs table is required before treasury operations', 500);
    }
    throw error;
  }
};

const insertTreasuryLog = async ({ type, amount, txHash = null }) => {
  await sequelize.query(
    `INSERT INTO treasury_logs (type, amount, tx_hash, created_at)
     VALUES (:type, :amount, :txHash, NOW())`,
    {
      type: QueryTypes.INSERT,
      replacements: {
        type,
        amount,
        txHash
      }
    }
  );
};

const getHotWalletSigner = () => {
  if (!TronWeb) {
    throw new AppError('TronWeb dependency is not available', 500);
  }

  const privateKey = String(process.env.TRON_HOT_WALLET_PRIVATE_KEY || process.env.TRON_PRIVATE_KEY || '').trim();
  if (!privateKey) {
    throw new AppError('TRON_HOT_WALLET_PRIVATE_KEY is required for sweep', 500);
  }

  const client = new TronWeb({
    fullHost: TRON_MAINNET_RPC,
    privateKey
  });

  let signerAddress = '';
  try {
    signerAddress = String(client.address.fromPrivateKey(privateKey) || '').trim();
  } catch {
    throw new AppError('Invalid TRON_HOT_WALLET_PRIVATE_KEY', 500);
  }

  if (!validateTronAddress(signerAddress)) {
    throw new AppError('Invalid signer address derived from hot wallet private key', 500);
  }

  return { client, privateKey, signerAddress };
};

const assertHotWalletGasBalance = async (client, hotWalletAddress) => {
  try {
    const balanceSun = await client.trx.getBalance(hotWalletAddress);
    const trxBalance = new Decimal(String(balanceSun || '0')).div('1000000');

    if (trxBalance.lt(MIN_TRX_FOR_GAS)) {
      throw new AppError('Insufficient TRX in hot wallet for treasury gas', 422, {
        available_trx: trxBalance.toFixed(6),
        required_trx: MIN_TRX_FOR_GAS.toFixed(6)
      });
    }

    return trxBalance;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(`Failed to validate hot wallet TRX balance: ${error.message}`, 502);
  }
};

const broadcastUsdtTransfer = async ({ client, privateKey, fromAddress, toAddress, amountBaseUnits }) => {
  try {
    const trigger = await client.transactionBuilder.triggerSmartContract(
      USDT_TRC20_CONTRACT,
      'transfer(address,uint256)',
      { feeLimit: FEE_LIMIT_SUN },
      [
        { type: 'address', value: toAddress },
        { type: 'uint256', value: amountBaseUnits }
      ],
      fromAddress
    );

    if (!trigger?.result?.result || !trigger?.transaction) {
      throw new Error('Failed to build treasury transfer transaction');
    }

    const signedTx = await client.trx.sign(trigger.transaction, privateKey);
    if (!signedTx || !Array.isArray(signedTx.signature) || signedTx.signature.length === 0) {
      throw new Error('Failed to sign treasury transfer transaction');
    }

    const broadcastResult = await client.trx.sendRawTransaction(signedTx);
    if (!broadcastResult?.result) {
      const decodedCode = decodeBroadcastCode(client, broadcastResult?.code);
      throw new Error(decodedCode || 'Treasury transfer broadcast rejected');
    }

    const txHash = String(broadcastResult.txid || signedTx.txID || '').trim();
    if (!txHash) {
      throw new Error('Missing transaction hash after treasury broadcast');
    }

    return txHash;
  } catch (error) {
    throw new AppError(`Failed to broadcast treasury transfer: ${error.message}`, 502);
  }
};

export const sweepToColdWallet = async (amount) => {
  const amountDecimal = assertPositiveAmount(amount, 'amount');
  const amountDb = toDbValue(amountDecimal);
  const { hotWalletAddress, coldWalletAddress } = loadWalletAddresses();

  await ensureTreasuryLogsTable();

  const hotWalletBalance = await getUSDTBalance(hotWalletAddress);
  const balanceDecimal = new Decimal(String(hotWalletBalance.balance || '0'));

  if (balanceDecimal.lt(amountDecimal)) {
    throw new AppError('Insufficient hot wallet USDT balance for sweep', 422, {
      balance: balanceDecimal.toFixed(6),
      requested: amountDecimal.toFixed(6)
    });
  }

  const { client, privateKey, signerAddress } = getHotWalletSigner();
  if (signerAddress !== hotWalletAddress) {
    throw new AppError('Hot wallet private key does not match HOT_WALLET_ADDRESS', 422);
  }

  await assertHotWalletGasBalance(client, hotWalletAddress);

  const amountBaseUnits = toBaseUnits(amountDecimal);
  const txHash = await broadcastUsdtTransfer({
    client,
    privateKey,
    fromAddress: hotWalletAddress,
    toAddress: coldWalletAddress,
    amountBaseUnits
  });

  await insertTreasuryLog({
    type: 'sweep',
    amount: amountDb,
    txHash
  });

  return {
    type: 'sweep',
    amount: amountDb,
    from: hotWalletAddress,
    to: coldWalletAddress,
    tx_hash: txHash
  };
};

export const refillHotWallet = async (amount) => {
  const amountDecimal = assertPositiveAmount(amount, 'amount');
  const amountDb = toDbValue(amountDecimal);
  const { hotWalletAddress, coldWalletAddress } = loadWalletAddresses();

  await ensureTreasuryLogsTable();

  await insertTreasuryLog({
    type: 'refill',
    amount: amountDb,
    txHash: null
  });

  return {
    type: 'refill',
    amount: amountDb,
    from: coldWalletAddress,
    to: hotWalletAddress,
    tx_hash: null,
    status: 'manual_refill_recorded'
  };
};

export const checkHotWalletThreshold = async () => {
  const { hotWalletAddress } = loadWalletAddresses();
  const hotWalletBalance = await getUSDTBalance(hotWalletAddress);
  const balanceDecimal = new Decimal(String(hotWalletBalance.balance || '0'));

  const suggestSweep = balanceDecimal.gt(HOT_WALLET_SWEEP_SUGGEST_THRESHOLD);
  const lowLiquidityWarning = balanceDecimal.lt(HOT_WALLET_LOW_LIQUIDITY_THRESHOLD);

  return {
    address: hotWalletAddress,
    token: 'USDT',
    balance: balanceDecimal.toFixed(6),
    thresholds: {
      suggest_sweep_if_above: HOT_WALLET_SWEEP_SUGGEST_THRESHOLD.toFixed(6),
      low_liquidity_if_below: HOT_WALLET_LOW_LIQUIDITY_THRESHOLD.toFixed(6)
    },
    suggest_sweep: suggestSweep,
    low_liquidity_warning: lowLiquidityWarning,
    message: suggestSweep
      ? 'Hot wallet balance is high, sweep to cold wallet is recommended.'
      : lowLiquidityWarning
        ? 'Hot wallet balance is low, refill planning is recommended.'
        : 'Hot wallet balance is within normal range.'
  };
};

export default {
  sweepToColdWallet,
  refillHotWallet,
  checkHotWalletThreshold
};
