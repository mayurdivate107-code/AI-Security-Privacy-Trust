import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info(`🌾 AgriAdvisor Backend Server listening on port ${env.PORT} in [${env.NODE_ENV}] mode`);
  logger.info(`🚀 API Base URL: http://localhost:${env.PORT}/api/v1`);
  logger.info(`📡 Health Check: http://localhost:${env.PORT}/api/v1/health`);
});

// Graceful shutdown handlers
const shutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
