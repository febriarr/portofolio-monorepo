import { Router } from "express"
import { projectCategoryController } from "@/modules/project-category/project-category.module"
import { authenticate } from "@/middlewares/authenticate.middleware"

const projectCategoryRouter: Router = Router()

projectCategoryRouter.get("/", projectCategoryController.findAll)
projectCategoryRouter.get("/:id", projectCategoryController.findById)

projectCategoryRouter.post("/", authenticate, projectCategoryController.create)
projectCategoryRouter.patch("/:id", authenticate, projectCategoryController.update)

projectCategoryRouter.delete("/:id", authenticate, projectCategoryController.delete)

export { projectCategoryRouter }
