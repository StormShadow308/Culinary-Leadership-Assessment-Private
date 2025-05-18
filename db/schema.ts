import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

export const correctAnswers = pgTable(
  'correct_answers',
  {
    questionId: integer('question_id').primaryKey().notNull(),
    bestOptionId: text('best_option_id').notNull(),
    worstOptionId: text('worst_option_id').notNull(),
  },
  table => [
    index('idx_correct_answers_question_id').using(
      'btree',
      table.questionId.asc().nullsLast().op('int4_ops')
    ),
    foreignKey({
      columns: [table.questionId],
      foreignColumns: [questions.id],
      name: 'correct_answers_question_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.bestOptionId, table.questionId],
      foreignColumns: [options.id, options.questionId],
      name: 'valid_best_option',
    }),
    foreignKey({
      columns: [table.worstOptionId, table.questionId],
      foreignColumns: [options.id, options.questionId],
      name: 'valid_worst_option',
    }),
    check('different_options', sql`best_option_id <> worst_option_id`),
  ]
);

export const assessments = pgTable('assessments', {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  description: text(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const questions = pgTable(
  'questions',
  {
    id: serial().primaryKey().notNull(),
    assessmentId: uuid('assessment_id'),
    text: text().notNull(),
    orderNumber: integer('order_number').notNull(),
    category: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  },
  table => [
    index('idx_questions_assessment_id').using(
      'btree',
      table.assessmentId.asc().nullsLast().op('uuid_ops')
    ),
    foreignKey({
      columns: [table.assessmentId],
      foreignColumns: [assessments.id],
      name: 'questions_assessment_id_fkey',
    }).onDelete('cascade'),
  ]
);

export const participants = pgTable(
  'participants',
  {
    id: uuid().defaultRandom().primaryKey(),
    email: text().notNull(),
    fullName: text('full_name'),
    cohortId: uuid('cohort_id'),
    organizationId: text('organization_id'),
    stayOut: text('stay_out').default('Stay').notNull(), // Add this line
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    lastActiveAt: timestamp('last_active_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  },
  table => [
    index('idx_participants_email').using('btree', table.email.asc().nullsLast().op('text_ops')),
    index('idx_participants_cohort_id').using(
      'btree',
      table.cohortId.asc().nullsLast().op('uuid_ops')
    ),
    index('idx_participants_organization_id').using(
      'btree',
      table.organizationId.asc().nullsLast().op('text_ops')
    ),
    foreignKey({
      columns: [table.cohortId],
      foreignColumns: [cohorts.id],
      name: 'participants_cohort_id_fkey',
    }).onDelete('set null'),
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.id],
      name: 'participants_organization_id_fkey',
    }).onDelete('cascade'),
    check('stay_out_check', sql`stay_out = ANY (ARRAY['Stay'::text, 'Out'::text])`), // Add this constraint
  ]
);

export const responses = pgTable(
  'responses',
  {
    id: uuid().defaultRandom().primaryKey(),
    attemptId: uuid('attempt_id'),
    questionId: integer('question_id'),
    bestOptionId: text('best_option_id'),
    worstOptionId: text('worst_option_id'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  },
  table => [
    index('idx_responses_attempt_id').using(
      'btree',
      table.attemptId.asc().nullsLast().op('uuid_ops')
    ),
    foreignKey({
      columns: [table.attemptId],
      foreignColumns: [attempts.id],
      name: 'responses_attempt_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.questionId],
      foreignColumns: [questions.id],
      name: 'responses_question_id_fkey',
    }).onDelete('cascade'),
    unique('responses_attempt_id_question_id_key').on(table.attemptId, table.questionId),
  ]
);

export const attempts = pgTable(
  'attempts',
  {
    id: uuid().defaultRandom().primaryKey(),
    participantId: uuid('participant_id'),
    assessmentId: uuid('assessment_id'),
    startedAt: timestamp('started_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true, mode: 'string' }),
    emailSentAt: timestamp('email_sent_at', { withTimezone: true, mode: 'string' }),
    reportData: jsonb('report_data'),
    status: text().default('in_progress').notNull(),
    type: text().default('pre_assessment').notNull(),
    lastQuestionSeen: integer('last_question_seen').default(1),
    welcomeEmailSent: boolean('welcome_email_sent').default(false),
    resultsEmailSent: boolean('results_email_sent').default(false),
  },
  table => [
    index('idx_attempts_participant_id').using(
      'btree',
      table.participantId.asc().nullsLast().op('uuid_ops')
    ),
    foreignKey({
      columns: [table.assessmentId],
      foreignColumns: [assessments.id],
      name: 'attempts_assessment_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.participantId],
      foreignColumns: [participants.id],
      name: 'attempts_participant_id_fkey',
    }).onDelete('cascade'),
    unique('attempts_participant_id_assessment_id_type_key').on(
      table.participantId,
      table.assessmentId,
      table.type
    ),
    check(
      'attempts_type_check',
      sql`type = ANY (ARRAY['pre_assessment'::text, 'post_assessment'::text])`
    ),
    check(
      'attempts_status_check',
      sql`status = ANY (ARRAY['in_progress'::text, 'completed'::text, 'abandoned'::text])`
    ),
  ]
);

export const options = pgTable(
  'options',
  {
    id: text().notNull(),
    questionId: integer('question_id').notNull(),
    text: text().notNull(),
  },
  table => [
    index('idx_options_question_id').using(
      'btree',
      table.questionId.asc().nullsLast().op('int4_ops')
    ),
    foreignKey({
      columns: [table.questionId],
      foreignColumns: [questions.id],
      name: 'options_question_id_fkey',
    }).onDelete('cascade'),
    primaryKey({ columns: [table.id, table.questionId], name: 'options_pkey' }),
  ]
);

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  role: text('role'),
  banned: boolean('banned'),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by'),
  activeOrganizationId: text('active_organization_id'),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const organization = pgTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at').notNull(),
  metadata: text('metadata'),
});

export const member = pgTable('member', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export const invitation = pgTable('invitation', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role'),
  status: text('status').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const cohorts = pgTable(
  'cohorts',
  {
    id: uuid().defaultRandom().primaryKey(),
    organizationId: text('organization_id').notNull(),
    name: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  },
  table => [
    index('idx_cohorts_organization_id').using(
      'btree',
      table.organizationId.asc().nullsLast().op('text_ops')
    ),
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.id],
      name: 'cohorts_organization_id_fkey',
    }).onDelete('cascade'),
    // Ensure cohort names are unique within an organization
    unique('cohorts_organization_id_name_key').on(table.organizationId, table.name),
  ]
);
