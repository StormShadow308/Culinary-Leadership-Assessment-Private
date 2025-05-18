'use server';

import { revalidatePath } from 'next/cache';

import { db } from '~/db';
import { correctAnswers, options, questions } from '~/db/schema';

import { actionClient } from '~/lib/action';

import { eq } from 'drizzle-orm';

import { editQuestionSchema } from './edit-question.schema';

export const editQuestionAction = actionClient
  .schema(editQuestionSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { questionId, text, bestOptionId, worstOptionId, optionUpdates } = parsedInput;

      // Update question text if provided
      if (text !== undefined) {
        await db.update(questions).set({ text }).where(eq(questions.id, questionId)).execute();
      }

      // Update correct answers if both options are provided
      if (bestOptionId !== undefined && worstOptionId !== undefined) {
        // Check if correct answers already exist for this question
        const existingAnswers = await db
          .select()
          .from(correctAnswers)
          .where(eq(correctAnswers.questionId, questionId))
          .execute();

        if (existingAnswers.length > 0) {
          // Update existing correct answers
          await db
            .update(correctAnswers)
            .set({
              bestOptionId,
              worstOptionId,
            })
            .where(eq(correctAnswers.questionId, questionId))
            .execute();
        } else {
          // Insert new correct answers
          await db
            .insert(correctAnswers)
            .values({
              questionId,
              bestOptionId,
              worstOptionId,
            })
            .execute();
        }
      }

      // Update option texts if provided
      if (optionUpdates && optionUpdates.length > 0) {
        for (const update of optionUpdates) {
          await db
            .update(options)
            .set({ text: update.text })
            .where(eq(options.id, update.optionId))
            .execute();
        }
      }

      // Revalidate cached data
      revalidatePath('/admin/qa');

      return {
        success: true,
        message: 'Question updated successfully',
      };
    } catch (error) {
      console.error('Error updating question:', error);
      return {
        error: 'update_failed',
        message: 'Failed to update question',
      };
    }
  });
