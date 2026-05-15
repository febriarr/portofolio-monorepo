'use client'

import { TooltipProvider } from '@workspace/ui/components/tooltip'
import Navbar from '@workspace/ui/components/navbar'
import { Footer } from '@workspace/ui/components/footer'
import React from 'react'
import { ThemeProvider } from '@/components/theme-provider'

export default function Provider({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <ThemeProvider>
        <TooltipProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </TooltipProvider>
      </ThemeProvider>
    </>
  )
}
