import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { cohorts, participants, attempts, responses } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq, sql } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { cohortId } = await request.json();

    if (!cohortId) {
      return NextResponse.json({ error: 'Cohort ID is required' }, { status: 400 });
    }

    // Check if cohort exists
    const cohortToDelete = await db.select().from(cohorts).where(eq(cohorts.id, cohortId)).limit(1);
    if (cohortToDelete.length === 0) {
      return NextResponse.json({ error: 'Cohort not found' }, { status: 404 });
    }

    // Delete cohort and all related data in a transaction
    await db.transaction(async (tx) => {
      // Get all participants in this cohort
      const cohortParticipants = await tx.select({ id: participants.id }).from(participants)
        .where(eq(participants.cohortId, cohortId));
      
      // Delete responses for all attempts of these participants
      for (const participant of cohortParticipants) {
        const participantAttempts = await tx.select({ id: attempts.id }).from(attempts)
          .where(eq(attempts.participantId, participant.id));
        
        for (const attempt of participantAttempts) {
          await tx.delete(responses).where(eq(responses.attemptId, attempt.id));
        }
      }
      
      // Delete attempts for these participants
      for (const participant of cohortParticipants) {
        await tx.delete(attempts).where(eq(attempts.participantId, participant.id));
      }
      
      // Update participants to remove cohort reference
      await tx.execute(sql`UPDATE participants SET cohort_id = NULL WHERE cohort_id = ${cohortId}`);
      
      // Delete cohort
      await tx.delete(cohorts).where(eq(cohorts.id, cohortId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cohort:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
