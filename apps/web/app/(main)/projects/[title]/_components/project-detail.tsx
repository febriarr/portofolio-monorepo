import Link from "next/link"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import {
  LinkIcon,
  GithubLogoIcon,
  CalendarBlankIcon,
  ImageIcon,
  TagIcon,
  StackIcon,
} from "@phosphor-icons/react/dist/ssr"
import { ProjectWithMeta } from "@workspace/shared"
import { formatDate } from "@/lib/utils"
import { ProjectImageGallery } from "@/app/(main)/projects/[title]/_components/project-image-gallery"

export function ProjectDetail({ project }: { project: ProjectWithMeta }) {
  const hasImages = (project.images?.length ?? 0) > 0

  return (
    <div className="container mx-auto flex flex-col gap-6 py-16">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl leading-tight font-semibold">{project.title}</h1>
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

      <Separator />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left - Images & Description */}
        <div className="flex flex-col gap-3 lg:col-span-2">
          {hasImages ? (
            <ProjectImageGallery images={project.images} title={project.title} />
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xs border border-dashed bg-muted/30 text-muted-foreground">
              <ImageIcon className="size-10 opacity-30" />
              <p className="text-sm">No images</p>
            </div>
          )}

          {project.description && (
            <div className="rounded-xs border p-4">
              <h2 className="mb-2 text-sm font-medium">Description</h2>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {project.description}
              </p>
            </div>
          )}
        </div>

        {/* Right - Meta */}
        <div className="flex flex-col gap-4">
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

          {project.techStacks?.length > 0 && (
            <div className="flex flex-col gap-3 rounded-xs border p-4">
              <h2 className="flex items-center gap-2 text-sm font-medium">
                <StackIcon className="size-4" />
                Tech Stacks
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {project.techStacks.map(({ techStack }) => (
                  <Badge key={techStack.id} variant="secondary" className="text-xs">
                    {techStack.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

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
        </div>
      </div>
    </div>
  )
}
