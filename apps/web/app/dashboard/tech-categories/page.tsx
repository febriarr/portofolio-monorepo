import { Metadata } from "next"
import DetailTechCategories from "@/app/dashboard/tech-categories/_components/detail-tech-categories"

export const metadata: Metadata = {
  title: "Tech Categories",
}

export default function TechCategoriesPage() {
  return <DetailTechCategories />
}
