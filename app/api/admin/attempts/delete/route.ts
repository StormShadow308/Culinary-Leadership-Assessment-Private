import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { attempts, responses } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { attemptId } = await request.json();

    if (!attemptId) {
      return NextResponse.json({ error: 'Attempt ID is required' }, { status: 400 });
    }

    // Check if attempt exists
    const attemptToDelete = await db.select().from(attempts).where(eq(attempts.id, attemptId)).limit(1);
    if (attemptToDelete.length === 0) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    // Delete attempt and all related data in a transaction
    await db.transaction(async (tx) => {
      // Delete responses for this attempt
      await tx.delete(responses).where(eq(responses.attemptId, attemptId));
      
      // Delete attempt
      await tx.delete(attempts).where(eq(attempts.id, attemptId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting attempt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
