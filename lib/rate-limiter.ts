import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

export class RateLimiter {
  private static limits = new Map<string, RateLimitEntry>();
  private static readonly CLEANUP_INTERVAL = 60 * 1000; // 1 minute
  private static readonly DEFAULT_CONFIG: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per window
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  };

  // Different rate limits for different user types
  private static readonly RATE_LIMITS = {
    admin: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 1000, // 1000 requests per window
    },
    organization: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 500, // 500 requests per window
    },
    student: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // 100 requests per window
    },
    anonymous: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 20, // 20 requests per window
    }
  };

  /**
   * Check if request is within rate limit
   */
  static async checkRateLimit(
    request: NextRequest,
    userRole: string = 'anonymous',
    customConfig?: Partial<RateLimitConfig>
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  }> {
    try {
      const clientId = this.getClientIdentifier(request);
      const config = { ...this.DEFAULT_CONFIG, ...this.RATE_LIMITS[userRole as keyof typeof this.RATE_LIMITS], ...customConfig };
      
      const now = Date.now();
      const windowStart = now - config.windowMs;
      
      // Get or create rate limit entry
      let entry = this.limits.get(clientId);
      
      if (!entry || entry.resetTime < now) {
        // Create new entry or reset expired entry
        entry = {
          count: 0,
          resetTime: now + config.windowMs,
          blocked: false
        };
        this.limits.set(clientId, entry);
      }

      // Check if user is temporarily blocked
      if (entry.blocked && entry.resetTime > now) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: entry.resetTime,
          retryAfter: Math.ceil((entry.resetTime - now) / 1000)
        };
      }

      // Check if within rate limit
      if (entry.count >= config.maxRequests) {
        // Block user temporarily
        entry.blocked = true;
        entry.resetTime = now + config.windowMs;
        
        console.log(`🚫 RateLimiter: User ${clientId} (${userRole}) blocked - ${entry.count}/${config.maxRequests} requests`);
        
        return {
          allowed: false,
          remaining: 0,
          resetTime: entry.resetTime,
          retryAfter: Math.ceil((entry.resetTime - now) / 1000)
        };
      }

      // Increment counter
      entry.count++;
      
      console.log(`✅ RateLimiter: User ${clientId} (${userRole}) - ${entry.count}/${config.maxRequests} requests`);
      
      return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime,
      };

    } catch (error) {
      console.error('❌ RateLimiter: Error checking rate limit:', error);
      // Allow request on error to prevent service disruption
      return {
        allowed: true,
        remaining: 999,
        resetTime: Date.now() + 15 * 60 * 1000,
      };
    }
  }

  /**
   * Record successful request
   */
  static recordSuccess(request: NextRequest, userRole: string = 'anonymous'): void {
    // Rate limiter automatically increments on check, no additional action needed
  }

  /**
   * Record failed request
   */
  static recordFailure(request: NextRequest, userRole: string = 'anonymous'): void {
    // Could implement different handling for failed requests
    // For now, we treat all requests the same
  }

  /**
   * Get client identifier for rate limiting
   */
  private static getClientIdentifier(request: NextRequest): string {
    // Try to get user ID from session first
    const userId = this.getUserIdFromRequest(request);
    if (userId) {
      return `user:${userId}`;
    }

    // Fall back to IP address
    const ip = this.getClientIP(request);
    return `ip:${ip}`;
  }

  /**
   * Get user ID from request (if available)
   */
  private static getUserIdFromRequest(request: NextRequest): string | null {
    // This would extract user ID from session/token
    // Implementation depends on your authentication system
    return null;
  }

  /**
   * Get client IP address
   */
  private static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    return request.ip || 'unknown';
  }

  /**
   * Clean up expired entries
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (entry.resetTime < now) {
        this.limits.delete(key);
      }
    }
  }

  /**
   * Get rate limit statistics
   */
  static getStats(): {
    totalEntries: number;
    activeUsers: number;
    blockedUsers: number;
  } {
    const now = Date.now();
    let activeUsers = 0;
    let blockedUsers = 0;

    for (const entry of this.limits.values()) {
      if (entry.resetTime > now) {
        activeUsers++;
        if (entry.blocked) {
          blockedUsers++;
        }
      }
    }

    return {
      totalEntries: this.limits.size,
      activeUsers,
      blockedUsers
    };
  }

  /**
   * Reset rate limit for specific user
   */
  static resetUserLimit(userId: string): void {
    for (const [key, entry] of this.limits.entries()) {
      if (key.startsWith(`user:${userId}`)) {
        this.limits.delete(key);
      }
    }
  }

  /**
   * Get rate limit headers for response
   */
  static getRateLimitHeaders(
    allowed: boolean,
    remaining: number,
    resetTime: number
  ): Record<string, string> {
    return {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
      ...(allowed ? {} : { 'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString() })
    };
  }
}

// Cleanup expired entries every minute
if (typeof window === 'undefined') {
  setInterval(() => {
    RateLimiter.cleanup();
  }, RateLimiter.CLEANUP_INTERVAL);
}
