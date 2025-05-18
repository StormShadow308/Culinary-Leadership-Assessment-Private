import { z } from 'zod';

export const editQuestionSchema = z
  .object({
    questionId: z.number().int().positive(),
    text: z.string().optional(),
    bestOptionId: z.string().optional(),
    worstOptionId: z.string().optional(),
    optionUpdates: z
      .array(
        z.object({
          optionId: z.string(),
          text: z.string().min(1, 'Option text cannot be empty'),
        })
      )
      .optional(),
  })
  .refine(
    data => {
      // Either text, both bestOptionId and worstOptionId, or optionUpdates must be provided
      return (
        data.text !== undefined ||
        (data.bestOptionId !== undefined && data.worstOptionId !== undefined) ||
        (data.optionUpdates !== undefined && data.optionUpdates.length > 0)
      );
    },
    {
      message: 'Either question text, both answer options, or option updates must be provided',
    }
  )
  .refine(
    data => {
      // If both options are provided, they must be different
      if (data.bestOptionId && data.worstOptionId) {
        return data.bestOptionId !== data.worstOptionId;
      }
      return true;
    },
    {
      message: 'Best and worst options must be different',
      path: ['worstOptionId'],
    }
  );

export type FormValues = z.infer<typeof editQuestionSchema>;
