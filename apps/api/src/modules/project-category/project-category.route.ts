import { Router } from "express"
import { projectCategoryController } from "@/modules/project-category/project-category.module"

const projectCategoryRouter: Router = Router()

projectCategoryRouter.get("/", projectCategoryController.findAll)
projectCategoryRouter.get("/:id", projectCategoryController.findById)

projectCategoryRouter.post("/", projectCategoryController.create)
projectCategoryRouter.patch("/:id", projectCategoryController.update)

projectCategoryRouter.delete("/:id", projectCategoryController.delete)

export { projectCategoryRouter }
