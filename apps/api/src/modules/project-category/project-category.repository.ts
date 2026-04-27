import { Database } from "@/config/db"
import { CreateProjectCategory, UpdateProjectCategory } from "@workspace/validator"
import { ProjectCategories } from "@workspace/shared"
import { projectCategory } from "@/config/db/schema"
import { IProjectCategoryRepository } from "@/modules/project-category/project-category.interface"
import { eq } from "drizzle-orm"
import { ConflictError } from "@/shared/errors/custom-error"

export class ProjectCategoryRepository implements IProjectCategoryRepository {
  constructor(private readonly database: Database) {}

  async create(createPayload: CreateProjectCategory): Promise<ProjectCategories> {
    const [projectCategories] = await this.database
      .insert(projectCategory)
      .values([createPayload])
      .returning()

    if (!projectCategories) {
      throw new Error(`Failed to create project category: insert returned no rows`)
    }
    return projectCategories
  }

  async update(id: number, updatePayload: UpdateProjectCategory): Promise<ProjectCategories> {
    const [projectCategories] = await this.database
      .update(projectCategory)
      .set(updatePayload)
      .where(eq(projectCategory.id, id))
      .returning()

    if (!projectCategories) {
      throw new Error(
        `Failed to update project category: update project category with id ${id} no rows`
      )
    }

    return projectCategories
  }

  findAll(): Promise<ProjectCategories[]> {
    return this.database.query.projectCategory.findMany()
  }

  async findById(id: number): Promise<ProjectCategories> {
    const category = await this.database.query.projectCategory.findFirst({
      where: eq(projectCategory.id, id),
    })

    if (!category) {
      throw new ConflictError(`Project Category with id ${id} not found`)
    }

    return category
  }

  async delete(id: number): Promise<void> {
    const category = await this.database
      .delete(projectCategory)
      .where(eq(projectCategory.id, id))
      .returning()

    if (!category) {
      throw new ConflictError(`Project Category with id ${id} not found`)
    }
  }
}
