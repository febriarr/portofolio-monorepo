"use client"

import Image from "next/image"
import { useState } from "react"
import { ApiResponse, ProjectWithMeta } from "@workspace/shared"
import { useProjects } from "@/hooks/use-projects"
import { Badge } from "@workspace/ui/components/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import { ArrowSquareInIcon, ImageIcon } from "@phosphor-icons/react"
import { ProjectsMeta } from "@/services/projects-service"
import { TypographyH2, TypographyLead } from "@workspace/ui/components/typography"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

type InitialData = ApiResponse<ProjectWithMeta[]> & { meta: ProjectsMeta }

export function ProjectsSection({ initialData }: { initialData: InitialData }) {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useProjects(
    { page, limit: 6 },
    { initialData: page === 1 ? initialData : undefined }
  )

  const projects = data?.data ?? []
  const meta = data?.meta
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1

  return (
    <section className="w-full space-y-8 py-16 md:space-y-12 lg:space-y-16" id="projects">
      <div className="space-y-2">
        <TypographyH2>Projects</TypographyH2>
        <TypographyLead>
          Things I've built while learning and growing as a developer.
        </TypographyLead>
      </div>

      {isLoading ? (
        <ProjectsGridSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <CustomPagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
      )}
    </section>
  )
}

function ProjectCard({ project }: { project: ProjectWithMeta }) {
  return (
    <Link href={`/projects/${encodeURIComponent(project.title)}?id=${project.id}`}>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-xs border bg-card transition-shadow hover:shadow-md">
        {/* Cover Image */}
        <div className="relative aspect-video w-full bg-muted">
          <div className="absolute z-50 flex h-full w-full items-center justify-center gap-1 bg-black/20 text-sm text-orange-foreground opacity-0 transition-opacity group-hover:opacity-100">
            <ArrowSquareInIcon className="size-4" /> Lihat Project
          </div>
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

          {project.images.length > 1 && (
            <div className="absolute right-2 bottom-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
              +{project.images.length - 1} more
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="truncate leading-tight font-medium">{project.title}</p>
          <div className="h-8">
            {project.shortDescription && (
              <p className="line-clamp-2 text-xs">{project.shortDescription}</p>
            )}
          </div>

          <div className="mt-auto flex flex-wrap gap-1 pt-2">
            <div className="flex min-h-10 flex-wrap content-start gap-1 overflow-hidden">
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
                <Badge variant="orange" className="text-xs">
                  +{project.techStacks.length - 3}
                </Badge>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{formatDate(project.createdAt)}</p>
        </div>
      </div>
    </Link>
  )
}

function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-xs border bg-card">
          <div className="aspect-video w-full animate-pulse bg-muted" />
          <div className="flex flex-col gap-2 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
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
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 3) return [1, 2, 3, 4, 5]
    if (page >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
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
