CREATE TABLE "assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_id" uuid,
	"assessment_id" uuid,
	"started_at" timestamp with time zone DEFAULT now(),
	"completed_at" timestamp with time zone,
	"email_sent_at" timestamp with time zone,
	"report_data" jsonb,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"last_question_seen" integer DEFAULT 1,
	"welcome_email_sent" boolean DEFAULT false,
	"results_email_sent" boolean DEFAULT false,
	CONSTRAINT "attempts_participant_id_assessment_id_key" UNIQUE("participant_id","assessment_id"),
	CONSTRAINT "attempts_status_check" CHECK (status = ANY (ARRAY['in_progress'::text, 'completed'::text, 'abandoned'::text]))
);
--> statement-breakpoint
CREATE TABLE "correct_answers" (
	"question_id" integer PRIMARY KEY NOT NULL,
	"best_option_id" text NOT NULL,
	"worst_option_id" text NOT NULL,
	CONSTRAINT "different_options" CHECK (best_option_id <> worst_option_id)
);
--> statement-breakpoint
CREATE TABLE "options" (
	"id" text NOT NULL,
	"question_id" integer NOT NULL,
	"text" text NOT NULL,
	CONSTRAINT "options_pkey" PRIMARY KEY("id","question_id")
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"last_active_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"assessment_id" uuid,
	"text" text NOT NULL,
	"order_number" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attempt_id" uuid,
	"question_id" integer,
	"best_option_id" text,
	"worst_option_id" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "responses_attempt_id_question_id_key" UNIQUE("attempt_id","question_id")
);
--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "correct_answers" ADD CONSTRAINT "correct_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "correct_answers" ADD CONSTRAINT "valid_best_option" FOREIGN KEY ("best_option_id","question_id") REFERENCES "public"."options"("id","question_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "correct_answers" ADD CONSTRAINT "valid_worst_option" FOREIGN KEY ("worst_option_id","question_id") REFERENCES "public"."options"("id","question_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "options" ADD CONSTRAINT "options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "public"."attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_attempts_participant_id" ON "attempts" USING btree ("participant_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_correct_answers_question_id" ON "correct_answers" USING btree ("question_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_options_question_id" ON "options" USING btree ("question_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_participants_email" ON "participants" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "idx_questions_assessment_id" ON "questions" USING btree ("assessment_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_responses_attempt_id" ON "responses" USING btree ("attempt_id" uuid_ops);