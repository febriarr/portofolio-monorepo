import { Metadata } from "next"
import { TypographyH1, TypographyP } from "@workspace/ui/components/typography"
import CodeHero from "@/components/code-hero"
import { Button } from "@workspace/ui/components/button"
import { getTechStacksSSR } from "@/services/ssr"

import AboutSection from "@/components/layouts/about-section"

export const metadata: Metadata = {
  title: "Home Page Portofolio Febri Ardiansyah",
  description: "Welcome to my Personal Portofolio, Febri Ardiansyah",
}

export default async function Page() {
  const techStacks = await getTechStacksSSR()
  return (
    <main className="flex min-h-dvh w-full items-center justify-center">
      {/* Container */}
      <div className="container flex flex-col gap-12">
        {/* Hero */}
        <section className="flex min-h-[80vh] flex-col items-center justify-center md:flex-row md:items-center md:justify-between md:gap-12">
          {/* Left */}
          <div className="md:flex-1">
            <TypographyH1 className="leading-tight tracking-tight">
              Hi, I&apos;m <span className="text-primary">Febri Ardiansyah</span>
            </TypographyH1>

            <TypographyP className="mt-4 text-muted-foreground">
              <span className="block text-sm">From Operations to Fullstack Developer</span>
              <span className="mt-2 block max-w-md">
                I build digital solutions with a structured and practical approach
              </span>
            </TypographyP>

            <div className="mt-6 flex gap-4">
              <Button variant="outline" size="lg">
                Download CV
              </Button>
              <Button size="lg">Contact</Button>
            </div>
          </div>

          {/* Right */}
          <div className="hidden justify-center p-4 md:flex md:justify-end">
            <CodeHero />
          </div>
        </section>

        {/*  about */}
        <AboutSection techStacks={techStacks} />
      </div>
    </main>
  )
}
