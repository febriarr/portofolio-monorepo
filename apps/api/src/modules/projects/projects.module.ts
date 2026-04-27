import { db } from "@/config/db"

import { ProjectsRepository } from "./projects.repository"

import { ProjectsService } from "./projects.service"

import { ProjectsController } from "./projects.controller"
import { ImageService } from "@/shared/cloudflare/image.service"

const projectsRepository = new ProjectsRepository(db)

const imageService = new ImageService()

const projectsService = new ProjectsService(projectsRepository, imageService)

const projectsController = new ProjectsController(projectsService)

export { projectsController }
