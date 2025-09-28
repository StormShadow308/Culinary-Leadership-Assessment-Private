'use server';

import { db } from '~/db';
import { assessments, attempts, cohorts, organization, participants, responses } from '~/db/schema';

import { actionClient } from '~/lib/action';

import { and, eq } from 'drizzle-orm';

import { newAssessmentSchema } from './new-assessment.schema';

type Participant = typeof participants.$inferSelect;
type Attempt = typeof attempts.$inferSelect;

export const newAssessmentAction = actionClient
  .schema(newAssessmentSchema)
  .action(
    async ({ parsedInput: { fullName, email, forceContinue, assessmentId, resetProgress, organizationId } }) => {
      if (!assessmentId) {
        return { error: 'assessment_missing', message: 'Assessment ID is required' };
      }

      // Check if assessment exists
      const assessmentExists = await db
        .select({ id: assessments.id })
        .from(assessments)
        .where(eq(assessments.id, assessmentId))
        .execute();

      if (assessmentExists.length === 0) {
        return { error: 'assessment_not_found', message: 'Assessment not found' };
      }

      let participant: Participant;
      let existingAttempts: Array<Attempt> = [];
      let assessmentType = 'pre_assessment'; // Default to pre-assessment

      // Check if a participant with the same email already exists
      const existingParticipant = await db
        .select()
        .from(participants)
        .where(eq(participants.email, email))
        .execute();

      if (existingParticipant.length > 0) {
        // Participant exists
        participant = existingParticipant[0];

        // Check for ALL existing attempts for this assessment
        existingAttempts = await db
          .select()
          .from(attempts)
          .where(
            and(eq(attempts.participantId, participant.id), eq(attempts.assessmentId, assessmentId))
          )
          .execute();

        // Determine assessment type based on existing attempts
        if (existingAttempts.length > 0) {
          // Check if there's a completed pre-assessment
          const hasCompletedPreAssessment = existingAttempts.some(
            attempt => attempt.type === 'pre_assessment' && attempt.status === 'completed'
          );

          // If they have a completed pre-assessment, this should be a post-assessment
          if (hasCompletedPreAssessment) {
            assessmentType = 'post_assessment';

            // Check if they already have a post-assessment
            const existingPostAssessment = existingAttempts.find(
              attempt => attempt.type === 'post_assessment'
            );

            // If they already have a post-assessment, allow them to retake it
            if (existingPostAssessment && !forceContinue) {
              return {
                error: 'duplicate_email',
                message:
                  'You have already taken a post-assessment. Do you want to continue or start over?',
                participantId: participant.id,
                attemptId: existingPostAssessment.id,
              };
            }
          } else {
            // If no completed pre-assessment, this should still be a pre-assessment
            assessmentType = 'pre_assessment';

            // Find the existing pre-assessment attempt
            const existingPreAssessment = existingAttempts.find(
              attempt => attempt.type === 'pre_assessment'
            );

            // If they have a pre-assessment and we're not forcing continue, return error
            if (existingPreAssessment && !forceContinue) {
              return {
                error: 'duplicate_email',
                message:
                  'You have already started a pre-assessment. Do you want to continue or start over?',
                participantId: participant.id,
                attemptId: existingPreAssessment.id,
              };
            }
          }
        }

        // Update participant's lastActiveAt
        await db
          .update(participants)
          .set({
            // @ts-expect-error - For some reason, TS doesn't recognize lastActiveAt as a valid field
            lastActiveAt: new Date().toISOString(),
            // Update fullName if it's different
            ...(fullName !== participant.fullName ? { fullName } : {}),
          })
          .where(eq(participants.id, participant.id))
          .execute();
      } else {
        // Determine organization ID - use from invite or create default
        let targetOrgId: string;
        
        if (organizationId) {
          // Use organization from invite
          targetOrgId = organizationId;
        } else {
          // Get or create a default organization for independent students
          const existingOrg = await db
            .select({ id: organization.id })
            .from(organization)
            .where(eq(organization.slug, 'default-students'))
            .limit(1)
            .execute();

          if (existingOrg.length > 0) {
            targetOrgId = existingOrg[0].id;
          } else {
            // Create default organization for independent students
            const [newOrg] = await db
              .insert(organization)
              .values({
                id: 'org_default_students',
                name: 'Independent Students',
                slug: 'default-students',
                createdAt: new Date(),
              })
              .returning({ id: organization.id })
              .execute();
            targetOrgId = newOrg.id;

            // Create predefined cohorts for independent students organization
            const predefinedCohorts = [
              'Fall 2024 Leadership Cohort',
              'Spring 2025 Advanced Cohort',
              'Summer 2025 Intensive Cohort',
              'Executive Leadership Program',
              'Culinary Management Cohort'
            ];

            for (const cohortName of predefinedCohorts) {
              await db
                .insert(cohorts)
                .values({
                  organizationId: targetOrgId,
                  name: cohortName,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                })
                .execute();
            }
          }
        }

        // Create new participant with determined organization
        const [newParticipant] = await db
          .insert(participants)
          // @ts-expect-error - TypeScript doesn't recognize the values method correctly
          .values({
            email,
            fullName,
            organizationId: targetOrgId,
            createdAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
          })
          .returning()
          .execute();

        participant = newParticipant;
      }

      // Find the existing attempt of the determined type
      const existingTypeAttempt = existingAttempts.find(attempt => attempt.type === assessmentType);

      // Handle existing attempt or create a new one
      let attempt: Attempt;

      if (existingTypeAttempt) {
        attempt = existingTypeAttempt;

        // Only reset if resetProgress is true
        if (resetProgress) {
          // Reset the attempt progress
          await db
            .update(attempts)
            .set({
              status: 'in_progress',
              lastQuestionSeen: 1, // Reset to first question if starting over
              completedAt: null, // Clear completion date
              reportData: null, // Clear any report data
            })
            .where(eq(attempts.id, attempt.id))
            .execute();

          // Delete any existing responses for this attempt
          try {
            await db.delete(responses).where(eq(responses.attemptId, attempt.id)).execute();
          } catch (error) {
            console.error('Error resetting responses:', error);
            // Continue even if this fails
          }
        } else {
          // For Continue option - just update lastActiveAt and status if needed
          const updates: Record<string, unknown> = {};

          // Only update status if it's abandoned (don't change completed to in_progress)
          if (attempt.status === 'abandoned') {
            updates.status = 'in_progress';
          }

          // Only update if we have changes to make
          if (Object.keys(updates).length > 0) {
            await db.update(attempts).set(updates).where(eq(attempts.id, attempt.id)).execute();
          }
        }
      } else {
        // Create new attempt with the determined type
        const [newAttempt] = await db
          .insert(attempts)
          .values({
            participantId: participant.id,
            assessmentId,
            startedAt: new Date().toISOString(),
            status: 'in_progress',
            lastQuestionSeen: 1,
            type: assessmentType, // Use the determined assessment type
          })
          .returning()
          .execute();

        attempt = newAttempt;
      }

      return {
        success: true,
        participantId: participant.id,
        attemptId: attempt.id,
      };
    }
  );
