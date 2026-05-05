import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ProjectsMeta, projectsService } from "@/services/projects-service"
import { CreateProject, ProjectsFilter, UpdateProject } from "@workspace/validator"
import { formatApiError, useAlert } from "@/hooks/use-alert"
import { toast } from "@workspace/ui/components/sonner"
import { ApiResponse, ProjectWithMeta } from "@workspace/shared"

export const PROJECT_KEYS = {
  all: ["projects"] as const,
  lists: () => [...PROJECT_KEYS.all, "list"] as const,
  list: (filter?: Partial<ProjectsFilter>) => [...PROJECT_KEYS.lists(), filter] as const,
  details: () => [...PROJECT_KEYS.all, "detail"] as const,
  detail: (id: number) => [...PROJECT_KEYS.details(), id] as const,
}

// ─── Queries ──────────────────────────────────────────────────────────────────
type InitialData = ApiResponse<ProjectWithMeta[]> & { meta: ProjectsMeta }

export const useProjects = (
  filter?: Partial<ProjectsFilter>,
  options?: { initialData?: InitialData }
) => {
  return useQuery({
    queryKey: PROJECT_KEYS.list(filter),
    queryFn: async () => {
      const res = await projectsService.findAll(filter)
      return res.data
    },
    initialData: options?.initialData,
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
  const { alert, hide } = useAlert()

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
      hide()
      toast.success("Success Create project")
    },
    onError: (error) => {
      const { title, description } = formatApiError(error)
      alert(title, description)
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  const { alert, hide } = useAlert()

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
      hide()
      toast.success("Success Update project")
    },
    onError: (error) => {
      const { title, description } = formatApiError(error)
      alert(title, description)
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  const { alert, hide } = useAlert()

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await projectsService.delete(id)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() })
      hide()
      toast.success("Success Delete project")
    },
    onError: (error) => {
      const { title, description } = formatApiError(error)
      alert(title, description)
    },
  })
}
