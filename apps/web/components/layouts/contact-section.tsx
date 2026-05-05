import Link from "next/link"
import {
  GithubLogoIcon,
  EnvelopeIcon,
  WhatsappLogoIcon,
  LinkedinLogoIcon,
  InstagramLogoIcon,
  TiktokLogoIcon,
} from "@phosphor-icons/react/dist/ssr"
import { TypographyH2, TypographyP } from "@workspace/ui/components/typography"

export const CONTACTS = [
  {
    label: "GitHub",
    href: "https://github.com/febriarr",
    icon: GithubLogoIcon,
    value: "@febriarr",
  },
  {
    label: "Email",
    href: "mailto:hello.febriar@gmail.com",
    icon: EnvelopeIcon,
    value: "hello.febriarr@gmail.com",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/6285857912408",
    icon: WhatsappLogoIcon,
    value: "+62 8585 7912 408",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/febri-ardiansyah-a6ba1a305",
    icon: LinkedinLogoIcon,
    value: "Febri Ardiansyah",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/febriiar_",
    icon: InstagramLogoIcon,
    value: "@febriiar_",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@febriarrr",
    icon: TiktokLogoIcon,
    value: "@febriarrr",
  },
]

export function ContactSection() {
  return (
    <section className="w-full space-y-8 py-16 md:space-y-12" id="contact">
      <div>
        <TypographyH2>Contact</TypographyH2>
        <TypographyP>
          Feel free to reach out — I'm always open to new opportunities and collaborations.
        </TypographyP>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CONTACTS.map(({ label, href, icon: Icon, value }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 border p-4 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <div className="flex size-10 shrink-0 items-center justify-center border bg-muted transition-colors group-hover:border-primary group-hover:bg-primary/10">
              <Icon className="size-5 transition-colors group-hover:text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="truncate text-sm font-medium">{value}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
