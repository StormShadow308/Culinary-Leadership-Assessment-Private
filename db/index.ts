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
  // Production-ready connection pool settings
  max: parseInt(process.env.DB_POOL_MAX || '20'), // Maximum number of connections in the pool
  min: parseInt(process.env.DB_POOL_MIN || '5'),  // Minimum number of connections in the pool
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'), // Close idle connections after 30 seconds
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'), // Return error after 2 seconds if connection could not be established
  // Enable SSL in production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Handle pool errors with better logging
pool.on('error', (err) => {
  console.error('Database pool error:', {
    message: err.message,
    code: err.code,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
  
  // Don't exit in production, let the app handle it gracefully
  if (process.env.NODE_ENV !== 'production') {
    process.exit(-1);
  }
});

// Test connection on startup
pool.on('connect', () => {
  console.log('Database connection established');
});

pool.on('remove', () => {
  console.log('Database connection removed from pool');
});

export const db = drizzle(pool);
