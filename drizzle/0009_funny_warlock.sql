ALTER TYPE "public"."user_role" ADD VALUE 'super_admin' BEFORE 'admin';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';