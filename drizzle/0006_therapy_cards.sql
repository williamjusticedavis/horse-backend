CREATE TABLE "therapy_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"domain" text NOT NULL,
	"description" text NOT NULL,
	"how_it_helps" text NOT NULL,
	"in_practice" text NOT NULL,
	"contraindications" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
