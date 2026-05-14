import { CreateProject, ProjectsFilter, UpdateProject } from "@workspace/validator"
import {
  IBaseRepository,
  IBaseService,
  Project,
  ProjectUploadedFiles,
  ProjectWithMeta,
} from "@workspace/shared"
import { PaginatedResult } from "@/types/paginated-result"

export interface IProjectsRepository extends IBaseRepository<
  Project,
  CreateProject,
  UpdateProject,
  number,
  ProjectsFilter
> {
  findAll(): Promise<{ data: ProjectWithMeta[]; total: number }>
  findByIdWithDetail(id: number): Promise<ProjectWithMeta>
  deleteImages(paths: string[]): Promise<void>
  findBySlug(slug: string): Promise<ProjectWithMeta>
}

export interface IProjectsService extends IBaseService<
  Project,
  CreateProject,
  UpdateProject,
  number,
  ProjectsFilter
> {
  findAll(filter?: ProjectsFilter): Promise<PaginatedResult<ProjectWithMeta>>
  createWithImages(payload: CreateProject, files?: ProjectUploadedFiles): Promise<Project>
  updateWithImages(
    id: number,
    payload: UpdateProject,
    files?: ProjectUploadedFiles,
    deletedPaths?: string[]
  ): Promise<Project>
  findByIdWithDetail(id: number): Promise<ProjectWithMeta>
  findBySlug(slug: string): Promise<ProjectWithMeta>
}
