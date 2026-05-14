import { projectsController } from "@/modules/projects/projects.module"
import { Router } from "express"
import { upload } from "@/middlewares/upload.middleware"
import { authenticate } from "@/middlewares/authenticate.middleware"

const projectsRouter: Router = Router()

projectsRouter.get("/", projectsController.findAll)
projectsRouter.get("/:id", projectsController.findById)
projectsRouter.get("/slug/:slug", projectsController.findBySlug)

projectsRouter.post("/", authenticate, projectsController.create)
projectsRouter.post(
  "/with-images",
  authenticate,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  projectsController.createWithImages
)

projectsRouter.patch("/:id", authenticate, projectsController.update)
projectsRouter.patch(
  "/:id/with-images",
  authenticate,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  projectsController.updateWithImages
)

projectsRouter.delete("/:id", authenticate, projectsController.delete)

export { projectsRouter }
