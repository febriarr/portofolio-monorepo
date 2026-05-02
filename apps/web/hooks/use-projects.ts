import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { projectsService } from "@/services/projects-service"
import { CreateProject, ProjectsFilter, UpdateProject } from "@workspace/validator"

export const PROJECT_KEYS = {
  all: ["projects"] as const,
  lists: () => [...PROJECT_KEYS.all, "list"] as const,
  list: (filter?: ProjectsFilter) => [...PROJECT_KEYS.lists(), filter] as const,
  details: () => [...PROJECT_KEYS.all, "detail"] as const,
  detail: (id: number) => [...PROJECT_KEYS.details(), id] as const,
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useProjects = (filter?: ProjectsFilter) => {
  return useQuery({
    queryKey: PROJECT_KEYS.list(filter),
    queryFn: async () => {
      const res = await projectsService.findAll(filter)
      return res.data
    },
  })
}

export const useProject = (id: number) => {
  return useQuery({
    queryKey: PROJECT_KEYS.detail(id),
    queryFn: async () => {
      const res = await projectsService.findById(id)
      return res.data
    },
    enabled: !!id,
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ payload, images }: { payload: CreateProject; images?: File[] }) => {
      if (images?.length) {
        const res = await projectsService.createWithImages(payload, images)
        return res.data
      }
      const res = await projectsService.create(payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
      images,
    }: {
      id: number
      payload: UpdateProject
      images?: File[]
    }) => {
      if (images?.length) {
        const res = await projectsService.updateWithImages(id, payload, images)
        return res.data
      }
      const res = await projectsService.update(id, payload)
      return res.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.detail(id) })
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await projectsService.delete(id)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() })
    },
  })
}
