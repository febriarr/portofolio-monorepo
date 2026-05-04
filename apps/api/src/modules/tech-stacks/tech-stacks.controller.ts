import { ITechStacksService } from "@/modules/tech-stacks/tech-stacks.interface"
import { asyncHandler } from "@/shared/helpers/async-handler"
import { Request, Response } from "express"
import { successResponse } from "@/shared/helpers/success-response"
import { UploadedFile } from "@workspace/shared"

export class TechStacksController {
  constructor(private readonly techStacksService: ITechStacksService) {}

  findById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const result = await this.techStacksService.findById(id)

    return successResponse({
      res,
      data: result,
    })
  })

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.techStacksService.findAll()

    return successResponse({
      res,
      data: result,
    })
  })

  create = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body
    const result = await this.techStacksService.create(payload)

    return successResponse({
      res,
      message: "Tech Stack created",
      data: result,
    })
  })

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const result = await this.techStacksService.update(id, req.body)

    return successResponse({
      res,
      message: "Tech Stack updated",
      data: result,
    })
  })

  createWithImage = asyncHandler(async (req: Request, res: Response) => {
    const image = req.file as UploadedFile | undefined
    const payload = req.body
    const result = await this.techStacksService.createWithImage(payload, image)

    return successResponse({
      res,
      message: "Tech Stack created",
      data: result,
    })
  })

  updateWithImage = asyncHandler(async (req: Request, res: Response) => {
    const image = req.file as UploadedFile | undefined
    const id = Number(req.params.id)
    const result = await this.techStacksService.updateWithImage(id, req.body, image)

    return successResponse({
      res,
      message: "Tech Stack updated",
      data: result,
    })
  })

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const result = await this.techStacksService.delete(id)

    return successResponse({
      res,
      message: "Tech Stack deleted",
      data: result,
    })
  })
}
