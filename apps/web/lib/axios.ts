import axios, { AxiosError, AxiosInstance } from "axios"
import { ApiResponse } from "@workspace/shared"

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 30000,
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const fallback: ApiResponse<null> = {
      success: false,
      message: error.message || "Unknown error",
      data: null,
      error: {
        code: "UNKNOWN_ERROR",
        statusCode: 0,
        message: error.message || "Unknown error",
      },
    }

    return Promise.reject(error.response?.data ?? fallback)
  }
)
