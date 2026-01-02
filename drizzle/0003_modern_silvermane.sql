CREATE TABLE "declaration_communication" (
	"id" text PRIMARY KEY NOT NULL,
	"declaration_id" text NOT NULL,
	"firm_id" text NOT NULL,
	"type" text NOT NULL,
	"direction" text NOT NULL,
	"subject" text,
	"content" text,
	"outcome" text,
	"communicated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "declaration_status_history" (
	"id" text PRIMARY KEY NOT NULL,
	"declaration_id" text NOT NULL,
	"firm_id" text NOT NULL,
	"from_status" text,
	"to_status" text NOT NULL,
	"notes" text,
	"changed_by" text,
	"changed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "document" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "subject" text DEFAULT 'הצהרת הון';--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "public_token" text;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "portal_accessed_at" timestamp;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "portal_access_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "priority" text DEFAULT 'normal';--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "assigned_to" text;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "assigned_at" timestamp;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "tax_authority_due_date" date;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "internal_due_date" date;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "submitted_at" timestamp;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "submission_screenshot_path" text;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "was_submitted_late" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "penalty_amount" numeric;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "penalty_status" text;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "penalty_received_date" date;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "penalty_notes" text;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "appeal_date" date;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "appeal_notes" text;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "penalty_paid_date" date;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "penalty_paid_amount" numeric;--> statement-breakpoint
ALTER TABLE "declaration" ADD COLUMN "penalty_paid_by" text;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "declaration_communication" ADD CONSTRAINT "declaration_communication_declaration_id_declaration_id_fk" FOREIGN KEY ("declaration_id") REFERENCES "public"."declaration"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "declaration_communication" ADD CONSTRAINT "declaration_communication_firm_id_firm_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "declaration_communication" ADD CONSTRAINT "declaration_communication_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "declaration_status_history" ADD CONSTRAINT "declaration_status_history_declaration_id_declaration_id_fk" FOREIGN KEY ("declaration_id") REFERENCES "public"."declaration"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "declaration_status_history" ADD CONSTRAINT "declaration_status_history_firm_id_firm_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "declaration_status_history" ADD CONSTRAINT "declaration_status_history_changed_by_user_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "declaration" ADD CONSTRAINT "declaration_assigned_to_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "declaration" DROP COLUMN "data";--> statement-breakpoint
ALTER TABLE "document" DROP COLUMN "mime_type";--> statement-breakpoint
ALTER TABLE "declaration" ADD CONSTRAINT "declaration_public_token_unique" UNIQUE("public_token");