import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { projectCategory } from "@/services/project-category"

import { CreateProjectCategory, UpdateProjectCategory } from "@workspace/validator"
import { toast } from "@workspace/ui/components/sonner"
import { formatApiError, useAlert } from "@/hooks/use-alert"

export const projectCategoryQueryKey = {
  all: ["project-categories"] as const,
  detail: (id: number) => ["project-categories", id] as const,
}

export function useProjectCategories() {
  return useQuery({
    queryKey: projectCategoryQueryKey.all,
    queryFn: async () => {
      const response = await projectCategory.findAll()
      return response.data.data
    },
  })
}

export function useProjectCategory(id: number) {
  return useQuery({
    queryKey: projectCategoryQueryKey.detail(id),
    queryFn: async () => {
      const response = await projectCategory.findById(id)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateProjectCategory() {
  const queryClient = useQueryClient()
  const { hide, alert } = useAlert()

  return useMutation({
    mutationFn: async (payload: CreateProjectCategory) => {
      const response = await projectCategory.create(payload)
      return response.data.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectCategoryQueryKey.all,
      })
      hide()
      toast.success("Create ProjectCategory")
    },
    onError: (error) => {
      const { title, description } = formatApiError(error)
      alert(title, description)
    },
  })
}

export function useUpdateProjectCategory() {
  const queryClient = useQueryClient()
  const { hide, alert } = useAlert()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateProjectCategory }) => {
      const response = await projectCategory.update(id, payload)
      return response.data
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectCategoryQueryKey.all,
      })

      queryClient.invalidateQueries({
        queryKey: projectCategoryQueryKey.detail(variables.id),
      })

      hide()
      toast.success("Update ProjectCategory")
    },
    onError: (error) => {
      const { title, description } = formatApiError(error)
      alert(title, description)
    },
  })
}

export function useDeleteProjectCategory() {
  const queryClient = useQueryClient()
  const { hide, alert } = useAlert()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await projectCategory.delete(id)
      return response.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectCategoryQueryKey.all,
      })
      hide()
      toast.success("Delete ProjectCategory")
    },
    onError: (error) => {
      const { title, description } = formatApiError(error)
      alert(title, description)
    },
  })
}
