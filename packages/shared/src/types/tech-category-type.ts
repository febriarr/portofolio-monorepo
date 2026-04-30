import { TimestampType } from "./timestamp-type"
import { TechStack } from "./tech-stack-type"

export interface TechCategory extends TimestampType {
  id: number
  name: string | null
}

export interface TechCategoryDetails extends TechCategory {
  techStack: TechStack[]
}
