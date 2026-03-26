// index.js — thin entry-point wrapper
// server.js checks require.main === module before calling boot(), so
// requiring it here does NOT start the server a second time.
// boot() is called explicitly below exactly once.

const { boot } = require('./server');

boot().catch((err) => {
  console.error('[index.js] Startup error:', err?.message || err);
  process.exit(1);
});
