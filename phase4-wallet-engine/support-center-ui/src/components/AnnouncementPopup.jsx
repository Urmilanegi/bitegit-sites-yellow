import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'support_center_announcement_snooze_until';

export default function AnnouncementPopup({ announcements }) {
  const [dismissForDay, setDismissForDay] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const latest = useMemo(() => (Array.isArray(announcements) && announcements.length ? announcements[0] : null), [announcements]);

  useEffect(() => {
    if (!latest) {
      setIsOpen(false);
      return;
    }

    const snoozeUntil = Number(localStorage.getItem(STORAGE_KEY) || 0);
    const isSnoozed = Number.isFinite(snoozeUntil) && snoozeUntil > Date.now();
    setIsOpen(!isSnoozed);
  }, [latest]);

  if (!isOpen || !latest) {
    return null;
  }

  return (
    <div className="popup-backdrop">
      <div className="popup-card">
        <h3>{latest.title || 'Announcement'}</h3>
        <p>{latest.message}</p>

        <label className="popup-check">
          <input
            type="checkbox"
            checked={dismissForDay}
            onChange={(event) => setDismissForDay(Boolean(event.target.checked))}
          />
          <span>Don't show again for 24 hours</span>
        </label>

        <button
          type="button"
          className="accent-btn"
          onClick={() => {
            if (dismissForDay) {
              localStorage.setItem(STORAGE_KEY, String(Date.now() + 24 * 60 * 60 * 1000));
            }
            setIsOpen(false);
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

