import { IBaseRepository, IBaseService, TechStack, UploadedFile } from "@workspace/shared"
import { CreateTechStack, UpdateTechStack } from "@workspace/validator"

export interface ITechStacksRepository extends IBaseRepository<
  TechStack,
  CreateTechStack,
  UpdateTechStack,
  number
> {
  findAll(): Promise<TechStack[]>
}

export interface ITechStacksService extends IBaseService<
  TechStack,
  CreateTechStack,
  UpdateTechStack,
  number
> {
  findAll(): Promise<TechStack[]>
  createWithImage(createTechStack: CreateTechStack, image?: UploadedFile): Promise<TechStack>
  updateWithImage(
    id: number,
    updateImage: UpdateTechStack,
    image?: UploadedFile
  ): Promise<TechStack>
}
