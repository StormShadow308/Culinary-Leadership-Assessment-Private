import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '~/db';
import { organization, member, cohorts, participants, attempts, responses, invitation, session } from '~/db/schema';
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
      console.log(`🗑️ Starting comprehensive deletion for organization: ${organizationId}`);
      
      // Get all participants for this organization
      const orgParticipants = await tx.select({ id: participants.id }).from(participants)
        .where(eq(participants.organizationId, organizationId));
      console.log(`📊 Found ${orgParticipants.length} participants to delete`);
      
      // Delete responses for all attempts of these participants
      let totalResponsesDeleted = 0;
      for (const participant of orgParticipants) {
        const participantAttempts = await tx.select({ id: attempts.id }).from(attempts)
          .where(eq(attempts.participantId, participant.id));
        
        for (const attempt of participantAttempts) {
          const deletedResponses = await tx.delete(responses).where(eq(responses.attemptId, attempt.id));
          totalResponsesDeleted += deletedResponses.rowCount || 0;
        }
      }
      console.log(`🗑️ Deleted ${totalResponsesDeleted} responses`);
      
      // Delete attempts for these participants
      let totalAttemptsDeleted = 0;
      for (const participant of orgParticipants) {
        const deletedAttempts = await tx.delete(attempts).where(eq(attempts.participantId, participant.id));
        totalAttemptsDeleted += deletedAttempts.rowCount || 0;
      }
      console.log(`🗑️ Deleted ${totalAttemptsDeleted} attempts`);
      
      // Delete participants
      const deletedParticipants = await tx.delete(participants).where(eq(participants.organizationId, organizationId));
      console.log(`🗑️ Deleted ${deletedParticipants.rowCount} participants`);
      
      // Delete cohorts
      const deletedCohorts = await tx.delete(cohorts).where(eq(cohorts.organizationId, organizationId));
      console.log(`🗑️ Deleted ${deletedCohorts.rowCount} cohorts`);
      
      // Delete invitations
      const deletedInvitations = await tx.delete(invitation).where(eq(invitation.organizationId, organizationId));
      console.log(`🗑️ Deleted ${deletedInvitations.rowCount} invitations`);
      
      // Clear active_organization_id from sessions (set to null)
      const updatedSessions = await tx.update(session)
        .set({ activeOrganizationId: null })
        .where(eq(session.activeOrganizationId, organizationId));
      console.log(`🔄 Updated ${updatedSessions.rowCount} sessions (cleared active_organization_id)`);
      
      // Delete memberships
      const deletedMembers = await tx.delete(member).where(eq(member.organizationId, organizationId));
      console.log(`🗑️ Deleted ${deletedMembers.rowCount} members`);
      
      // Finally delete the organization
      const deletedOrg = await tx.delete(organization).where(eq(organization.id, organizationId));
      console.log(`🗑️ Deleted organization: ${deletedOrg.rowCount}`);
      
      console.log(`✅ Comprehensive organization deletion completed successfully`);
    });

    // Revalidate all relevant pages to ensure data consistency
    revalidatePath('/admin/organizations');
    revalidatePath('/admin');
    revalidatePath('/admin/overview');
    revalidatePath('/admin/cohorts');
    revalidatePath('/admin/participants');
    revalidatePath('/admin/answers');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
