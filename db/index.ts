import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create connection pool for production scalability
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Production-ready connection pool settings optimized for Render
  max: parseInt(process.env.DB_POOL_MAX || '10'), // Maximum number of connections in the pool (reduced for Render free tier)
  min: parseInt(process.env.DB_POOL_MIN || '2'),  // Minimum number of connections in the pool
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '60000'), // Close idle connections after 60 seconds (increased)
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'), // Return error after 5 seconds (increased for Render)
  // Enable SSL in production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Additional settings for better connection management
  allowExitOnIdle: false, // Keep the pool alive even when idle
  keepAlive: true, // Enable TCP keep-alive
  keepAliveInitialDelayMillis: 10000, // Start keep-alive after 10 seconds
});

// Handle pool errors with better logging
pool.on('error', (err: any) => {
  console.error('Database pool error:', {
    message: err.message,
    code: err.code || 'UNKNOWN',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
  
  // Don't exit in production, let the app handle it gracefully
  if (process.env.NODE_ENV !== 'production') {
    process.exit(-1);
  }
});

// Test connection on startup (only log in development to reduce noise)
pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Database connection established');
  }
});

pool.on('remove', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Database connection removed from pool');
  }
});

export const db = drizzle(pool);
