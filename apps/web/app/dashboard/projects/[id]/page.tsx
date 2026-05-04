import { DetailProjectPage } from "@/app/dashboard/projects/[id]/_components/projects-detail"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [categoryRes, techStacksRes] = await Promise.all([
    fetch("http://localhost:8000/api/project-categories"),
    fetch("http://localhost:8000/api/tech-stacks"),
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
