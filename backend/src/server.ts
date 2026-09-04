import { Server } from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

let server: Server;

const startServer = async (): Promise<void> => {
  try {
    // 1. Database connection
    console.log('⏳ Connecting to database...');
    await connectDatabase();

    // 2. Create Express app
    const app = createApp();
    const PORT = env.PORT;

    // 3. Start HTTP server
    server = app.listen(PORT, () => {
      console.log(`🚀 Flowmetrics API Server running on port ${PORT} [${env.NODE_ENV}]`);
      console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('💥 Fatal error during server startup: Failed to establish database connection.');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

const handleShutdown = async (signal: string): Promise<void> => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      await disconnectDatabase();
      console.log('Exiting process.');
      process.exit(0);
    });
  } else {
    await disconnectDatabase();
    process.exit(0);
  }
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

startServer();
