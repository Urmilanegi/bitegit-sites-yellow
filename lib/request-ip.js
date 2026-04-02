function normalizeIpValue(value) {
  let normalized = String(value || '').trim();
  if (!normalized) {
    return '';
  }

  if (normalized.includes(',')) {
    normalized = normalized.split(',')[0].trim();
  }

  if (normalized.startsWith('::ffff:')) {
    normalized = normalized.slice(7);
  }

  if (normalized.startsWith('[') && normalized.endsWith(']')) {
    normalized = normalized.slice(1, -1);
  }

  return normalized.trim();
}

function getRequestIp(req) {
  const candidates = [
    req?.headers?.['cf-connecting-ip'],
    req?.headers?.['x-real-ip'],
    req?.headers?.['x-forwarded-for'],
    req?.ip,
    req?.connection?.remoteAddress,
    req?.socket?.remoteAddress
  ];

  for (const candidate of candidates) {
    const normalized = normalizeIpValue(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return 'unknown';
}

module.exports = {
  getRequestIp,
  normalizeIpValue
};
