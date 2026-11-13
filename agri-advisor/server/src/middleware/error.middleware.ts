import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/response.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  logger.error({ err, path: req.path, method: req.method }, 'Unhandled API error encountered');

  if (err instanceof ZodError) {
    sendError(
      res,
      'Validation failed for input data',
      400,
      'VALIDATION_ERROR',
      err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }))
    );
    return;
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      sendError(res, 'Uploaded image exceeds maximum allowed size (8MB).', 400, 'FILE_TOO_LARGE');
      return;
    }
    sendError(res, err.message, 400, 'UPLOAD_ERROR');
    return;
  }

  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const message = err.message || 'An unexpected internal server error occurred';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  sendError(res, message, statusCode, code);
}
