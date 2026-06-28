import { Geist, JetBrains_Mono } from "next/font/google"

import "@workspace/ui/globals.css"

import { cn } from "@workspace/ui/lib/utils"
import ProviderPublic from "@/components/provider-public"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Metadata } from "next"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.febriardiansyah.my.id"),
  title: {
    default: "Febri Ardiansyah - Fullstack Developer",
    template: "%s | Febri Ardiansyah",
  },
  description:
    "Personal portfolio of Febri Ardiansyah, a fullstack developer focused on building modern, scalable, and high-performance web applications.",
  keywords: [
    "Febri Ardiansyah",
    "fullstack developer",
    "web developer",
    "backend developer",
    "frontend developer",
    "Next.js",
    "React",
    "Node.js",
    "TypeScript",
    "JavaScript",
  ],
  openGraph: {
    title: "Febri Ardiansyah - Fullstack Developer",
    description: "Fullstack Developer specializing in Next.js, Node.js.",
    url: "https://febriardiansyah.my.id",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Febri Ardiansyah Portfolio",
      },
    ],
  },

  authors: [{ name: "Febri Ardiansyah", url: "https://github.com/febriarr" }],
  creator: "Febri Ardiansyah",

  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },

  verification: {
    google: "svxHf-QT4HuW6mHAl4Tjtxo2i7h2eMbv5SRNZQLk4R0",
  },
  robots: "index, follow",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, "font-mono", jetbrainsMono.variable)}
    >
      <body>
        <ProviderPublic>
          {children}
          <ScrollToTop />
        </ProviderPublic>
      </body>
    </html>
  )
}
