import { BaseRepository } from "@/shared/base/base.repository"
import { TechCategory } from "@workspace/shared"
import { CreateTechCategory, UpdateTechCategory } from "@workspace/validator"
import { techCategory } from "@/config/db/schema"
import { ITechCategoryRepository } from "@/modules/tech-category/tech-category.interface"
import { Database } from "@/config/db"
import { eq } from "drizzle-orm"
import { NotFoundError } from "@/shared/errors/custom-error"

export class TechCategoryRepository
  extends BaseRepository<TechCategory, CreateTechCategory, UpdateTechCategory, typeof techCategory>
  implements ITechCategoryRepository
{
  constructor(database: Database) {
    super(database, techCategory)
  }

  findAll(): Promise<TechCategory[]> {
    return this.database.query.techCategory.findMany()
  }

  async findById(id: number): Promise<TechCategory> {
    const data = await this.database.query.techCategory.findFirst({
      where: eq(techCategory.id, id),
    })

    if (!data) {
      throw new NotFoundError("Tech Category not found with id " + id)
    }

    return data
  }
}
