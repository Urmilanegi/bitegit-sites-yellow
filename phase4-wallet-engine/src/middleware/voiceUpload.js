import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { AppError } from '../utils/appError.js';

const VOICE_UPLOAD_DIR = path.resolve(process.cwd(), 'uploads', 'support_voice');
const MAX_VOICE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['.mp3', '.wav', '.ogg']);

fs.mkdirSync(VOICE_UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, VOICE_UPLOAD_DIR);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(String(file.originalname || '').toLowerCase());
    callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  }
});

const fileFilter = (req, file, callback) => {
  const extension = path.extname(String(file.originalname || '').toLowerCase());

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    callback(new AppError('Only mp3, wav, and ogg voice files are allowed', 422));
    return;
  }

  callback(null, true);
};

export const uploadSupportVoice = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_VOICE_SIZE_BYTES
  }
});

export const handleVoiceUpload = (fieldName = 'voice') => (req, res, next) => {
  uploadSupportVoice.single(fieldName)(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof AppError) {
      return next(error);
    }

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('Voice message size must be 5MB or less', 413));
    }

    return next(new AppError('Voice upload failed', 422));
  });
};
