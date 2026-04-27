import { Router } from "express"
import { projectCategoryController } from "@/modules/project-category/project-category.module"
import { projectsRouter } from "@/modules/projects/projects.route"

const projectCategoryRouter: Router = Router()

projectCategoryRouter.get("/", projectCategoryController.findAll)
projectCategoryRouter.get("/:id", projectCategoryController.findById)

projectsRouter.post("/", projectCategoryController.create)
projectCategoryRouter.patch("/:id", projectCategoryController.update)

projectsRouter.delete("/:id", projectCategoryController.delete)

export { projectCategoryRouter }
