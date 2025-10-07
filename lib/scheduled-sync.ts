import { SyncService } from './sync-service';

/**
 * Scheduled sync job that runs automatically to maintain data consistency
 * This should be called periodically (e.g., every hour) via a cron job or similar
 */
export class ScheduledSync {
  private static isRunning = false;
  private static lastRun: Date | null = null;
  private static runCount = 0;

  /**
   * Run the scheduled sync job
   */
  static async runScheduledSync(): Promise<{
    success: boolean;
    message: string;
    details: any;
  }> {
    // Prevent concurrent runs
    if (this.isRunning) {
      console.log('⏳ Scheduled sync already running, skipping...');
      return {
        success: false,
        message: 'Sync already running',
        details: { skipped: true }
      };
    }

    try {
      this.isRunning = true;
      this.runCount++;
      console.log(`🔄 Starting scheduled sync job #${this.runCount}...`);

      // Validate data integrity first
      const validation = await SyncService.validateDataIntegrity();
      
      if (validation.isValid) {
        console.log('✅ Data integrity check passed - no sync needed');
        this.lastRun = new Date();
        return {
          success: true,
          message: 'Data is already in sync',
          details: { 
            validated: true,
            runCount: this.runCount,
            lastRun: this.lastRun
          }
        };
      }

      // Run sync if issues found
      console.log('⚠️ Data integrity issues found, running sync...');
      const syncResult = await SyncService.syncAllUsers();
      
      this.lastRun = new Date();
      console.log(`✅ Scheduled sync job #${this.runCount} completed`);

      return {
        success: syncResult.success,
        message: syncResult.message,
        details: {
          ...syncResult.details,
          runCount: this.runCount,
          lastRun: this.lastRun
        }
      };

    } catch (error) {
      console.error('❌ Scheduled sync job failed:', error);
      return {
        success: false,
        message: 'Scheduled sync failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          runCount: this.runCount,
          lastRun: this.lastRun
        }
      };
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Get sync job status
   */
  static getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      runCount: this.runCount
    };
  }

  /**
   * Reset sync job status (for testing)
   */
  static reset() {
    this.isRunning = false;
    this.lastRun = null;
    this.runCount = 0;
  }
}

// Auto-run sync every hour (in production, use a proper cron job)
if (typeof window === 'undefined') {
  // Only run on server side
  setInterval(async () => {
    try {
      await ScheduledSync.runScheduledSync();
    } catch (error) {
      console.error('❌ Scheduled sync interval error:', error);
    }
  }, 60 * 60 * 1000); // 1 hour
}
