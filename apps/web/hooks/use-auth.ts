"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { LoginPayload } from "@workspace/validator"
import { authService } from "@/services/auth"

export const useLogin = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: () => {
      router.push("/dashboard")
      router.refresh()
    },
  })
}

export const useLogout = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      router.push("/login")
      router.refresh()
    },
  })
}
