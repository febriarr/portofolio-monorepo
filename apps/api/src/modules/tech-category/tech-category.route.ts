import { Router } from "express"
import { techCategoryController } from "@/modules/tech-category/tech-category.module"

const techCategoryRouter: Router = Router()

techCategoryRouter.get("/", techCategoryController.findAll)
techCategoryRouter.get(":id", techCategoryController.findById)

techCategoryRouter.post("/", techCategoryController.create)
techCategoryRouter.patch("/:id", techCategoryController.update)

techCategoryRouter.delete("/:id", techCategoryController.delete)

export { techCategoryRouter }
