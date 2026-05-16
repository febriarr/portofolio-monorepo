import {
  EnvelopeIcon,
  GithubLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  TiktokLogoIcon,
  WhatsappLogoIcon,
} from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export const CONTACTS = [
  {
    label: 'GitHub',
    href: 'https://github.com/febriarr',
    icon: GithubLogoIcon,
    value: '@febriarr',
  },
  {
    label: 'Email',
    href: 'mailto:hello.febriar@gmail.com',
    icon: EnvelopeIcon,
    value: 'hello.febriarr@gmail.com',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/6285857912408',
    icon: WhatsappLogoIcon,
    value: '+62 8585 7912 408',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/febri-ardiansyah-a6ba1a305',
    icon: LinkedinLogoIcon,
    value: 'Febri Ardiansyah',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/febriiar_',
    icon: InstagramLogoIcon,
    value: '@febriiar_',
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@febriarrr',
    icon: TiktokLogoIcon,
    value: '@febriarrr',
  },
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
