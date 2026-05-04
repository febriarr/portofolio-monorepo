import { Metadata } from "next"
import DetailProjectCategory from "@/app/dashboard/project-categories/_components/detail-project-category"

export const metadata: Metadata = {
  title: "Project Category",
}

export default function ProjectCategoryPage() {
  return <DetailProjectCategory />
}
