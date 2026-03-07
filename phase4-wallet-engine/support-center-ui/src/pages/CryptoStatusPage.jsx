import { useMemo, useState } from 'react';

const statusClass = (status) => {
  if (status === 'available') {
    return 'pill-success';
  }
  if (status === 'suspended') {
    return 'pill-danger';
  }
  return 'pill-warning';
};

export default function CryptoStatusPage({ coins, filters, onChangeFilters }) {
  const [expanded, setExpanded] = useState({});

  const rows = useMemo(() => (Array.isArray(coins) ? coins : []), [coins]);

  return (
    <section className="page-main">
      <article className="card">
        <h1>Crypto Deposit and Withdrawal Status</h1>

        <div className="search-row">
          <input
            value={filters.search}
            onChange={(event) => onChangeFilters((prev) => ({ ...prev, search: event.target.value }))}
            placeholder="Search coin by symbol or name"
          />
          <label className="inline-check">
            <input
              type="checkbox"
              checked={filters.hideSuspended}
              onChange={(event) => onChangeFilters((prev) => ({ ...prev, hideSuspended: event.target.checked }))}
            />
            <span>Hide coins with suspended deposits</span>
          </label>
          <label className="inline-check">
            <input
              type="checkbox"
              checked={filters.onlySuspended}
              onChange={(event) => onChangeFilters((prev) => ({ ...prev, onlySuspended: event.target.checked }))}
            />
            <span>Show only coins with suspended deposits</span>
          </label>
        </div>
      </article>

      <div className="status-list">
        {rows.map((coin) => (
          <article key={coin.symbol} className="card status-card">
            <button
              type="button"
              className="status-toggle"
              onClick={() =>
                setExpanded((prev) => ({
                  ...prev,
                  [coin.symbol]: !prev[coin.symbol]
                }))
              }
            >
              <div>
                <h3>
                  {coin.symbol} <span>{coin.name}</span>
                </h3>
              </div>
              <span>{expanded[coin.symbol] ? '−' : '+'}</span>
            </button>

            {expanded[coin.symbol] ? (
              <div className="network-table-wrap">
                <table className="network-table">
                  <thead>
                    <tr>
                      <th>Network</th>
                      <th>Deposit</th>
                      <th>Withdrawal</th>
                      <th>Maintenance Alerts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(coin.networks || []).map((network) => (
                      <tr key={`${coin.symbol}-${network.network}`}>
                        <td>{network.network}</td>
                        <td>
                          <span className={`pill ${statusClass(network.deposit_status)}`}>{network.deposit_status}</span>
                        </td>
                        <td>
                          <span className={`pill ${statusClass(network.withdraw_status)}`}>{network.withdraw_status}</span>
                        </td>
                        <td>{network.deposit_alert || network.withdraw_alert || 'No active alert'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

