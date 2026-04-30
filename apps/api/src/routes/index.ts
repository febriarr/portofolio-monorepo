import { Router } from "express"
import { projectsRouter } from "@/modules/projects/projects.route"
import { projectCategoryRouter } from "@/modules/project-category/project-category.route"
import { techCategoryRouter } from "@/modules/tech-category/tech-category.route"

const router: Router = Router()

router.use("/projects", projectsRouter)
router.use("/project-category", projectCategoryRouter)
router.use("/tech-category", techCategoryRouter)

export default router
