import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${config.mongoUri}: ${error.message}`);
    console.warn('[Database Warning] Running in offline/graceful mode. Ensure MongoDB is running locally or MONGODB_URI is set in server/.env');
  }
};

export const getDBStatus = () => ({
  isConnected,
  uri: config.mongoUri ? config.mongoUri.replace(/:([^:@]+)@/, ':****@') : 'none',
});
