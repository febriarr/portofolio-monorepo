"use client"
import { TypographyP } from "@workspace/ui/components/typography"
import Link from "next/link"
import { FoldersIcon, StackIcon, TagIcon, TreeStructureIcon } from "@phosphor-icons/react"

export default function PlanningAction() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
      <div className="flex w-full flex-col space-y-2">
        <TypographyP>Ada Project Baru?</TypographyP>
        <Link href="/dashboard/projects">
          <div className="w-full rounded-xs border p-6 hover:bg-primary hover:text-primary-foreground">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FoldersIcon size={20} />
                <p className="font-medium">Projects</p>
              </div>
              <TypographyP>Langsung Tambah Projects disini King!</TypographyP>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex w-full flex-col space-y-2">
        <TypographyP>Ada Project Category Baru?</TypographyP>
        <Link href="/dashboard/project-categories">
          <div className="w-full rounded-xs border p-6 hover:bg-primary hover:text-primary-foreground">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TagIcon size={20} />
                <p className="font-medium">Projects Categories</p>
              </div>
              <TypographyP>Tambah Project Categories disini King!</TypographyP>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex w-full flex-col space-y-2">
        <TypographyP>Ada Skill Baru?</TypographyP>
        <Link href="/dashboard/tech-stacks">
          <div className="w-full rounded-xs border p-6 hover:bg-primary hover:text-primary-foreground">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <StackIcon size={20} />
                <p className="font-medium">Tech Stacks</p>
              </div>
              <TypographyP>Tambah Tech Stacks disini King!</TypographyP>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex w-full flex-col space-y-2">
        <TypographyP>Ada Role Baru?</TypographyP>
        <Link href="/dashboard/tech-categories">
          <div className="w-full rounded-xs border p-6 hover:bg-primary hover:text-primary-foreground">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TreeStructureIcon size={20} />
                <p className="font-medium">Tech Stack Categories</p>
              </div>
              <TypographyP>Tambah Tech Stack Categories disini King!</TypographyP>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
