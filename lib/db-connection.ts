import { db } from '~/db';
import { sql } from 'drizzle-orm';

// Database connection status
let isConnected = true;
let lastConnectionCheck = 0;
const CONNECTION_CHECK_INTERVAL = 30000; // 30 seconds

// Connection timeout in milliseconds
const CONNECTION_TIMEOUT = 5000;

/**
 * Check if the database is currently connected and healthy
 */
export async function isDatabaseConnected(): Promise<boolean> {
  const now = Date.now();
  
  // Return cached result if checked recently
  if (now - lastConnectionCheck < CONNECTION_CHECK_INTERVAL) {
    return isConnected;
  }
  
  try {
    // Test connection with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), CONNECTION_TIMEOUT);
    });
    
    await Promise.race([
      db.execute(sql`SELECT 1`),
      timeoutPromise
    ]);
    
    isConnected = true;
    lastConnectionCheck = now;
    return true;
  } catch (error) {
    console.warn('Database connection check failed:', error);
    isConnected = false;
    lastConnectionCheck = now;
    return false;
  }
}

/**
 * Execute a database query with connection health check and timeout
 */
export async function executeWithHealthCheck<T>(
  queryFn: () => Promise<T>,
  fallbackValue?: T
): Promise<T | undefined> {
  try {
    // Check connection health first
    const isHealthy = await isDatabaseConnected();
    
    if (!isHealthy) {
      console.warn('Database is not healthy, skipping query');
      return fallbackValue;
    }
    
    // Execute query with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Query timeout')), CONNECTION_TIMEOUT);
    });
    
    return await Promise.race([
      queryFn(),
      timeoutPromise
    ]) as T;
  } catch (error) {
    console.warn('Database query failed:', error);
    isConnected = false;
    return fallbackValue;
  }
}

/**
 * Get database connection status
 */
export function getConnectionStatus(): boolean {
  return isConnected;
}

/**
 * Reset connection status (useful for testing or manual recovery)
 */
export function resetConnectionStatus(): void {
  isConnected = true;
  lastConnectionCheck = 0;
}
