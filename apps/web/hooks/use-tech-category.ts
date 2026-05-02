import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { techCategory } from "@/services/tech-category"

import { CreateTechCategory, UpdateTechCategory } from "@workspace/validator"

export const techCategoryQueryKey = {
  all: ["tech-category"] as const,
  detail: (id: number) => ["tech-category", id] as const,
}

export function useTechCategories() {
  return useQuery({
    queryKey: techCategoryQueryKey.all,
    queryFn: async () => {
      const response = await techCategory.findAll()
      return response.data.data
    },
  })
}

export function useTechCategory(id: number) {
  return useQuery({
    queryKey: techCategoryQueryKey.detail(id),
    queryFn: async () => {
      const response = await techCategory.findById(id)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateTechCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateTechCategory) => {
      const response = await techCategory.create(payload)
      return response.data.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: techCategoryQueryKey.all,
      })
    },
  })
}

export function useUpdateTechCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateTechCategory }) => {
      const response = await techCategory.update(id, payload)
      return response.data.data
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: techCategoryQueryKey.all,
      })

      queryClient.invalidateQueries({
        queryKey: techCategoryQueryKey.detail(variables.id),
      })
    },
  })
}

export function useDeleteTechCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await techCategory.delete(id)
      return response.data.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: techCategoryQueryKey.all,
      })
    },
  })
}
