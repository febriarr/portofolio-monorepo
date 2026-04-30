import { TechCategoryService } from "@/modules/tech-category/tech-category.service"
import { asyncHandler } from "@/shared/helpers/async-handler"
import { Request, Response } from "express"
import { successResponse } from "@/shared/helpers/success-response"

export class TechCategoryController {
  constructor(private readonly techCategoryService: TechCategoryService) {}

  findById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const result = await this.techCategoryService.findById(id)

    return successResponse({
      res,
      data: result,
    })
  })

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.techCategoryService.findAll()
    return successResponse({
      res,
      data: result,
    })
  })

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.techCategoryService.create(req.body)
    return successResponse({
      res,
      message: "Success create Tech Category",
      data: result,
    })
  })

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const result = await this.techCategoryService.update(id, req.body)
    return successResponse({
      res,
      message: "Success update Tech Category",
      data: result,
    })
  })

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const result = await this.techCategoryService.delete(id)
    return successResponse({
      res,
      message: "Success delete Tech Category",
      data: result,
    })
  })
}
