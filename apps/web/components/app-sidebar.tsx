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
  SignOutIcon,
  StackIcon,
  TagIcon,
  TreeStructureIcon,
} from "@phosphor-icons/react"
import { Separator } from "@workspace/ui/components/separator"
import { Button } from "@workspace/ui/components/button"
import { usePathname } from "next/navigation"
import { useLogout } from "@/hooks/use-auth"

const navMain = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: HouseIcon,
  },
  {
    title: "Projects",
    link: "/dashboard/projects",
    icon: FoldersIcon,
  },
  {
    title: "Project Categories",
    link: "/dashboard/project-categories",
    icon: TagIcon,
  },
  {
    title: "Tech Stacks",
    link: "/dashboard/tech-stacks",
    icon: StackIcon,
  },
  {
    title: "Tech Categories",
    link: "/dashboard/tech-categories",
    icon: TreeStructureIcon,
  },
]

export default function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
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
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={`${pathname === item.link ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                >
                  <Link href={item.link}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
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
  const { mutate } = useLogout()
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">Febri Ardiansyah</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/febriarr/portofolio-monorepo"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
          <Button variant={"outline"} onClick={() => mutate()}>
            <SignOutIcon /> Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
