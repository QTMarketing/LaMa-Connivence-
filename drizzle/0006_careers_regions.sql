CREATE TYPE "public"."location_scope" AS ENUM('chain', 'region', 'store');--> statement-breakpoint
CREATE TABLE "regions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "regions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "job_regions" (
	"job_id" uuid NOT NULL,
	"region_id" uuid NOT NULL,
	CONSTRAINT "job_regions_job_id_region_id_pk" PRIMARY KEY("job_id","region_id")
);
--> statement-breakpoint
CREATE TABLE "job_stores" (
	"job_id" uuid NOT NULL,
	"store_id" integer NOT NULL,
	CONSTRAINT "job_stores_job_id_store_id_pk" PRIMARY KEY("job_id","store_id")
);
--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "location_scope" "location_scope" DEFAULT 'chain' NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "region_id" uuid;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "preferred_store_id" integer;--> statement-breakpoint
ALTER TABLE "job_regions" ADD CONSTRAINT "job_regions_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_regions" ADD CONSTRAINT "job_regions_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_stores" ADD CONSTRAINT "job_stores_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_stores" ADD CONSTRAINT "job_stores_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_preferred_store_id_stores_id_fk" FOREIGN KEY ("preferred_store_id") REFERENCES "public"."stores"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "job_regions_region_id_idx" ON "job_regions" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "job_stores_store_id_idx" ON "job_stores" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "stores_region_id_idx" ON "stores" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "applications_preferred_store_id_idx" ON "applications" USING btree ("preferred_store_id");
