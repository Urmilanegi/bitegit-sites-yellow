# Bitegit Disaster Recovery

This repo now keeps a practical disaster-recovery drill in GitHub Actions and stores a source backup artifact on every drill run.

## What is automated

- Production and staging health checks must pass before the drill is marked healthy.
- A git bundle source backup is generated and uploaded as a GitHub Actions artifact.
- The drill resolves the current production commit and the immediate rollback target from git history.
- A markdown report is written for every run and attached to the workflow summary.
- A GitHub issue is opened on drill failure and auto-closed when the drill recovers.

## Files

- Workflow: `.github/workflows/disaster-recovery-drill.yml`
- Drill runner: `scripts/run-dr-drill.js`
- Source backup helper: `scripts/create-source-backup.js`
- Shared helper logic: `scripts/lib/disaster-recovery.js`

## Manual provider backups

The repo can verify rollback readiness by itself, but database snapshot ownership still sits with infrastructure providers:

- MongoDB: keep provider snapshots/export enabled and record the latest restore point before risky deploys.
- MySQL: keep Render/provider snapshot or export enabled and verify restore credentials outside the app repo.
- Redis: current usage is queue + lock state only, so a cold restart is the recovery path.

If you later want GitHub-driven database exports, add these secrets:

- `BACKUP_MONGODB_URI`
- `BACKUP_MONGODB_DB_NAME`
- `BACKUP_MYSQL_HOST`
- `BACKUP_MYSQL_DATABASE`
- `BACKUP_MYSQL_USER`
- `BACKUP_MYSQL_PASSWORD`

## Manual rollback drill

1. Open the latest disaster-recovery workflow report and copy the recommended rollback commit.
2. Confirm current prod health on `https://www.bitegit.com/api/health`.
3. Redeploy production web and worker services to the rollback commit.
4. Verify `https://www.bitegit.com/api/health`, `https://www.bitegit.com/healthz`, and `https://www.bitegit.com/status`.
5. Keep staging on the broken commit for debugging until prod is stable.
