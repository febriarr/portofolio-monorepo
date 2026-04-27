import { IProjectCategoryService } from "@/modules/project-category/project-category.interface"
import { asyncHandler } from "@/shared/helpers/async-handler"
import { successResponse } from "@/shared/helpers/success-response"
import { Response, Request } from "express"

export class ProjectCategoryController {
  constructor(private readonly projectCategoryService: IProjectCategoryService) {}

  findAll = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.projectCategoryService.findAll()

    return successResponse({
      res,
      data: result,
    })
  })

  findById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const result = await this.projectCategoryService.findById(id)
    return successResponse({
      res,
      data: result,
    })
  })

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.projectCategoryService.create(req.body)
    return successResponse({
      res,
      data: result,
    })
  })

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const result = await this.projectCategoryService.update(id, req.body)
    return successResponse({
      res,
      data: result,
    })
  })

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    await this.projectCategoryService.delete(id)
    return successResponse({
      res,
      message: "Successfully deleted project category",
    })
  })
}
