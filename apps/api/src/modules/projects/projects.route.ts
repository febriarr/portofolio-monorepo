import { projectsController } from "@/modules/projects/projects.module"
import { Router } from "express"
import { upload } from "@/middlewares/upload.middleware"

const projectsRouter: Router = Router()

projectsRouter.get("/", projectsController.findAll)
projectsRouter.get("/:id", projectsController.findById)

projectsRouter.post("/", projectsController.create)
projectsRouter.post("/with-images", upload.array("images"), projectsController.createWithImages)

projectsRouter.patch("/:id", projectsController.update)
projectsRouter.patch(
  "/:id/with-images",
  upload.array("images"),
  projectsController.updateWithImages
)

projectsRouter.delete("/:id", projectsController.delete)

export { projectsRouter }
