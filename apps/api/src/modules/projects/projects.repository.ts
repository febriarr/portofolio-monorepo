import { IProjectsRepository } from "@/modules/projects/projects.interface"
import { Database } from "@/config/db"
import { CreateProject, ProjectsFilter, UpdateProject } from "@workspace/validator"
import { Project, ProjectDetails, ProjectWithMeta } from "@workspace/shared"
import { projectImages, projects, projectTechStacks } from "@/config/db/schema"
import { eq, ilike, inArray, SQL } from "drizzle-orm"
import { QueryHelper } from "@/shared/helpers/query-helper"
import { ConflictError } from "@/shared/errors/custom-error"

export class ProjectsRepository implements IProjectsRepository {
  constructor(private readonly database: Database) {}

  async create(payload: CreateProject): Promise<Project> {
    return await this.database.transaction(async (tx) => {
      const { techStackIds, ...projectPayload } = payload

      const [project] = await tx.insert(projects).values(projectPayload).returning()

      if (!project) {
        throw new Error(`Failed to create project: insert returned no rows`)
      }

      if (payload.images?.length) {
        const validImages = payload.images.filter(Boolean)
        await tx.insert(projectImages).values(
          validImages.map((image) => ({
            projectId: project.id,
            imageUrl: image?.imageUrl,
          }))
        )
      }

      if (techStackIds?.length) {
        await tx.insert(projectTechStacks).values(
          techStackIds.map((techStackId) => ({
            projectId: project.id,
            techStackId,
          }))
        )
      }

      return project
    })
  }

  async update(id: number, payload: UpdateProject): Promise<Project> {
    return await this.database.transaction(async (tx) => {
      const { images, techStackIds, deletedImagePaths, ...projectPayload } = payload

      const [project] = await tx
        .update(projects)
        .set(projectPayload)
        .where(eq(projects.id, id))
        .returning()

      if (!project) {
        throw new Error(`Failed to update project: project with id ${id} not found`)
      }

      if (images?.length) {
        await tx.insert(projectImages).values(
          images.map((image) => ({
            projectId: project.id,
            imageUrl: image?.imageUrl,
          }))
        )
      }

      // Delete then re-insert techStacks kalau ada perubahan
      if (techStackIds?.length) {
        await tx.delete(projectTechStacks).where(eq(projectTechStacks.projectId, id))
        await tx.insert(projectTechStacks).values(
          techStackIds.map((techStackId) => ({
            projectId: project.id,
            techStackId,
          }))
        )
      }

      return project
    })
  }

  async findAll(filter?: ProjectsFilter): Promise<{ data: ProjectWithMeta[]; total: number }> {
    const { page = 1, limit = 6, search, categoryId, techStackId } = filter ?? {}
    const offset = (page - 1) * limit

    // Resolve techStackId → projectIds via pivot
    let techStackProjectIds: number[] | undefined

    if (techStackId) {
      const rows = await this.database
        .select({ projectId: projectTechStacks.projectId })
        .from(projectTechStacks)
        .where(eq(projectTechStacks.techStackId, techStackId))

      techStackProjectIds = rows.map((r) => r.projectId)

      if (!techStackProjectIds.length) {
        return { data: [], total: 0 }
      }
    }

    // Build where conditions
    const conditions: SQL[] = []

    QueryHelper.pushIfExists(conditions, search ? ilike(projects.title, `%${search}%`) : null)
    QueryHelper.pushIfExists(conditions, categoryId ? eq(projects.categoryId, categoryId) : null)
    QueryHelper.pushIfExists(
      conditions,
      techStackProjectIds ? inArray(projects.id, techStackProjectIds) : null
    )

    const where = QueryHelper.combineConditions(conditions)

    const [data, total] = await Promise.all([
      this.database.query.projects.findMany({
        where,
        limit,
        offset,
        with: {
          category: true,
          images: true,
          techStacks: {
            with: {
              techStack: true,
            },
          },
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

    if (!project) {
      throw new ConflictError(`Project with id ${id} not found`)
    }

    return project
  }
  async findByIdWithDetail(id: number): Promise<ProjectDetails> {
    const project = await this.database.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        images: true,
        category: true,
        techStacks: {
          with: {
            techStack: true,
          },
        },
      },
    })

    if (!project) {
      throw new Error(`Project with id ${id} not found`)
    }

    return {
      ...project,
      techStacks: project.techStacks.map((t) => t.techStack),
    }
  }
  async delete(id: number): Promise<void> {
    const [deleted] = await this.database.delete(projects).where(eq(projects.id, id)).returning()

    if (!deleted) {
      throw new Error(`Project with id ${id} not found`)
    }
  }

  async deleteImages(paths: string[]): Promise<void> {
    if (!paths.length) return
    await this.database.delete(projectImages).where(inArray(projectImages.imageUrl, paths))
  }
}
