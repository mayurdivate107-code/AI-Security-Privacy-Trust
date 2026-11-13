import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

export const authRouter = Router();

authRouter.get('/me', requireAuth, AuthController.getProfile);
authRouter.patch('/profile', requireAuth, AuthController.updateProfile);
