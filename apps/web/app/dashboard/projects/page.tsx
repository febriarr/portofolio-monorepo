import { ProjectsPage } from "@/app/dashboard/projects/_components/projects-page"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Projects",
}

export default async function Page() {
  try {
    const [category, techStacks] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/project-categories`, { 
        cache: 'no-store' 
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/tech-stacks`, { 
        cache: 'no-store' 
      }),
    ])
    
    if (!category.ok || !techStacks.ok) throw new Error('Fetch failed')
    
    const [categoryData, techStackData] = await Promise.all([
      category.json(),
      techStacks.json(),
    ])
    
    return (
      <ProjectsPage 
        categoryOptions={categoryData.data ?? []} 
        techStackOptions={techStackData.data ?? []} 
      />
    )
  } catch {
    return <ProjectsPage categoryOptions={[]} techStackOptions={[]} />
  }
}
