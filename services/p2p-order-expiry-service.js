function createP2POrderExpiryService({ walletService } = {}) {
  if (
    !walletService ||
    typeof walletService.expireOrders !== 'function' ||
    typeof walletService.warnOrdersNearingExpiry !== 'function'
  ) {
    throw new Error('walletService.warnOrdersNearingExpiry and walletService.expireOrders are required for P2P expiry service.');
  }

  async function runExpirySweep() {
    const warningResult = await walletService.warnOrdersNearingExpiry();
    const result = await walletService.expireOrders();
    const expiredCount = Number(result?.expired || 0);
    return {
      success: true,
      warningCount: Number(warningResult?.warned || 0),
      warningOrders: warningResult?.warnedOrders || [],
      expiredCount,
      cancelledCount: expiredCount,
      orders: result?.expiredOrders || []
    };
  }

  return {
    runExpirySweep
  };
}

module.exports = {
  createP2POrderExpiryService
};
