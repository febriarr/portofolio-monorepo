import { CreateProject, UpdateProject } from "@workspace/validator"
import { IBaseRepository, Project, ProjectDetails } from "@workspace/shared"

export interface IProjectsRepository extends IBaseRepository<
  Project,
  CreateProject,
  UpdateProject,
  number
> {
  findByIdWithDetail(id: number): Promise<ProjectDetails>
}

export interface IProjectsService extends IBaseRepository<
  Project,
  CreateProject,
  UpdateProject,
  number
> {
  createWithImage(payload: CreateProject, image: Express.Multer.File): Promise<Project>
  findByIdWithDetail(id: number): Promise<ProjectDetails>
  updateWithImage(id: number, payload: UpdateProject, image: Express.Multer.File): Promise<Project>
}
