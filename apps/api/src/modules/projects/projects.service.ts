import { BaseService } from "@/shared/base/base.service"
import { ProjectsRepository } from "@/modules/projects/projects.repository"
import { ImageService } from "@/shared/cloudflare/image.service"
import { IProjectsService } from "@/modules/projects/projects.interface"
import {
  CreateProject,
  createProjectSchema,
  paramsSchema,
  ProjectsFilter,
  projectsFilterSchema,
  UpdateProject,
  updateProjectSchema,
} from "@workspace/validator"
import { Project, ProjectUploadedFiles, ProjectWithMeta, UploadedFile } from "@workspace/shared"
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

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
  }

  // Override karena ada Zod parse
  override async create(payload: CreateProject): Promise<Project> {
    const data = createProjectSchema.parse(payload)
    return this.repository.create({
      ...data,
      slug: this.generateSlug(data.title),
    })
  }

  // Override karena ada Zod parse
  override async update(id: number, payload: UpdateProject): Promise<Project> {
    const data = updateProjectSchema.parse(payload)
    return this.repository.update(id, {
      ...data,
      ...(data.title && { slug: this.generateSlug(data.title) }),
    })
  }

  async findAll(filter?: ProjectsFilter): Promise<PaginatedResult<ProjectWithMeta>> {
    const parsed = projectsFilterSchema.parse(filter ?? {})
    const { data, total } = await this.projectsRepository.findAll(parsed)

    return { data, total, page: parsed.page!, limit: parsed.limit! }
  }

  findByIdWithDetail(id: number): Promise<ProjectWithMeta> {
    return this.projectsRepository.findByIdWithDetail(id)
  }

  async createWithImages(payload: CreateProject, files?: ProjectUploadedFiles): Promise<Project> {
    const data = createProjectSchema.parse(payload)

    // Upload thumbnail (single)
    if (files?.thumbnail?.[0]) {
      const [uploaded] = await this.imageService.createImages([{ file: files.thumbnail[0] }])
      data.thumbnailUrl = uploaded?.path
    }

    // Upload images (multiple)
    if (files?.images?.length) {
      const uploaded = await this.imageService.createImages(files.images.map((file) => ({ file })))
      data.images = uploaded.map((img) => ({ imageUrl: img.path }))
    }

    return this.repository.create(data)
  }

  async updateWithImages(
    id: number,
    payload: UpdateProject,
    files?: ProjectUploadedFiles
  ): Promise<Project> {
    const data = updateProjectSchema.parse(payload)
    const { deletedImagePaths, deletedThumbnailPath } = data

    // Hapus thumbnail lama jika ada
    if (deletedThumbnailPath) {
      await this.imageService.deleteImages([deletedThumbnailPath])
      data.thumbnailUrl = null // atau undefined tergantung schema
    }

    // Hapus images lama jika ada
    if (deletedImagePaths?.length) {
      await Promise.all([
        this.imageService.deleteImages(deletedImagePaths),
        this.projectsRepository.deleteImages(deletedImagePaths),
      ])
    }

    // Upload thumbnail baru
    if (files?.thumbnail?.[0]) {
      const [uploaded] = await this.imageService.createImages([{ file: files.thumbnail[0] }])
      data.thumbnailUrl = uploaded?.path
    }

    // Upload images baru
    if (files?.images?.length) {
      const uploaded = await this.imageService.createImages(files.images.map((file) => ({ file })))
      data.images = uploaded.map((img) => ({ imageUrl: img.path }))
    }

    return this.repository.update(id, data)
  }

  findBySlug(slug: string): Promise<ProjectWithMeta> {
    const parsed = paramsSchema.parse(slug)
    return this.projectsRepository.findBySlug(parsed)
  }
}
