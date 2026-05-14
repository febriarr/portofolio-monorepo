import { Metadata } from "next"
import AboutSection from "@/components/layouts/about-section"
import { getTechStacksSSR } from "@/services/ssr"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Febri Ardiansyah, a backend and web developer passionate about building modern, scalable, and high-performance web applications.",
}

export default async function AboutPage() {
  const techStacks = await getTechStacksSSR()

  if (!techStacks) return notFound()

  return (
    <div className="flex min-h-dvh w-full items-center justify-center">
      <div className="container">
        <h1 className="sr-only">Contact</h1>
        <AboutSection techStacks={techStacks ?? []} />
      </div>
    </div>
  )
}
