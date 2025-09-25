CREATE TABLE "passcodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_passcodes_email" ON "passcodes" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_passcodes_code" ON "passcodes" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_passcodes_type" ON "passcodes" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_passcodes_expires_at" ON "passcodes" USING btree ("expires_at");