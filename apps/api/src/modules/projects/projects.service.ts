import { IProjectsRepository, IProjectsService } from "@/modules/projects/projects.interface"
import { ImageService } from "@/shared/cloudflare/image.service"
import {
  CreateProject,
  createProjectSchema,
  ProjectsFilter,
  projectsFilterSchema,
  UpdateProject,
  updateProjectSchema,
} from "@workspace/validator"
import { Project, ProjectDetails, ProjectWithMeta, UploadedFile } from "@workspace/shared"
import { PaginatedResult } from "@/types/paginated-result"

export class ProjectsService implements IProjectsService {
  constructor(
    private readonly repository: IProjectsRepository,
    private readonly imageService: ImageService
  ) {}

  create(createPayload: CreateProject): Promise<Project> {
    const data = createProjectSchema.parse(createPayload)

    return this.repository.create(data)
  }

  update(id: number, updatePayload: UpdateProject): Promise<Project> {
    const data = updateProjectSchema.parse(updatePayload)

    return this.repository.update(id, data)
  }

  async findAll(filter?: ProjectsFilter): Promise<PaginatedResult<ProjectWithMeta>> {
    const parsed = projectsFilterSchema.parse(filter ?? {})
    const { data, total } = await this.repository.findAll(parsed)

    return {
      data,
      total,
      page: parsed.page,
      limit: parsed.limit,
    }
  }

  findById(id: number): Promise<Project> {
    return this.repository.findById(id)
  }

  findByIdWithDetail(id: number): Promise<ProjectDetails> {
    return this.repository.findByIdWithDetail(id)
  }

  async createWithImages(payload: CreateProject, images?: UploadedFile[]): Promise<Project> {
    const data = createProjectSchema.parse(payload)

    if (images?.length) {
      const uploaded = await this.imageService.createImages(images.map((file) => ({ file })))
      data.images = uploaded.map((img) => ({
        imageUrl: img.path,
      }))
    }
    return this.create(data)
  }

  async updateWithImages(
    id: number,
    payload: UpdateProject,
    images?: UploadedFile[]
  ): Promise<Project> {
    const data = updateProjectSchema.parse(payload)
    const { deletedImagePaths } = data

    if (deletedImagePaths?.length) {
      await Promise.all([
        this.imageService.deleteImages(deletedImagePaths),
        this.repository.deleteImages(deletedImagePaths),
      ])
    }

    if (images?.length) {
      const uploaded = await this.imageService.createImages(images.map((file) => ({ file })))
      data.images = uploaded.map((img) => ({ imageUrl: img.path }))
    }

    return this.update(id, data)
  }

  delete(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
