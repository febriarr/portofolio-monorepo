import {
  IProjectCategoryRepository,
  IProjectCategoryService,
} from "@/modules/project-category/project-category.interface"
import {
  CreateProjectCategory,
  createProjectCategorySchema,
  UpdateProjectCategory,
  updateProjectCategorySchema,
} from "@workspace/validator"
import { ProjectCategories } from "@workspace/shared"
import { BaseService } from "@/shared/base/base.service"
import { projectCategory } from "@/config/db/schema"
import { ProjectCategoryRepository } from "@/modules/project-category/project-category.repository"

export class ProjectCategoryService
  extends BaseService<
    ProjectCategories,
    CreateProjectCategory,
    UpdateProjectCategory,
    typeof projectCategory
  >
  implements IProjectCategoryService
{
  constructor(private readonly projectCategoryRepository: ProjectCategoryRepository) {
    super(projectCategoryRepository)
  }

  override async create(payload: CreateProjectCategory): Promise<ProjectCategories> {
    const data = createProjectCategorySchema.parse(payload)
    return this.repository.create(data)
  }

  override async update(id: number, payload: UpdateProjectCategory): Promise<ProjectCategories> {
    const data = updateProjectCategorySchema.parse(payload)
    return this.repository.update(id, data)
  }

  findAll(): Promise<ProjectCategories[]> {
    return this.projectCategoryRepository.findAll()
  }
}
