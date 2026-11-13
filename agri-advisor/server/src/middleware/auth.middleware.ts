import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { supabaseAdmin } from '../config/supabase.js';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authentication required. Missing or malformed Bearer token.', 401, 'UNAUTHORIZED');
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      logger.warn({ error }, 'Invalid or expired Supabase authentication token');
      sendError(res, 'Invalid or expired authentication session', 401, 'UNAUTHORIZED');
      return;
    }

    req.user = {
      id: user.id,
      email: user.email || '',
      role: (user.user_metadata?.role as string) || 'farmer',
    };

    next();
  } catch (err: any) {
    logger.error({ err }, 'Error during JWT verification');
    sendError(res, 'Internal authentication verification error', 500, 'AUTH_ERROR');
  }
}
