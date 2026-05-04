import { Router } from "express"
import { projectsRouter } from "@/modules/projects/projects.route"
import { projectCategoryRouter } from "@/modules/project-category/project-category.route"
import { techCategoryRouter } from "@/modules/tech-category/tech-category.route"
import { techStacksRouter } from "@/modules/tech-stacks/tech-stacks.route"

const router: Router = Router()

router.use("/projects", projectsRouter)
router.use("/project-categories", projectCategoryRouter)
router.use("/tech-category", techCategoryRouter)
router.use("/tech-stacks", techStacksRouter)

export default router
