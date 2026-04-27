import { Router } from "express"
import { projectsRouter } from "@/modules/projects/projects.route"

const router: Router = Router()

router.use("/projects", projectsRouter)

export default router
