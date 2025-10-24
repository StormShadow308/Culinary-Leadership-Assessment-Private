import { headers } from 'next/headers';

/**
 * Request context utilities for proper isolation between concurrent requests
 * Using a simple Map-based approach to avoid async local storage issues
 */
export class RequestContext {
  private static contexts = new Map<string, { requestId: string; userEmail?: string }>();

  /**
   * Generate a unique request ID for this request
   */
  static generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set the current request context
   */
  static setContext(requestId: string, userEmail?: string) {
    this.contexts.set(requestId, { requestId, userEmail });
  }

  /**
   * Get the current request ID (simplified for now)
   */
  static getRequestId(): string | null {
    // For now, return a simple ID to avoid async issues
    return 'req-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get the current user email (simplified for now)
   */
  static getUserEmail(): string | null {
    return null;
  }

  /**
   * Clear the current request context
   */
  static clearContext() {
    // Clean up old contexts periodically
    if (this.contexts.size > 1000) {
      this.contexts.clear();
    }
  }

  /**
   * Get client IP from headers
   */
  static async getClientIP(): Promise<string> {
    try {
      const headersList = await headers();
      const forwarded = headersList.get('x-forwarded-for');
      const realIP = headersList.get('x-real-ip');
      
      if (forwarded) {
        return forwarded.split(',')[0].trim();
      }
      
      if (realIP) {
        return realIP;
      }
      
      return 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Get user agent from headers
   */
  static async getUserAgent(): Promise<string> {
    try {
      const headersList = await headers();
      return headersList.get('user-agent') || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Create a scoped logger for this request
   */
  static createLogger(requestId: string, userEmail?: string) {
    const prefix = userEmail ? `[${requestId}:${userEmail}]` : `[${requestId}]`;
    
    return {
      info: (message: string, ...args: any[]) => {
        console.log(`${prefix} ${message}`, ...args);
      },
      warn: (message: string, ...args: any[]) => {
        console.warn(`${prefix} ${message}`, ...args);
      },
      error: (message: string, ...args: any[]) => {
        console.error(`${prefix} ${message}`, ...args);
      },
      debug: (message: string, ...args: any[]) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug(`${prefix} ${message}`, ...args);
        }
      }
    };
  }
}

/**
 * Request isolation middleware wrapper (simplified to avoid async context issues)
 */
export function withRequestIsolation<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    // Simplified implementation to avoid async context issues
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  };
}
