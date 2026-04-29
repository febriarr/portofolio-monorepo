import { Database } from "@/config/db"
import { CreateProjectCategory, UpdateProjectCategory } from "@workspace/validator"
import { ProjectCategories } from "@workspace/shared"
import { projectCategory } from "@/config/db/schema"
import { IProjectCategoryRepository } from "@/modules/project-category/project-category.interface"
import { eq } from "drizzle-orm"
import { NotFoundError } from "@/shared/errors/custom-error"
import { BaseRepository } from "@/shared/base/base.repository"

export class ProjectCategoryRepository
  extends BaseRepository<
    ProjectCategories,
    CreateProjectCategory,
    UpdateProjectCategory,
    typeof projectCategory
  >
  implements IProjectCategoryRepository
{
  constructor(database: Database) {
    super(database, projectCategory)
  }

  async findById(id: number): Promise<ProjectCategories> {
    const category = await this.database.query.projectCategory.findFirst({
      where: eq(projectCategory.id, id),
    })

    if (!category) throw new NotFoundError(`Project Category with id ${id} not found`)
    return category
  }

  findAll(): Promise<ProjectCategories[]> {
    return this.database.query.projectCategory.findMany()
  }
}
