import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './core/logging/logger.js';

const app = createApp();

const PORT = Number(env.PORT) || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT} [${env.NODE_ENV}]`);
});

const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down server gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
