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
  authors: [
    {
      name: "Febri Ardiansyah",
      url: "https://github.com/febriarr",
    },
  ],
  creator: "Febri Ardiansyah",
  keywords: ["Febri Ardiansyah", "Portfolio", "Fullstack Developer", "Next.js", "NestJS"],
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
