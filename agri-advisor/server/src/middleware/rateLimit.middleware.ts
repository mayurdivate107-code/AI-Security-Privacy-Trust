import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { sendError } from '../utils/response.js';

export const standardRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, 'Too many requests. Please slow down and try again later.', 429, 'RATE_LIMIT_EXCEEDED');
  },
});

export const aiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AI_RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Key by authenticated user ID if available, otherwise by IP
    return (req as any).user?.id || req.ip || 'anonymous';
  },
  handler: (req, res) => {
    sendError(
      res,
      'AI consultation rate limit exceeded. Please wait a few minutes before submitting another advisory request.',
      429,
      'AI_RATE_LIMIT_EXCEEDED'
    );
  },
});
