module.exports = {
  apps: [
    {
      name: 'bitegit-app',
      script: 'server.js',
      exec_mode: 'fork',
      instances: 1,

      // Auto-restart on crash
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 3000,

      // Auto-restart if memory leaks
      max_memory_restart: '450M',

      // Don't watch files (prod)
      watch: false,

      // Logs
      error_file: './logs/pm2-error.log',
      out_file:   './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,

      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 5000,
      },
    },
  ],
};
