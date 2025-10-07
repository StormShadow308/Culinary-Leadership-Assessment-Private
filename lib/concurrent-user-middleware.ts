import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from './session-manager';
import { RateLimiter } from './rate-limiter';
import { DataIsolationService } from './data-isolation';

/**
 * Middleware to handle concurrent users and prevent route mixing
 */
export class ConcurrentUserMiddleware {
  private static readonly MAX_CONCURRENT_USERS = 1000;
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  private static activeUsers = new Map<string, { lastActivity: number; sessionId: string }>();

  /**
   * Process request with concurrent user handling
   */
  static async processRequest(
    request: NextRequest,
    handler: (sessionContext: any) => Promise<NextResponse>
  ): Promise<NextResponse> {
    try {
      console.log('🔍 ConcurrentUserMiddleware: Processing request...');
      
      // Get client identifier
      const clientId = this.getClientIdentifier(request);
      const userAgent = request.headers.get('user-agent') || 'unknown';
      const ipAddress = this.getClientIP(request);
      
      console.log('👤 Client info:', { clientId, userAgent, ipAddress });

      // Check if we're at capacity
      if (this.activeUsers.size >= this.MAX_CONCURRENT_USERS) {
        console.log('🚫 Maximum concurrent users reached');
        return NextResponse.json(
          { 
            error: 'Server is at capacity. Please try again later.',
            retryAfter: 60 
          },
          { status: 503 }
        );
      }

      // Get session context
      const sessionContext = await SessionManager.getSessionContext();
      
      if (!sessionContext) {
        console.log('❌ No valid session found');
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Update active users tracking
      this.updateActiveUser(clientId, sessionContext.user.sessionToken);
      
      // Clean up inactive users
      this.cleanupInactiveUsers();

      // Rate limiting based on user role
      const rateLimitResult = await RateLimiter.checkRateLimit(
        request, 
        sessionContext.user.role
      );
      
      if (!rateLimitResult.allowed) {
        console.log('🚫 Rate limit exceeded for user:', sessionContext.user.email);
        return NextResponse.json(
          { 
            error: 'Too many requests. Please try again later.',
            retryAfter: rateLimitResult.retryAfter 
          },
          { 
            status: 429,
            headers: RateLimiter.getRateLimitHeaders(
              rateLimitResult.allowed,
              rateLimitResult.remaining,
              rateLimitResult.resetTime
            )
          }
        );
      }

      // Validate user permissions for the requested resource
      const resourceValidation = await this.validateResourceAccess(
        request,
        sessionContext
      );
      
      if (!resourceValidation.allowed) {
        console.log('❌ Resource access denied for user:', sessionContext.user.email);
        await DataIsolationService.logDataAccess(
          sessionContext,
          'access',
          resourceValidation.resourceType,
          resourceValidation.resourceId,
          false
        );
        
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      // Execute the handler with session context
      const response = await handler(sessionContext);
      
      // Add security headers
      this.addSecurityHeaders(response);
      
      // Log successful access
      await DataIsolationService.logDataAccess(
        sessionContext,
        'access',
        resourceValidation.resourceType,
        resourceValidation.resourceId,
        true
      );

      console.log('✅ Request processed successfully for user:', sessionContext.user.email);
      return response;

    } catch (error) {
      console.error('❌ ConcurrentUserMiddleware: Error processing request:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  /**
   * Get client identifier
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
   * Get user ID from request
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
   * Update active user tracking
   */
  private static updateActiveUser(clientId: string, sessionId: string): void {
    this.activeUsers.set(clientId, {
      lastActivity: Date.now(),
      sessionId
    });
  }

  /**
   * Clean up inactive users
   */
  private static cleanupInactiveUsers(): void {
    const now = Date.now();
    const timeout = this.SESSION_TIMEOUT;
    
    for (const [clientId, user] of this.activeUsers.entries()) {
      if (now - user.lastActivity > timeout) {
        this.activeUsers.delete(clientId);
        console.log('🧹 Cleaned up inactive user:', clientId);
      }
    }
  }

  /**
   * Validate resource access
   */
  private static async validateResourceAccess(
    request: NextRequest,
    sessionContext: any
  ): Promise<{
    allowed: boolean;
    resourceType: string;
    resourceId: string;
  }> {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      
      // Extract resource information from URL
      const pathParts = pathname.split('/').filter(Boolean);
      
      if (pathParts.length === 0) {
        return { allowed: true, resourceType: 'root', resourceId: 'root' };
      }

      const resourceType = pathParts[0];
      const resourceId = pathParts[1] || 'all';

      // Check permissions based on resource type
      switch (resourceType) {
        case 'admin':
          if (!sessionContext.isAdmin) {
            return { allowed: false, resourceType, resourceId };
          }
          break;
        
        case 'organisation':
          if (!sessionContext.isOrganization && !sessionContext.isAdmin) {
            return { allowed: false, resourceType, resourceId };
          }
          
          // Check specific organization access
          if (resourceId !== 'all' && !sessionContext.canAccessOrganization(resourceId)) {
            return { allowed: false, resourceType, resourceId };
          }
          break;
        
        case 'assessment':
          // Students, organizations, and admins can access assessments
          if (!sessionContext.isStudent && !sessionContext.isOrganization && !sessionContext.isAdmin) {
            return { allowed: false, resourceType, resourceId };
          }
          break;
        
        default:
          // Allow access to other resources by default
          break;
      }

      return { allowed: true, resourceType, resourceId };

    } catch (error) {
      console.error('❌ Error validating resource access:', error);
      return { allowed: false, resourceType: 'unknown', resourceId: 'unknown' };
    }
  }

  /**
   * Add security headers
   */
  private static addSecurityHeaders(response: NextResponse): void {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  }

  /**
   * Get concurrent user statistics
   */
  static getStats(): {
    activeUsers: number;
    maxUsers: number;
    utilizationPercent: number;
  } {
    const activeUsers = this.activeUsers.size;
    const maxUsers = this.MAX_CONCURRENT_USERS;
    const utilizationPercent = Math.round((activeUsers / maxUsers) * 100);

    return {
      activeUsers,
      maxUsers,
      utilizationPercent
    };
  }

  /**
   * Force cleanup of all users (for maintenance)
   */
  static forceCleanup(): void {
    this.activeUsers.clear();
    console.log('🧹 Force cleaned all active users');
  }
}

// Cleanup inactive users every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    ConcurrentUserMiddleware['cleanupInactiveUsers']();
  }, 5 * 60 * 1000);
}
