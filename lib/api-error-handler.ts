import { NextResponse } from 'next/server';
import { RequestContext } from './request-context';

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  requestId?: string;
}

export class ApiErrorHandler {
  /**
   * Create a standardized error response
   */
  static createErrorResponse(
    status: number,
    code: string,
    message: string,
    details?: any
  ): NextResponse {
    const requestId = RequestContext.getRequestId();
    const userEmail = RequestContext.getUserEmail();
    
    const error: ApiError = {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      requestId: requestId || undefined,
    };

    // Log error with context
    const logger = RequestContext.createLogger(requestId || 'unknown', userEmail || undefined);
    logger.error(`API Error [${code}]: ${message}`, { details, status });

    return NextResponse.json(error, { status });
  }

  /**
   * Handle authentication errors
   */
  static authenticationError(message = 'Authentication required'): NextResponse {
    return this.createErrorResponse(401, 'AUTH_REQUIRED', message);
  }

  /**
   * Handle authorization errors
   */
  static authorizationError(message = 'Access denied'): NextResponse {
    return this.createErrorResponse(403, 'ACCESS_DENIED', message);
  }

  /**
   * Handle validation errors
   */
  static validationError(message: string, details?: any): NextResponse {
    return this.createErrorResponse(400, 'VALIDATION_ERROR', message, details);
  }

  /**
   * Handle not found errors
   */
  static notFoundError(resource: string): NextResponse {
    return this.createErrorResponse(404, 'NOT_FOUND', `${resource} not found`);
  }

  /**
   * Handle rate limit errors
   */
  static rateLimitError(): NextResponse {
    return this.createErrorResponse(429, 'RATE_LIMITED', 'Too many requests');
  }

  /**
   * Handle server errors
   */
  static serverError(message = 'Internal server error', details?: any): NextResponse {
    return this.createErrorResponse(500, 'SERVER_ERROR', message, details);
  }

  /**
   * Handle database errors
   */
  static databaseError(operation: string, details?: any): NextResponse {
    return this.createErrorResponse(500, 'DATABASE_ERROR', `Database error during ${operation}`, details);
  }

  /**
   * Handle concurrent access errors
   */
  static concurrentAccessError(resource: string): NextResponse {
    return this.createErrorResponse(409, 'CONCURRENT_ACCESS', `${resource} is being accessed by another user`);
  }
}

/**
 * Wrapper for API route handlers with error handling
 */
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args);
    } catch (error) {
      const requestId = RequestContext.getRequestId() || 'unknown';
      const logger = RequestContext.createLogger(requestId);
      
      logger.error('Unhandled error in API route:', error);
      
      // Re-throw to be handled by Next.js error boundary
      throw error;
    }
  };
}
