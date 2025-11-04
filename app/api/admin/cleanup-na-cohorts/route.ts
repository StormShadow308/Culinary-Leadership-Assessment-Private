import { NextResponse } from 'next/server';
import { db } from '~/db';
import { cohorts, participants } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq } from 'drizzle-orm';

/**
 * API endpoint to cleanup duplicate cohorts in N/A Organization
 * Only keeps the "Independent Learners" cohort and reassigns all participants to it
 */
export async function POST() {
  try {
    const currentUser = await getCurrentUser();
    
    // Only admins can run this cleanup
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('🧹 Starting N/A Organization cohorts cleanup...');

    // Step 1: Find all cohorts for org_default_students
    const allNACohorts = await db
      .select()
      .from(cohorts)
      .where(eq(cohorts.organizationId, 'org_default_students'))
      .execute();

    console.log(`📊 Found ${allNACohorts.length} cohorts for N/A Organization`);

    if (allNACohorts.length === 0) {
      return NextResponse.json({ 
        error: 'No cohorts found for N/A Organization. Please run setup-default-cohorts first.' 
      }, { status: 404 });
    }

    if (allNACohorts.length === 1) {
      return NextResponse.json({ 
        message: 'Only one cohort exists. No cleanup needed!',
        cohorts: allNACohorts 
      });
    }

    // Step 2: Find the "Independent Learners" cohort
    const independentLearnersCohort = allNACohorts.find(
      cohort => cohort.name === 'Independent Learners'
    );

    if (!independentLearnersCohort) {
      return NextResponse.json({ 
        error: '"Independent Learners" cohort not found. Please run setup-default-cohorts first.' 
      }, { status: 404 });
    }

    console.log(`✅ Found "Independent Learners" cohort (ID: ${independentLearnersCohort.id})`);

    // Step 3: Get cohorts to delete
    const cohortsToDelete = allNACohorts.filter(
      cohort => cohort.id !== independentLearnersCohort.id
    );

    const deletedCohorts: string[] = [];
    let totalReassigned = 0;

    // Step 4: Reassign participants and delete cohorts
    for (const cohort of cohortsToDelete) {
      console.log(`🔄 Processing cohort: ${cohort.name}`);

      // Find participants in this cohort
      const participantsInCohort = await db
        .select()
        .from(participants)
        .where(eq(participants.cohortId, cohort.id))
        .execute();

      if (participantsInCohort.length > 0) {
        // Reassign participants to "Independent Learners" cohort
        await db
          .update(participants)
          // @ts-expect-error - TypeScript doesn't recognize cohortId in set
          .set({ cohortId: independentLearnersCohort.id })
          .where(eq(participants.cohortId, cohort.id))
          .execute();

        totalReassigned += participantsInCohort.length;
        console.log(`   ✅ Reassigned ${participantsInCohort.length} participants`);
      }

      // Delete the cohort
      await db
        .delete(cohorts)
        .where(eq(cohorts.id, cohort.id))
        .execute();

      deletedCohorts.push(cohort.name);
      console.log(`   🗑️  Deleted cohort: ${cohort.name}`);
    }

    // Step 5: Verify cleanup
    const remainingCohorts = await db
      .select()
      .from(cohorts)
      .where(eq(cohorts.organizationId, 'org_default_students'))
      .execute();

    const totalParticipants = await db
      .select()
      .from(participants)
      .where(eq(participants.cohortId, independentLearnersCohort.id))
      .execute();

    console.log('✅ Cleanup complete!');

    return NextResponse.json({
      success: true,
      message: 'N/A Organization cohorts cleaned up successfully',
      details: {
        cohortsDeleted: deletedCohorts.length,
        deletedCohortNames: deletedCohorts,
        participantsReassigned: totalReassigned,
        remainingCohorts: remainingCohorts.length,
        totalParticipants: totalParticipants.length,
        finalCohort: {
          id: independentLearnersCohort.id,
          name: independentLearnersCohort.name
        }
      }
    });

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    return NextResponse.json({ 
      error: 'Failed to cleanup cohorts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
