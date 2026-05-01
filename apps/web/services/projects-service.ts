import { ApiResponse, ProjectWithMeta } from "@workspace/shared"
import { apiClient } from "@/lib/axios"

export const findProjectWithId = async (id: number) => {
  return apiClient.get<ApiResponse<ProjectWithMeta>>(`projects/${id}`)
}
