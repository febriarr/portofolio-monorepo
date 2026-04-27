import { ProjectCategoryRepository } from "@/modules/project-category/project-category.repository"
import { db } from "@/config/db"
import { ProjectCategoryService } from "@/modules/project-category/project-category.service"
import { ProjectCategoryController } from "@/modules/project-category/project-category.controller"

const projectCategoryRepository = new ProjectCategoryRepository(db)

const projectCategoryService = new ProjectCategoryService(projectCategoryRepository)

const projectCategoryController = new ProjectCategoryController(projectCategoryService)

export { projectCategoryController }
