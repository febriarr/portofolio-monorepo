DROP INDEX "projects_title_idx";--> statement-breakpoint
DROP INDEX "project_slug_idx";--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "projects_title_idx" ON "projects" USING btree ("title");--> statement-breakpoint
CREATE UNIQUE INDEX "project_slug_idx" ON "projects" USING btree ("slug");