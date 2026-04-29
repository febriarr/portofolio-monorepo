import { IBaseRepository, IBaseService, ProjectCategories } from "@workspace/shared"
import { CreateProjectCategory, UpdateProjectCategory } from "@workspace/validator"

export interface IProjectCategoryRepository extends IBaseRepository<
  ProjectCategories,
  CreateProjectCategory,
  UpdateProjectCategory,
  number
> {
  findAll(): Promise<ProjectCategories[]>
}

export interface IProjectCategoryService extends IBaseService<
  ProjectCategories,
  CreateProjectCategory,
  UpdateProjectCategory,
  number
> {
  findAll(): Promise<ProjectCategories[]>
}
