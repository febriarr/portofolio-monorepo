ALTER TABLE "tech_stack" DROP CONSTRAINT "tech_stack_tech_categories_id_tech_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "tech_stack" ADD COLUMN "tech_category_id" integer;--> statement-breakpoint
ALTER TABLE "tech_stack" ADD CONSTRAINT "tech_stack_tech_category_id_tech_categories_id_fk" FOREIGN KEY ("tech_category_id") REFERENCES "public"."tech_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tech_stack" DROP COLUMN "tech_categories_id";