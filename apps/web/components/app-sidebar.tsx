"use client"

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import Link from "next/link"
import {
  BrainIcon,
  FoldersIcon,
  HouseIcon,
  StackIcon,
  TagIcon,
  TreeStructureIcon,
} from "@phosphor-icons/react"
import { Separator } from "@workspace/ui/components/separator"
import { Button } from "@workspace/ui/components/button"

const navMain = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: HouseIcon,
  },
  {
    title: "Projects",
    link: "/projects",
    icon: FoldersIcon,
  },
  {
    title: "Project Categories",
    link: "/project-categories",
    icon: TagIcon,
  },
  {
    title: "Tech Stacks",
    link: "/tech-stacks",
    icon: StackIcon,
  },
  {
    title: "Tech Categories",
    link: "/tech-categories",
    icon: TreeStructureIcon,
  },
]

export default function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar collapsible={"offcanvas"} variant={"inset"}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={"#"}>
                  <BrainIcon className={"size-5!"} />
                  <span className="text-base font-semibold">FA</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link href={item.link}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>ßß
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </>
  )
}

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/febriarr/monorepo-portofolio"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
