import { createClient } from '@supabase/supabase-js';
import { db } from '~/db';
import { user, member, participants, attempts, responses, passcodes } from '~/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// Create Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export interface SyncResult {
  success: boolean;
  message: string;
  details: {
    localUsers: number;
    supabaseUsers: number;
    syncedUsers: number;
    orphanedLocal: string[];
    orphanedSupabase: string[];
    errors: string[];
  };
}

export interface UserSyncStatus {
  email: string;
  localExists: boolean;
  supabaseExists: boolean;
  inSync: boolean;
  localData?: any;
  supabaseData?: any;
  issues: string[];
}

/**
 * Comprehensive sync service to ensure Supabase and local database are in sync
 */
export class SyncService {
  
  /**
   * Get sync status for all users
   */
  static async getSyncStatus(): Promise<UserSyncStatus[]> {
    console.log('🔍 Checking sync status for all users...');
    
    try {
      // Get all local users
      const localUsers = await db.select().from(user);
      console.log(`📊 Found ${localUsers.length} users in local database`);

      // Get all Supabase users
      const { data: supabaseUsers, error: supabaseError } = await supabase.auth.admin.listUsers();
      if (supabaseError) {
        console.error('❌ Error fetching Supabase users:', supabaseError);
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }

      console.log(`📊 Found ${supabaseUsers.users.length} users in Supabase`);

      // Create a map of Supabase users by email
      const supabaseUserMap = new Map();
      supabaseUsers.users.forEach(user => {
        if (user.email) {
          supabaseUserMap.set(user.email, user);
        }
      });

      // Check sync status for each local user
      const syncStatus: UserSyncStatus[] = localUsers.map(localUser => {
        const supabaseUser = supabaseUserMap.get(localUser.email);
        const issues: string[] = [];

        if (!supabaseUser) {
          issues.push('User exists in local DB but not in Supabase');
        } else {
          // Check if data is consistent
          if (localUser.id !== supabaseUser.id) {
            issues.push('User ID mismatch between local and Supabase');
          }
          if (localUser.name !== supabaseUser.user_metadata?.name) {
            issues.push('User name mismatch between local and Supabase');
          }
          if (localUser.emailVerified !== !!supabaseUser.email_confirmed_at) {
            issues.push('Email verification status mismatch');
          }
        }

        return {
          email: localUser.email,
          localExists: true,
          supabaseExists: !!supabaseUser,
          inSync: issues.length === 0,
          localData: localUser,
          supabaseData: supabaseUser,
          issues
        };
      });

      // Check for orphaned Supabase users (exist in Supabase but not locally)
      const localEmailSet = new Set(localUsers.map(u => u.email));
      supabaseUsers.users.forEach(supabaseUser => {
        if (supabaseUser.email && !localEmailSet.has(supabaseUser.email)) {
          syncStatus.push({
            email: supabaseUser.email,
            localExists: false,
            supabaseExists: true,
            inSync: false,
            supabaseData: supabaseUser,
            issues: ['User exists in Supabase but not in local database']
          });
        }
      });

      console.log(`✅ Sync status check completed. Found ${syncStatus.length} total users`);
      return syncStatus;

    } catch (error) {
      console.error('❌ Error checking sync status:', error);
      throw error;
    }
  }

  /**
   * Sync all users between Supabase and local database
   */
  static async syncAllUsers(): Promise<SyncResult> {
    console.log('🔄 Starting comprehensive user sync...');
    
    const result: SyncResult = {
      success: true,
      message: 'Sync completed',
      details: {
        localUsers: 0,
        supabaseUsers: 0,
        syncedUsers: 0,
        orphanedLocal: [],
        orphanedSupabase: [],
        errors: []
      }
    };

    try {
      // Get sync status
      const syncStatus = await this.getSyncStatus();
      
      result.details.localUsers = syncStatus.filter(s => s.localExists).length;
      result.details.supabaseUsers = syncStatus.filter(s => s.supabaseExists).length;

      // Handle orphaned local users (exist locally but not in Supabase)
      const orphanedLocal = syncStatus.filter(s => s.localExists && !s.supabaseExists);
      for (const userStatus of orphanedLocal) {
        try {
          console.log(`🔧 Creating orphaned local user in Supabase: ${userStatus.email}`);
          
          const { data: supabaseData, error: supabaseError } = await supabase.auth.admin.createUser({
            email: userStatus.email,
            password: 'temp-password-' + Date.now(), // Temporary password
            email_confirm: userStatus.localData?.emailVerified || false,
            user_metadata: {
              name: userStatus.localData?.name || '',
              full_name: userStatus.localData?.name || '',
              display_name: userStatus.localData?.name || '',
              role: userStatus.localData?.role || 'student',
              registration_date: userStatus.localData?.createdAt?.toISOString() || new Date().toISOString(),
              registration_source: 'sync_service'
            }
          });

          if (supabaseError) {
            console.error(`❌ Failed to create user in Supabase: ${userStatus.email}`, supabaseError);
            result.details.errors.push(`Failed to create ${userStatus.email} in Supabase: ${supabaseError.message}`);
          } else {
            console.log(`✅ Created user in Supabase: ${userStatus.email}`);
            result.details.syncedUsers++;
          }
        } catch (error) {
          console.error(`❌ Error syncing local user ${userStatus.email}:`, error);
          result.details.errors.push(`Error syncing ${userStatus.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Handle orphaned Supabase users (exist in Supabase but not locally)
      const orphanedSupabase = syncStatus.filter(s => !s.localExists && s.supabaseExists);
      for (const userStatus of orphanedSupabase) {
        try {
          console.log(`🗑️ Cleaning up orphaned Supabase user: ${userStatus.email}`);
          
          const { error: deleteError } = await supabase.auth.admin.deleteUser(userStatus.supabaseData.id);
          if (deleteError) {
            console.error(`❌ Failed to delete orphaned Supabase user: ${userStatus.email}`, deleteError);
            result.details.errors.push(`Failed to delete orphaned user ${userStatus.email}: ${deleteError.message}`);
          } else {
            console.log(`✅ Deleted orphaned Supabase user: ${userStatus.email}`);
            result.details.orphanedSupabase.push(userStatus.email);
          }
        } catch (error) {
          console.error(`❌ Error cleaning up orphaned Supabase user ${userStatus.email}:`, error);
          result.details.errors.push(`Error cleaning up ${userStatus.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Handle data inconsistencies for synced users
      const inconsistentUsers = syncStatus.filter(s => s.localExists && s.supabaseExists && !s.inSync);
      for (const userStatus of inconsistentUsers) {
        try {
          console.log(`🔧 Fixing data inconsistency for: ${userStatus.email}`);
          
          // Update Supabase user metadata to match local data
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            userStatus.supabaseData.id,
            {
              user_metadata: {
                name: userStatus.localData.name,
                full_name: userStatus.localData.name,
                display_name: userStatus.localData.name,
                role: userStatus.localData.role,
                registration_date: userStatus.localData.createdAt?.toISOString(),
                registration_source: 'sync_service'
              }
            }
          );

          if (updateError) {
            console.error(`❌ Failed to update Supabase user: ${userStatus.email}`, updateError);
            result.details.errors.push(`Failed to update ${userStatus.email} in Supabase: ${updateError.message}`);
          } else {
            console.log(`✅ Updated Supabase user: ${userStatus.email}`);
            result.details.syncedUsers++;
          }
        } catch (error) {
          console.error(`❌ Error fixing inconsistency for ${userStatus.email}:`, error);
          result.details.errors.push(`Error fixing ${userStatus.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Update result
      result.details.orphanedLocal = orphanedLocal.map(u => u.email);
      result.success = result.details.errors.length === 0;
      result.message = result.success 
        ? `Sync completed successfully. Synced ${result.details.syncedUsers} users.`
        : `Sync completed with ${result.details.errors.length} errors.`;

      console.log('✅ Comprehensive user sync completed');
      console.log('📊 Sync summary:', result.details);

      return result;

    } catch (error) {
      console.error('❌ Fatal error during sync:', error);
      result.success = false;
      result.message = 'Sync failed due to fatal error';
      result.details.errors.push(`Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  /**
   * Sync a specific user by email
   */
  static async syncUserByEmail(email: string): Promise<{ success: boolean; message: string }> {
    console.log(`🔄 Syncing specific user: ${email}`);
    
    try {
      // Get local user
      const localUsers = await db.select().from(user).where(eq(user.email, email)).limit(1);
      const localUser = localUsers[0];

      // Get Supabase user by listing all users and filtering by email
      const { data: supabaseUsers, error: supabaseError } = await supabase.auth.admin.listUsers();
      
      if (supabaseError) {
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }

      const supabaseUserData = supabaseUsers.users.find(user => user.email === email);

      if (localUser && supabaseUserData) {
        // Both exist - check for inconsistencies
        console.log(`🔍 Both local and Supabase users exist for ${email} - checking consistency`);
        
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          supabaseUserData.id,
          {
            user_metadata: {
              name: localUser.name,
              full_name: localUser.name,
              display_name: localUser.name,
              role: localUser.role,
              registration_date: localUser.createdAt?.toISOString(),
              registration_source: 'sync_service'
            }
          }
        );

        if (updateError) {
          throw new Error(`Failed to update Supabase user: ${updateError.message}`);
        }

        return { success: true, message: `User ${email} synced successfully` };

      } else if (localUser && !supabaseUserData) {
        // Local exists but not Supabase - create in Supabase
        console.log(`🔧 Creating user in Supabase: ${email}`);
        
        const { data: supabaseData, error: supabaseError } = await supabase.auth.admin.createUser({
          email: localUser.email,
          password: 'temp-password-' + Date.now(),
          email_confirm: localUser.emailVerified || false,
          user_metadata: {
            name: localUser.name,
            full_name: localUser.name,
            display_name: localUser.name,
            role: localUser.role,
            registration_date: localUser.createdAt?.toISOString(),
            registration_source: 'sync_service'
          }
        });

        if (supabaseError) {
          throw new Error(`Failed to create user in Supabase: ${supabaseError.message}`);
        }

        return { success: true, message: `User ${email} created in Supabase` };

      } else if (!localUser && supabaseUserData) {
        // Supabase exists but not local - delete from Supabase
        console.log(`🗑️ Deleting orphaned Supabase user: ${email}`);
        
        const { error: deleteError } = await supabase.auth.admin.deleteUser(supabaseUserData.id);
        if (deleteError) {
          throw new Error(`Failed to delete orphaned Supabase user: ${deleteError.message}`);
        }

        return { success: true, message: `Orphaned user ${email} deleted from Supabase` };

      } else {
        // Neither exists
        return { success: true, message: `User ${email} does not exist in either system` };
      }

    } catch (error) {
      console.error(`❌ Error syncing user ${email}:`, error);
      return { 
        success: false, 
        message: `Failed to sync user ${email}: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Validate data integrity between systems
   */
  static async validateDataIntegrity(): Promise<{
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    console.log('🔍 Validating data integrity...');
    
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      const syncStatus = await this.getSyncStatus();
      
      // Check for orphaned users
      const orphanedLocal = syncStatus.filter(s => s.localExists && !s.supabaseExists);
      const orphanedSupabase = syncStatus.filter(s => !s.localExists && s.supabaseExists);
      
      if (orphanedLocal.length > 0) {
        issues.push(`${orphanedLocal.length} users exist in local database but not in Supabase`);
        recommendations.push('Run sync to create missing users in Supabase');
      }
      
      if (orphanedSupabase.length > 0) {
        issues.push(`${orphanedSupabase.length} users exist in Supabase but not in local database`);
        recommendations.push('Run sync to clean up orphaned Supabase users');
      }

      // Check for data inconsistencies
      const inconsistentUsers = syncStatus.filter(s => s.localExists && s.supabaseExists && !s.inSync);
      if (inconsistentUsers.length > 0) {
        issues.push(`${inconsistentUsers.length} users have data inconsistencies between systems`);
        recommendations.push('Run sync to fix data inconsistencies');
      }

      const isValid = issues.length === 0;
      
      console.log(`✅ Data integrity validation completed. Valid: ${isValid}, Issues: ${issues.length}`);
      
      return {
        isValid,
        issues,
        recommendations
      };

    } catch (error) {
      console.error('❌ Error validating data integrity:', error);
      return {
        isValid: false,
        issues: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        recommendations: ['Check system connectivity and try again']
      };
    }
  }
}
