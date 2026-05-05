import { ProjectsPage } from "@/app/dashboard/projects/_components/projects-page"

export const dynamic = "force-dynamic"

export default async function Page() {
  const category = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project-categories`)
  const techStacks = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tech-stacks`)

  const categoryOptions = await category.json()
  const techStackOptions = await techStacks.json()

  return (
    <ProjectsPage categoryOptions={categoryOptions.data} techStackOptions={techStackOptions.data} />
  )
}
