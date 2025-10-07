import { db } from '~/db';
import { organization, participants, attempts, cohorts, member } from '~/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { SessionContext } from './session-manager';

/**
 * Data isolation service to ensure users can only access their own data
 * and prevent cross-user data leakage
 */
export class DataIsolationService {
  
  /**
   * Get user's accessible organizations
   */
  static async getUserOrganizations(sessionContext: SessionContext): Promise<string[]> {
    try {
      if (sessionContext.isAdmin) {
        // Admins can access all organizations
        const allOrgs = await db.select({ id: organization.id }).from(organization);
        return allOrgs.map(org => org.id);
      }

      if (sessionContext.isOrganization) {
        // Organization users can only access their own organization
        const userMemberships = await db
          .select({ organizationId: member.organizationId })
          .from(member)
          .where(eq(member.userId, sessionContext.user.userId));

        return userMemberships.map(m => m.organizationId);
      }

      // Students don't have organization access
      return [];

    } catch (error) {
      console.error('❌ DataIsolationService: Error getting user organizations:', error);
      return [];
    }
  }

  /**
   * Validate user can access specific organization
   */
  static async canAccessOrganization(sessionContext: SessionContext, organizationId: string): Promise<boolean> {
    try {
      if (sessionContext.isAdmin) {
        return true;
      }

      if (sessionContext.isOrganization) {
        const userOrgs = await this.getUserOrganizations(sessionContext);
        return userOrgs.includes(organizationId);
      }

      return false;

    } catch (error) {
      console.error('❌ DataIsolationService: Error checking organization access:', error);
      return false;
    }
  }

  /**
   * Get user's accessible participants
   */
  static async getUserParticipants(sessionContext: SessionContext, organizationId?: string): Promise<any[]> {
    try {
      let accessibleOrgs: string[] = [];

      if (organizationId) {
        // Check if user can access specific organization
        const canAccess = await this.canAccessOrganization(sessionContext, organizationId);
        if (!canAccess) {
          console.log('❌ DataIsolationService: User cannot access organization:', organizationId);
          return [];
        }
        accessibleOrgs = [organizationId];
      } else {
        // Get all accessible organizations
        accessibleOrgs = await this.getUserOrganizations(sessionContext);
      }

      if (accessibleOrgs.length === 0) {
        return [];
      }

      // Get participants from accessible organizations
      const participantsData = await db
        .select()
        .from(participants)
        .where(inArray(participants.organizationId, accessibleOrgs));

      console.log(`✅ DataIsolationService: Found ${participantsData.length} participants for user`);
      return participantsData;

    } catch (error) {
      console.error('❌ DataIsolationService: Error getting user participants:', error);
      return [];
    }
  }

  /**
   * Get user's accessible attempts
   */
  static async getUserAttempts(sessionContext: SessionContext, organizationId?: string): Promise<any[]> {
    try {
      // Get accessible participants first
      const accessibleParticipants = await this.getUserParticipants(sessionContext, organizationId);
      
      if (accessibleParticipants.length === 0) {
        return [];
      }

      const participantIds = accessibleParticipants.map(p => p.id);

      // Get attempts for accessible participants only
      const attemptsData = await db
        .select()
        .from(attempts)
        .where(inArray(attempts.participantId, participantIds));

      console.log(`✅ DataIsolationService: Found ${attemptsData.length} attempts for user`);
      return attemptsData;

    } catch (error) {
      console.error('❌ DataIsolationService: Error getting user attempts:', error);
      return [];
    }
  }

  /**
   * Get user's accessible cohorts
   */
  static async getUserCohorts(sessionContext: SessionContext, organizationId?: string): Promise<any[]> {
    try {
      let accessibleOrgs: string[] = [];

      if (organizationId) {
        const canAccess = await this.canAccessOrganization(sessionContext, organizationId);
        if (!canAccess) {
          return [];
        }
        accessibleOrgs = [organizationId];
      } else {
        accessibleOrgs = await this.getUserOrganizations(sessionContext);
      }

      if (accessibleOrgs.length === 0) {
        return [];
      }

      const cohortsData = await db
        .select()
        .from(cohorts)
        .where(inArray(cohorts.organizationId, accessibleOrgs));

      console.log(`✅ DataIsolationService: Found ${cohortsData.length} cohorts for user`);
      return cohortsData;

    } catch (error) {
      console.error('❌ DataIsolationService: Error getting user cohorts:', error);
      return [];
    }
  }

  /**
   * Sanitize data to remove sensitive information
   */
  static sanitizeData(data: any, sessionContext: SessionContext): any {
    try {
      if (!data) return data;

      // Remove sensitive fields based on user role
      const sensitiveFields = ['password', 'token', 'secret', 'key'];
      
      if (Array.isArray(data)) {
        return data.map(item => this.sanitizeData(item, sessionContext));
      }

      if (typeof data === 'object') {
        const sanitized = { ...data };
        
        // Remove sensitive fields
        sensitiveFields.forEach(field => {
          if (field in sanitized) {
            delete sanitized[field];
          }
        });

        // Recursively sanitize nested objects
        Object.keys(sanitized).forEach(key => {
          if (typeof sanitized[key] === 'object') {
            sanitized[key] = this.sanitizeData(sanitized[key], sessionContext);
          }
        });

        return sanitized;
      }

      return data;

    } catch (error) {
      console.error('❌ DataIsolationService: Error sanitizing data:', error);
      return data;
    }
  }

  /**
   * Validate user can perform action on specific resource
   */
  static async canPerformAction(
    sessionContext: SessionContext, 
    action: string, 
    resourceType: string, 
    resourceId: string
  ): Promise<boolean> {
    try {
      console.log(`🔍 DataIsolationService: Checking ${action} permission for ${resourceType}:${resourceId}`);

      // Admin can do everything
      if (sessionContext.isAdmin) {
        return true;
      }

      switch (resourceType) {
        case 'organization':
          return await this.canAccessOrganization(sessionContext, resourceId);
        
        case 'participant':
          // Check if participant belongs to user's accessible organizations
          const participant = await db
            .select({ organizationId: participants.organizationId })
            .from(participants)
            .where(eq(participants.id, resourceId))
            .limit(1);
          
          if (participant.length === 0) return false;
          return await this.canAccessOrganization(sessionContext, participant[0].organizationId);
        
        case 'attempt':
          // Check if attempt belongs to user's accessible participants
          const attempt = await db
            .select({ participantId: attempts.participantId })
            .from(attempts)
            .where(eq(attempts.id, resourceId))
            .limit(1);
          
          if (attempt.length === 0) return false;
          
          const participantData = await db
            .select({ organizationId: participants.organizationId })
            .from(participants)
            .where(eq(participants.id, attempt[0].participantId))
            .limit(1);
          
          if (participantData.length === 0) return false;
          return await this.canAccessOrganization(sessionContext, participantData[0].organizationId);
        
        case 'cohort':
          // Check if cohort belongs to user's accessible organizations
          const cohort = await db
            .select({ organizationId: cohorts.organizationId })
            .from(cohorts)
            .where(eq(cohorts.id, resourceId))
            .limit(1);
          
          if (cohort.length === 0) return false;
          return await this.canAccessOrganization(sessionContext, cohort[0].organizationId);
        
        default:
          console.log(`❌ DataIsolationService: Unknown resource type: ${resourceType}`);
          return false;
      }

    } catch (error) {
      console.error('❌ DataIsolationService: Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Log data access for audit purposes
   */
  static async logDataAccess(
    sessionContext: SessionContext,
    action: string,
    resourceType: string,
    resourceId: string,
    success: boolean
  ): Promise<void> {
    try {
      console.log(`📊 DataIsolationService: ${success ? 'SUCCESS' : 'DENIED'} - User ${sessionContext.user.email} ${action} ${resourceType}:${resourceId}`);
      
      // In a production environment, you would log this to a proper audit system
      // For now, we'll just use console logging
      
    } catch (error) {
      console.error('❌ DataIsolationService: Error logging data access:', error);
    }
  }

  /**
   * Get user's data summary for dashboard
   */
  static async getUserDataSummary(sessionContext: SessionContext): Promise<{
    organizations: number;
    participants: number;
    attempts: number;
    cohorts: number;
  }> {
    try {
      const [orgs, participants, attempts, cohorts] = await Promise.all([
        this.getUserOrganizations(sessionContext),
        this.getUserParticipants(sessionContext),
        this.getUserAttempts(sessionContext),
        this.getUserCohorts(sessionContext)
      ]);

      return {
        organizations: orgs.length,
        participants: participants.length,
        attempts: attempts.length,
        cohorts: cohorts.length
      };

    } catch (error) {
      console.error('❌ DataIsolationService: Error getting data summary:', error);
      return {
        organizations: 0,
        participants: 0,
        attempts: 0,
        cohorts: 0
      };
    }
  }
}
