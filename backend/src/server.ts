import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();
const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`🚀 Flowmetrics API Server running on port ${PORT} [${env.NODE_ENV}]`);
  console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
});

const handleShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
