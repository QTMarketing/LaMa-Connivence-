CREATE TYPE "public"."deal_category" AS ENUM('meal-deals', 'daily-specials', 'weekly-promotions', 'grill-items', 'mix-and-match', 'best-value', 'combo-offers');--> statement-breakpoint
CREATE TYPE "public"."drink_category" AS ENUM('buy-2-save', 'discounted', 'seasonal');--> statement-breakpoint
CREATE TABLE "deals" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"category" "deal_category" NOT NULL,
	"savings" text NOT NULL,
	"expiration_date" date,
	"featured" boolean DEFAULT false NOT NULL,
	"display_name" text,
	"homepage_order" integer,
	"price" numeric(10, 2),
	"original_price" numeric(10, 2),
	"stock_left" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drinks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"category" "drink_category" NOT NULL,
	"savings" text NOT NULL,
	"expiration_date" date,
	"featured" boolean DEFAULT false NOT NULL,
	"price" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"hours" text DEFAULT 'Call to confirm' NOT NULL,
	"city" text,
	"state" text,
	"zip" text,
	"category" text,
	"hours_verified" boolean DEFAULT false NOT NULL,
	"phone_verified" boolean DEFAULT false NOT NULL,
	"address_complete" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "deals_category_idx" ON "deals" USING btree ("category");--> statement-breakpoint
CREATE INDEX "deals_featured_idx" ON "deals" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "drinks_category_idx" ON "drinks" USING btree ("category");--> statement-breakpoint
CREATE INDEX "stores_state_idx" ON "stores" USING btree ("state");