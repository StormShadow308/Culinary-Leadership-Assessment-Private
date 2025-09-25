import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { questions, options, correctAnswers } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq, sql } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { questionId } = await request.json();

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    // Check if question exists
    const questionToDelete = await db.select().from(questions).where(eq(questions.id, questionId)).limit(1);
    if (questionToDelete.length === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Delete question and all related data in a transaction
    await db.transaction(async (tx) => {
      // Delete responses for this question
      await tx.execute(sql`DELETE FROM responses WHERE question_id = ${questionId}`);
      
      // Delete correct answers for this question
      await tx.delete(correctAnswers).where(eq(correctAnswers.questionId, questionId));
      
      // Delete options for this question
      await tx.delete(options).where(eq(options.questionId, questionId));
      
      // Delete question
      await tx.delete(questions).where(eq(questions.id, questionId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
