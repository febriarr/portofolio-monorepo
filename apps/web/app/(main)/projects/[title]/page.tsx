import { notFound } from "next/navigation"
import { getProjectById } from "@/services/ssr"
import { ProjectDetail } from "@/app/(main)/projects/[title]/_components/project-detail"

interface Props {
  searchParams: Promise<{ id?: string }>
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
