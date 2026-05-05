import { apiClient } from "@/lib/axios"
import { ApiResponse } from "@workspace/shared"
import { LoginPayload } from "@workspace/validator"

export const authService = {
  login(payload: LoginPayload) {
    return apiClient.post<ApiResponse<null>>("auth/login", payload)
  },

  me() {
    return apiClient.get<ApiResponse<{ sub: number; username: string }>>("auth/me")
  },

  logout() {
    return apiClient.post<ApiResponse<null>>("auth/logout")
  },

  refresh() {
    return apiClient.post<ApiResponse<null>>("auth/refresh")
  },
}
