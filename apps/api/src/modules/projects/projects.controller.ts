import type { Request, Response } from "express"

import { asyncHandler } from "@/shared/helpers/async-handler"

import { successResponse } from "@/shared/helpers/success-response"

import { ProjectsService } from "./projects.service"
import { UploadedFile } from "@workspace/shared"

export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  findAll = asyncHandler(async (_req: Request, res: Response) => {
    const projects = await this.projectsService.findAll()

    return successResponse({
      res,
      data: projects,
      message: "Projects fetched successfully",
    })
  })

  findById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    const project = await this.projectsService.findById(id)

    return successResponse({
      res,
      data: project,
      message: "Project fetched successfully",
    })
  })

  create = asyncHandler(async (req: Request, res: Response) => {
    const project = await this.projectsService.create(req.body)

    return successResponse({
      res,
      data: project,
      message: "Project created successfully",
      statusCode: 201,
    })
  })

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    const project = await this.projectsService.update(id, req.body)

    return successResponse({
      res,
      data: project,
      message: "Project updated successfully",
    })
  })

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    await this.projectsService.delete(id)

    return successResponse({
      res,
      message: "Project deleted successfully",
    })
  })

  createWithImages = asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as UploadedFile[] | undefined

    const project = await this.projectsService.createWithImages(req.body, files)

    return successResponse({
      res,
      data: project,
      message: "Project created successfully",
      statusCode: 201,
    })
  })

  updateWithImages = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const files = req.files as UploadedFile[] | undefined

    const project = await this.projectsService.updateWithImages(id, req.body, files)

    return successResponse({
      res,
      data: project,
      message: "Project updated successfully",
    })
  })
}
