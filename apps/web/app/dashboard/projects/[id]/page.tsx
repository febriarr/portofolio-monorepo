import { DetailProjectPage } from "@/app/dashboard/projects/[id]/_components/projects-detail"

export const dynamic = "force-dynamic"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [categoryRes, techStacksRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/project-categories`),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tech-stacks`),
  ])

  const categoryOptions = await categoryRes.json()
  const techStackOptions = await techStacksRes.json()

  return (
    <DetailProjectPage
      projectId={Number(id)}
      categoryOptions={categoryOptions.data ?? []}
      techStackOptions={techStackOptions.data ?? []}
    />
  )
}
