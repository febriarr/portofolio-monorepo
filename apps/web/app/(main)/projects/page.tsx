import { Metadata } from "next"
import { getProjects } from "@/services/ssr"
import { ProjectsSection } from "@/components/layouts/projects-section"
import { ApiResponse, ProjectWithMeta } from "@workspace/shared"
import { ProjectsMeta } from "@/services/projects-service"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Projects ",
  description: "A collection of projects that have been built with full dedication",
}

export default async function ProjectsPage() {
  let projects: (ApiResponse<ProjectWithMeta[]> & { meta: ProjectsMeta }) | null = null

  try {
    projects = await getProjects({ page: 1, limit: 6 })
  } catch (error) {
    console.error("[ProjectsPage] Failed to fetch projects:", error)
  }

  if (!projects) return notFound()

  return (
    <div className="flex min-h-dvh w-full items-center justify-center">
      <div className="container">
        <h1 className="sr-only">Projects</h1>
        <ProjectsSection initialData={projects} />
      </div>
    </div>
  )
}
