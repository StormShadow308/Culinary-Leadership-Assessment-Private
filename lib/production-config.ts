// Production configuration and optimizations

export const PRODUCTION_CONFIG = {
  // Database connection pool settings
  DATABASE: {
    MAX_CONNECTIONS: 20,
    MIN_CONNECTIONS: 5,
    IDLE_TIMEOUT: 30000,
    CONNECTION_TIMEOUT: 2000,
    ACQUIRE_TIMEOUT: 60000,
  },

  // Rate limiting settings
  RATE_LIMITS: {
    AUTH: { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 requests per 15 minutes
    API: { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
    ASSESSMENT: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 requests per minute
    DASHBOARD: { maxRequests: 50, windowMs: 5 * 60 * 1000 }, // 50 requests per 5 minutes
    REPORTS: { maxRequests: 20, windowMs: 5 * 60 * 1000 }, // 20 requests per 5 minutes
  },

  // Cache settings
  CACHE: {
    USER_MEMBERSHIP_TTL: 5 * 60 * 1000, // 5 minutes
    ORGANIZATION_DATA_TTL: 10 * 60 * 1000, // 10 minutes
    PARTICIPANTS_TTL: 2 * 60 * 1000, // 2 minutes
    STATS_TTL: 1 * 60 * 1000, // 1 minute
    CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
  },

  // Query optimization settings
  QUERY: {
    BATCH_SIZE: 100, // Batch size for large queries
    MAX_PARTICIPANTS_PER_QUERY: 1000, // Maximum participants per query
    PARALLEL_QUERIES: 5, // Maximum parallel queries
  },

  // Security settings
  SECURITY: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    PASSWORD_MIN_LENGTH: 8,
    REQUIRE_EMAIL_VERIFICATION: true,
  },

  // Performance monitoring
  MONITORING: {
    SLOW_QUERY_THRESHOLD: 1000, // 1 second
    MEMORY_USAGE_THRESHOLD: 0.8, // 80% of available memory
    CPU_USAGE_THRESHOLD: 0.8, // 80% of available CPU
  },
} as const;

// Environment-specific configurations
export function getConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    ...PRODUCTION_CONFIG,
    // Override for development
    ...(isDevelopment && {
      DATABASE: {
        ...PRODUCTION_CONFIG.DATABASE,
        MAX_CONNECTIONS: 5,
        MIN_CONNECTIONS: 1,
      },
      RATE_LIMITS: {
        ...PRODUCTION_CONFIG.RATE_LIMITS,
        AUTH: { maxRequests: 100, windowMs: 15 * 60 * 1000 },
        API: { maxRequests: 1000, windowMs: 15 * 60 * 1000 },
      },
    }),
    // Override for production
    ...(isProduction && {
      SECURITY: {
        ...PRODUCTION_CONFIG.SECURITY,
        REQUIRE_EMAIL_VERIFICATION: true,
      },
    }),
  };
}

// Health check configuration
export const HEALTH_CHECK = {
  DATABASE_TIMEOUT: 5000, // 5 seconds
  CACHE_TIMEOUT: 1000, // 1 second
  EXTERNAL_SERVICES_TIMEOUT: 10000, // 10 seconds
} as const;

// Error handling configuration
export const ERROR_HANDLING = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  CIRCUIT_BREAKER_THRESHOLD: 5,
  CIRCUIT_BREAKER_TIMEOUT: 60000, // 1 minute
} as const;
