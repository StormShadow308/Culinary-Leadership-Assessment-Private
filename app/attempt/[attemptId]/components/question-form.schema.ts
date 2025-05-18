import z from 'zod';

// Schema for the next action
export const nextQuestionSchema = z.object({
  attemptId: z.string().uuid(),
  questionId: z.number().int().positive(),
  bestOptionId: z.string().min(1),
  worstOptionId: z.string().min(1),
});

// Schema for the previous action
export const previousQuestionSchema = z.object({
  attemptId: z.string().uuid(),
  currentQuestionOrder: z.number().int().positive(),
});

// Infer types from schemas
export type NextQuestionForm = z.infer<typeof nextQuestionSchema>;
export type PreviousQuestionForm = z.infer<typeof previousQuestionSchema>;
