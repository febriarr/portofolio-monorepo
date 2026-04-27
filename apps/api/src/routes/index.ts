import { Router } from "express"
import { projectsRouter } from "@/modules/projects/projects.route"
import { projectCategoryRouter } from "@/modules/project-category/project-category.route"

const router: Router = Router()

router.use("/projects", projectsRouter)
router.use("/project-category", projectCategoryRouter)

export default router
