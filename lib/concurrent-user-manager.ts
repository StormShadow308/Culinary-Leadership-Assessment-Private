import { NextRequest } from 'next/server';

/**
 * Concurrent user session manager
 */
export class ConcurrentUserManager {
  private static activeSessions = new Map<string, {
    userId: string;
    email: string;
    lastActivity: number;
    requestCount: number;
    ipAddress: string;
  }>();
  
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly MAX_CONCURRENT_SESSIONS = 1000;
  private static readonly MAX_REQUESTS_PER_MINUTE = 60;

  /**
   * Register a user session
   */
  static registerSession(
    userId: string, 
    email: string, 
    ipAddress: string
  ): boolean {
    const now = Date.now();
    const sessionKey = `${userId}:${ipAddress}`;
    
    // Check if we're at capacity
    if (this.activeSessions.size >= this.MAX_CONCURRENT_SESSIONS) {
      return false;
    }
    
    const existing = this.activeSessions.get(sessionKey);
    if (existing) {
      // Update existing session
      existing.lastActivity = now;
      existing.requestCount++;
    } else {
      // Create new session
      this.activeSessions.set(sessionKey, {
        userId,
        email,
        lastActivity: now,
        requestCount: 1,
        ipAddress
      });
    }
    
    return true;
  }

  /**
   * Check if user session is valid and not rate limited
   */
  static validateSession(
    userId: string, 
    ipAddress: string
  ): { valid: boolean; rateLimited: boolean } {
    const sessionKey = `${userId}:${ipAddress}`;
    const session = this.activeSessions.get(sessionKey);
    
    if (!session) {
      return { valid: false, rateLimited: false };
    }
    
    const now = Date.now();
    
    // Check if session has expired
    if (now - session.lastActivity > this.SESSION_TIMEOUT) {
      this.activeSessions.delete(sessionKey);
      return { valid: false, rateLimited: false };
    }
    
    // Check rate limiting (requests per minute)
    const requestsPerMinute = session.requestCount;
    if (requestsPerMinute > this.MAX_REQUESTS_PER_MINUTE) {
      return { valid: true, rateLimited: true };
    }
    
    // Update activity
    session.lastActivity = now;
    
    return { valid: true, rateLimited: false };
  }

  /**
   * Get active session count
   */
  static getActiveSessionCount(): number {
    return this.activeSessions.size;
  }

  /**
   * Get sessions for a specific user
   */
  static getUserSessions(userId: string): Array<{
    ipAddress: string;
    lastActivity: number;
    requestCount: number;
  }> {
    const sessions: Array<{
      ipAddress: string;
      lastActivity: number;
      requestCount: number;
    }> = [];
    
    for (const [key, session] of this.activeSessions.entries()) {
      if (session.userId === userId) {
        sessions.push({
          ipAddress: session.ipAddress,
          lastActivity: session.lastActivity,
          requestCount: session.requestCount
        });
      }
    }
    
    return sessions;
  }

  /**
   * Clean up expired sessions
   */
  static cleanupExpiredSessions(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, session] of this.activeSessions.entries()) {
      if (now - session.lastActivity > this.SESSION_TIMEOUT) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.activeSessions.delete(key));
  }

  /**
   * Get client IP from request
   */
  static getClientIP(request: NextRequest): string {
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
}

// Clean up expired sessions every 5 minutes
setInterval(() => {
  ConcurrentUserManager.cleanupExpiredSessions();
}, 5 * 60 * 1000);

/**
 * Middleware to handle concurrent user sessions
 */
export function withConcurrentUserHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('Error in concurrent user handler:', error);
      throw error;
    }
  };
}
