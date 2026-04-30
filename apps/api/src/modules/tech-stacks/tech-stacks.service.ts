import { BaseService } from "@/shared/base/base.service"
import {
  CreateTechStack,
  createTechStackSchema,
  UpdateTechStack,
  updateTechStackSchema,
} from "@workspace/validator"
import { TechStack, UploadedFile } from "@workspace/shared"
import { techStack } from "@/config/db/schema"
import { ITechStacksService } from "@/modules/tech-stacks/tech-stacks.interface"
import { TechStacksRepository } from "@/modules/tech-stacks/tech-stacks.repository"
import { ImageService } from "@/shared/cloudflare/image.service"
import { NotFoundError } from "@/shared/errors/custom-error"

export class TechStacksService
  extends BaseService<TechStack, CreateTechStack, UpdateTechStack, typeof techStack>
  implements ITechStacksService
{
  constructor(
    private readonly techStacskRepository: TechStacksRepository,
    private readonly imageService: ImageService
  ) {
    super(techStacskRepository)
  }

  override async create(payload: CreateTechStack): Promise<TechStack> {
    const data = createTechStackSchema.parse(payload)
    return this.repository.create(data)
  }

  override async update(id: number, payload: UpdateTechStack): Promise<TechStack> {
    const data = updateTechStackSchema.parse(payload)
    return this.repository.update(id, data)
  }

  async createWithImage(
    createTechStack: CreateTechStack,
    image?: UploadedFile
  ): Promise<TechStack> {
    let data: CreateTechStack | null = createTechStack

    if (image) {
      const uploaded = await this.imageService.createImage({ file: image })
      data.logo = uploaded.path
    }

    return this.create(data)
  }

  override async findById(id: number): Promise<TechStack> {
    return this.repository.findById(id)
  }

  async updateWithImage(
    id: number,
    updateTechStack: UpdateTechStack,
    image?: UploadedFile
  ): Promise<TechStack> {
    let data: UpdateTechStack | null = updateTechStack

    const dataExists = await this.findById(id)
    if (!dataExists) {
      throw new NotFoundError(`Tech stack ${id} not found`)
    }
    if (image) {
      const uploaded = await this.imageService.createImage({ file: image })
      data.logo = uploaded.path
      await this.imageService.deleteImages([dataExists.logo!])
    }

    return this.update(id, data)
  }

  findAll(): Promise<TechStack[]> {
    return this.techStacskRepository.findAll()
  }
}
