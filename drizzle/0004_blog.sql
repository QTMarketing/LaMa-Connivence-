CREATE TYPE "public"."blog_status" AS ENUM('draft', 'published', 'scheduled', 'trash');--> statement-breakpoint
CREATE TABLE "blog_tags" (
	"blog_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "blog_tags_blog_id_tag_id_pk" PRIMARY KEY("blog_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"excerpt" text,
	"status" "blog_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"author" text DEFAULT 'LaMa Team' NOT NULL,
	"featured_image" text,
	"seo_title" text,
	"seo_description" text,
	"focus_keyword" text,
	"canonical_url" text,
	"og_title" text,
	"og_description" text,
	"og_image" text,
	"twitter_title" text,
	"twitter_description" text,
	"twitter_image" text,
	"robots_index" boolean DEFAULT true NOT NULL,
	"robots_follow" boolean DEFAULT true NOT NULL,
	"robots_no_archive" boolean DEFAULT false NOT NULL,
	"robots_no_snippet" boolean DEFAULT false NOT NULL,
	"word_count" integer DEFAULT 0 NOT NULL,
	"category_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "blog_tags" ADD CONSTRAINT "blog_tags_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_tags" ADD CONSTRAINT "blog_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blog_tags_tag_id_idx" ON "blog_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "blogs_status_idx" ON "blogs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "blogs_published_at_idx" ON "blogs" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "blogs_category_id_idx" ON "blogs" USING btree ("category_id");