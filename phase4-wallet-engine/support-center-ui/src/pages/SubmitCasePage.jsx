import { useMemo, useState } from 'react';

const DEFAULT_FORM_STATE = {
  user_uid: '',
  email: '',
  order_id: '',
  subject: '',
  description: '',
  attachments: []
};

const extractFileNames = (fileList) => {
  const names = [];
  for (const file of Array.from(fileList || [])) {
    names.push(file.name);
  }
  return names;
};

const shouldShowDisputeStatus = (subcategory = '') => {
  const text = String(subcategory || '').toLowerCase();
  const keywords = ['appeal', 'dispute', 'report', 'release'];
  return keywords.some((keyword) => text.includes(keyword));
};

export default function SubmitCasePage({ config, onSubmitCase }) {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [disputeStatus, setDisputeStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM_STATE);

  const subcategories = useMemo(() => config?.subcategories?.[category] || [], [config, category]);
  const showTip = Boolean(category);
  const showDisputeDropdown = shouldShowDisputeStatus(subcategory);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const response = await onSubmitCase({
        category,
        subcategory,
        dispute_status: disputeStatus,
        ...form
      });
      setResult(response);
      setForm(DEFAULT_FORM_STATE);
      setShowForm(false);
    } catch (error) {
      setResult({
        error: true,
        message: error.message || 'Unable to submit request right now.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-main">
      <article className="card warning-banner">
        <strong>We are currently experiencing a large volume of inquiries.</strong>
        <p>To facilitate faster responses please check the help center first.</p>
      </article>

      <article className="card">
        <h1>Submit Case</h1>

        <div className="form-grid">
          <label>
            <span>Category</span>
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setSubcategory('');
                setDisputeStatus('');
              }}
            >
              <option value="">Select category</option>
              {(config?.categories || []).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Subcategory</span>
            <select value={subcategory} onChange={(event) => setSubcategory(event.target.value)} disabled={!category}>
              <option value="">Select subcategory</option>
              {subcategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          {showDisputeDropdown ? (
            <label>
              <span>Dispute Status</span>
              <select value={disputeStatus} onChange={(event) => setDisputeStatus(event.target.value)}>
                <option value="">Select dispute status</option>
                {(config?.dispute_status_options || []).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        {showTip ? (
          <div className="tip-box">
            <p>{config?.support_tip}</p>
            <button type="button" className="accent-btn" onClick={() => setShowForm(true)}>
              Yes – Submit Request
            </button>
          </div>
        ) : null}
      </article>

      {showForm ? (
        <article className="card">
          <h2>Support Ticket Form</h2>
          <form className="ticket-form" onSubmit={handleSubmit}>
            <label>
              <span>User UID</span>
              <input
                value={form.user_uid}
                onChange={(event) => setForm((prev) => ({ ...prev, user_uid: event.target.value }))}
                required
              />
            </label>
            <label>
              <span>Email Address</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
            </label>
            <label>
              <span>Order ID</span>
              <input
                value={form.order_id}
                onChange={(event) => setForm((prev) => ({ ...prev, order_id: event.target.value }))}
              />
            </label>
            <label>
              <span>Subject</span>
              <input
                value={form.subject}
                onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                required
              />
            </label>
            <label className="col-span-2">
              <span>Description</span>
              <textarea
                rows={5}
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                required
              />
            </label>
            <label className="col-span-2">
              <span>Attachments (PDF, PNG, JPG, JPEG, MP4)</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.mp4"
                multiple
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    attachments: extractFileNames(event.target.files)
                  }))
                }
              />
            </label>
            <button type="submit" className="accent-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Case'}
            </button>
          </form>
        </article>
      ) : null}

      {result ? (
        <article className={`card ${result.error ? 'status-error' : 'status-success'}`}>
          {result.error ? (
            <p>{result.message}</p>
          ) : (
            <p>
              Support ticket created successfully. Ticket ID: <strong>{result.ticket_code}</strong>
            </p>
          )}
        </article>
      ) : null}
    </section>
  );
}

