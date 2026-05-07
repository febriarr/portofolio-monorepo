CREATE INDEX "project_images_project_id_idx" ON "project_images" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "projects_title_idx" ON "projects" USING btree ("title");--> statement-breakpoint
CREATE INDEX "projects_category_idx" ON "projects" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "pts_tech_stack_idx" ON "project_tech_stacks" USING btree ("tech_stack_id");--> statement-breakpoint
CREATE INDEX "pts_project_idx" ON "project_tech_stacks" USING btree ("project_id");