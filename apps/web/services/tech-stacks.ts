import { apiClient } from "@/lib/axios"
import { ApiResponse, TechStack } from "@workspace/shared"
import { CreateTechStack, UpdateTechStack } from "@workspace/validator"

export const techStacks = {
  findAll() {
    return apiClient.get<ApiResponse<TechStack[]>>("tech-stacks")
  },
  findById(id: number) {
    return apiClient.get<ApiResponse<TechStack>>(`tech-stacks/${id}`)
  },
  create(payload: CreateTechStack) {
    return apiClient.post<ApiResponse<TechStack>>("tech-stacks", payload)
  },
  update(id: number, payload: UpdateTechStack) {
    return apiClient.patch<ApiResponse<TechStack>>(`tech-stacks/${id}`, payload)
  },
  delete(id: number) {
    return apiClient.delete<ApiResponse<TechStack>>(`tech-stacks/${id}`)
  },
}
