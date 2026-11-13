import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { sendError } from '../utils/response.js';

// In-memory buffer storage to prevent writing unencrypted files to disk
const storage = multer.memoryStorage();

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP images are supported.'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_IMAGE_SIZE_MB * 1024 * 1024,
  },
  fileFilter,
});

/**
 * Validates magic numbers (file signature) of the image buffer
 */
export function validateImageSignature(req: Request, res: Response, next: NextFunction): void {
  if (!req.file || !req.file.buffer) {
    next();
    return;
  }

  const buf = req.file.buffer;
  if (buf.length < 4) {
    sendError(res, 'Uploaded image buffer is too small or corrupted.', 400, 'INVALID_IMAGE');
    return;
  }

  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  const isWebp =
    buf.length >= 12 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50;

  if (!isJpeg && !isPng && !isWebp) {
    sendError(res, 'File signature check failed. File is not a valid JPEG, PNG, or WEBP image.', 400, 'INVALID_FILE_SIGNATURE');
    return;
  }

  next();
}

export const uploadSingleImage = upload.single('image');
