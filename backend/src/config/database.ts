import mongoose from 'mongoose';
import { env } from './env.js';
import { DatabaseConnectionStatus } from '../types/api.js';

/**
 * Connect to MongoDB using Mongoose.
 * Reuses existing connection if already established.
 * Avoids creating multiple redundant connections.
 */
export const connectDatabase = async (): Promise<typeof mongoose> => {
  // 1 = connected
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // 2 = connecting
  if (mongoose.connection.readyState === 2) {
    console.log('⏳ MongoDB connection is currently in progress...');
    await new Promise((resolve) => mongoose.connection.once('open', resolve));
    return mongoose;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging indefinitely
    });

    const host = conn.connection.host || 'unknown';
    const dbName = conn.connection.name || 'unknown';
    console.log(`🌿 MongoDB connected successfully: host=${host}, db=${dbName}`);
    return conn;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error instanceof Error ? error.message : error);
    throw error;
  }
};

/**
 * Disconnect from MongoDB.
 * Used for graceful shutdown.
 */
export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('🌿 MongoDB disconnected successfully');
  }
};

/**
 * Get current database connection status without leaking credentials or internals.
 */
export const getDatabaseStatus = (): DatabaseConnectionStatus => {
  switch (mongoose.connection.readyState) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
};
