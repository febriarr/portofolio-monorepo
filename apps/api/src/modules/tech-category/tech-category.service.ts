import { BaseService } from "@/shared/base/base.service"
import { TechCategory } from "@workspace/shared"
import {
  CreateTechCategory,
  createTechCategorySchema,
  UpdateTechCategory,
  updateTechCategorySchema,
} from "@workspace/validator"
import { techCategory } from "@/config/db/schema"
import { ITechCategoryService } from "@/modules/tech-category/tech-category.interface"
import { TechCategoryRepository } from "@/modules/tech-category/tech-category.repository"

export class TechCategoryService
  extends BaseService<TechCategory, CreateTechCategory, UpdateTechCategory, typeof techCategory>
  implements ITechCategoryService
{
  constructor(private readonly techCategoryRepository: TechCategoryRepository) {
    super(techCategoryRepository)
  }

  override async create(payload: CreateTechCategory): Promise<TechCategory> {
    const data = createTechCategorySchema.parse(payload)
    return this.repository.create(data)
  }

  override async update(id: number, payload: UpdateTechCategory): Promise<TechCategory> {
    const data = updateTechCategorySchema.parse(payload)
    return this.repository.update(id, data)
  }

  findAll(): Promise<TechCategory[]> {
    return this.techCategoryRepository.findAll()
  }
}
