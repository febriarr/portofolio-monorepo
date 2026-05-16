"use client"

import { BrainIcon, GithubLogoIcon, ListIcon, XIcon } from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const links = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Projects", href: "/projects" },
  { title: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [open, setOpen] = useState<boolean>(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-[9999] w-full border-b bg-background">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BrainIcon weight="thin" size={30} />
            <p className="text-lg font-medium">Febri</p>
          </Link>

          <div className="flex items-center space-x-10">
            <ol className="hidden space-x-10 md:flex">
              {links.map((link) => (
                <li
                  key={link.href}
                  className={`transition-all duration-200 hover:text-primary ${
                    pathname === link.href ? "font-medium text-primary" : ""
                  }`}
                >
                  <Link href={link.href}>{link.title}</Link>
                </li>
              ))}
            </ol>

            <div className="flex items-center space-x-2">
              <Button asChild size="icon">
                <Link href="https://github.com/febriarr" target="_blank" rel="noopener noreferrer">
                  <GithubLogoIcon size={30} />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="icon"
                aria-label="toggle navigation"
                className="md:hidden"
                onClick={() => setOpen((prev) => !prev)}
              >
                {open ? <XIcon size={20} /> : <ListIcon size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 z-[9999] flex h-full w-64 flex-col border-r bg-background shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-4 py-2">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
            <BrainIcon weight="thin" size={24} />
            <p className="text-base font-medium">Febri</p>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="close navigation"
            onClick={() => setOpen(false)}
          >
            <XIcon size={18} />
          </Button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-primary ${
                pathname === link.href ? "bg-accent text-primary" : "text-muted-foreground"
              }`}
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t p-4">
          <Button asChild size="sm" className="w-full">
            <Link href="https://github.com/febriarr" target="_blank" rel="noopener noreferrer">
              <GithubLogoIcon size={16} />
              GitHub
            </Link>
          </Button>
        </div>
      </aside>
    </>
  )
}
