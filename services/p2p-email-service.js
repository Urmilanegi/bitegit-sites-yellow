const { sendRawEmail } = require('./auth-email-service');
const T = require('./email-templates');

async function trySend(to, subjectStr, html, text) {
  if (!to) {
    throw new Error('P2P email recipient is required.');
  }

  const result = await sendRawEmail({ to, subject: subjectStr, html, text: text || subjectStr });
  if (!result?.delivered) {
    const error = new Error(`P2P email delivery failed: ${result?.reason || 'delivery_failed'}`);
    error.code = 'P2P_EMAIL_DELIVERY_FAILED';
    error.delivery = result || null;
    throw error;
  }

  return result;
}

function createP2PEmailService() {
  /**
   * Seller receives this when a buyer places an order.
   */
  async function sendOrderCreated(sellerEmail, order) {
    await trySend(
      sellerEmail,
      T.subject('New P2P order placed'),
      T.p2pOrderNotification({
        buyerUsername: order.buyerUsername || order.buyerEmail || 'A buyer',
        orderId:       order.id || order._id,
        orderNo:       order.reference || order.orderNo || order.id,
        antiPhishingCode: order.antiPhishingCode || ''
      }),
      `New P2P order from ${order.buyerUsername || 'a buyer'}. Order #${order.reference || order.id}`
    );
  }

  /**
   * Seller receives this when buyer marks payment as sent.
   * Prompts seller to verify bank/UPI and release crypto.
   */
  async function sendOrderPaid(sellerEmail, order) {
    await trySend(
      sellerEmail,
      T.subject('Buyer has completed payment — please release'),
      T.p2pCryptoRelease({
        toEmail:      sellerEmail,
        buyerUsername: order.buyerUsername || order.buyerEmail || 'Buyer',
        amountInr:    order.amountInr || order.fiatAmount || 0,
        paymentMethod: order.paymentMethod || 'UPI',
        upiId:        order.upiId || order.paymentDetails || '',
        antiPhishingCode: order.antiPhishingCode || ''
      }),
      `Buyer has sent payment for order #${order.reference || order.id}. Verify your account and release crypto.`
    );
  }

  /**
   * Buyer receives this when seller releases crypto.
   */
  async function sendOrderReleased(buyerEmail, order) {
    await trySend(
      buyerEmail,
      T.subject('Crypto released — order complete'),
      T.p2pOrderCompleted({
        toEmail:     buyerEmail,
        orderId:     order.id || order._id,
        orderNo:     order.reference || order.orderNo || order.id,
        assetAmount: order.assetAmount || order.cryptoAmount || 0,
        asset:       order.asset || 'USDT',
        antiPhishingCode: order.antiPhishingCode || ''
      }),
      `Your crypto has been released. Order #${order.reference || order.id} completed.`
    );
  }

  /**
   * Both buyer and/or seller receive this when an order is cancelled.
   */
  async function sendOrderCancelled(email, order) {
    await trySend(
      email,
      T.subject('P2P order cancelled'),
      T.p2pOrderCanceled({
        toEmail:    email,
        orderNo:    order.reference || order.orderNo || order.id,
        canceledBy: order.canceledBy || order.cancelledBy || 'the other party',
        antiPhishingCode: order.antiPhishingCode || ''
      }),
      `P2P order #${order.reference || order.id} has been cancelled.`
    );
  }

  /**
   * Admin receives this when a dispute is raised.
   */
  async function sendDisputeRaised(adminEmail, order, raisedBy) {
    await trySend(
      adminEmail,
      T.subject('P2P dispute raised — action required'),
      T.p2pDisputeRaised({
        toEmail:   adminEmail,
        raisedBy:  raisedBy || 'A user',
        orderId:   order.id || order._id,
        orderNo:   order.reference || order.orderNo || order.id,
        antiPhishingCode: order.antiPhishingCode || ''
      }),
      `Dispute raised on order #${order.reference || order.id} by ${raisedBy}. Review in admin panel.`
    );
  }

  async function sendWithdrawalOtp(toEmail, otp, amount, currency, address) {
    const T2 = require('./email-templates');
    const html = T2.withdrawalVerificationCode
      ? T2.withdrawalVerificationCode({ toEmail, code: otp, withdrawalTime: new Date().toLocaleString('en-IN'), amount, asset: currency || 'USDT', address: address || '' })
      : `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0b0f17;color:#fff;padding:32px;border-radius:12px;">
          <h2 style="color:#00d4d4;margin-top:0;">Withdrawal Confirmation</h2>
          <p style="color:rgba(255,255,255,0.7);">Your withdrawal OTP for <strong>${amount} ${currency || 'USDT'}</strong>:</p>
          <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#fff;padding:20px;background:#111;border-radius:8px;text-align:center;margin:16px 0;">${otp}</div>
          <p style="color:rgba(255,255,255,0.4);font-size:12px;">To: ${address}<br>Valid for 10 minutes. Never share this code.</p>
        </div>`;
    await trySend(toEmail, T.subject(`Withdrawal OTP: ${amount} ${currency || 'USDT'}`), html,
      `Your Bitegit withdrawal OTP: ${otp}. Amount: ${amount} ${currency || 'USDT'}. Valid 10 minutes.`);
  }

  async function sendEmailVerificationOtp(toEmail, otp) {
    const html = `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0b0f17;color:#fff;padding:32px;border-radius:12px;">
      <h2 style="color:#00d4d4;margin-top:0;">Email Verification</h2>
      <p style="color:rgba(255,255,255,0.7);">Your email verification code for Bitegit P2P:</p>
      <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#fff;padding:20px;background:#111;border-radius:8px;text-align:center;margin:16px 0;">${otp}</div>
      <p style="color:rgba(255,255,255,0.4);font-size:13px;">This code expires in 10 minutes. Do not share it with anyone.</p>
    </div>`;
    await trySend(toEmail, T.subject('Your Bitegit email verification code'), html, `Your Bitegit verification code: ${otp}. Valid for 10 minutes.`);
  }

  return {
    sendOrderCreated,
    sendOrderPaid,
    sendOrderReleased,
    sendOrderCancelled,
    sendDisputeRaised,
    sendEmailVerificationOtp,
    sendWithdrawalOtp
  };
}

module.exports = { createP2PEmailService };

// ── Standalone KYC emails ─────────────────────────────────────────────────

async function sendKycApprovedEmail(toEmail, username) {
  return sendRawEmail({
    to:      toEmail,
    subject: T.subject('KYC approved — you can now trade'),
    html:    T.kycApproved({ toEmail, username }),
    text:    `Your KYC has been approved on ${T.APP_NAME}. You can now trade on P2P.`
  });
}

async function sendKycRejectedEmail(toEmail, username, reason) {
  return sendRawEmail({
    to:      toEmail,
    subject: T.subject('KYC update — action required'),
    html:    T.kycRejected({ toEmail, username, reason }),
    text:    `Your KYC submission was not approved. Reason: ${reason || 'See email for details.'}. Please resubmit.`
  });
}

module.exports.sendKycApprovedEmail = sendKycApprovedEmail;
module.exports.sendKycRejectedEmail = sendKycRejectedEmail;
