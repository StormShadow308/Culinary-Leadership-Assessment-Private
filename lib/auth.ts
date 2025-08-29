import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin, organization } from 'better-auth/plugins';

import { db } from '~/db';
import {
  account,
  invitation,
  member,
  organization as organizationSchema,
  session,
  user,
} from '~/db/schema';

import { eq } from 'drizzle-orm';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      organization: organizationSchema,
      member,
      invitation,
    },
  }),
  emailAndPassword: {
    enabled: true,                                      
  },
  plugins: [admin(), organization(), nextCookies()],
  databaseHooks: {
    session: {
      create: {
        before: async session => {
          // Find the first member record for this user
          const memberRecord = await db
            .select()
            .from(member)
            .where(eq(member.userId, session.userId))
            .limit(1);

          // If no member record found, return the session as is
          if (!memberRecord.length) return { data: session };

          // Get the organization using the organizationId from the member record
          const organizationRecord = await db
            .select()
            .from(organizationSchema)
            .where(eq(organizationSchema.id, memberRecord[0].organizationId))
            .limit(1);

          // Get the user's organization from your database
          const organization = organizationRecord?.[0] ?? null;

          if (organization) {
            return {
              data: {
                ...session,
                activeOrganizationId: organization.id,
              },
            };
          }

          return { data: session };
        },
      },
    },
  },
});
