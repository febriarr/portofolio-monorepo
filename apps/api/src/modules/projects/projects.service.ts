import { BaseService } from "@/shared/base/base.service"
import { ProjectsRepository } from "@/modules/projects/projects.repository"
import { ImageService } from "@/shared/cloudflare/image.service"
import { IProjectsService } from "@/modules/projects/projects.interface"
import {
  CreateProject,
  createProjectSchema,
  ProjectsFilter,
  projectsFilterSchema,
  UpdateProject,
  updateProjectSchema,
} from "@workspace/validator"
import { Project, ProjectWithMeta, UploadedFile } from "@workspace/shared"
import { PaginatedResult } from "@/types/paginated-result"
import { projects } from "@/config/db/schema"

export class ProjectsService
  extends BaseService<
    Project,
    CreateProject,
    UpdateProject,
    typeof projects,
    number,
    ProjectsFilter,
    PaginatedResult<ProjectWithMeta>
  >
  implements IProjectsService
{
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly imageService: ImageService
  ) {
    super(projectsRepository)
  }

  // Override karena ada Zod parse
  override async create(payload: CreateProject): Promise<Project> {
    const data = createProjectSchema.parse(payload)
    return this.repository.create(data)
  }

  // Override karena ada Zod parse
  override async update(id: number, payload: UpdateProject): Promise<Project> {
    const data = updateProjectSchema.parse(payload)
    return this.repository.update(id, data)
  }

  async findAll(filter?: ProjectsFilter): Promise<PaginatedResult<ProjectWithMeta>> {
    const parsed = projectsFilterSchema.parse(filter ?? {})
    const { data, total } = await this.projectsRepository.findAll(parsed)

    return { data, total, page: parsed.page!, limit: parsed.limit! }
  }

  findByIdWithDetail(id: number): Promise<ProjectWithMeta> {
    return this.projectsRepository.findByIdWithDetail(id)
  }

  async createWithImages(payload: CreateProject, images?: UploadedFile[]): Promise<Project> {
    try {
      const data = createProjectSchema.parse(payload)

      if (images?.length) {
        const uploaded = await this.imageService.createImages(images.map((file) => ({ file })))
        data.images = uploaded.map((img) => ({ imageUrl: img.path }))
      }

      return this.repository.create(data)
    } catch (error) {
      throw error
    }
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
        this.projectsRepository.deleteImages(deletedImagePaths),
      ])
    }

    if (images?.length) {
      const uploaded = await this.imageService.createImages(images.map((file) => ({ file })))
      data.images = uploaded.map((img) => ({ imageUrl: img.path }))
    }

    return this.repository.update(id, data)
  }
}
