import type { Request, Response } from "express"

import { asyncHandler } from "@/shared/helpers/async-handler"

import { successResponse } from "@/shared/helpers/success-response"

import { ProjectUploadedFiles } from "@workspace/shared"
import { ProjectsFilter } from "@workspace/validator"
import { IProjectsService } from "@/modules/projects/projects.interface"
import { NotFoundError } from "@/shared/errors/custom-error"

export class ProjectsController {
  constructor(private readonly projectsService: IProjectsService) {}

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.projectsService.findAll(req.query as unknown as ProjectsFilter)

    return successResponse({
      res,
      data: result.data,
      message: "Projects fetched successfully",
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    })
  })

  findById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    const project = await this.projectsService.findByIdWithDetail(id)

    return successResponse({
      res,
      data: project,
      message: "Project fetched successfully",
    })
  })

  findBySlug = asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug as string

    const project = await this.projectsService.findBySlug(slug)

    return successResponse({
      res,
      data: project,
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
    const files = req.files as ProjectUploadedFiles | undefined

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
    const files = req.files as ProjectUploadedFiles | undefined

    const project = await this.projectsService.updateWithImages(id, req.body, files)

    return successResponse({
      res,
      data: project,
      message: "Project updated successfully",
    })
  })
}
