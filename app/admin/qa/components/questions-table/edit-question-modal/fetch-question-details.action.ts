'use server';

import { db } from '~/db';
import { correctAnswers, options } from '~/db/schema';

import { eq } from 'drizzle-orm';

export async function fetchQuestionDetailsAction(questionId: number) {
  try {
    // Fetch options for the question
    const optionsData = await db
      .select()
      .from(options)
      .where(eq(options.questionId, questionId))
      .execute();

    // Fetch correct answers for the question
    const correctAnswersData = await db
      .select()
      .from(correctAnswers)
      .where(eq(correctAnswers.questionId, questionId))
      .execute();

    return {
      options: optionsData,
      correctAnswers: correctAnswersData.length > 0 ? correctAnswersData[0] : null,
    };
  } catch (error) {
    console.error('Error fetching question details:', error);
    throw new Error('Failed to fetch question details');
  }
}
