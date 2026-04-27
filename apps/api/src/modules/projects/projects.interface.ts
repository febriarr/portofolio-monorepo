import { CreateProject, UpdateProject } from "@workspace/validator"
import { IBaseRepository, Project, ProjectDetails, UploadedFile } from "@workspace/shared"

export interface IProjectsRepository extends IBaseRepository<
  Project,
  CreateProject,
  UpdateProject,
  number
> {
  findByIdWithDetail(id: number): Promise<ProjectDetails>
  deleteImages(paths: string[]): Promise<void>
}

export interface IProjectsService extends IBaseRepository<
  Project,
  CreateProject,
  UpdateProject,
  number
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
