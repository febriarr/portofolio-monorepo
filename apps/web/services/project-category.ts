import { apiClient } from "@/lib/axios"
import { ApiResponse, ProjectCategories } from "@workspace/shared"
import { CreateProjectCategory, UpdateProjectCategory } from "@workspace/validator"

export const projectCategory = {
  findAll() {
    return apiClient.get<ApiResponse<ProjectCategories[]>>("/project-category")
  },

  findById(id: number) {
    return apiClient.get<ApiResponse<ProjectCategories>>(`project-category/${id}`)
  },

  create(payload: CreateProjectCategory) {
    return apiClient.post<ApiResponse<ProjectCategories>>(`project-category`, payload)
  },

  update(id: number, payload: UpdateProjectCategory) {
    return apiClient.patch(`project-category/${id}`, payload)
  },

  delete(id: number) {
    return apiClient.delete(`project-category/${id}`)
  },
}
