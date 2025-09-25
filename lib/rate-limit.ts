// Simple in-memory rate limiter
// In production, use Redis for distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  isAllowed(
    key: string, 
    maxRequests: number = 100, 
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (entry.count >= maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingRequests(
    key: string, 
    maxRequests: number = 100, 
    windowMs: number = 15 * 60 * 1000
  ): number {
    const entry = this.limits.get(key);
    if (!entry) return maxRequests;
    
    const now = Date.now();
    if (now > entry.resetTime) return maxRequests;
    
    return Math.max(0, maxRequests - entry.count);
  }

  getResetTime(key: string): number | null {
    const entry = this.limits.get(key);
    return entry ? entry.resetTime : null;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.limits.clear();
  }
}

export const rateLimiter = new RateLimiter();

// Rate limit configurations
export const RATE_LIMITS = {
  // API endpoints
  AUTH: { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 requests per 15 minutes
  API: { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  ASSESSMENT: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 requests per minute
  
  // Dashboard queries
  DASHBOARD: { maxRequests: 50, windowMs: 5 * 60 * 1000 }, // 50 requests per 5 minutes
  REPORTS: { maxRequests: 20, windowMs: 5 * 60 * 1000 }, // 20 requests per 5 minutes
} as const;

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

// Rate limiting middleware
export function checkRateLimit(
  request: Request, 
  limitType: keyof typeof RATE_LIMITS
): { allowed: boolean; remaining: number; resetTime: number | null } {
  const clientIP = getClientIP(request);
  const limit = RATE_LIMITS[limitType];
  const key = `${clientIP}_${limitType}`;
  
  const allowed = rateLimiter.isAllowed(key, limit.maxRequests, limit.windowMs);
  const remaining = rateLimiter.getRemainingRequests(key, limit.maxRequests, limit.windowMs);
  const resetTime = rateLimiter.getResetTime(key);
  
  return { allowed, remaining, resetTime };
}
