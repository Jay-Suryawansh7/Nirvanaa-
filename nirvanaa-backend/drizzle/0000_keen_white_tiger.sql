CREATE TYPE "public"."role" AS ENUM('JUDGE', 'LAWYER', 'COURT_STAFF', 'ADMIN');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100),
	"email" varchar(150) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'LAWYER' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
