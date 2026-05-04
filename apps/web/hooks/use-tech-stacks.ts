import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { techStacks } from "@/services/tech-stacks"

import { CreateTechStack, UpdateTechStack } from "@workspace/validator"
import { formatApiError, useAlert } from "@/hooks/use-alert"
import { toast } from "@workspace/ui/components/sonner"

export const techStacksQueryKey = {
  all: ["tech-stacks"] as const,
  detail: (id: number) => ["tech-stacks", id] as const,
}

export function useTechStacks() {
  return useQuery({
    queryKey: techStacksQueryKey.all,
    queryFn: async () => {
      const response = await techStacks.findAll()
      return response.data.data
    },
  })
}

export function useTechStack(id: number) {
  return useQuery({
    queryKey: techStacksQueryKey.detail(id),
    queryFn: async () => {
      const response = await techStacks.findById(id)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateTechStack() {
  const queryClient = useQueryClient()
  const { hide, alert } = useAlert()

  return useMutation({
    mutationFn: async (payload: CreateTechStack) => {
      const response = await techStacks.create(payload)
      return response.data.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: techStacksQueryKey.all,
      })
      hide()
      toast.success("Success create TechStack")
    },
    onError: (error) => {
      const { title, description } = formatApiError(error)
      alert(title, description)
    },
  })
}

export function useUpdateTechStack() {
  const queryClient = useQueryClient()
  const { hide, alert } = useAlert()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateTechStack }) => {
      const response = await techStacks.update(id, payload)
      return response.data.data
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: techStacksQueryKey.all,
      })

      queryClient.invalidateQueries({
        queryKey: techStacksQueryKey.detail(variables.id),
      })
      hide()
      toast.success("Success update TechStack")
    },
    onError: (error) => {
      const { title, description } = formatApiError(error)
      alert(title, description)
    },
  })
}

export function useDeleteTechStack() {
  const queryClient = useQueryClient()
  const { hide, alert } = useAlert()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await techStacks.delete(id)
      return response.data.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: techStacksQueryKey.all,
      })
      hide()
      toast.success("Success delete TechStack")
    },
    onError: (error) => {
      const { title, description } = formatApiError(error)
      alert(title, description)
    },
  })
}
