import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import { connectDB, getDBStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import firewallRoutes from './routes/firewallRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import policyRoutes from './routes/policyRoutes.js';

const app = express();

// Security & Parsing Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible integration in dev/testing
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Health Check & System Status Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'AegisAI Enterprise Security Gateway',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    database: getDBStatus(),
    geminiConfigured: !!config.geminiApiKey,
  });
});

// Mount Core API Routes
app.use('/api/auth', authRoutes);
app.use('/api/firewall', firewallRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/policy', policyRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error in AegisAI Gateway',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// Start Server & Connect to DB
const startServer = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`=======================================================`);
    console.log(`🛡️  AegisAI Enterprise Security Gateway is Online!`);
    console.log(`📡 Port: ${config.port}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`🧠 Gemini AI: ${config.geminiApiKey ? 'Configured (Live API Mode)' : 'Heuristic Mode (Add GEMINI_API_KEY for live LLM)'}`);
    console.log(`🚀 API Base URL: http://localhost:${config.port}/api`);
    console.log(`=======================================================`);
  });
};

startServer();

export default app;
