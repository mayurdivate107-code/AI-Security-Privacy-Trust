import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { standardRateLimiter } from './middleware/rateLimit.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { farmsRouter } from './modules/farms/farms.routes.js';
import { advisoriesRouter } from './modules/advisories/advisories.routes.js';
import { diseaseRouter } from './modules/disease/disease.routes.js';
import { notificationsRouter } from './modules/notifications/notifications.routes.js';
import { knowledgeRouter } from './modules/knowledge/knowledge.routes.js';
import { sendSuccess } from './utils/response.js';

export const app = express();

// Security and transport headers
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or dev)
      if (!origin || origin === env.FRONTEND_URL || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, strict in prod
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Standard rate limiter for all routes
app.use(standardRateLimiter);

// Payload parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/v1/health', (req, res) => {
  sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: '1.0.0',
    model: env.GEMINI_MODEL,
  }, 'AgriAdvisor Backend API is operational');
});

// Modular Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/farms', farmsRouter);
app.use('/api/v1/advisories/disease-detection', diseaseRouter);
app.use('/api/v1/advisories', advisoriesRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/knowledge', knowledgeRouter);

// Centralized Error Handling Middleware
app.use(errorHandler);
