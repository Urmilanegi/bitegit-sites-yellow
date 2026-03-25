// P2P Email Service
function createP2PEmailService(resend, fromEmail) {
  async function sendOrderConfirmation(email, order) {
    try {
      if (!resend || !fromEmail) return { delivered: false, reason: 'not_configured' };
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `P2P Order ${order.id} Confirmation`,
        html: `<p>Your P2P order <b>${order.id}</b> has been placed successfully.</p>`
      });
      return { delivered: true };
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  async function sendOrderUpdate(email, order, status) {
    try {
      if (!resend || !fromEmail) return { delivered: false, reason: 'not_configured' };
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `P2P Order ${order.id} Update`,
        html: `<p>Your P2P order <b>${order.id}</b> status is now: <b>${status}</b></p>`
      });
      return { delivered: true };
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  return { sendOrderConfirmation, sendOrderUpdate };
}

module.exports = { createP2PEmailService };
