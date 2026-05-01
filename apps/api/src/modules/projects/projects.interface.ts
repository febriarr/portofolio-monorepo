import { CreateProject, ProjectsFilter, UpdateProject } from "@workspace/validator"
import {
  IBaseRepository,
  IBaseService,
  Project,
  ProjectWithMeta,
  UploadedFile,
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
}

export interface IProjectsService extends IBaseService<
  Project,
  CreateProject,
  UpdateProject,
  number,
  ProjectsFilter
> {
  findAll(filter?: ProjectsFilter): Promise<PaginatedResult<ProjectWithMeta>>
  createWithImages(payload: CreateProject, images?: UploadedFile[]): Promise<Project>
  updateWithImages(
    id: number,
    payload: UpdateProject,
    images?: UploadedFile[],
    deletedPaths?: string[]
  ): Promise<Project>
  findByIdWithDetail(id: number): Promise<ProjectWithMeta>
}
