import { apiClient } from "@/lib/axios"
import { ApiResponse, TechCategory } from "@workspace/shared"
import { CreateTechCategory, UpdateTechCategory } from "@workspace/validator"

export const techCategory = {
  findAll() {
    return apiClient.get<ApiResponse<TechCategory[]>>("tech-category")
  },
  findById(id: number) {
    return apiClient.get<ApiResponse<TechCategory>>(`tech-category/${id}`)
  },
  create(payload: CreateTechCategory) {
    return apiClient.post<ApiResponse<TechCategory>>("tech-category", payload)
  },
  update(id: number, payload: UpdateTechCategory) {
    return apiClient.patch<ApiResponse<TechCategory>>(`tech-category/${id}`, payload)
  },
  delete(id: number) {
    return apiClient.delete<ApiResponse<TechCategory>>(`tech-category/${id}`)
  },
}
