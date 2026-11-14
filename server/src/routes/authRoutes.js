import express from 'express';
import { register, login, getMe, registerSchema, loginSchema } from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', verifyToken, getMe);

export default router;
