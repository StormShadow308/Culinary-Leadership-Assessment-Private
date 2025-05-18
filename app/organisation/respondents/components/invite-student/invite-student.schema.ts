import { z } from 'zod';

export const inviteFormSchema = z.object({
  name: z.string().min(1, 'Name is a required field'),
  email: z.string().email('Invalid email address'),
  cohort: z.string().min(1, 'Cohort is a required field'),
  stayOut: z.enum(['Stay', 'Out']).default('Stay'),
  organizationId: z.string().min(1, 'Organization ID is a required field'),
});
