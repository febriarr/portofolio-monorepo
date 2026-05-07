"use client"

import { TechStackDetails } from "@workspace/shared"
import {
  TypographyH2,
  TypographyH3,
  TypographyList,
  TypographyP,
} from "@workspace/ui/components/typography"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"
import Image from "next/image"
import { Tooltip, TooltipTrigger, TooltipContent } from "@workspace/ui/components/tooltip"

const CATEGORIES = ["frontend", "backend", "database", "tools", "language"] as const
type Category = (typeof CATEGORIES)[number]

const CATEGORY_LABELS: Record<Category, string> = {
  language: "Language",
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  tools: "Tools",
}

export default function AboutSection({ techStacks }: { techStacks: TechStackDetails[] }) {
  const grouped = CATEGORIES.reduce<Record<Category, TechStackDetails[]>>(
    (acc, cat) => {
      acc[cat] = techStacks.filter((t) => t.category?.name?.toLowerCase() === cat)
      return acc
    },
    { language: [], frontend: [], backend: [], database: [], tools: [] }
  )

  return (
    <section className="min-h-screen w-full space-y-8 py-16 md:space-y-12 lg:space-y-16" id="about">
      <TypographyH2>About</TypographyH2>
      <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16 xl:gap-24">
        <div className="about">
          <TypographyH3>
            <span className="text-primary">[01]</span> About Me
          </TypographyH3>
          <TypographyP>
            I currently work as an{" "}
            <span className="font-semibold text-orange-foreground">
              Operational Warehouse at PT Suri Tani Pemuka
            </span>
            . Outside of work, I'm focused on growing as a fullstack developer.
          </TypographyP>
        </div>

        <div className="background">
          <TypographyH3>
            <span className="text-primary">[02]</span> Background
          </TypographyH3>
          <TypographyP>My experience in operations shaped how I work:</TypographyP>
          <TypographyList>
            <li>Structured Workflows</li>
            <li>Process Efficiency</li>
            <li>Practical Problem Solving</li>
          </TypographyList>
        </div>

        <div className="interest">
          <TypographyH3>
            <span className="text-primary">[03]</span> Interest
          </TypographyH3>
          <TypographyP>
            I enjoy building things from both backend and frontend side. Some areas I often explore:
          </TypographyP>
          <TypographyList>
            <li>APIs & backend systems</li>
            <li>Integration Third Party</li>
            <li>Clean application structure</li>
          </TypographyList>
        </div>

        <div className="how-i-work">
          <TypographyH3>
            <span className="text-primary">[04]</span> How I Work
          </TypographyH3>
          <TypographyP>
            I prefer simple and clear solutions. I focus on building things that are{" "}
            <span className="font-semibold text-orange-foreground">
              reliable, easy to understand, and scalable
            </span>
            .
          </TypographyP>
        </div>

        <div className="current">
          <TypographyH3>
            <span className="text-primary">[05]</span> Current
          </TypographyH3>
          <TypographyP>Right now I:</TypographyP>
          <TypographyList>
            <li>Work in Operations Warehouse</li>
            <li>Build personal projects in web development</li>
          </TypographyList>
        </div>

        <div className="goal">
          <TypographyH3>
            <span className="text-primary">[06]</span> Goal
          </TypographyH3>
          <TypographyP>I aim to grow into a developer who:</TypographyP>
          <TypographyList>
            <li>Can build end-to-end systems</li>
            <li>Understands how things work under the hood</li>
          </TypographyList>
        </div>

        <div className="col-span-1 space-y-4 md:col-span-2 md:space-y-8">
          <TypographyH3 className="text-center">
            <span className="text-primary">[07]</span> Tech Stack
          </TypographyH3>

          <Tabs defaultValue="frontend" orientation="horizontal" className="mt-4 flex w-full gap-6">
            <div className="flex w-full overflow-x-auto overflow-y-hidden md:justify-center">
              <TabsList>
                {CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="w-full justify-start rounded-none border-border px-4 text-base data-[state=active]:border-orange-foreground! data-[state=active]:bg-transparent! data-[state=active]:text-orange-foreground! data-[state=active]:shadow-none"
                  >
                    {CATEGORY_LABELS[cat]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="w-full md:px-8 lg:px-16">
              {CATEGORIES.map((cat) => (
                <TabsContent key={cat} value={cat} className="mt-0 flex w-full justify-center">
                  {grouped[cat].length === 0 ? (
                    <TypographyP className="text-sm text-muted-foreground">
                      No tech stacks in this category.
                    </TypographyP>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      {grouped[cat].map((item) => (
                        <Tooltip key={item.id}>
                          <TooltipTrigger asChild>
                            <Image
                              src={`${process.env.NEXT_PUBLIC_LINK_R2}/${item.logo}`}
                              alt={item.name}
                              width={500}
                              height={500}
                              className="aspect-square h-16 w-16 object-contain lg:h-24 lg:w-24"
                            />
                          </TooltipTrigger>
                          <TooltipContent className="capitalize">{item.name}</TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
