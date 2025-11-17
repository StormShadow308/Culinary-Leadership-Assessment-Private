'use server';

import { revalidatePath } from 'next/cache';

import { db } from '~/db';
import { assessments, attempts, cohorts, participants } from '~/db/schema';

import { actionClient } from '~/lib/action';
import { sendInvitationEmail, generateInviteLink } from '~/lib/invitation-service';
import { getCurrentUser } from '~/lib/user-sync';

import { and, eq, sql } from 'drizzle-orm';

import { inviteFormSchema } from './invite-student.schema';

export const inviteStudentAction = actionClient
  .schema(inviteFormSchema)
  .action(async ({ parsedInput: { name, email, cohort: cohortName, organizationId, stayOut } }) => {
    try {
      // Check if user is admin for cohort creation
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return { error: 'User not authenticated' };
      }

      // Validate organization ID
      if (!organizationId) {
        return { error: 'Organization ID is required' };
      }

      // Get environment variables
      const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

      // Check if cohort exists or create it
      let cohortId: string;
      
      // Special handling for N/A organization - only use existing "Independent Learners" cohort
      if (organizationId === 'org_default_students') {
        console.log('🏢 N/A Organization detected - using single "Independent Learners" cohort');
        const naOrgCohort = await db
          .select({ id: cohorts.id })
          .from(cohorts)
          .where(eq(cohorts.organizationId, 'org_default_students'))
          .limit(1)
          .execute();
        
        if (naOrgCohort.length === 0) {
          return { error: 'Independent Learners cohort not found. Please contact administrator.' };
        }
        
        cohortId = naOrgCohort[0].id;
        console.log('✅ Using Independent Learners cohort:', cohortId);
      } else {
        // For regular organizations, check if cohort exists or create it
        const existingCohort = await db
          .select({ id: cohorts.id })
          .from(cohorts)
          .where(and(eq(cohorts.name, cohortName), eq(cohorts.organizationId, organizationId)))
          .execute();

        if (existingCohort.length > 0) {
          cohortId = existingCohort[0].id;
        } else {
          // Organization users can now create new cohorts
          // Create new cohort
          const [newCohort] = await db
            .insert(cohorts)
            // @ts-expect-error - TypeScript doesn't recognize all the fields in the object
            .values({
              name: cohortName,
              organizationId: organizationId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
            .returning({ id: cohorts.id })
            .execute();

          cohortId = newCohort.id;
        }
      }

      // Check if participant already exists
      const existingParticipant = await db
        .select()
        .from(participants)
        .where(eq(participants.email, email))
        .execute();

      let participantId: string;

      if (existingParticipant.length > 0) {
        // Update existing participant
        participantId = existingParticipant[0].id;

        await db
          .update(participants)
          .set({
            // @ts-expect-error - TypeScript doesn't recognize all the fields in the object
            fullName: name,
            cohortId,
            stayOut,
            lastActiveAt: new Date().toISOString(),
          })
          .where(eq(participants.id, participantId))
          .execute();
      } else {
        // Create new participant
        const [newParticipant] = await db
          .insert(participants)
          // @ts-expect-error - TypeScript doesn't recognize all the fields in the object
          .values({
            email,
            fullName: name,
            cohortId,
            stayOut,
            createdAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
            organizationId,
          })
          .returning({ id: participants.id })
          .execute();

        participantId = newParticipant.id;
      }

      // Get the default assessment
      const [defaultAssessment] = await db.select().from(assessments).execute();

      if (!defaultAssessment) {
        return {
          error: 'no_assessment',
          message: 'No assessments found in the system',
        };
      }

      // Check existing attempts for this participant and assessment (both pre and post)
      const existingAttempts = await db
        .select()
        .from(attempts)
        .where(
          and(
            eq(attempts.participantId, participantId),
            eq(attempts.assessmentId, defaultAssessment.id)
          )
        )
        .execute();

      let attemptId: string;

      // Find pre- and post-assessment attempts, if any
      const existingPreAttempt = existingAttempts.find(a => a.type === 'pre_assessment');
      const existingPostAttempt = existingAttempts.find(a => a.type === 'post_assessment');

      if (existingPreAttempt) {
        if (existingPreAttempt.status !== 'completed') {
          // Reuse in-progress pre-assessment attempt
          attemptId = existingPreAttempt.id;
        } else {
          // Pre-assessment completed: we want to invite for post-assessment
          if (existingPostAttempt) {
            // Reuse existing post-assessment attempt (resetting basic progress)
            attemptId = existingPostAttempt.id;

            await db
              .update(attempts)
              .set({
                status: 'in_progress',
                lastQuestionSeen: 1,
                // Do not clear reportData here; student will progress from start
              })
              .where(eq(attempts.id, attemptId))
              .execute();
          } else {
            // No post-assessment yet: create one
            const [newAttempt] = await db
              .insert(attempts)
              .values({
                participantId,
                assessmentId: defaultAssessment.id,
                startedAt: new Date().toISOString(),
                status: 'in_progress',
                type: 'post_assessment',
                lastQuestionSeen: 1,
                welcomeEmailSent: true,
              })
              .returning({ id: attempts.id })
              .execute();

            attemptId = newAttempt.id;
          }
        }
      } else {
        // No pre-assessment yet: start with a new pre-assessment attempt
        const [newAttempt] = await db
          .insert(attempts)
          .values({
            participantId,
            assessmentId: defaultAssessment.id,
            startedAt: new Date().toISOString(),
            status: 'in_progress',
            type: 'pre_assessment',
            lastQuestionSeen: 1,
            welcomeEmailSent: true,
          })
          .returning({ id: attempts.id })
          .execute();

        attemptId = newAttempt.id;
      }

      // Generate invitation URL using the invitation service
      const inviteLink = generateInviteLink(email, organizationId, BASE_URL);

      // Get organization name for the invitation email
      const orgData = await db.execute(sql`
        SELECT name FROM organization WHERE id = ${organizationId}
      `);
      const organizationName = (orgData.rows[0]?.name as string) || 'Unknown Organization';

      // Send invitation email using the invitation service
      const emailResult = await sendInvitationEmail({
        participantName: name,
        participantEmail: email,
        organizationName: organizationName,
        cohortName: cohortName,
        inviteLink: inviteLink
      });

      if (!emailResult.success) {
        console.error('Failed to send invitation email:', emailResult.error);
        throw new Error(`Failed to send invitation email: ${emailResult.error}`);
      }

      // Update the attempt to mark email as sent
      await db
        .update(attempts)
        .set({
          welcomeEmailSent: true,
        })
        .where(eq(attempts.id, attemptId))
        .execute();

      // Revalidate the cache for the participants
      revalidatePath('/organisation/respondents');

      return {
        success: true,
        message: 'Invitation sent successfully',
        data: {
          participantId,
          cohortId,
          attemptId,
          inviteLink,
        },
      };
    } catch (error) {
      console.error('Error inviting student:', error);
      return {
        error: 'invitation_failed',
        message: 'Failed to invite student',
      };
    }
  });
