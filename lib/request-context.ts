import { headers } from 'next/headers';

/**
 * Request context utilities for proper isolation between concurrent requests
 */
export class RequestContext {
  private static requestId: string | null = null;
  private static userEmail: string | null = null;

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
    this.requestId = requestId;
    this.userEmail = userEmail || null;
  }

  /**
   * Get the current request ID
   */
  static getRequestId(): string | null {
    return this.requestId;
  }

  /**
   * Get the current user email
   */
  static getUserEmail(): string | null {
    return this.userEmail;
  }

  /**
   * Clear the current request context
   */
  static clearContext() {
    this.requestId = null;
    this.userEmail = null;
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
 * Request isolation middleware wrapper
 */
export function withRequestIsolation<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const requestId = RequestContext.generateRequestId();
    const logger = RequestContext.createLogger(requestId);
    
    try {
      logger.debug('Starting isolated request');
      RequestContext.setContext(requestId);
      
      const result = await fn(...args);
      
      logger.debug('Completed isolated request');
      return result;
    } catch (error) {
      logger.error('Request failed:', error);
      throw error;
    } finally {
      RequestContext.clearContext();
    }
  };
}
