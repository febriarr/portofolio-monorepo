import { CreateProject, ProjectsFilter, UpdateProject } from "@workspace/validator"
import {
  IBaseRepository,
  Project,
  ProjectDetails,
  ProjectWithMeta,
  UploadedFile,
} from "@workspace/shared"
import { PaginatedResult } from "@/types/paginated-result"

export interface IProjectsRepository extends IBaseRepository<
  Project,
  CreateProject,
  UpdateProject,
  number,
  ProjectsFilter,
  {
    data: ProjectWithMeta[]
    total: number
  }
> {
  findByIdWithDetail(id: number): Promise<ProjectDetails>
  deleteImages(paths: string[]): Promise<void>
}

export interface IProjectsService extends IBaseRepository<
  Project,
  CreateProject,
  UpdateProject,
  number,
  ProjectsFilter,
  PaginatedResult<ProjectWithMeta>
> {
  createWithImages(payload: CreateProject, images?: UploadedFile[]): Promise<Project>
  updateWithImages(
    id: number,
    payload: UpdateProject,
    images?: UploadedFile[],
    deletedPaths?: string[]
  ): Promise<Project>
  findByIdWithDetail(id: number): Promise<ProjectDetails>
}
