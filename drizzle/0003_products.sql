CREATE TYPE "public"."product_category" AS ENUM('hot-beverages', 'fresh-food', 'cold-drinks', 'snacks', 'grocery', 'services');--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"category" "product_category" NOT NULL,
	"price" text,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category");