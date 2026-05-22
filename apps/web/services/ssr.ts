import { ApiResponse, ProjectWithMeta, TechStackDetails } from "@workspace/shared"
import { ProjectsMeta } from "@/services/projects-service"

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined")
}

export async function getTechStacksSSR(): Promise<TechStackDetails[] | null> {
  try {
    const res = await fetch(`${API_URL}/tech-stacks`, {
      next: {
        revalidate: 60 * 60 * 3,
      },
    })

    if (!res.ok) {
      return null
    }

    const data: ApiResponse<TechStackDetails[]> = await res.json()

    return data.data ?? []
  } catch (error) {
    console.error("getTechStacksSSR error:", error)

    return null
  }
}

export async function getProjects(
  params?: Record<string, string | number>
): Promise<(ApiResponse<ProjectWithMeta[]> & { meta: ProjectsMeta }) | null> {
  try {
    const url = new URL(`${API_URL}/projects`)

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        url.searchParams.set(k, String(v))
      })
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 * 60 * 3 },
    })

    if (!res.ok) {
      return null
    }

    return await res.json()
  } catch (error) {
    console.error("getProjects error:", error)

    return null
  }
}

export async function getProjectById(id: number): Promise<ApiResponse<ProjectWithMeta> | null> {
  try {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      next: { revalidate: 60 * 60 * 3 },
    })

    if (!res.ok) {
      return null
    }

    return await res.json()
  } catch (error) {
    console.error("getProjectById error:", error)

    return null
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithMeta | null> {
  try {
    const res = await fetch(`${API_URL}/projects/slug/${slug}`, {
      next: { revalidate: 60 * 60 * 3 },
    })

    if (!res.ok) {
      return null
    }

    const data: ApiResponse<ProjectWithMeta> = await res.json()

    return data.data as ProjectWithMeta
  } catch (error) {
    console.error("getProjectBySlug error:", error)

    return null
  }
}
