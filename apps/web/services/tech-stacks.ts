import { apiClient } from "@/lib/axios"
import { ApiResponse, TechStack, TechStackDetails } from "@workspace/shared"

export const techStacks = {
  findAll() {
    return apiClient.get<ApiResponse<TechStackDetails[]>>("tech-stacks")
  },
  findById(id: number) {
    return apiClient.get<ApiResponse<TechStack>>(`tech-stacks/${id}`)
  },
  create(payload: FormData) {
    return apiClient.post<ApiResponse<TechStack>>("tech-stacks/create/with-image", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  update(id: number, payload: FormData) {
    return apiClient.patch<ApiResponse<TechStack>>(`tech-stacks/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  delete(id: number) {
    return apiClient.delete<ApiResponse<TechStack>>(`tech-stacks/${id}`)
  },
}
