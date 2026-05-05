import { Router } from "express"
import { techStacksController } from "@/modules/tech-stacks/tech-stacks.module"
import { upload } from "@/middlewares/upload.middleware"
import { authenticate } from "@/middlewares/authenticate.middleware"

const techStacksRouter: Router = Router()

techStacksRouter.get("/", techStacksController.findAll)
techStacksRouter.get("/:id", techStacksController.findById)

techStacksRouter.post("/create", authenticate, techStacksController.create)
techStacksRouter.post(
  "/create/with-image",
  authenticate,
  upload.single("image"),
  techStacksController.createWithImage
)
techStacksRouter.patch(
  "/:id",
  authenticate,
  upload.single("image"),
  techStacksController.updateWithImage
)

techStacksRouter.delete("/:id", authenticate, techStacksController.delete)

export { techStacksRouter }
