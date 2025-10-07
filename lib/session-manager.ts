import { createClient } from './supabase-server';
import { db } from '~/db';
import { user, session } from '~/db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export interface UserSession {
  id: string;
  userId: string;
  email: string;
  role: string;
  organizationId?: string;
  activeOrganizationId?: string;
  sessionToken: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

export interface SessionContext {
  user: UserSession;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOrganization: boolean;
  isStudent: boolean;
  canAccessOrganization: (orgId: string) => boolean;
}

/**
 * Comprehensive session management for handling 1000+ concurrent users
 */
export class SessionManager {
  private static sessionCache = new Map<string, UserSession>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_CONCURRENT_SESSIONS = 1000;
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get or create user session with proper isolation
   */
  static async getSessionContext(): Promise<SessionContext | null> {
    try {
      console.log('🔍 SessionManager: Getting session context...');
      
      // Get Supabase user first
      const supabase = await createClient();
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
      
      if (error || !supabaseUser) {
        console.log('❌ SessionManager: No Supabase user found');
        return null;
      }

      console.log('✅ SessionManager: Supabase user found:', supabaseUser.email);

      // Get local user data
      const localUser = await db
        .select()
        .from(user)
        .where(eq(user.email, supabaseUser.email))
        .limit(1);

      if (localUser.length === 0) {
        console.log('❌ SessionManager: No local user found');
        return null;
      }

      const userData = localUser[0];
      console.log('✅ SessionManager: Local user found:', { 
        id: userData.id, 
        email: userData.email, 
        role: userData.role 
      });

      // Get or create session
      const sessionData = await this.getOrCreateSession(userData, supabaseUser);
      if (!sessionData) {
        console.log('❌ SessionManager: Failed to create/get session');
        return null;
      }

      // Create session context
      const context: SessionContext = {
        user: sessionData,
        isAuthenticated: true,
        isAdmin: userData.role === 'admin',
        isOrganization: userData.role === 'organization',
        isStudent: userData.role === 'student',
        canAccessOrganization: (orgId: string) => {
          if (userData.role === 'admin') return true;
          if (userData.role === 'organization') {
            return sessionData.organizationId === orgId || sessionData.activeOrganizationId === orgId;
          }
          return false;
        }
      };

      console.log('✅ SessionManager: Session context created successfully');
      return context;

    } catch (error) {
      console.error('❌ SessionManager: Error getting session context:', error);
      return null;
    }
  }

  /**
   * Get or create session for user
   */
  private static async getOrCreateSession(userData: any, supabaseUser: any): Promise<UserSession | null> {
    try {
      // Check for existing active session
      const existingSessions = await db
        .select()
        .from(session)
        .where(
          and(
            eq(session.userId, userData.id),
            eq(session.active, true),
            gte(session.expiresAt, new Date())
          )
        )
        .orderBy(session.createdAt)
        .limit(1);

      if (existingSessions.length > 0) {
        const existingSession = existingSessions[0];
        console.log('✅ SessionManager: Using existing session');
        
        // Update last activity
        await db
          .update(session)
          .set({ 
            updatedAt: new Date(),
            lastActivityAt: new Date()
          })
          .where(eq(session.id, existingSession.id));

        return this.mapSessionToUserSession(existingSession, userData);
      }

      // Check concurrent session limit
      const activeSessionCount = await db
        .select({ count: session.id })
        .from(session)
        .where(
          and(
            eq(session.active, true),
            gte(session.expiresAt, new Date())
          )
        );

      if (activeSessionCount.length >= this.MAX_CONCURRENT_SESSIONS) {
        console.log('⚠️ SessionManager: Maximum concurrent sessions reached');
        // Clean up expired sessions
        await this.cleanupExpiredSessions();
      }

      // Create new session
      console.log('🆕 SessionManager: Creating new session');
      const sessionToken = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + this.SESSION_TIMEOUT);

      const newSession = await db
        .insert(session)
        .values({
          id: `session_${Date.now()}_${randomBytes(8).toString('hex')}`,
          userId: userData.id,
          token: sessionToken,
          expiresAt: expiresAt,
          createdAt: new Date(),
          updatedAt: new Date(),
          active: true,
          ipAddress: this.getClientIP(),
          userAgent: this.getUserAgent(),
          lastActivityAt: new Date()
        })
        .returning();

      console.log('✅ SessionManager: New session created:', newSession[0].id);
      return this.mapSessionToUserSession(newSession[0], userData);

    } catch (error) {
      console.error('❌ SessionManager: Error creating session:', error);
      return null;
    }
  }

  /**
   * Validate session and ensure user isolation
   */
  static async validateSession(sessionToken: string): Promise<UserSession | null> {
    try {
      // Check cache first
      const cachedSession = this.sessionCache.get(sessionToken);
      if (cachedSession && cachedSession.expiresAt > new Date()) {
        return cachedSession;
      }

      // Get session from database
      const sessionData = await db
        .select()
        .from(session)
        .where(
          and(
            eq(session.token, sessionToken),
            eq(session.active, true),
            gte(session.expiresAt, new Date())
          )
        )
        .limit(1);

      if (sessionData.length === 0) {
        return null;
      }

      // Get user data
      const userData = await db
        .select()
        .from(user)
        .where(eq(user.id, sessionData[0].userId))
        .limit(1);

      if (userData.length === 0) {
        return null;
      }

      const userSession = this.mapSessionToUserSession(sessionData[0], userData[0]);
      
      // Cache the session
      this.sessionCache.set(sessionToken, userSession);
      
      // Clean up cache periodically
      this.cleanupCache();

      return userSession;

    } catch (error) {
      console.error('❌ SessionManager: Error validating session:', error);
      return null;
    }
  }

  /**
   * Update user's active organization (for organization users)
   */
  static async updateActiveOrganization(userId: string, organizationId: string): Promise<boolean> {
    try {
      await db
        .update(session)
        .set({ 
          activeOrganizationId: organizationId,
          updatedAt: new Date()
        })
        .where(eq(session.userId, userId));

      // Update cache
      for (const [token, session] of this.sessionCache.entries()) {
        if (session.userId === userId) {
          session.activeOrganizationId = organizationId;
          this.sessionCache.set(token, session);
        }
      }

      console.log('✅ SessionManager: Active organization updated');
      return true;

    } catch (error) {
      console.error('❌ SessionManager: Error updating active organization:', error);
      return false;
    }
  }

  /**
   * Invalidate user session
   */
  static async invalidateSession(sessionToken: string): Promise<boolean> {
    try {
      await db
        .update(session)
        .set({ 
          active: false,
          updatedAt: new Date()
        })
        .where(eq(session.token, sessionToken));

      // Remove from cache
      this.sessionCache.delete(sessionToken);

      console.log('✅ SessionManager: Session invalidated');
      return true;

    } catch (error) {
      console.error('❌ SessionManager: Error invalidating session:', error);
      return false;
    }
  }

  /**
   * Clean up expired sessions
   */
  private static async cleanupExpiredSessions(): Promise<void> {
    try {
      const result = await db
        .update(session)
        .set({ 
          active: false,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(session.active, true),
            gte(session.expiresAt, new Date())
          )
        );

      console.log('🧹 SessionManager: Cleaned up expired sessions');
    } catch (error) {
      console.error('❌ SessionManager: Error cleaning up sessions:', error);
    }
  }

  /**
   * Clean up cache
   */
  private static cleanupCache(): void {
    const now = new Date();
    for (const [token, session] of this.sessionCache.entries()) {
      if (session.expiresAt <= now) {
        this.sessionCache.delete(token);
      }
    }
  }

  /**
   * Map database session to UserSession
   */
  private static mapSessionToUserSession(sessionData: any, userData: any): UserSession {
    return {
      id: sessionData.id,
      userId: sessionData.userId,
      email: userData.email,
      role: userData.role,
      organizationId: sessionData.organizationId,
      activeOrganizationId: sessionData.activeOrganizationId,
      sessionToken: sessionData.token,
      expiresAt: sessionData.expiresAt,
      ipAddress: sessionData.ipAddress,
      userAgent: sessionData.userAgent,
      isActive: sessionData.active
    };
  }

  /**
   * Get client IP address
   */
  private static getClientIP(): string {
    // This would be implemented based on your deployment setup
    return 'unknown';
  }

  /**
   * Get user agent
   */
  private static getUserAgent(): string {
    // This would be implemented based on your deployment setup
    return 'unknown';
  }

  /**
   * Get session statistics
   */
  static async getSessionStats(): Promise<{
    activeSessions: number;
    totalUsers: number;
    cacheSize: number;
  }> {
    try {
      const activeSessions = await db
        .select({ count: session.id })
        .from(session)
        .where(
          and(
            eq(session.active, true),
            gte(session.expiresAt, new Date())
          )
        );

      const totalUsers = await db
        .select({ count: user.id })
        .from(user);

      return {
        activeSessions: activeSessions.length,
        totalUsers: totalUsers.length,
        cacheSize: this.sessionCache.size
      };
    } catch (error) {
      console.error('❌ SessionManager: Error getting stats:', error);
      return {
        activeSessions: 0,
        totalUsers: 0,
        cacheSize: 0
      };
    }
  }
}
