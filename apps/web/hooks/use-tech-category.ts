import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { techCategory } from "@/services/tech-category"

import { CreateTechCategory, UpdateTechCategory } from "@workspace/validator"
import { formatApiError, useAlert } from "@/hooks/use-alert"
import { toast } from "@workspace/ui/components/sonner"

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
  const { hide, alert } = useAlert()

  return useMutation({
    mutationFn: async (payload: CreateTechCategory) => {
      const response = await techCategory.create(payload)
      return response.data.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: techCategoryQueryKey.all,
      })
      hide()
      toast.success("Success Create Tech Category")
    },
    onError: (error) => {
      const { title, description } = formatApiError(error)
      alert(title, description)
    },
  })
}

export function useUpdateTechCategory() {
  const queryClient = useQueryClient()
  const { hide, alert } = useAlert()

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
      hide()
      toast.success("Success Update Tech Category")
    },
    onError: (error) => {
      const { title, description } = formatApiError(error)
      alert(title, description)
    },
  })
}

export function useDeleteTechCategory() {
  const queryClient = useQueryClient()
  const { hide, alert } = useAlert()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await techCategory.delete(id)
      return response.data.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: techCategoryQueryKey.all,
      })
      hide()
      toast.success("Success Delete Tech Category")
    },
    onError: (error) => {
      const { title, description } = formatApiError(error)
      alert(title, description)
    },
  })
}
