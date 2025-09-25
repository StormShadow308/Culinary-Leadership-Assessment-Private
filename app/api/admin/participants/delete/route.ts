import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { participants, attempts, responses } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { participantId } = await request.json();

    if (!participantId) {
      return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
    }

    // Check if participant exists
    const participantToDelete = await db.select().from(participants).where(eq(participants.id, participantId)).limit(1);
    if (participantToDelete.length === 0) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    // Delete participant and all related data in a transaction
    await db.transaction(async (tx) => {
      // Get all attempts for this participant
      const participantAttempts = await tx.select({ id: attempts.id }).from(attempts)
        .where(eq(attempts.participantId, participantId));
      
      // Delete responses for all attempts
      for (const attempt of participantAttempts) {
        await tx.delete(responses).where(eq(responses.attemptId, attempt.id));
      }
      
      // Delete attempts
      await tx.delete(attempts).where(eq(attempts.participantId, participantId));
      
      // Delete participant
      await tx.delete(participants).where(eq(participants.id, participantId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
