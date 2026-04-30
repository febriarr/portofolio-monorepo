import { TechStacksRepository } from "@/modules/tech-stacks/tech-stacks.repository"
import { db } from "@/config/db"
import { TechStacksService } from "@/modules/tech-stacks/tech-stacks.service"
import { ImageService } from "@/shared/cloudflare/image.service"
import { TechStacksController } from "@/modules/tech-stacks/tech-stacks.controller"

const techStacksRepository = new TechStacksRepository(db)

const imageService = new ImageService()

const techStacksService = new TechStacksService(techStacksRepository, imageService)

const techStacksController = new TechStacksController(techStacksService)

export { techStacksController }
