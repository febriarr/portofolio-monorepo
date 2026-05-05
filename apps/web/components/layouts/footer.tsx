import Link from "next/link"
import { CONTACTS } from "@/components/layouts/contact-section"
import { ThemeToggle } from "@/components/theme-toggle"

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
]

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="container mx-auto flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        {/* Left - Brand */}
        <div>
          <p className="font-mono font-semibold tracking-tight">
            <span className="text-primary">febri</span>.dev
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            From Operations to Fullstack Developer
          </p>
        </div>

        {/* Center - Nav */}
        <nav className="flex gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right - Social */}
        <div className="flex items-center gap-3">
          {CONTACTS.map(({ href, icon: Icon, label }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex size-8 items-center justify-center border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Icon className="size-4" />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t">
        <div className="container mx-auto flex flex-col gap-1 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Febri Ardiansyah. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <p className="font-mono text-xs text-muted-foreground">
              Built with Next.js & shadcn/ui
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
