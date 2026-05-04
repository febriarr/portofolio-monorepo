"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useProject } from "@/hooks/use-projects"
import { SheetEditProject } from "@/components/sheet-edit-project"
import { AlertDialogDeleteProject } from "@/components/alert-dialog-delete-project"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import {
  ArrowLeftIcon,
  PencilSimpleIcon,
  TrashIcon,
  LinkIcon,
  GithubLogoIcon,
  CalendarBlankIcon,
  ImageIcon,
  TagIcon,
  StackIcon,
} from "@phosphor-icons/react"
import { formatDate } from "@/lib/utils"

interface DetailProjectPageProps {
  projectId: number
  categoryOptions?: { id: number; name: string | null }[]
  techStackOptions?: { id: number; name: string }[]
}

export function DetailProjectPage({
  projectId,
  categoryOptions = [],
  techStackOptions = [],
}: DetailProjectPageProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  const { data, isLoading, isError } = useProject(projectId)
  const project = data?.data

  // ─── Loading ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  // ─── Error ────────────────────────────────────────────────────────────────

  if (isError || !project) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Project not found.</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeftIcon />
          Go back
        </Button>
      </div>
    )
  }

  const hasImages = (project.images?.length ?? 0) > 0
  const currentImage = hasImages ? (project.images[activeImage] ?? project.images[0]) : null

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.back()}>
              <ArrowLeftIcon className="size-4" />
            </Button>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl leading-tight font-semibold">{project.title}</h1>
                {project.category && (
                  <Badge variant="secondary" className="text-xs">
                    <TagIcon className="mr-1 size-3" />
                    {project.category.name}
                  </Badge>
                )}
              </div>
              {project.shortDescription && (
                <p className="mt-1 text-sm text-muted-foreground">{project.shortDescription}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <PencilSimpleIcon />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
              <TrashIcon />
              Delete
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Left Column: Images ─────────────────────────────────── */}
          <div className="flex flex-col gap-3 lg:col-span-2">
            {/* Main Image */}
            {hasImages ? (
              <>
                <div className="relative aspect-video w-full overflow-hidden rounded-xs border bg-muted">
                  <Image
                    src={
                      (currentImage &&
                        `${process.env.NEXT_PUBLIC_LINK_R2}/${currentImage.imageUrl!}`) ||
                      "/"
                    }
                    alt={`${project.title} - image ${activeImage + 1}`}
                    fill
                    className="object-cover transition-all duration-300"
                    priority
                  />
                  <div className="absolute right-3 bottom-3 rounded-xs bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                    {activeImage + 1} / {project.images.length}
                  </div>
                </div>

                {/* Thumbnails */}
                {project.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {project.images.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => setActiveImage(i)}
                        className={`relative size-16 shrink-0 overflow-hidden rounded-xs border-2 transition-all ${
                          activeImage === i
                            ? "border-primary opacity-100"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_LINK_R2}/${img.imageUrl!}`}
                          alt={`Thumbnail ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xs border border-dashed bg-muted/30 text-muted-foreground">
                <ImageIcon className="size-10 opacity-30" />
                <p className="text-sm">No images uploaded</p>
                <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                  Add images
                </Button>
              </div>
            )}

            {/* Description */}
            {project.description && (
              <div className="rounded-xs border p-4">
                <h2 className="mb-2 text-sm font-medium">Description</h2>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {project.description}
                </p>
              </div>
            )}
          </div>

          {/* ── Right Column: Meta ──────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Links */}
            {(project.liveUrl || project.linkRepo) && (
              <div className="flex flex-col gap-3 rounded-xs border p-4">
                <h2 className="text-sm font-medium">Links</h2>
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 truncate text-sm text-primary underline-offset-4 hover:underline"
                  >
                    <LinkIcon className="size-4 shrink-0" />
                    {project.liveUrl}
                  </Link>
                )}
                {project.linkRepo && (
                  <Link
                    href={project.linkRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 truncate text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    <GithubLogoIcon className="size-4 shrink-0" />
                    {project.linkRepo}
                  </Link>
                )}
              </div>
            )}

            {/* Tech Stacks */}
            {project.techStacks?.length > 0 && (
              <div className="flex flex-col gap-3 rounded-xs border p-4">
                <h2 className="flex items-center gap-2 text-sm font-medium">
                  <StackIcon className="size-4" />
                  Tech Stacks
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStacks.map(({ techStack }) => (
                    <Badge key={techStack.id} variant="outline" className="text-xs">
                      {techStack.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="flex flex-col gap-3 rounded-xs border p-4">
              <h2 className="flex items-center gap-2 text-sm font-medium">
                <CalendarBlankIcon className="size-4" />
                Timeline
              </h2>
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Created</span>
                  <span className="font-mono">{formatDate(project.createdAt)}</span>
                </div>
                {project.updatedAt && (
                  <div className="flex justify-between">
                    <span>Last updated</span>
                    <span className="font-mono">{formatDate(project.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-3 rounded-xs border p-4">
              <h2 className="text-sm font-medium">Summary</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xs bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-semibold">{project.images?.length}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Images</p>
                </div>
                <div className="rounded-xs bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-semibold">{project.techStacks?.length}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Tech Stacks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Dialogs ───────────────────────────────────────────────────── */}
      <SheetEditProject
        project={project}
        open={editOpen}
        onOpenChange={setEditOpen}
        categoryOptions={categoryOptions}
        techStackOptions={techStackOptions}
      />

      <AlertDialogDeleteProject
        project={project}
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open)
          if (!open) router.push("/dashboard/projects")
        }}
      />
    </>
  )
}
