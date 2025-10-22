import { NextRequest } from 'next/server';

/**
 * Simple in-memory rate limiter for API endpoints
 * In production, use Redis or a dedicated rate limiting service
 */
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>();
  private static readonly WINDOW_MS = 60000; // 1 minute
  private static readonly MAX_REQUESTS = 100; // Max requests per window per IP

  /**
   * Check if request should be rate limited
   */
  static isRateLimited(request: NextRequest): boolean {
    const ip = this.getClientIP(request);
    const now = Date.now();
    
    const current = this.requests.get(ip);
    
    if (!current) {
      this.requests.set(ip, { count: 1, resetTime: now + this.WINDOW_MS });
      return false;
    }
    
    if (now > current.resetTime) {
      this.requests.set(ip, { count: 1, resetTime: now + this.WINDOW_MS });
      return false;
    }
    
    if (current.count >= this.MAX_REQUESTS) {
      return true;
    }
    
    current.count++;
    return false;
  }

  /**
   * Get client IP from request
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
    
    return 'unknown';
  }

  /**
   * Clean up expired entries
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [ip, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        this.requests.delete(ip);
      }
    }
  }
}

// Clean up every 5 minutes
setInterval(() => {
  RateLimiter.cleanup();
}, 5 * 60 * 1000);

/**
 * Rate limiting middleware for API routes
 */
export function withRateLimit(handler: (request: NextRequest) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    if (RateLimiter.isRateLimited(request)) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests', 
          message: 'Please try again later' 
        }),
        { 
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      );
    }
    
    return handler(request);
  };
}