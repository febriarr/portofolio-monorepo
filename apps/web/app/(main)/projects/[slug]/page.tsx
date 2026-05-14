import { notFound } from "next/navigation"
import { getProjectBySlug } from "@/services/ssr"
import { ProjectDetail } from "@/app/(main)/projects/[slug]/_components/project-detail"
import { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const project = await getProjectBySlug(slug)

  if (!project)
    return {
      title: "Project Detail",
    }

  const ogImage = project.images?.[0]
    ? `${process.env.NEXT_PUBLIC_LINK_R2}/${project.images[0].imageUrl}`
    : undefined

  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      type: "article",
      title: project.title,
      description: project.shortDescription ?? undefined,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.shortDescription ?? undefined,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) return notFound()

  return <ProjectDetail project={project ?? []} />
}
