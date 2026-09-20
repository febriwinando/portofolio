CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"bio" text NOT NULL,
	"location" text NOT NULL,
	"email" text NOT NULL,
	"avatar_url" text,
	"github_username" text DEFAULT 'febriwinando' NOT NULL,
	"github_url" text DEFAULT 'https://github.com/febriwinando' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
