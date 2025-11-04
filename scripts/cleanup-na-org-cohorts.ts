/**
 * Cleanup Script: Remove duplicate/wrong cohorts from N/A Organization
 * 
 * This script:
 * 1. Finds all cohorts for org_default_students
 * 2. Identifies the "Independent Learners" cohort (the one we want to keep)
 * 3. Reassigns all participants from other cohorts to "Independent Learners"
 * 4. Deletes the duplicate/wrong cohorts
 */

import { db } from '../db';
import { cohorts, participants } from '../db/schema';
import { eq, and, ne } from 'drizzle-orm';

async function cleanupNAOrgCohorts() {
  console.log('🧹 Starting N/A Organization cohorts cleanup...\n');

  try {
    // Step 1: Find all cohorts for org_default_students
    const allNACohorts = await db
      .select()
      .from(cohorts)
      .where(eq(cohorts.organizationId, 'org_default_students'))
      .execute();

    console.log(`📊 Found ${allNACohorts.length} cohorts for N/A Organization:`);
    allNACohorts.forEach(cohort => {
      console.log(`   - ${cohort.name} (ID: ${cohort.id})`);
    });
    console.log('');

    if (allNACohorts.length === 0) {
      console.log('❌ No cohorts found for N/A Organization!');
      console.log('⚠️  Please run the setup-default-cohorts API first.');
      return;
    }

    if (allNACohorts.length === 1) {
      console.log('✅ Only one cohort exists. No cleanup needed!');
      return;
    }

    // Step 2: Find the "Independent Learners" cohort (the one we want to keep)
    const independentLearnersCohort = allNACohorts.find(
      cohort => cohort.name === 'Independent Learners'
    );

    if (!independentLearnersCohort) {
      console.log('❌ "Independent Learners" cohort not found!');
      console.log('⚠️  Please run the setup-default-cohorts API first.');
      return;
    }

    console.log(`✅ Found "Independent Learners" cohort (ID: ${independentLearnersCohort.id})`);
    console.log('');

    // Step 3: Get cohorts to delete (all except "Independent Learners")
    const cohortsToDelete = allNACohorts.filter(
      cohort => cohort.id !== independentLearnersCohort.id
    );

    if (cohortsToDelete.length === 0) {
      console.log('✅ No duplicate cohorts to clean up!');
      return;
    }

    console.log(`🗑️  Found ${cohortsToDelete.length} cohorts to delete:`);
    cohortsToDelete.forEach(cohort => {
      console.log(`   - ${cohort.name} (ID: ${cohort.id})`);
    });
    console.log('');

    // Step 4: For each cohort to delete, reassign participants
    for (const cohort of cohortsToDelete) {
      console.log(`🔄 Processing cohort: ${cohort.name}`);

      // Find participants in this cohort
      const participantsInCohort = await db
        .select()
        .from(participants)
        .where(eq(participants.cohortId, cohort.id))
        .execute();

      console.log(`   📋 Found ${participantsInCohort.length} participants`);

      if (participantsInCohort.length > 0) {
        // Reassign participants to "Independent Learners" cohort
        await db
          .update(participants)
          // @ts-expect-error - TypeScript doesn't recognize cohortId in set
          .set({ cohortId: independentLearnersCohort.id })
          .where(eq(participants.cohortId, cohort.id))
          .execute();

        console.log(`   ✅ Reassigned ${participantsInCohort.length} participants to "Independent Learners"`);
      }

      // Delete the cohort
      await db
        .delete(cohorts)
        .where(eq(cohorts.id, cohort.id))
        .execute();

      console.log(`   🗑️  Deleted cohort: ${cohort.name}`);
      console.log('');
    }

    // Step 5: Verify cleanup
    const remainingCohorts = await db
      .select()
      .from(cohorts)
      .where(eq(cohorts.organizationId, 'org_default_students'))
      .execute();

    console.log('✅ Cleanup complete!');
    console.log(`📊 Remaining cohorts for N/A Organization: ${remainingCohorts.length}`);
    remainingCohorts.forEach(cohort => {
      console.log(`   - ${cohort.name} (ID: ${cohort.id})`);
    });

    // Count total participants
    const totalParticipants = await db
      .select()
      .from(participants)
      .where(eq(participants.cohortId, independentLearnersCohort.id))
      .execute();

    console.log(`\n👥 Total participants in "Independent Learners": ${totalParticipants.length}`);
    console.log('\n🎉 N/A Organization now has a single cohort as intended!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

// Run the cleanup
cleanupNAOrgCohorts()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
