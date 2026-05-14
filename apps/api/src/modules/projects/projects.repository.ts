import { BaseRepository } from "@/shared/base/base.repository"
import { Database } from "@/config/db"
import { projectImages, projects, projectTechStacks } from "@/config/db/schema"
import { CreateProject, ProjectsFilter, UpdateProject } from "@workspace/validator"
import { Project, ProjectWithMeta } from "@workspace/shared"
import { eq, ilike, inArray, SQL } from "drizzle-orm"
import { QueryHelper } from "@/shared/helpers/query-helper"
import { NotFoundError } from "@/shared/errors/custom-error"
import { IProjectsRepository } from "@/modules/projects/projects.interface"
import { id } from "zod/locales"

export class ProjectsRepository
  extends BaseRepository<
    Project,
    CreateProject,
    UpdateProject,
    typeof projects,
    number,
    ProjectsFilter,
    { data: ProjectWithMeta[]; total: number }
  >
  implements IProjectsRepository
{
  constructor(database: Database) {
    super(database, projects)
  }

  // Override karena butuh transaction + insert pivot tables
  override async create(payload: CreateProject): Promise<Project> {
    return this.database.transaction(async (tx) => {
      const { techStackIds, images, ...projectPayload } = payload

      const [project] = await tx.insert(projects).values(projectPayload).returning()
      if (!project) throw new Error("Failed to create project: insert returned no rows")

      if (images?.length) {
        await tx.insert(projectImages).values(
          images.filter(Boolean).map((image) => ({
            projectId: project.id,
            imageUrl: image?.imageUrl,
          }))
        )
      }

      if (techStackIds?.length) {
        await tx
          .insert(projectTechStacks)
          .values(techStackIds.map((techStackId) => ({ projectId: project.id, techStackId })))
      }

      return project
    })
  }

  // Override karena butuh transaction + delete-reinsert pivot tables
  override async update(id: number, payload: UpdateProject): Promise<Project> {
    return this.database.transaction(async (tx) => {
      const { images, techStackIds, deletedImagePaths, ...projectPayload } = payload

      const [project] = await tx
        .update(projects)
        .set(projectPayload)
        .where(eq(projects.id, id))
        .returning()
      if (!project) throw new NotFoundError(`Failed to update project: id ${id} not found`)

      if (images?.length) {
        await tx
          .insert(projectImages)
          .values(images.map((image) => ({ projectId: project.id, imageUrl: image?.imageUrl })))
      }

      if (techStackIds?.length) {
        await tx.delete(projectTechStacks).where(eq(projectTechStacks.projectId, id))
        await tx
          .insert(projectTechStacks)
          .values(techStackIds.map((techStackId) => ({ projectId: project.id, techStackId })))
      }

      return project
    })
  }

  async findAll(filter?: ProjectsFilter): Promise<{ data: ProjectWithMeta[]; total: number }> {
    const { page = 1, limit = 6, search, categoryId, techStackId } = filter ?? {}
    const offset = (page - 1) * limit

    const conditions: SQL[] = []

    QueryHelper.pushIfExists(conditions, search ? ilike(projects.title, `%${search}%`) : null)
    QueryHelper.pushIfExists(conditions, categoryId ? eq(projects.categoryId, categoryId) : null)

    if (techStackId) {
      const subquery = this.database
        .select({ projectId: projectTechStacks.projectId })
        .from(projectTechStacks)
        .where(eq(projectTechStacks.techStackId, techStackId))

      QueryHelper.pushIfExists(conditions, inArray(projects.id, subquery))
    }

    const where = QueryHelper.combineConditions(conditions)

    const [data, total] = await Promise.all([
      this.database.query.projects.findMany({
        where,
        limit,
        offset,
        with: {
          category: true,
          images: true,
          techStacks: { with: { techStack: true } },
        },
      }),
      this.database.$count(projects, where),
    ])

    return { data: data as ProjectWithMeta[], total }
  }

  async findById(id: number): Promise<Project> {
    const project = await this.database.query.projects.findFirst({
      where: eq(projects.id, id),
    })

    if (!project) throw new NotFoundError(`Project with id ${id} not found`)
    return project
  }

  async findByIdWithDetail(id: number): Promise<ProjectWithMeta> {
    const project = await this.database.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        images: true,
        category: true,
        techStacks: { with: { techStack: true } },
      },
    })

    if (!project) throw new Error(`Project with id ${id} not found`)

    return project
  }

  async deleteImages(paths: string[]): Promise<void> {
    if (!paths.length) return
    await this.database.delete(projectImages).where(inArray(projectImages.imageUrl, paths))
  }

  override async delete(id: number): Promise<Project> {
    return this.database.transaction(async (tx) => {
      // Hapus pivot tables dulu sebelum hapus project
      await tx.delete(projectTechStacks).where(eq(projectTechStacks.projectId, id))
      await tx.delete(projectImages).where(eq(projectImages.projectId, id))

      const [project] = await tx.delete(projects).where(eq(projects.id, id)).returning()

      if (!project) throw new NotFoundError(`Project with id ${id} not found`)

      return project
    })
  }

  async findBySlug(slug: string): Promise<ProjectWithMeta> {
    const project = await this.database.query.projects.findFirst({
      where: eq(projects.slug, slug),
      with: {
        images: true,
        category: true,
        techStacks: { with: { techStack: true } },
      },
    })

    if (!project) throw new NotFoundError(`Project with id ${id} not found`)

    return project
  }
}
