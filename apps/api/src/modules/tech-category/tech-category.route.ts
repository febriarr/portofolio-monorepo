import { Router } from "express"
import { techCategoryController } from "@/modules/tech-category/tech-category.module"
import { authenticate } from "@/middlewares/authenticate.middleware"

const techCategoryRouter: Router = Router()

techCategoryRouter.get("/", techCategoryController.findAll)
techCategoryRouter.get("/:id", techCategoryController.findById)

techCategoryRouter.post("/", authenticate, techCategoryController.create)
techCategoryRouter.patch("/:id", authenticate, techCategoryController.update)

techCategoryRouter.delete("/:id", authenticate, techCategoryController.delete)

export { techCategoryRouter }
