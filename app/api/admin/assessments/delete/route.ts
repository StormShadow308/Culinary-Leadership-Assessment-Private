import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { assessments, questions, options, correctAnswers, attempts } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq, sql } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { assessmentId } = await request.json();

    if (!assessmentId) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 });
    }

    // Check if assessment exists
    const assessmentToDelete = await db.select().from(assessments).where(eq(assessments.id, assessmentId)).limit(1);
    if (assessmentToDelete.length === 0) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Delete assessment and all related data in a transaction
    await db.transaction(async (tx) => {
      // Get all questions for this assessment
      const assessmentQuestions = await tx.select({ id: questions.id }).from(questions)
        .where(eq(questions.assessmentId, assessmentId));
      
      // Delete responses for all attempts of these questions
      for (const question of assessmentQuestions) {
        await tx.execute(sql`DELETE FROM responses WHERE question_id = ${question.id}`);
      }
      
      // Delete correct answers for these questions
      for (const question of assessmentQuestions) {
        await tx.delete(correctAnswers).where(eq(correctAnswers.questionId, question.id));
      }
      
      // Delete options for these questions
      for (const question of assessmentQuestions) {
        await tx.delete(options).where(eq(options.questionId, question.id));
      }
      
      // Delete questions
      await tx.delete(questions).where(eq(questions.assessmentId, assessmentId));
      
      // Delete attempts for this assessment
      await tx.delete(attempts).where(eq(attempts.assessmentId, assessmentId));
      
      // Delete assessment
      await tx.delete(assessments).where(eq(assessments.id, assessmentId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
