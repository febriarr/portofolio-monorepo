"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useProjects } from "@/hooks/use-projects"
import { ProjectWithMeta } from "@workspace/shared"
import { DialogCreateProject } from "@/components/dialog-create-project"
import { SheetEditProject } from "@/components/sheet-edit-project"
import { AlertDialogDeleteProject } from "@/components/alert-dialog-delete-project"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  MagnifyingGlassIcon,
  SquaresFourIcon,
  ListIcon,
  DotsThreeVerticalIcon,
  PencilSimpleIcon,
  TrashIcon,
  ArrowSquareOutIcon,
  ImageIcon,
  FolderOpenIcon,
} from "@phosphor-icons/react"
import {
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  Pagination,
} from "@workspace/ui/components/pagination"
import { TypographyLarge } from "@workspace/ui/components/typography"
import { truncate } from "@/lib/utils"

interface ProjectsPageProps {
  categoryOptions?: { id: number; name: string | null }[]
  techStackOptions?: { id: number; name: string }[]
}

type ViewMode = "table" | "grid"

export function ProjectsPage({ categoryOptions = [], techStackOptions = [] }: ProjectsPageProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [editProject, setEditProject] = useState<ProjectWithMeta | null>(null)
  const [deleteProject, setDeleteProject] = useState<{ id: number; title: string } | null>(null)

  const { data, isLoading } = useProjects({
    search: search || undefined,
    page,
    limit: 6,
  })

  const projects = data?.data ?? []
  const total = data?.meta?.total ?? 0
  const totalPages = Math.ceil(total / 6)

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleRowClick = (id: number) => {
    router.push(`/dashboard/projects/${id}`)
  }

 
  const handleEdit = (e: React.MouseEvent, project: ProjectWithMeta) => {
    e.stopPropagation()
    e.preventDefault()
    setEditProject(project)
  }

  const handleDelete = (e: React.MouseEvent, project: ProjectWithMeta) => {
    e.stopPropagation()
    e.preventDefault()
    setDeleteProject({ id: project.id, title: project.title })
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <TypographyLarge>Projects</TypographyLarge>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${total} project${total !== 1 ? "s" : ""}`}
            </p>
          </div>
          <DialogCreateProject
            categoryOptions={categoryOptions}
            techStackOptions={techStackOptions}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative max-w-sm flex-1">
            <MagnifyingGlassIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* View toggle */}
          <div className="flex rounded-xs border">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-r-none border-r ${viewMode === "table" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("table")}
            >
              <ListIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-l-none ${viewMode === "grid" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <SquaresFourIcon className="size-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <ProjectsSkeleton viewMode={viewMode} />
        ) : projects.length === 0 ? (
          <EmptyState search={search} />
        ) : viewMode === "table" ? (
          <TableView
            projects={projects}
            onRowClick={handleRowClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <GridView
            projects={projects}
            onCardClick={handleRowClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {!isLoading && totalPages > 1 && (
          <CustomPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>

    
      {editProject && (
        <SheetEditProject
          project={editProject}
          open={true}
          onOpenChange={(open) => !open && setEditProject(null)}
          categoryOptions={categoryOptions}
          techStackOptions={techStackOptions}
        />
      )}

      {deleteProject && (
        <AlertDialogDeleteProject
          project={deleteProject}
          open={true}
          onOpenChange={(open) => !open && setDeleteProject(null)}
        />
      )}
    </>
  )
}

function TableView({
  projects,
  onRowClick,
  onEdit,
  onDelete,
}: {
  projects: ProjectWithMeta[]
  onRowClick: (id: number) => void
  onEdit: (e: React.MouseEvent, project: ProjectWithMeta) => void
  onDelete: (e: React.MouseEvent, project: ProjectWithMeta) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-12 pl-4">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden lg:table-cell">Tech Stacks</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              className="cursor-pointer"
              onClick={() => onRowClick(project.id)}
            >
              {/* Thumbnail */}
              <TableCell className="pl-4">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                  {project.images[0]?.imageUrl ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_LINK_R2}/${project.images[0].imageUrl}`}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <ImageIcon className="size-4 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Title */}
              <TableCell>
                <div>
                  <p
                    className="line-clamp-1 truncate leading-tight font-medium"
                    title={project.title}
                  >
                    {project.title}
                  </p>
                  {project.shortDescription && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {truncate(project.shortDescription, 50)}
                    </p>
                  )}
                </div>
              </TableCell>

              {/* Category */}
              <TableCell className="hidden md:table-cell">
                {project.category ? (
                  <Badge variant="secondary" className="text-xs">
                    {project.category.name}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* Tech Stacks */}
              <TableCell className="hidden lg:table-cell">
                <div className="flex flex-wrap gap-1">
                  {project.techStacks.slice(0, 3).map(({ techStack }) => (
                    <Badge key={techStack.id} variant="orange" className="text-xs">
                      {techStack.name}
                    </Badge>
                  ))}
                  {project.techStacks.length > 3 && (
                    <Badge variant="orange" className="text-xs">
                      +{project.techStacks.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>

              {/* Created At */}
              <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                {new Date(project.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>

              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <DotsThreeVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onRowClick(project.id)}>
                      <ArrowSquareOutIcon className="size-4" />
                      View detail
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => onEdit(e, project)}>
                      <PencilSimpleIcon className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => onDelete(e, project)}
                      className="text-destructive focus:text-destructive"
                    >
                      <TrashIcon className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function GridView({
  projects,
  onCardClick,
  onEdit,
  onDelete,
}: {
  projects: ProjectWithMeta[]
  onCardClick: (id: number) => void
  onEdit: (e: React.MouseEvent, project: ProjectWithMeta) => void
  onDelete: (e: React.MouseEvent, project: ProjectWithMeta) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onCardClick(project.id)}
          className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xs border bg-card transition-shadow hover:shadow-md"
        >
          {/* Cover Image */}
          <div className="relative aspect-video w-full bg-muted">
            {project.images[0]?.imageUrl ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_LINK_R2}/${project.images[0].imageUrl}`}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground/40">
                <ImageIcon className="size-8" />
                <span className="text-xs">No image</span>
              </div>
            )}

            {/* Image count badge */}
            {project.images.length > 1 && (
              <div className="absolute right-2 bottom-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                +{project.images.length - 1} more
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col gap-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate leading-tight font-medium">{project.title}</p>
                {project.shortDescription && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {truncate(project.shortDescription, 50)}
                  </p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DotsThreeVerticalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onCardClick(project.id)}>
                    <ArrowSquareOutIcon className="size-4" />
                    View detail
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => onEdit(e, project)}>
                    <PencilSimpleIcon className="size-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => onDelete(e, project)}
                    className="text-destructive focus:text-destructive"
                  >
                    <TrashIcon className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Category & Tech Stacks */}
            <div className="mt-auto flex flex-wrap gap-1 pt-2">
              {project.category && (
                <Badge variant="secondary" className="text-xs">
                  {project.category.name}
                </Badge>
              )}
              {project.techStacks.slice(0, 3).map(({ techStack }) => (
                <Badge key={techStack.id} variant="orange" className="text-xs">
                  {techStack.name}
                </Badge>
              ))}
              {project.techStacks.length > 3 && (
                <Badge variant="orange" className="text-xs text-muted-foreground">
                  +{project.techStacks.length - 3}
                </Badge>
              )}
            </div>

            {/* Date */}
            <p className="text-xs text-muted-foreground">
              {new Date(project.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
      <FolderOpenIcon className="size-10 text-muted-foreground/40" />
      <div>
        <p className="text-sm font-medium">
          {search ? `No projects found for "${search}"` : "No projects yet"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {search ? "Try a different search term" : "Create your first project to get started"}
        </p>
      </div>
    </div>
  )
}

function CustomPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (page <= 3) return [1, 2, 3, 4, 5]
    if (page >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }
    return [page - 2, page - 1, page, page + 1, page + 2]
  }

  const pageNumbers = getPageNumbers()
  const showStartEllipsis = pageNumbers[0]! > 1
  const showEndEllipsis = pageNumbers[pageNumbers.length - 1]! < totalPages

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(page - 1)}
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {showStartEllipsis && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {pageNumbers.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink isActive={p === page} onClick={() => onPageChange(p)}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showEndEllipsis && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(totalPages)}>{totalPages}</PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(page + 1)}
            aria-disabled={page === totalPages}
            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function ProjectsSkeleton({ viewMode }: { viewMode: ViewMode }) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-xl border">
            <div className="aspect-video bg-muted" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="mt-1 flex gap-1">
                <div className="h-5 w-16 rounded-full bg-muted" />
                <div className="h-5 w-12 rounded-full bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="animate-pulse overflow-hidden rounded-xl border">
      <div className="h-10 bg-muted/40" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-t px-4 py-3">
          <div className="size-10 shrink-0 rounded-md bg-muted" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
          <div className="hidden h-5 w-20 rounded-full bg-muted md:block" />
          <div className="hidden gap-1 lg:flex">
            <div className="h-5 w-14 rounded-full bg-muted" />
            <div className="h-5 w-14 rounded-full bg-muted" />
          </div>
          <div className="hidden h-3 w-20 rounded bg-muted md:block" />
          <div className="size-8 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}