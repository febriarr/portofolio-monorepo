import { ProjectsPage } from "@/app/dashboard/projects/_components/projects-page"

export default async function Page() {
  const category = await fetch("http://localhost:8000/api/project-categories")
  const techStacks = await fetch("http://localhost:8000/api/tech-stacks")

  const categoryOptions = await category.json()
  const techStackOptions = await techStacks.json()

  return (
    <ProjectsPage categoryOptions={categoryOptions.data} techStackOptions={techStackOptions.data} />
  )
}
