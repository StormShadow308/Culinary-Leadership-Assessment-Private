import z from 'zod';

const newAssessmentSchema = z.object({
  fullName: z.string().min(1, { message: 'Name is a required field' }),
  email: z.string().min(1, { message: 'Email is a required field' }).email({
    message: 'Please enter a valid email address',
  }),
  forceContinue: z.boolean().optional().default(false),
  resetProgress: z.boolean().optional().default(false),
  assessmentId: z.string().uuid({ message: 'Valid assessment ID is required' }),
});

type NewAssessmentForm = z.infer<typeof newAssessmentSchema>;

export { newAssessmentSchema, type NewAssessmentForm };
