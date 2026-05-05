import { ApiResponse, ProjectWithMeta, TechStackDetails } from "@workspace/shared"
import { ProjectsMeta } from "@/services/projects-service"

export async function getTechStacksSSR(): Promise<TechStackDetails[]> {
  const res = await fetch("http://localhost:8000/api/tech-stacks", {
    next: {
      revalidate: 60 * 60 * 3,
    },
  })
  const data = await res.json()

  return data.data
}

export async function getProjects(params?: Record<string, string | number>) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL!}/projects`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 * 60 * 3 },
  })

  if (!res.ok) throw new Error("Failed to fetch projects")

  return res.json() as Promise<ApiResponse<ProjectWithMeta[]> & { meta: ProjectsMeta }>
}

export async function getProjectById(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/projects/${id}`, {
    next: { revalidate: 60 * 60 * 3 },
  })

  if (!res.ok) throw new Error("Failed to fetch project")

  return res.json() as Promise<ApiResponse<ProjectWithMeta>>
}
