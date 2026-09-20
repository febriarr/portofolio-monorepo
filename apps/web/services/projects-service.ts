import { ApiResponse, Project, ProjectWithMeta } from "@workspace/shared"
import { apiClient } from "@/lib/axios"
import { CreateProject, ProjectsFilter, UpdateProject } from "@workspace/validator"

export interface ProjectsMeta {
  total: number
  page: number
  limit: number
}

export interface ProjectsListResponse {
  data: ProjectWithMeta[]
  meta: ProjectsMeta
}

export const projectsService = {
  findAll: async (filter?: Partial<ProjectsFilter>) => {
    return apiClient.get<ApiResponse<ProjectWithMeta[]> & { meta: ProjectsMeta }>("projects", {
      params: filter,
    })
  },

  findById: async (id: number) => {
    return apiClient.get<ApiResponse<ProjectWithMeta>>(`projects/${id}`)
  },

  create: async (payload: CreateProject) => {
    return apiClient.post<ApiResponse<Project>>("projects", payload)
  },

  update: async (id: number, payload: UpdateProject) => {
    return apiClient.patch<ApiResponse<Project>>(`projects/${id}`, payload)
  },

  createWithImages: async (payload: CreateProject, images: File[], thumbnail?: File) => {
    const formData = new FormData()

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, String(v)))
      } else {
        formData.append(key, String(value))
      }
    })

    if (thumbnail) formData.append("thumbnail", thumbnail)

    images.forEach((file) => formData.append("images", file))

    return apiClient.post<ApiResponse<Project>>("projects/with-images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  updateWithImages: async (
    id: number,
    payload: UpdateProject,
    images?: File[],
    thumbnail?: File
  ) => {
    const formData = new FormData()

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, String(v)))
      } else {
        formData.append(key, String(value))
      }
    })

    if (thumbnail) formData.append("thumbnail", thumbnail)
    images?.forEach((file) => formData.append("images", file))

    return apiClient.patch<ApiResponse<Project>>(`projects/${id}/with-images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  delete: async (id: number) => {
    return apiClient.delete<ApiResponse<null>>(`projects/${id}`)
  },
}
