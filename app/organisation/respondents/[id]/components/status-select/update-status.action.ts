'use server';

import { z } from 'zod';

import { db } from '~/db';
import { participants } from '~/db/schema';

import { actionClient } from '~/lib/action';

import { eq } from 'drizzle-orm';

const updateStudentStatusSchema = z.object({
  studentId: z.string().uuid(),
  status: z.enum(['Stay', 'Out']),
});

export const updateStudentStatusAction = actionClient
  .schema(updateStudentStatusSchema)
  .action(async ({ parsedInput: { studentId, status } }) => {
    try {
      // @ts-expect-error drizzle-orm
      await db.update(participants).set({ stayOut: status }).where(eq(participants.id, studentId));

      return {
        success: true,
        message: 'Status updated successfully',
      };
    } catch (error) {
      console.error('Error updating student status:', error);
      return {
        error: 'status_update_failed',
        message: 'Failed to update student status',
      };
    }
  });
