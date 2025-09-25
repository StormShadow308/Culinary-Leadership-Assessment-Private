import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { organization, member, cohorts, participants, attempts, responses } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { organizationId } = await request.json();

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    // Prevent deletion of system organizations
    const orgToDelete = await db.select().from(organization).where(eq(organization.id, organizationId)).limit(1);
    if (orgToDelete.length === 0) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    if (orgToDelete[0].name === 'System' || orgToDelete[0].name === 'Default') {
      return NextResponse.json({ error: 'Cannot delete system organizations' }, { status: 400 });
    }

    // Delete organization and all related data in a transaction
    await db.transaction(async (tx) => {
      // Get all participants for this organization
      const orgParticipants = await tx.select({ id: participants.id }).from(participants)
        .where(eq(participants.organizationId, organizationId));
      
      // Delete responses for all attempts of these participants
      for (const participant of orgParticipants) {
        const participantAttempts = await tx.select({ id: attempts.id }).from(attempts)
          .where(eq(attempts.participantId, participant.id));
        
        for (const attempt of participantAttempts) {
          await tx.delete(responses).where(eq(responses.attemptId, attempt.id));
        }
      }
      
      // Delete attempts for these participants
      for (const participant of orgParticipants) {
        await tx.delete(attempts).where(eq(attempts.participantId, participant.id));
      }
      
      // Delete participants
      await tx.delete(participants).where(eq(participants.organizationId, organizationId));
      
      // Delete cohorts
      await tx.delete(cohorts).where(eq(cohorts.organizationId, organizationId));
      
      // Delete memberships
      await tx.delete(member).where(eq(member.organizationId, organizationId));
      
      // Delete organization
      await tx.delete(organization).where(eq(organization.id, organizationId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
