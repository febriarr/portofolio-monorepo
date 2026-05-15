import React from 'react'
import '@workspace/ui/globals.css'
import Provider from '@/components/provider'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
