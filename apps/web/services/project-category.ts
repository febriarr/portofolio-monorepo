import { apiClient } from "@/lib/axios"
import { ApiResponse, ProjectCategories } from "@workspace/shared"
import { CreateProjectCategory, UpdateProjectCategory } from "@workspace/validator"

export const projectCategory = {
  findAll() {
    return apiClient.get<ApiResponse<ProjectCategories[]>>("/project-categories")
  },

  findById(id: number) {
    return apiClient.get<ApiResponse<ProjectCategories>>(`/project-categories/${id}`)
  },

  create(payload: CreateProjectCategory) {
    return apiClient.post<ApiResponse<ProjectCategories>>(`/project-categories`, payload)
  },

  update(id: number, payload: UpdateProjectCategory) {
    return apiClient.patch(`/project-categories/${id}`, payload)
  },

  delete(id: number) {
    return apiClient.delete(`/project-categories/${id}`)
  },
}
