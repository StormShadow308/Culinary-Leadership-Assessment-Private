'use server';

import { headers } from 'next/headers';

import { z } from 'zod';

import { eq } from 'drizzle-orm';

import { db } from '~/db';
import { user } from '~/db/schema';

import { actionClient, ActionError } from '~/lib/action';
import { auth } from '~/lib/auth';

const payloadSchema = z.object({
  role: z.enum(['student', 'organization']),
});

export const setUserRoleAction = actionClient
  .schema(payloadSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      throw new ActionError('UNAUTHORIZED');
    }

    await db.update(user).set({ role: parsedInput.role }).where(eq(user.id, session.user.id));

    return { ok: true } as const;
  });


