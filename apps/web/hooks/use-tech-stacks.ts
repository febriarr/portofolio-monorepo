import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { techStacks } from "@/services/tech-stacks"

import { CreateTechStack, UpdateTechStack } from "@workspace/validator"

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

  return useMutation({
    mutationFn: async (payload: CreateTechStack) => {
      const response = await techStacks.create(payload)
      return response.data.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: techStacksQueryKey.all,
      })
    },
  })
}

export function useUpdateTechStack() {
  const queryClient = useQueryClient()

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
    },
  })
}

export function useDeleteTechStack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await techStacks.delete(id)
      return response.data.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: techStacksQueryKey.all,
      })
    },
  })
}
