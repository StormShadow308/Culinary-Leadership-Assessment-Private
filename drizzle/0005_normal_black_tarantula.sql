CREATE TABLE "cohorts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "cohorts_organization_id_name_key" UNIQUE("organization_id","name")
);
--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "cohort_id" uuid;--> statement-breakpoint
ALTER TABLE "cohorts" ADD CONSTRAINT "cohorts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_cohorts_organization_id" ON "cohorts" USING btree ("organization_id" text_ops);--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "public"."cohorts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_participants_cohort_id" ON "participants" USING btree ("cohort_id" uuid_ops);