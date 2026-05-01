import { Router } from "express"
import { techStacksController } from "@/modules/tech-stacks/tech-stacks.module"
import { upload } from "@/middlewares/upload.middleware"

const techStacksRouter: Router = Router()

techStacksRouter.get("/", techStacksController.findAll)
techStacksRouter.get("/:id", techStacksController.findById)

techStacksRouter.post("/create", techStacksController.create)
techStacksRouter.patch("/:id", techStacksController.update)
techStacksRouter.post(
  "/create/with-image",
  upload.single("image"),
  techStacksController.createWithImage
)
techStacksRouter.patch("/:id", upload.single("image"), techStacksController.updateWithImage)

techStacksRouter.delete("/:id", techStacksController.delete)

export { techStacksRouter }
