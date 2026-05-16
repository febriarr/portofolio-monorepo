import React from 'react'
import '@workspace/ui/globals.css'
import Provider from '@/components/provider'
import { Sora, JetBrains_Mono } from 'next/font/google'
import { cn } from '@workspace/ui/lib/utils'
import { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: {
    default: 'Blog',
    template: '%s | Febri Ardiansyah',
  },
  openGraph: {
    title: 'Febri Ardiansyah - Fullstack Developer',
    description: 'Fullstack Developer specializing in Next.js, Node.js.',
    url: 'https://febriardiansyah.my.id',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Febri Ardiansyah Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Febri Ardiansyah - Fullstack Developer',
    description: 'Fullstack Developer specializing in Next.js, Node.js.',
    images: ['/og-image.png'],
  },

  authors: [{ name: 'Febri Ardiansyah', url: 'https://github.com/febriarr' }],
  creator: 'Febri Ardiansyah',

  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL('https://blog.febriardiansyah.my.id'),
}

export const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('antialiased', sora.className, jetbrainsMono.variable)}
    >
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
