"use client"

import { BrainIcon, GithubLogoIcon } from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"

const links = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About",
    href: "#about",
  },
  {
    title: "Projects",
    href: "#projects",
  },
  {
    title: "Contact",
    href: "#contact",
  },
]

export default function Navbar() {
  return (
    <header className={"sticky top-0 z-99999 w-full border-b bg-background"}>
      <div className={"container mx-auto flex items-center justify-between px-4 py-2"}>
        <div className={"flex items-center space-x-2"}>
          <BrainIcon weight={"thin"} size={30} />
          <p className={"text-lg font-medium"}>Febri</p>
        </div>
        <div className={"flex items-center space-x-10"}>
          <ol className={"hidden space-x-10 md:flex"}>
            {links.map((link) => (
              <li key={link.href} className={"transition-all duration-200 hover:text-primary"}>
                <Link href={link.href}>{link.title}</Link>
              </li>
            ))}
          </ol>
          <Button asChild size="icon">
            <Link href={"https://github.com/febriarr"} target="_blank" rel="noopener noreferrer">
              <GithubLogoIcon size={30} />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
