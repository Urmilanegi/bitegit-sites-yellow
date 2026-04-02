function splitHosts(rawValue) {
  return String(rawValue || '')
    .split(',')
    .map((entry) => String(entry || '').trim())
    .filter(Boolean);
}

function resolveMySqlHosts(...values) {
  const hosts = [];
  const seen = new Set();

  for (const value of values) {
    for (const host of splitHosts(value)) {
      const normalized = host.toLowerCase();
      if (seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      hosts.push(host);
    }
  }

  return hosts;
}

module.exports = {
  resolveMySqlHosts
};
