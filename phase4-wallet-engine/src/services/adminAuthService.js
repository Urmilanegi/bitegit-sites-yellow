import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Admin, AdminRole } from '../models/index.js';
import { AppError } from '../utils/appError.js';

const DEFAULT_ADMIN_ROLES = ['super_admin', 'finance_admin', 'support_admin'];

const getAdminJwtSecret = () => String(process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || '').trim();

const getTokenExpiry = () => String(process.env.ADMIN_JWT_EXPIRES_IN || '8h').trim();

const signAdminToken = (admin) => {
  const secret = getAdminJwtSecret();
  if (!secret) {
    throw new AppError('Missing ADMIN_JWT_SECRET/JWT_SECRET', 500);
  }

  return jwt.sign(
    {
      admin_id: admin.id,
      email: admin.email,
      role: admin.role_name,
      scope: 'admin'
    },
    secret,
    { expiresIn: getTokenExpiry() }
  );
};

export const verifyAdminToken = (token) => {
  const secret = getAdminJwtSecret();
  if (!secret) {
    throw new AppError('Missing ADMIN_JWT_SECRET/JWT_SECRET', 500);
  }

  return jwt.verify(token, secret);
};

export const ensureAdminRoles = async (transaction = null) => {
  for (const roleName of DEFAULT_ADMIN_ROLES) {
    await AdminRole.findOrCreate({
      where: { role_name: roleName },
      defaults: { role_name: roleName },
      ...(transaction ? { transaction } : {})
    });
  }
};

const ensureBootstrapAdmin = async (transaction = null) => {
  const adminEmail = String(process.env.ADMIN_BOOTSTRAP_EMAIL || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const adminPassword = String(process.env.ADMIN_BOOTSTRAP_PASSWORD || process.env.ADMIN_PASSWORD || '').trim();

  if (!adminEmail || !adminPassword) {
    return null;
  }

  const existing = await Admin.findOne({
    where: { email: adminEmail },
    ...(transaction ? { transaction } : {})
  });
  if (existing) {
    return existing;
  }

  const role = await AdminRole.findOne({
    where: { role_name: 'super_admin' },
    ...(transaction ? { transaction } : {})
  });
  if (!role) {
    return null;
  }

  const hash = await bcrypt.hash(adminPassword, 10);
  return Admin.create(
    {
      email: adminEmail,
      password_hash: hash,
      role_id: role.id,
      is_active: true
    },
    transaction ? { transaction } : undefined
  );
};

export const bootstrapAdminAuth = async () => {
  return sequelize.transaction(async (transaction) => {
    await ensureAdminRoles(transaction);
    await ensureBootstrapAdmin(transaction);
    return true;
  });
};

export const adminLogin = async (email, password) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const rawPassword = String(password || '');

  if (!normalizedEmail || !rawPassword) {
    throw new AppError('email and password are required', 422);
  }

  await bootstrapAdminAuth();

  const admin = await Admin.findOne({
    where: { email: normalizedEmail },
    include: [{ model: AdminRole, attributes: ['id', 'role_name'] }]
  });

  if (!admin) {
    throw new AppError('Invalid admin credentials', 401);
  }

  if (!admin.is_active) {
    throw new AppError('Admin account is inactive', 403);
  }

  const isValid = await bcrypt.compare(rawPassword, admin.password_hash);
  if (!isValid) {
    throw new AppError('Invalid admin credentials', 401);
  }

  const roleName = String(admin.AdminRole?.role_name || '').trim();
  if (!roleName) {
    throw new AppError('Admin role is not configured', 500);
  }

  const token = signAdminToken({
    id: admin.id,
    email: admin.email,
    role_name: roleName
  });

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      role_name: roleName,
      is_active: admin.is_active
    }
  };
};

export const getAdminByPayload = async (payload) => {
  const adminId = Number.parseInt(String(payload?.admin_id || 0), 10);
  if (!Number.isInteger(adminId) || adminId <= 0) {
    throw new AppError('Invalid admin token payload', 401);
  }

  const admin = await Admin.findOne({
    where: {
      id: adminId,
      is_active: true,
      email: payload.email
    },
    include: [{ model: AdminRole, attributes: ['id', 'role_name'] }]
  });

  if (!admin) {
    throw new AppError('Admin account not found or inactive', 401);
  }

  return {
    id: admin.id,
    email: admin.email,
    role_name: String(admin.AdminRole?.role_name || '').trim()
  };
};

export const listAdmins = async () => {
  const admins = await Admin.findAll({
    where: {
      role_id: {
        [Op.ne]: null
      }
    },
    include: [{ model: AdminRole, attributes: ['role_name'] }],
    order: [['id', 'ASC']]
  });

  return admins.map((admin) => ({
    id: admin.id,
    email: admin.email,
    role_name: admin.AdminRole?.role_name || null,
    is_active: Boolean(admin.is_active),
    created_at: admin.created_at
  }));
};
