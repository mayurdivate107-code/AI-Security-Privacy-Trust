import express from 'express';
import { analyzeAndChat, analyzeChatSchema } from '../controllers/firewallController.js';
import { validateBody } from '../middleware/validate.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public / Authenticated Playground Firewall Route
router.post('/analyze-and-chat', optionalAuth, validateBody(analyzeChatSchema), analyzeAndChat);

export default router;
