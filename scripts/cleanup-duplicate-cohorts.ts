import { db } from '~/db';
import { cohorts } from '~/db/schema';
import { sql } from 'drizzle-orm';

/**
 * Script to clean up duplicate cohorts in the database
 * This will keep the first occurrence of each cohort name per organization
 * and remove duplicates
 */
async function cleanupDuplicateCohorts() {
  try {
    console.log('🧹 Starting cleanup of duplicate cohorts...');

    // Find duplicate cohorts (same name and organization)
    const duplicatesResult = await db.execute(sql`
      SELECT organization_id, name, COUNT(*) as count
      FROM cohorts 
      GROUP BY organization_id, name 
      HAVING COUNT(*) > 1
      ORDER BY organization_id, name
    `);

    const duplicates = duplicatesResult.rows || [];
    console.log(`📊 Found ${duplicates.length} duplicate cohort groups`);

    if (duplicates.length === 0) {
      console.log('✅ No duplicate cohorts found. Database is clean.');
      return;
    }

    // Process each duplicate group
    for (const duplicate of duplicates) {
      const { organization_id, name, count } = duplicate as any;
      
      console.log(`🔍 Processing duplicates for "${name}" in organization ${organization_id} (${count} duplicates)`);

      // Get all cohorts with this name and organization, ordered by creation date
      const cohortDuplicates = await db
        .select()
        .from(cohorts)
        .where(
          sql`${cohorts.organizationId} = ${organization_id} AND ${cohorts.name} = ${name}`
        )
        .orderBy(cohorts.createdAt);

      if (cohortDuplicates.length <= 1) {
        console.log('⚠️ No duplicates found for this group, skipping...');
        continue;
      }

      // Keep the first one (oldest), delete the rest
      const toKeep = cohortDuplicates[0];
      const toDelete = cohortDuplicates.slice(1);

      console.log(`✅ Keeping cohort: ${toKeep.id} (created: ${toKeep.createdAt})`);
      
      for (const cohortToDelete of toDelete) {
        console.log(`🗑️ Deleting duplicate cohort: ${cohortToDelete.id} (created: ${cohortToDelete.createdAt})`);
        
        // Delete the duplicate cohort
        await db
          .delete(cohorts)
          .where(sql`${cohorts.id} = ${cohortToDelete.id}`);
      }
    }

    console.log('✅ Duplicate cohorts cleanup completed successfully!');

    // Verify cleanup
    const remainingDuplicatesResult = await db.execute(sql`
      SELECT organization_id, name, COUNT(*) as count
      FROM cohorts 
      GROUP BY organization_id, name 
      HAVING COUNT(*) > 1
    `);

    const remainingDuplicates = remainingDuplicatesResult.rows || [];
    if (remainingDuplicates.length === 0) {
      console.log('✅ Verification passed: No duplicate cohorts remain');
    } else {
      console.log(`⚠️ Warning: ${remainingDuplicates.length} duplicate groups still exist`);
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

// Run the cleanup if this script is executed directly
if (require.main === module) {
  cleanupDuplicateCohorts()
    .then(() => {
      console.log('🎉 Cleanup script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Cleanup script failed:', error);
      process.exit(1);
    });
}

export { cleanupDuplicateCohorts };
