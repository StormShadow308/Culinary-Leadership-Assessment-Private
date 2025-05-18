'use server';

import { db } from '~/db';
import { attempts, correctAnswers, questions, responses } from '~/db/schema';

import { actionClient } from '~/lib/action';

import { and, count, eq, inArray } from 'drizzle-orm';

import { nextQuestionSchema, previousQuestionSchema } from './question-form.schema';

type CategoryResult = {
  category: string;
  score: number;
  total: number;
  percentage: number;
};

type AttemptResult = {
  totalScore: number;
  totalPossible: number;
  overallPercentage: number;
  categoryResults: Array<CategoryResult>;
};

export const saveResponseAction = actionClient
  .schema(nextQuestionSchema)
  .action(async ({ parsedInput: { attemptId, questionId, bestOptionId, worstOptionId } }) => {
    try {
      // Check if response exists
      const existingResponses = await db
        .select()
        .from(responses)
        .where(and(eq(responses.attemptId, attemptId), eq(responses.questionId, questionId)))
        .execute();

      if (existingResponses.length > 0) {
        // Update existing response
        await db
          .update(responses)
          .set({
            bestOptionId,
            worstOptionId,
          })
          .where(eq(responses.id, existingResponses[0].id))
          .execute();
      } else {
        // Create new response
        await db
          .insert(responses)
          .values({
            attemptId,
            questionId,
            bestOptionId,
            worstOptionId,
            createdAt: new Date().toISOString(),
          })
          .execute();
      }

      // Get the current attempt
      const [attempt] = await db
        .select()
        .from(attempts)
        .where(eq(attempts.id, attemptId))
        .execute();

      if (!attempt) {
        return { error: 'attempt_not_found', message: 'Attempt not found' };
      }

      // Get total question count
      const [{ count: totalCount }] = await db
        .select({ count: count() })
        .from(questions)
        .where(eq(questions.assessmentId, attempt.assessmentId))
        .execute();

      const totalQuestions = Number(totalCount) || 20; // Fallback to 20 if count fails

      // If this was the last question, calculate results and mark attempt as completed
      if (attempt.lastQuestionSeen >= totalQuestions) {
        // Calculate assessment results
        const results = await calculateAttemptResults(attemptId);

        // Mark attempt as completed and store results
        await db
          .update(attempts)
          .set({
            status: 'completed',
            completedAt: new Date().toISOString(),
            reportData: results,
          })
          .where(eq(attempts.id, attemptId))
          .execute();

        return { success: true, completed: true };
      }

      // Otherwise, update lastQuestionSeen
      await db
        .update(attempts)
        .set({
          lastQuestionSeen: attempt.lastQuestionSeen + 1,
        })
        .where(eq(attempts.id, attemptId))
        .execute();

      return {
        success: true,
        nextQuestion: attempt.lastQuestionSeen + 1,
      };
    } catch (error) {
      console.error('Error saving response:', error);
      return {
        error: 'save_failed',
        message: 'Failed to save response',
      };
    }
  });

// Helper function to calculate attempt results
async function calculateAttemptResults(attemptId: string): Promise<AttemptResult> {
  // Get all responses for this attempt with their corresponding questions
  const userResponses = await db
    .select({
      questionId: responses.questionId,
      bestOptionId: responses.bestOptionId,
      worstOptionId: responses.worstOptionId,
    })
    .from(responses)
    .where(eq(responses.attemptId, attemptId))
    .execute();

  const questionIds = userResponses.map(r => r.questionId);

  // Early return if no responses
  if (questionIds.length === 0) {
    return {
      totalScore: 0,
      totalPossible: 0,
      overallPercentage: 0,
      categoryResults: [],
    };
  }

  // Get question categories
  const questionCategories = await db
    .select({
      id: questions.id,
      category: questions.category,
    })
    .from(questions)
    .where(inArray(questions.id, questionIds))
    .execute();

  // Get correct answers
  const answers = await db
    .select({
      questionId: correctAnswers.questionId,
      bestOptionId: correctAnswers.bestOptionId,
      worstOptionId: correctAnswers.worstOptionId,
    })
    .from(correctAnswers)
    .where(inArray(correctAnswers.questionId, questionIds))
    .execute();

  // Create maps for easier lookup
  const responseMap = new Map(
    userResponses.map(r => [
      r.questionId,
      { bestOptionId: r.bestOptionId, worstOptionId: r.worstOptionId },
    ])
  );

  const correctAnswerMap = new Map(
    answers.map(a => [
      a.questionId,
      { bestOptionId: a.bestOptionId, worstOptionId: a.worstOptionId },
    ])
  );

  const categoryMap = new Map(questionCategories.map(q => [q.id, q.category]));

  // Initialize category scores
  const categoryCounts: Record<string, { correct: number; total: number }> = {};

  // Count points by category
  for (const questionId of questionIds) {
    const category = categoryMap.get(questionId);
    if (!category) continue;

    // Initialize category if not exists
    if (!categoryCounts[category]) {
      categoryCounts[category] = { correct: 0, total: 0 };
    }

    // Each question has 2 possible points (best and worst)
    categoryCounts[category].total += 2;

    const userResponse = responseMap.get(questionId);
    const correctAnswer = correctAnswerMap.get(questionId);

    if (userResponse && correctAnswer) {
      // Check best option
      if (userResponse.bestOptionId === correctAnswer.bestOptionId) {
        categoryCounts[category].correct += 1;
      }

      // Check worst option
      if (userResponse.worstOptionId === correctAnswer.worstOptionId) {
        categoryCounts[category].correct += 1;
      }
    }
  }

  // Convert to category results array
  const categoryResults: CategoryResult[] = Object.entries(categoryCounts).map(
    ([category, counts]) => ({
      category,
      score: counts.correct,
      total: counts.total,
      percentage: (counts.correct / counts.total) * 100,
    })
  );

  // Sort categories alphabetically
  categoryResults.sort((a, b) => a.category.localeCompare(b.category));

  // Calculate total score
  const totalScore = categoryResults.reduce((sum, cat) => sum + cat.score, 0);
  const totalPossible = categoryResults.reduce((sum, cat) => sum + cat.total, 0);
  const overallPercentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

  return {
    totalScore,
    totalPossible,
    overallPercentage,
    categoryResults,
  };
}

export const previousQuestionAction = actionClient
  .schema(previousQuestionSchema)
  .action(async ({ parsedInput: { attemptId, currentQuestionOrder } }) => {
    try {
      if (currentQuestionOrder <= 1) {
        return {
          success: true,
          message: 'Already at first question',
        };
      }

      // Update lastQuestionSeen to previous question
      await db
        .update(attempts)
        .set({
          lastQuestionSeen: currentQuestionOrder - 1,
        })
        .where(eq(attempts.id, attemptId))
        .execute();

      return {
        success: true,
        previousQuestion: currentQuestionOrder - 1,
      };
    } catch (error) {
      console.error('Error navigating to previous question:', error);
      return {
        error: 'navigation_failed',
        message: 'Failed to navigate to previous question',
      };
    }
  });
