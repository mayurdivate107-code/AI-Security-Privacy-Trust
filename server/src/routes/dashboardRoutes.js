import express from 'express';
import { getStats, getLogs, getLogById } from '../controllers/dashboardController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', optionalAuth, getStats);
router.get('/logs', optionalAuth, getLogs);
router.get('/logs/:id', optionalAuth, getLogById);

export default router;
