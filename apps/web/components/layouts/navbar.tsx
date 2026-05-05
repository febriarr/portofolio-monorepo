"use client"

import { BrainIcon } from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"

const links = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Projects",
    href: "/projects",
  },
  {
    title: "Certifications",
    href: "/certifications",
  },
]

export default function Navbar() {
  return (
    <header className={"sticky-0 w-full border-b"}>
      <div className={"container mx-auto flex items-center justify-between px-4 py-2"}>
        <div className={"flex items-center space-x-2"}>
          <BrainIcon weight={"thin"} size={32} />
          <p className={"text-lg font-medium"}>Febri</p>
        </div>
        <div className={"hidden items-center space-x-10 md:flex"}>
          <ol className={"flex space-x-10"}>
            {links.map((link) => (
              <li key={link.href} className={"transition-all duration-200 hover:text-primary"}>
                <Link href={link.href}>{link.title}</Link>
              </li>
            ))}
          </ol>
          <Button size="lg">Contact</Button>
        </div>
      </div>
    </header>
  )
}
