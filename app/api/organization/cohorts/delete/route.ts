import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '~/db';
import { cohorts, participants, attempts, responses, member } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq, and, sql } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user's organization
    const userMembership = await db
      .select({ organizationId: member.organizationId })
      .from(member)
      .where(eq(member.userId, currentUser.id))
      .limit(1);

    if (userMembership.length === 0) {
      return NextResponse.json({ error: 'User is not associated with an organization' }, { status: 403 });
    }

    const organizationId = userMembership[0].organizationId;
    const { cohortId } = await request.json();

    if (!cohortId) {
      return NextResponse.json({ error: 'Cohort ID is required' }, { status: 400 });
    }

    // Check if cohort exists and belongs to user's organization
    const cohortToDelete = await db
      .select()
      .from(cohorts)
      .where(
        and(
          eq(cohorts.id, cohortId),
          eq(cohorts.organizationId, organizationId)
        )
      )
      .limit(1);

    if (cohortToDelete.length === 0) {
      return NextResponse.json({ error: 'Cohort not found or access denied' }, { status: 404 });
    }

    // Check if cohort has participants
    const participantCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(participants)
      .where(eq(participants.cohortId, cohortId));

    if (participantCount[0]?.count > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete cohort with existing participants. Please reassign or remove participants first.',
        code: 'COHORT_HAS_PARTICIPANTS'
      }, { status: 409 });
    }

    // Delete cohort and all related data in a transaction
    await db.transaction(async (tx) => {
      console.log('🔄 Starting comprehensive cohort deletion for cohortId:', cohortId);
      
      // Get all participants in this cohort for logging
      const cohortParticipants = await tx
        .select({ id: participants.id, email: participants.email, fullName: participants.fullName })
        .from(participants)
        .where(eq(participants.cohortId, cohortId));
      
      console.log('📋 Found participants to delete:', cohortParticipants.length);

      // Delete responses for attempts from participants in this cohort
      const deletedResponses = await tx.execute(sql`
        DELETE FROM responses 
        WHERE attempt_id IN (
          SELECT id FROM attempts 
          WHERE participant_id IN (
            SELECT id FROM participants 
            WHERE cohort_id = ${cohortId}
          )
        )
      `);
      console.log('🗑️ Deleted responses:', deletedResponses.rowCount);

      // Delete attempts for participants in this cohort
      const deletedAttempts = await tx.execute(sql`
        DELETE FROM attempts 
        WHERE participant_id IN (
          SELECT id FROM participants 
          WHERE cohort_id = ${cohortId}
        )
      `);
      console.log('🗑️ Deleted attempts:', deletedAttempts.rowCount);

      // Delete participants in this cohort
      const deletedParticipants = await tx
        .delete(participants)
        .where(eq(participants.cohortId, cohortId));
      console.log('🗑️ Deleted participants:', deletedParticipants.rowCount);

      // Finally delete the cohort
      const deletedCohort = await tx
        .delete(cohorts)
        .where(eq(cohorts.id, cohortId));
      console.log('🗑️ Deleted cohort:', deletedCohort.rowCount);

      console.log('✅ Comprehensive cohort deletion completed successfully');
    });

    // Revalidate all relevant pages to ensure data consistency
    revalidatePath('/organisation/cohorts');
    revalidatePath('/organisation');
    revalidatePath('/admin');
    revalidatePath('/admin/cohorts');
    revalidatePath('/admin/overview');

    console.log('✅ Organization cohort deleted successfully:', cohortId);
    return NextResponse.json({ message: 'Cohort deleted successfully' });
  } catch (error) {
    console.error('Error deleting organization cohort:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
