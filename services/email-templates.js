/**
 * Bitegit Email Templates — Pixel-match to Binance style
 * Black header · Gold brand · Gold CTA button · Full social footer
 */

const APP_NAME   = String(process.env.APP_NAME   || 'Bitegit').trim();
const APP_DOMAIN = String(process.env.APP_DOMAIN || 'bitegit.com').trim();
const SUPPORT    = `support@${APP_DOMAIN}`;
const YEAR       = new Date().getUTCFullYear();

const GOLD  = '#F0B90B';
const BLACK = '#1E2026';
const TEXT  = '#1E2026';
const MUTED = '#888888';

// ─── Binance-style 5-diamond cross logo in GOLD ──────────────────────────
const LOGO_HTML = `
<table cellpadding="0" cellspacing="0" border="0" align="center">
  <tr>
    <td align="center" valign="middle" style="padding-right:8px;">
      <svg width="28" height="28" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <polygon points="25,19 31,25 25,31 19,25" fill="${GOLD}"/>
        <polygon points="25,5 31,11 25,17 19,11" fill="${GOLD}"/>
        <polygon points="33,19 39,25 33,31 27,25" fill="${GOLD}"/>
        <polygon points="25,33 31,39 25,45 19,39" fill="${GOLD}"/>
        <polygon points="11,19 17,25 11,31 5,25" fill="${GOLD}"/>
      </svg>
    </td>
    <td align="center" valign="middle">
      <span style="font-size:18px;font-weight:900;color:${GOLD};letter-spacing:2.5px;font-family:Arial,sans-serif;">
        ${APP_NAME.toUpperCase()}
      </span>
    </td>
  </tr>
</table>`;

function esc(v) {
  return String(v || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Gold CTA button (Binance style — wide, left-aligned) ─────────────────
function ctaButton(label, url) {
  return `
  <table cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 14px;">
    <tr>
      <td>
        <a href="${url}" style="display:inline-block;background:${GOLD};color:#000000;
           font-size:14px;font-weight:700;text-decoration:none;padding:12px 36px;
           border-radius:2px;font-family:Arial,sans-serif;letter-spacing:0.3px;">
          ${label}
        </a>
      </td>
    </tr>
  </table>`;
}

// ─── Social SVG icons ──────────────────────────────────────────────────────
const SOCIAL_ICONS = `
<table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:8px auto 0;">
  <tr>
    <td style="padding:0 8px;">
      <a href="https://twitter.com/${APP_NAME.toLowerCase()}" style="text-decoration:none;">
        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.622L18.244 2.25z" fill="#555"/></svg>
      </a>
    </td>
    <td style="padding:0 8px;">
      <a href="https://t.me/${APP_NAME.toLowerCase()}" style="text-decoration:none;">
        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="#555"/></svg>
      </a>
    </td>
    <td style="padding:0 8px;">
      <a href="https://facebook.com/${APP_NAME.toLowerCase()}" style="text-decoration:none;">
        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#555"/></svg>
      </a>
    </td>
    <td style="padding:0 8px;">
      <a href="https://linkedin.com/company/${APP_NAME.toLowerCase()}" style="text-decoration:none;">
        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#555"/></svg>
      </a>
    </td>
    <td style="padding:0 8px;">
      <a href="https://youtube.com/@${APP_NAME.toLowerCase()}" style="text-decoration:none;">
        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" fill="#555"/></svg>
      </a>
    </td>
    <td style="padding:0 8px;">
      <a href="https://reddit.com/r/${APP_NAME.toLowerCase()}" style="text-decoration:none;">
        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" fill="#555"/></svg>
      </a>
    </td>
    <td style="padding:0 8px;">
      <a href="https://instagram.com/${APP_NAME.toLowerCase()}" style="text-decoration:none;">
        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#555"/></svg>
      </a>
    </td>
  </tr>
</table>`;

// ─── Footer ────────────────────────────────────────────────────────────────
function buildFooter() {
  return `
  <!-- Gold divider -->
  <tr><td style="padding:28px 24px 0;">
    <div style="height:1px;background:${GOLD};"></div>
  </td></tr>

  <!-- Stay connected — small text like Binance -->
  <tr><td style="padding:16px 24px 4px;text-align:center;">
    <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:${GOLD};font-family:Arial,sans-serif;">
      Stay connected!
    </p>
    ${SOCIAL_ICONS}
  </td></tr>

  <!-- Anti-phishing -->
  <tr><td style="padding:14px 24px 4px;">
    <p style="margin:0;font-size:12px;color:${TEXT};font-family:Arial,sans-serif;line-height:1.7;">
      To stay secure, setup your anti-phishing code
      <a href="https://${APP_DOMAIN}/settings/security" style="color:${GOLD};text-decoration:none;">here</a>.
    </p>
  </td></tr>

  <!-- Disclaimer -->
  <tr><td style="padding:10px 24px 4px;">
    <p style="margin:0 0 10px;font-size:12px;color:${TEXT};font-family:Arial,sans-serif;line-height:1.7;">
      <strong>Disclaimer:</strong> Digital asset prices are subject to high market risk and
      price volatility. The value of your investment may go down or up, and you may not get
      back the amount invested. You are solely responsible for your investment decisions and
      ${esc(APP_NAME)} is not liable for any losses you may incur. Past performance is not a
      reliable predictor of future performance. You should only invest in products you are
      familiar with and where you understand the risks. You should carefully consider your
      investment experience, financial situation, investment objectives and risk tolerance and
      consult an independent financial adviser prior to making any investment. This material
      should not be construed as financial advice. For more information, see our
      <a href="https://${APP_DOMAIN}/terms" style="color:${GOLD};text-decoration:none;">Terms of Use</a>
      and
      <a href="https://${APP_DOMAIN}/risk" style="color:${GOLD};text-decoration:none;">Risk Warning</a>.
    </p>
    <p style="margin:0 0 10px;font-size:12px;color:${TEXT};font-family:Arial,sans-serif;line-height:1.7;">
      <strong>Kindly note:</strong> Please be aware of phishing sites and always make sure you
      are visiting the official ${esc(APP_DOMAIN)} website when entering sensitive data.
    </p>
    <p style="margin:0 0 10px;font-size:12px;color:${TEXT};font-family:Arial,sans-serif;line-height:1.7;">
      ${esc(APP_DOMAIN)} services are provided under applicable financial laws and regulations,
      as detailed <a href="https://${APP_DOMAIN}/legal" style="color:${GOLD};text-decoration:none;">here</a>.
    </p>
    <p style="margin:0 0 10px;font-size:12px;color:${TEXT};font-family:Arial,sans-serif;line-height:1.7;">
      For more information about how we process data, please see
      our <a href="https://${APP_DOMAIN}/privacy" style="color:${GOLD};text-decoration:none;">Privacy policy</a>
    </p>
  </td></tr>

  <!-- Copyright -->
  <tr><td style="padding:8px 24px 24px;text-align:center;">
    <p style="margin:0;font-size:12px;color:${MUTED};font-family:Arial,sans-serif;">
      &copy; ${YEAR} ${esc(APP_DOMAIN)}, All Rights Reserved.
    </p>
  </td></tr>
`;
}

// ─── Security line ─────────────────────────────────────────────────────────
const SECURITY_LINE = `
  <p style="margin:14px 0 0;font-size:14px;color:${TEXT};font-family:Arial,sans-serif;line-height:1.7;">
    Don't recognize this activity? Please
    <a href="https://${APP_DOMAIN}/reset-password" style="color:${GOLD};text-decoration:none;">reset your password</a>
    and contact
    <a href="https://${APP_DOMAIN}/support" style="color:${GOLD};text-decoration:none;">customer support</a>
    immediately.
  </p>`;

const AUTO_MSG = `
  <p style="margin:16px 0 6px;font-size:14px;color:${TEXT};font-style:italic;
     font-family:Arial,sans-serif;line-height:1.6;">
    This is an automated message, please do not reply.
  </p>`;

// ─── Master shell — wider horizontal feel ─────────────────────────────────
function buildShell(contentRows) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#F5F5F5;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F5;padding:16px 0;">
  <tr><td align="center">
    <table width="640" cellpadding="0" cellspacing="0"
      style="max-width:640px;width:100%;background:#FFFFFF;">

      <!-- BLACK HEADER -->
      <tr>
        <td style="background:${BLACK};padding:16px 24px;text-align:center;">
          ${LOGO_HTML}
        </td>
      </tr>

      <!-- MAIN CONTENT -->
      ${contentRows}

      <!-- FOOTER -->
      ${buildFooter()}

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════
// 1. WITHDRAWAL SUCCESSFUL
// ══════════════════════════════════════════════════════════════════
function withdrawalSuccessful({ toEmail, amount, asset, withdrawalTime, address, txId }) {
  const assetUpper = esc(String(asset || 'USDT').toUpperCase());
  const content = `
  <tr><td style="padding:28px 24px 8px;">
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${TEXT};
               font-family:Arial,sans-serif;line-height:1.3;">
      ${assetUpper} Withdrawal Successful
    </h1>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      You have successfully withdrawn <strong>${esc(String(amount))} ${assetUpper}</strong> from your account.
    </p>
    <p style="margin:0 0 4px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Withdrawal Address:</strong><br/>
      <span style="font-size:13px;word-break:break-all;">${esc(address || 'N/A')}</span>
    </p>
    <p style="margin:10px 0 0;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Transaction ID:</strong> <span style="font-size:13px;word-break:break-all;">${esc(txId || 'N/A')}</span>
    </p>
    ${ctaButton('Visit Your Dashboard', 'https://' + APP_DOMAIN + '/wallet')}
    ${SECURITY_LINE}
    <p style="margin:12px 0 0;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Please check with the receiving platform or wallet as the transaction is already
      confirmed on the blockchain explorer.
    </p>
    ${AUTO_MSG}
  </td></tr>`;
  return buildShell(content);
}

// ══════════════════════════════════════════════════════════════════
// 2. DEPOSIT SUCCESSFUL
// ══════════════════════════════════════════════════════════════════
function depositSuccessful({ toEmail, amount, asset, txTime }) {
  const assetUpper = esc(String(asset || 'USDT').toUpperCase());
  const time = esc(txTime || new Date().toISOString().replace('T',' ').slice(0,19) + ' (UTC)');
  const content = `
  <tr><td style="padding:28px 24px 8px;">
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${TEXT};
               font-family:Arial,sans-serif;line-height:1.3;">
      ${assetUpper} Deposit Successful
    </h1>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      You have successfully deposited <strong>${esc(String(amount))} ${assetUpper}</strong> into your account.
    </p>
    <p style="margin:0 0 4px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Transaction Time:</strong> ${time}
    </p>
    <p style="margin:8px 0 0;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Amount Credited:</strong> ${esc(String(amount))} ${assetUpper}
    </p>
    ${ctaButton('Visit Your Dashboard', 'https://' + APP_DOMAIN + '/wallet')}
    ${SECURITY_LINE}
    <p style="margin:12px 0 0;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Your balance has been updated. Go to your assets to check the details.
    </p>
    ${AUTO_MSG}
  </td></tr>`;
  return buildShell(content);
}

// ══════════════════════════════════════════════════════════════════
// 3. WITHDRAWAL VERIFICATION CODE
// ══════════════════════════════════════════════════════════════════
function withdrawalVerificationCode({ toEmail, code, withdrawalTime, amount, asset, address }) {
  const assetUpper = esc(String(asset || 'USDT').toUpperCase());
  const content = `
  <tr><td style="padding:28px 24px 8px;">
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${TEXT};
               font-family:Arial,sans-serif;line-height:1.3;">
      Confirm Your Withdrawal
    </h1>
    <p style="margin:0 0 8px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Your verification code
    </p>
    <p style="margin:0 0 14px;font-size:34px;font-weight:700;color:${GOLD};
              font-family:Arial,sans-serif;letter-spacing:4px;line-height:1.2;">
      ${esc(code)}
    </p>
    <p style="margin:0 0 14px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      You're initiating a withdrawal of <strong>${esc(String(amount))} ${assetUpper}</strong>.
      The verification code will be valid for <strong>10 minutes</strong>.<br/>
      Please do not share this code with anyone.
    </p>
    <p style="margin:0 0 4px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Withdrawal Address:</strong><br/>
      <span style="font-size:13px;word-break:break-all;">${esc(address || 'N/A')}</span>
    </p>
    <p style="margin:8px 0 0;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Amount:</strong> ${esc(String(amount))} ${assetUpper}
    </p>
    ${SECURITY_LINE}
    <p style="margin:10px 0 0;font-size:13px;color:#CC0000;font-weight:700;line-height:1.7;font-family:Arial,sans-serif;">
      Never share this code with anyone, including ${esc(APP_NAME)} support.
    </p>
    ${AUTO_MSG}
  </td></tr>`;
  return buildShell(content);
}

// ══════════════════════════════════════════════════════════════════
// 4. OTP — Login / Signup / Password Reset
// ══════════════════════════════════════════════════════════════════
function otpEmail({ heading, toEmail, code, expiresInMinutes, note }) {
  const content = `
  <tr><td style="padding:28px 24px 8px;">
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${TEXT};
               font-family:Arial,sans-serif;line-height:1.3;">
      ${esc(heading)}
    </h1>
    <p style="margin:0 0 8px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Your verification code
    </p>
    <p style="margin:0 0 14px;font-size:34px;font-weight:700;color:${GOLD};
              font-family:Arial,sans-serif;letter-spacing:4px;line-height:1.2;">
      ${esc(code)}
    </p>
    <p style="margin:0 0 14px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      The verification code will be valid for <strong>${Number(expiresInMinutes) || 30} minutes</strong>.<br/>
      Please do not share this code with anyone.
    </p>
    ${SECURITY_LINE}
    <p style="margin:10px 0 0;font-size:13px;color:#CC0000;font-weight:700;line-height:1.7;font-family:Arial,sans-serif;">
      Never share this code with anyone, including ${esc(APP_NAME)} support staff.
    </p>
    ${AUTO_MSG}
  </td></tr>`;
  return buildShell(content);
}

// ══════════════════════════════════════════════════════════════════
// 5. LOGIN ALERT — New Device or IP
// ══════════════════════════════════════════════════════════════════
function loginAlert({ toEmail, loginTime, device, ipAddress, location }) {
  const content = `
  <tr><td style="padding:28px 24px 8px;">
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${TEXT};
               font-family:Arial,sans-serif;line-height:1.3;">
      New Device or IP Login Detected on Your Account
    </h1>
    <p style="margin:0 0 18px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      We detected a login to your account
      <a href="mailto:${esc(toEmail)}" style="color:${GOLD};text-decoration:none;">${esc(toEmail)}</a>
      from a new device or IP address. If this was not you, please change your
      password or temporarily disable your account immediately.
    </p>
    <p style="margin:0 0 5px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Time</strong> : ${esc(loginTime || new Date().toISOString().replace('T',' ').slice(0,19) + '(UTC)')}
    </p>
    <p style="margin:0 0 5px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Device</strong> : ${esc(device || 'Unknown')}
    </p>
    <p style="margin:0 0 5px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>IP Address</strong> : ${esc(ipAddress || 'Unknown')}
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Location</strong>: ${esc(location || 'Unknown')}
    </p>
    <p style="margin:0 0 16px;font-size:13px;color:${TEXT};line-height:1.7;font-style:italic;font-family:Arial,sans-serif;">
      Note: The location is based on IP data provided by a third-party service and may not be entirely accurate.
    </p>
    ${ctaButton('Check Account Activity', 'https://' + APP_DOMAIN + '/settings/security')}
    ${AUTO_MSG}
  </td></tr>`;
  return buildShell(content);
}

// ══════════════════════════════════════════════════════════════════
// 6. P2P — NEW ORDER PLACED
// ══════════════════════════════════════════════════════════════════
function p2pOrderNotification({ buyerUsername, orderId, orderNo }) {
  const ref = esc(orderNo || orderId || '--');
  const content = `
  <tr><td style="padding:28px 24px 8px;">
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${TEXT};
               font-family:Arial,sans-serif;line-height:1.3;">
      New P2P Order Placed
    </h1>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>${esc(buyerUsername || 'A buyer')}</strong> has placed an order on your listing.
      Please review and respond promptly.
    </p>
    <p style="margin:0 0 4px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Order No.:</strong> ${ref}
    </p>
    ${ctaButton('View Order', 'https://' + APP_DOMAIN + '/p2p')}
    ${SECURITY_LINE}
    <p style="margin:12px 0 0;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Please verify all payment details with the buyer before releasing any assets.
    </p>
    ${AUTO_MSG}
  </td></tr>`;
  return buildShell(content);
}

// ══════════════════════════════════════════════════════════════════
// 7. P2P — BUYER PAID, PLEASE RELEASE
// ══════════════════════════════════════════════════════════════════
function p2pCryptoRelease({ toEmail, buyerUsername, amountInr, paymentMethod, upiId }) {
  const content = `
  <tr><td style="padding:28px 24px 8px;">
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${TEXT};
               font-family:Arial,sans-serif;line-height:1.3;">
      Payment Received — Please Release
    </h1>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>${esc(buyerUsername || 'Buyer')}</strong> has completed the payment of
      <strong>&#8377;${esc(String(amountInr || 0))}</strong>
      via <strong>${esc(paymentMethod || 'UPI')}</strong>.
    </p>
    <p style="margin:0 0 4px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Payment Method:</strong> ${esc(paymentMethod || 'UPI')}
    </p>
    <p style="margin:8px 0 0;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>UPI / Account ID:</strong> ${esc(upiId || 'Check in order chat')}
    </p>
    ${ctaButton('Verify &amp; Release Crypto', 'https://' + APP_DOMAIN + '/p2p')}
    ${SECURITY_LINE}
    <p style="margin:12px 0 0;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Please verify receipt of funds in your bank or UPI account before releasing.
      Do not release until you have confirmed the payment is in your account.
    </p>
    ${AUTO_MSG}
  </td></tr>`;
  return buildShell(content);
}

// ══════════════════════════════════════════════════════════════════
// 8. P2P — ORDER CANCELLED
// ══════════════════════════════════════════════════════════════════
function p2pOrderCanceled({ toEmail, orderNo, canceledBy }) {
  const content = `
  <tr><td style="padding:28px 24px 8px;">
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${TEXT};
               font-family:Arial,sans-serif;line-height:1.3;">
      P2P Order Cancelled
    </h1>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Your P2P order has been cancelled by <strong>${esc(canceledBy || 'the other party')}</strong>.
      No funds have been deducted from your account.
    </p>
    <p style="margin:0 0 4px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Order No.:</strong> ${esc(orderNo || '--')}
    </p>
    ${ctaButton('Find a New Trade', 'https://' + APP_DOMAIN + '/p2p')}
    ${SECURITY_LINE}
    <p style="margin:12px 0 0;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      If you believe this was an error, please contact customer support immediately.
    </p>
    ${AUTO_MSG}
  </td></tr>`;
  return buildShell(content);
}

// ══════════════════════════════════════════════════════════════════
// 9. KYC APPROVED
// ══════════════════════════════════════════════════════════════════
function kycApproved({ toEmail, username }) {
  const content = `
  <tr><td style="padding:28px 24px 8px;">
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${TEXT};
               font-family:Arial,sans-serif;line-height:1.3;">
      Identity Verification Approved
    </h1>
    <p style="margin:0 0 10px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Hi <strong>${esc(username || toEmail)}</strong>,
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Your KYC verification has been <strong style="color:#16a34a;">approved</strong>.
      You can now place buy and sell orders on ${esc(APP_NAME)} P2P.
    </p>
    ${ctaButton('Start Trading on P2P', 'https://' + APP_DOMAIN + '/p2p')}
    ${SECURITY_LINE}
    <p style="margin:12px 0 0;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Please check your account dashboard to see your updated trading limits.
    </p>
    ${AUTO_MSG}
  </td></tr>`;
  return buildShell(content);
}

// ══════════════════════════════════════════════════════════════════
// 10. KYC REJECTED
// ══════════════════════════════════════════════════════════════════
function kycRejected({ toEmail, username, reason }) {
  const content = `
  <tr><td style="padding:28px 24px 8px;">
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${TEXT};
               font-family:Arial,sans-serif;line-height:1.3;">
      KYC Verification Update
    </h1>
    <p style="margin:0 0 10px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Hi <strong>${esc(username || toEmail)}</strong>,
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Your KYC submission was <strong style="color:#CC0000;">not approved</strong> at this time.
      ${reason ? `<br/><br/><strong>Reason:</strong> ${esc(reason)}` : ''}
    </p>
    ${ctaButton('Resubmit KYC', 'https://' + APP_DOMAIN + '/kyc')}
    ${SECURITY_LINE}
    <p style="margin:12px 0 0;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Please ensure your documents are clear, valid and match your account details.
      Contact customer support if you need assistance.
    </p>
    ${AUTO_MSG}
  </td></tr>`;
  return buildShell(content);
}

// ══════════════════════════════════════════════════════════════════
// 11. P2P — DISPUTE RAISED (admin alert)
// ══════════════════════════════════════════════════════════════════
function p2pDisputeRaised({ toEmail, raisedBy, orderId, orderNo }) {
  const ref = esc(orderNo || orderId || '--');
  const content = `
  <tr><td style="padding:28px 24px 8px;">
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${TEXT};
               font-family:Arial,sans-serif;line-height:1.3;">
      P2P Dispute Raised — Action Required
    </h1>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>${esc(raisedBy || 'A user')}</strong> has raised a dispute on order
      <strong>${ref}</strong>. Please review and resolve in the admin panel.
    </p>
    <p style="margin:0 0 4px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Order No.:</strong> ${ref}
    </p>
    ${ctaButton('Review in Admin Panel', 'https://' + APP_DOMAIN + '/admin')}
    <p style="margin:10px 0 0;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Navigate to <strong>Admin → P2P → Disputes</strong> to review evidence and resolve.
    </p>
    ${AUTO_MSG}
  </td></tr>`;
  return buildShell(content);
}

// ══════════════════════════════════════════════════════════════════
// 12. P2P — ORDER COMPLETED
// ══════════════════════════════════════════════════════════════════
function p2pOrderCompleted({ toEmail, orderId, orderNo, assetAmount, asset }) {
  const assetUpper = esc(String(asset || 'USDT').toUpperCase());
  const ref = esc(orderNo || orderId || '--');
  const content = `
  <tr><td style="padding:28px 24px 8px;">
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${TEXT};
               font-family:Arial,sans-serif;line-height:1.3;">
      ${assetUpper} P2P Order Completed
    </h1>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      You have successfully received
      <strong>${esc(String(assetAmount))} ${assetUpper}</strong> from your P2P order.
      The funds are now available in your wallet.
    </p>
    <p style="margin:0 0 4px;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Amount Received:</strong> ${esc(String(assetAmount))} ${assetUpper}
    </p>
    <p style="margin:8px 0 0;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      <strong>Order No.:</strong> ${ref}
    </p>
    ${ctaButton('Visit Your Dashboard', 'https://' + APP_DOMAIN + '/wallet')}
    ${SECURITY_LINE}
    <p style="margin:12px 0 0;font-size:14px;color:${TEXT};line-height:1.7;font-family:Arial,sans-serif;">
      Please check your wallet to confirm the balance has been updated.
    </p>
    ${AUTO_MSG}
  </td></tr>`;
  return buildShell(content);
}

// ─── Subject helper ────────────────────────────────────────────────────────
function subject(title) {
  return `[${APP_NAME}] ${title}`;
}

module.exports = {
  APP_NAME, APP_DOMAIN, SUPPORT,
  subject,
  depositSuccessful,
  withdrawalSuccessful,
  withdrawalVerificationCode,
  otpEmail,
  loginAlert,
  p2pOrderNotification,
  p2pCryptoRelease,
  p2pOrderCanceled,
  p2pOrderCompleted,
  kycApproved,
  kycRejected,
  p2pDisputeRaised
};
