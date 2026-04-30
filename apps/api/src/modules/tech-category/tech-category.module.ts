import { TechCategoryRepository } from "@/modules/tech-category/tech-category.repository"
import { db } from "@/config/db"
import { TechCategoryService } from "@/modules/tech-category/tech-category.service"
import { TechCategoryController } from "@/modules/tech-category/tech-category.controller"

const techCategoryRepository = new TechCategoryRepository(db)

const techCategoryService = new TechCategoryService(techCategoryRepository)

const techCategoryController = new TechCategoryController(techCategoryService)

export { techCategoryController }
