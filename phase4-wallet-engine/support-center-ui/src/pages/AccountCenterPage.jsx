export default function AccountCenterPage({ onOpenSubmitCase }) {
  return (
    <section className="page-main">
      <article className="card">
        <h1>Account Center</h1>
        <p>Manage account security, verification status, support requests, and service tools.</p>
      </article>

      <div className="category-grid">
        <article className="category-card">
          <h3>KYC Verification Support</h3>
          <p>Track verification progress, rejected reasons, and resubmission guidance.</p>
          <button type="button" className="ghost-btn" onClick={onOpenSubmitCase}>
            Open KYC Case
          </button>
        </article>

        <article className="category-card">
          <h3>P2P Support Tools</h3>
          <p>Appeal flow, completion-rate disputes, payment method issues, and advertiser help.</p>
          <button type="button" className="ghost-btn" onClick={onOpenSubmitCase}>
            Open P2P Case
          </button>
        </article>

        <article className="category-card">
          <h3>Deposit & Withdrawal Monitoring</h3>
          <p>Live network status, suspensions, maintenance alerts, and coin availability details.</p>
          <button type="button" className="ghost-btn" onClick={onOpenSubmitCase}>
            Open Asset Case
          </button>
        </article>

        <article className="category-card">
          <h3>Security Assistance</h3>
          <p>2FA reset, suspicious login review, withdrawal holds, and anti-phishing setup support.</p>
          <button type="button" className="ghost-btn" onClick={onOpenSubmitCase}>
            Open Security Case
          </button>
        </article>
      </div>
    </section>
  );
}

