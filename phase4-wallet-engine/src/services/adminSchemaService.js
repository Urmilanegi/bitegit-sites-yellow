import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const tableSchemaCache = new Map();

const normalizeName = (value) => String(value || '').trim().toLowerCase();

export const getTableSchema = async (tableName) => {
  const normalized = normalizeName(tableName);
  if (!normalized) {
    return null;
  }

  if (tableSchemaCache.has(normalized)) {
    return tableSchemaCache.get(normalized);
  }

  try {
    const schema = await sequelize.getQueryInterface().describeTable(normalized);
    tableSchemaCache.set(normalized, schema);
    return schema;
  } catch {
    tableSchemaCache.set(normalized, null);
    return null;
  }
};

export const hasTable = async (tableName) => {
  const schema = await getTableSchema(tableName);
  return Boolean(schema);
};

export const hasColumn = async (tableName, columnName) => {
  const schema = await getTableSchema(tableName);
  if (!schema) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(schema, columnName);
};

export const querySingleNumber = async (sql, replacements = {}, defaultValue = 0, transaction = null) => {
  try {
    const rows = await sequelize.query(sql, {
      replacements,
      type: QueryTypes.SELECT,
      transaction: transaction || undefined
    });
    const first = rows?.[0] || null;
    if (!first || typeof first !== 'object') {
      return defaultValue;
    }
    const value = Number(Object.values(first)[0]);
    return Number.isFinite(value) ? value : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const queryRows = async (sql, replacements = {}, transaction = null) => {
  return sequelize.query(sql, {
    replacements,
    type: QueryTypes.SELECT,
    transaction: transaction || undefined
  });
};
