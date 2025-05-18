import { relations } from 'drizzle-orm/relations';

import {
  assessments,
  attempts,
  cohorts,
  correctAnswers,
  options,
  organization,
  participants,
  questions,
  responses,
} from './schema';

export const correctAnswersRelations = relations(correctAnswers, ({ one }) => ({
  question: one(questions, {
    fields: [correctAnswers.questionId],
    references: [questions.id],
  }),
  option_questionId: one(options, {
    fields: [correctAnswers.questionId],
    references: [options.id],
    relationName: 'correctAnswers_questionId_options_id',
  }),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  correctAnswers: many(correctAnswers),
  assessment: one(assessments, {
    fields: [questions.assessmentId],
    references: [assessments.id],
  }),
  responses: many(responses),
  options: many(options),
}));

export const optionsRelations = relations(options, ({ one, many }) => ({
  correctAnswers_questionId: many(correctAnswers, {
    relationName: 'correctAnswers_questionId_options_id',
  }),
  question: one(questions, {
    fields: [options.questionId],
    references: [questions.id],
  }),
}));

export const assessmentsRelations = relations(assessments, ({ many }) => ({
  questions: many(questions),
  attempts: many(attempts),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  attempt: one(attempts, {
    fields: [responses.attemptId],
    references: [attempts.id],
  }),
  question: one(questions, {
    fields: [responses.questionId],
    references: [questions.id],
  }),
}));

export const attemptsRelations = relations(attempts, ({ one, many }) => ({
  responses: many(responses),
  assessment: one(assessments, {
    fields: [attempts.assessmentId],
    references: [assessments.id],
  }),
  participant: one(participants, {
    fields: [attempts.participantId],
    references: [participants.id],
  }),
}));

export const participantsRelations = relations(participants, ({ one, many }) => ({
  attempts: many(attempts),
  cohort: one(cohorts, {
    fields: [participants.cohortId],
    references: [cohorts.id],
  }),
  organization: one(organization, {
    fields: [participants.organizationId],
    references: [organization.id],
  }),
}));
