import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { cohorts, participants, member, attempts, responses } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq, and, sql } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { cohortId: string; studentId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { cohortId, studentId } = params;

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

    // Verify cohort exists and belongs to user's organization
    const cohort = await db
      .select()
      .from(cohorts)
      .where(
        and(
          eq(cohorts.id, cohortId),
          eq(cohorts.organizationId, organizationId)
        )
      )
      .limit(1);

    if (cohort.length === 0) {
      return NextResponse.json({ error: 'Cohort not found or access denied' }, { status: 404 });
    }

    // Verify student exists and belongs to this cohort
    const student = await db
      .select()
      .from(participants)
      .where(
        and(
          eq(participants.id, studentId),
          eq(participants.cohortId, cohortId)
        )
      )
      .limit(1);

    if (student.length === 0) {
      return NextResponse.json({ error: 'Student not found in this cohort' }, { status: 404 });
    }

    // Remove student and all related data in a transaction
    await db.transaction(async (tx) => {
      // Delete responses for attempts from this student
      await tx.execute(sql`
        DELETE FROM responses 
        WHERE attempt_id IN (
          SELECT id FROM attempts 
          WHERE participant_id = ${studentId}
        )
      `);

      // Delete attempts for this student
      await tx.delete(attempts).where(eq(attempts.participantId, studentId));

      // Delete the student
      await tx.delete(participants).where(eq(participants.id, studentId));
    });

    console.log('✅ Student removed from cohort successfully:', { studentId, cohortId });
    return NextResponse.json({ message: 'Student removed from cohort successfully' });
  } catch (error) {
    console.error('Error removing student from cohort:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
