ALTER TABLE "attempts" DROP CONSTRAINT "attempts_participant_id_assessment_id_key";--> statement-breakpoint
ALTER TABLE "attempts" ADD COLUMN "type" text DEFAULT 'pre_assessment' NOT NULL;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_participant_id_assessment_id_type_key" UNIQUE("participant_id","assessment_id","type");--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_type_check" CHECK (type = ANY (ARRAY['pre_assessment'::text, 'post_assessment'::text]));