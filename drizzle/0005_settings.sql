CREATE TABLE "faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section" text DEFAULT 'rewards' NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_slides" (
	"id" serial PRIMARY KEY NOT NULL,
	"italic_text" text NOT NULL,
	"headline" text NOT NULL,
	"body_text" text NOT NULL,
	"image" text NOT NULL,
	"alt" text NOT NULL,
	"cta_text" text NOT NULL,
	"cta_link" text NOT NULL,
	"price_amount" text,
	"price_label" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "faqs_section_idx" ON "faqs" USING btree ("section");--> statement-breakpoint
CREATE INDEX "faqs_sort_order_idx" ON "faqs" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "hero_slides_sort_order_idx" ON "hero_slides" USING btree ("sort_order");