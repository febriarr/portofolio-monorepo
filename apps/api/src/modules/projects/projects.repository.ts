import { IProjectsRepository } from "@/modules/projects/projects.interface"
import { Database } from "@/config/db"
import { CreateProject, CreateProjectImages, UpdateProject } from "@workspace/validator"
import { Project, ProjectDetails, ProjectImages } from "@workspace/shared"
import { projectImages, projects } from "@/config/db/schema"
import { eq } from "drizzle-orm"
import { PgInsertBase } from "drizzle-orm/pg-core"
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres"

export class ProjectsRepository implements IProjectsRepository {
  constructor(private readonly database: Database) {}

  async create(payload: CreateProject): Promise<Project> {
    return await this.database.transaction(async (tx) => {
      const [project] = await tx.insert(projects).values(payload).returning()

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

      return project
    })
  }

  async update(payload: UpdateProject, id: number): Promise<Project> {
    return await this.database.transaction(async (tx) => {
      const { images, ...projectPayload } = payload

      const [project] = await tx
        .update(projects)
        .set(projectPayload)
        .where(eq(projects.id, id))
        .returning()

      if (!project) {
        throw new Error(`Failed to update project: project with id ${id} not found`)
      }

      if (images?.length) {
        await tx.delete(projectImages).where(eq(projectImages.projectId, id))

        const validImages = images.filter(Boolean)

        await tx.insert(projectImages).values(
          validImages.map((image) => ({
            projectId: project.id,
            imageUrl: image?.imageUrl,
          }))
        )
      }

      return project
    })
  }

  findAll(): Promise<Project[]> {
    return this.database.query.projects.findMany({})
  }

  async findById(id: number): Promise<Project> {
    const project = await this.database.query.projects.findFirst({
      where: eq(projects.id, id),
    })

    if (!project) {
      throw new Error(`Project with id ${id} not found`)
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
}
