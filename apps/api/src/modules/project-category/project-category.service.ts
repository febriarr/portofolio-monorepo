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

export class ProjectCategoryService implements IProjectCategoryService {
  constructor(private readonly projectCategoryRepository: IProjectCategoryRepository) {}

  create(createPayload: CreateProjectCategory): Promise<ProjectCategories> {
    const data = createProjectCategorySchema.parse(createPayload)
    return this.projectCategoryRepository.create(data)
  }

  update(id: number, updatePayload: UpdateProjectCategory): Promise<ProjectCategories> {
    const data = updateProjectCategorySchema.parse(updatePayload)
    return this.projectCategoryRepository.update(id, data)
  }

  findAll(): Promise<ProjectCategories[]> {
    return this.projectCategoryRepository.findAll()
  }

  findById(id: number): Promise<ProjectCategories> {
    return this.projectCategoryRepository.findById(id)
  }

  delete(id: number): Promise<void> {
    return this.projectCategoryRepository.delete(id)
  }
}
