'use server';

import { db } from '~/db';
import { assessments, attempts, cohorts, organization, participants, responses } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';

import { actionClient } from '~/lib/action';

import { and, eq } from 'drizzle-orm';

import { newAssessmentSchema } from './new-assessment.schema';

type Participant = typeof participants.$inferSelect;
type Attempt = typeof attempts.$inferSelect;

export const newAssessmentAction = actionClient
  .schema(newAssessmentSchema)
  .action(
    async ({ parsedInput: { fullName, email, forceContinue, assessmentId, resetProgress, organizationId } }) => {
      try {
        console.log('🎯 New assessment action started:', { fullName, email, assessmentId, organizationId });
        
        if (!assessmentId) {
          console.error('❌ Assessment ID missing');
          return { error: 'assessment_missing', message: 'Assessment ID is required' };
        }

        // Check if assessment exists
        const assessmentExists = await db
          .select({ id: assessments.id })
          .from(assessments)
          .where(eq(assessments.id, assessmentId))
          .execute();

        if (assessmentExists.length === 0) {
          console.error('❌ Assessment not found:', assessmentId);
          return { error: 'assessment_not_found', message: 'Assessment not found' };
        }
        
        console.log('✅ Assessment found:', assessmentId);

      let participant: Participant;
      let existingAttempts: Array<Attempt> = [];
      let assessmentType = 'pre_assessment'; // Default to pre-assessment

      // Check if a participant with the same email already exists
      console.log('🔍 Checking for existing participant:', email);
      const existingParticipant = await db
        .select()
        .from(participants)
        .where(eq(participants.email, email))
        .execute();

      if (existingParticipant.length > 0) {
        // Participant exists
        console.log('👤 Existing participant found:', email);
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
          // Check if there's ANY completed assessment (pre or post)
          const hasCompletedAssessment = existingAttempts.some(
            attempt => attempt.status === 'completed'
          );

          // If they have ANY completed assessment, this should be a post-assessment
          if (hasCompletedAssessment) {
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
            // If no completed assessment, this should be a pre-assessment
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
          console.log('🏢 Checking for default organization...');
          
          // Check by ID first (primary key)
          const existingOrgById = await db
            .select({ id: organization.id })
            .from(organization)
            .where(eq(organization.id, 'org_default_students'))
            .limit(1)
            .execute();

          if (existingOrgById.length > 0) {
            console.log('✅ Default organization found by ID');
            targetOrgId = existingOrgById[0].id;
          } else {
            // Also check by slug as fallback
            const existingOrgBySlug = await db
              .select({ id: organization.id })
              .from(organization)
              .where(eq(organization.slug, 'default-students'))
              .limit(1)
              .execute();

            if (existingOrgBySlug.length > 0) {
              console.log('✅ Default organization found by slug');
              targetOrgId = existingOrgBySlug[0].id;
            } else {
              // Create default organization for independent students
              console.log('🏢 Creating new default organization...');
              try {
                const [newOrg] = await db
                  .insert(organization)
                  // @ts-expect-error - Drizzle ORM type inference issue
                  .values({
                    id: 'org_default_students',
                    name: 'Independent Students',
                    slug: 'default-students',
                    createdAt: new Date(),
                  })
                  .returning({ id: organization.id })
                  .execute();
                targetOrgId = newOrg.id;
                console.log('✅ Default organization created');
              } catch (orgError: any) {
                // If it fails due to duplicate key, fetch the existing one
                if (orgError.code === '23505') {
                  console.log('⚠️ Organization already exists (race condition), fetching it...');
                  const [existingOrg] = await db
                    .select({ id: organization.id })
                    .from(organization)
                    .where(eq(organization.id, 'org_default_students'))
                    .limit(1)
                    .execute();
                  targetOrgId = existingOrg.id;
                } else {
                  throw orgError;
                }
              }
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

        console.log('👤 New participant created:', email);
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

        console.log('✅ Assessment action completed successfully:', { participantId: participant.id, attemptId: attempt.id });
        
        return {
          success: true,
          participantId: participant.id,
          attemptId: attempt.id,
        };
      } catch (error) {
        console.error('❌ Assessment action failed with error:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          email,
          assessmentId
        });
        return {
          error: 'action_failed',
          message: error instanceof Error ? error.message : 'Failed to create assessment attempt'
        };
      }
    }
  );
