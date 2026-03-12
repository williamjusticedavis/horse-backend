CREATE TYPE "public"."tag_category" AS ENUM('age', 'temperament', 'level', 'purpose', 'gender');--> statement-breakpoint
CREATE TABLE "horses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"age" integer NOT NULL,
	"description" text NOT NULL,
	"full_description" text,
	"breed" varchar(100),
	"color" varchar(100),
	"image_emoji" varchar(10)
);--> statement-breakpoint
CREATE TABLE "horse_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"horse_id" integer NOT NULL,
	"category" "tag_category" NOT NULL,
	"label" varchar(100) NOT NULL,
	"note" text
);--> statement-breakpoint
ALTER TABLE "horse_tags" ADD CONSTRAINT "horse_tags_horse_id_horses_id_fk" FOREIGN KEY ("horse_id") REFERENCES "public"."horses"("id") ON DELETE cascade ON UPDATE no action;
