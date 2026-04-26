import { TimestampType } from "./timestamp-type"
import { TechStack } from "./tech-stack-type"

export interface Project extends TimestampType {
  id: number
  title: string
  shortDescription: string | null
  description: string | null
  liveUrl: string | null
  linkRepo: string | null
  categoryId: number | null
}

export interface ProjectImages extends TimestampType {
  id: number
  projectId: number | null
  imageUrl: string | null
}

export interface ProjectCategories extends TimestampType {
  id: number
  name: string | null
}

export interface ProjectDetails extends Project {
  category: ProjectCategories | null
  techStacks: TechStack[]
  images: ProjectImages[]
}

export interface ProjectImagesDetails extends ProjectImages {
  project: Project
}
