CREATE TYPE "public"."verify_status" AS ENUM('0', '1');--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" varchar(255) NOT NULL,
	"iat" timestamp with time zone NOT NULL,
	"exp" timestamp with time zone NOT NULL,
	"user_id" serial NOT NULL,
	"create_at" timestamp with time zone DEFAULT now(),
	"update_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"create_at" timestamp with time zone DEFAULT now(),
	"update_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(180) NOT NULL,
	"password" varchar(180) NOT NULL,
	"role_id" serial NOT NULL,
	"verify" "verify_status" DEFAULT '0' NOT NULL,
	"email_verify_token" varchar(255),
	"forgot_password_token" varchar(255),
	"create_at" timestamp with time zone DEFAULT now(),
	"update_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;