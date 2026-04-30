import { IBaseRepository, IBaseService, TechCategory } from "@workspace/shared"
import { CreateTechCategory, UpdateTechCategory } from "@workspace/validator"

export interface ITechCategoryRepository extends IBaseRepository<
  TechCategory,
  CreateTechCategory,
  UpdateTechCategory,
  number
> {
  findAll(): Promise<TechCategory[]>
}

export interface ITechCategoryService extends IBaseService<
  TechCategory,
  CreateTechCategory,
  UpdateTechCategory,
  number
> {
  findAll(): Promise<TechCategory[]>
}
