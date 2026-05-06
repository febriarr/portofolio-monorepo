import { notFound } from "next/navigation"
import { getProjectById } from "@/services/ssr"
import { ProjectDetail } from "@/app/(main)/projects/[title]/_components/project-detail"
import { Metadata } from "next"

interface Props {
  searchParams: Promise<{ id?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { id } = await searchParams
  const numId = Number(id)

  if (!numId || isNaN(numId)) notFound()

  const res = await getProjectById(numId)
  const project = res.data

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

export default async function ProjectDetailPage({ searchParams }: Props) {
  const { id } = await searchParams
  const numId = Number(id)

  if (!numId || isNaN(numId)) notFound()

  const res = await getProjectById(numId)
  const project = res.data

  if (!project) notFound()

  return <ProjectDetail project={project} />
}
