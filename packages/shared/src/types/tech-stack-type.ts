import { TimestampType } from "./timestamp-type"
import { TechCategory } from "./tech-category-type"
import { Project } from "./projects-type"

export interface TechStack extends TimestampType {
  id: number
  name: string
  techCategoryId: number | null
  logo: string | null
}

export interface TechStackDetails extends TechStack {
  category: TechCategory
  projects: Project[]
}
