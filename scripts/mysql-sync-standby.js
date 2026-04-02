const mysql = require('mysql2/promise');
const { resolveMySqlHosts } = require('../lib/mysql-hosts');

function escapeIdentifier(value) {
  return `\`${String(value || '').replace(/`/g, '``')}\``;
}

function normalizePort(value, fallback = 3306) {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildInsertStatement(tableName, rows) {
  const columns = Object.keys(rows[0] || {});
  const columnSql = columns.map((column) => escapeIdentifier(column)).join(', ');
  const valuesSql = rows.map(() => `(${columns.map(() => '?').join(', ')})`).join(', ');
  const params = [];

  for (const row of rows) {
    for (const column of columns) {
      params.push(row[column]);
    }
  }

  return {
    sql: `INSERT INTO ${escapeIdentifier(tableName)} (${columnSql}) VALUES ${valuesSql}`,
    params
  };
}

async function listBaseTables(connection) {
  const [rows] = await connection.query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
  return rows.map((row) => String(Object.values(row)[0] || '').trim()).filter(Boolean);
}

async function listViews(connection) {
  const [rows] = await connection.query("SHOW FULL TABLES WHERE Table_type = 'VIEW'");
  return rows.map((row) => String(Object.values(row)[0] || '').trim()).filter(Boolean);
}

async function getCreateStatement(connection, objectType, name) {
  const query = objectType === 'VIEW'
    ? `SHOW CREATE VIEW ${escapeIdentifier(name)}`
    : `SHOW CREATE TABLE ${escapeIdentifier(name)}`;
  const [rows] = await connection.query(query);
  const row = rows[0] || {};
  return String(row['Create View'] || row['Create Table'] || '').trim();
}

async function rebuildTargetSchema({ source, target, tables, views }) {
  await target.query('SET FOREIGN_KEY_CHECKS = 0');

  const existingViews = await listViews(target);
  for (const viewName of existingViews.reverse()) {
    await target.query(`DROP VIEW IF EXISTS ${escapeIdentifier(viewName)}`);
  }

  const existingTables = await listBaseTables(target);
  for (const tableName of existingTables.reverse()) {
    await target.query(`DROP TABLE IF EXISTS ${escapeIdentifier(tableName)}`);
  }

  for (const tableName of tables) {
    const createTableSql = await getCreateStatement(source, 'TABLE', tableName);
    await target.query(createTableSql);
  }

  for (const viewName of views) {
    const createViewSql = await getCreateStatement(source, 'VIEW', viewName);
    await target.query(createViewSql);
  }

  await target.query('SET FOREIGN_KEY_CHECKS = 1');
}

async function copyTableRows({ source, target, tableName }) {
  const [rows] = await source.query(`SELECT * FROM ${escapeIdentifier(tableName)}`);
  if (!rows.length) {
    return 0;
  }

  const { sql, params } = buildInsertStatement(tableName, rows);
  await target.query(sql, params);
  return rows.length;
}

async function main() {
  const mysqlHosts = resolveMySqlHosts(
    process.env.MYSQL_SOURCE_HOSTS,
    process.env.MYSQL_HOSTS,
    process.env.MYSQL_SOURCE_HOST,
    process.env.MYSQL_HOST
  );
  const sourceHost = String(process.env.MYSQL_SOURCE_HOST || mysqlHosts[0] || '').trim();
  const targetHost = String(process.env.MYSQL_TARGET_HOST || process.env.MYSQL_STANDBY_HOST || mysqlHosts[1] || '').trim();
  const port = normalizePort(process.env.MYSQL_SOURCE_PORT || process.env.MYSQL_PORT, 3306);
  const targetPort = normalizePort(process.env.MYSQL_TARGET_PORT || process.env.MYSQL_PORT, port);
  const user = String(process.env.MYSQL_SOURCE_USER || process.env.MYSQL_USER || '').trim();
  const password = String(process.env.MYSQL_SOURCE_PASSWORD || process.env.MYSQL_PASSWORD || '').trim();
  const database = String(process.env.MYSQL_SOURCE_DATABASE || process.env.MYSQL_DATABASE || '').trim();

  if (!sourceHost || !targetHost || !user || !database) {
    throw new Error('Missing required MySQL sync configuration');
  }
  if (sourceHost === targetHost) {
    throw new Error('Source and target MySQL hosts must be different');
  }

  console.log(`[mysql-sync] source=${sourceHost}:${port} target=${targetHost}:${targetPort} database=${database}`);

  const source = await mysql.createConnection({
    host: sourceHost,
    port,
    user,
    password,
    database
  });
  const target = await mysql.createConnection({
    host: targetHost,
    port: targetPort,
    user,
    password,
    database
  });

  try {
    await source.query('SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ');
    await source.beginTransaction();

    const tables = await listBaseTables(source);
    const views = await listViews(source);

    console.log(`[mysql-sync] rebuilding target schema (${tables.length} tables, ${views.length} views)`);
    await rebuildTargetSchema({ source, target, tables, views });

    let copiedRows = 0;
    for (const tableName of tables) {
      const inserted = await copyTableRows({ source, target, tableName });
      copiedRows += inserted;
      console.log(`[mysql-sync] copied ${inserted} rows from ${tableName}`);
    }

    await source.commit();
    console.log(`[mysql-sync] complete: ${tables.length} tables, ${views.length} views, ${copiedRows} rows copied`);
  } catch (error) {
    try {
      await source.rollback();
    } catch (_) {
      // Ignore rollback failures after source sync errors.
    }
    throw error;
  } finally {
    await Promise.allSettled([source.end(), target.end()]);
  }
}

main().catch((error) => {
  console.error(`[mysql-sync] failed: ${String(error && error.stack ? error.stack : error)}`);
  process.exitCode = 1;
});
