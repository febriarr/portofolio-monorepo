'use client'

import { TooltipProvider } from '@workspace/ui/components/tooltip'
<<<<<<< HEAD
import { Footer } from '@/components/footer'
import React, { Suspense } from 'react'
=======

import React from 'react'
>>>>>>> 7e07ec1 (fix(blog): fix Error Blocking Route)
import { ThemeProvider } from '@/components/theme-provider'
import Link from 'next/link'
import { BrainIcon, GithubLogoIcon } from '@phosphor-icons/react'
import { Button } from '@workspace/ui/components/button'
import { Footer } from './footer'

export default function Provider({ children, year }: { children?: React.ReactNode; year: number }) {
  return (
    <>
      <ThemeProvider>
        <Suspense>

          <TooltipProvider>
            <div className="w-full flex justify-center sticky top-0 z-9999 px-4 py-2 border-b bg-background">
              <div className="container flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <BrainIcon weight="thin" size={30} />
                  <p className="text-lg font-medium">Febri</p>
                </Link>
                <div>
                  <Button asChild size="sm" className="w-full">
                    <Link
                      href="https://github.com/febriarr"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubLogoIcon size={16} />
                      GitHub
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
<<<<<<< HEAD
            <main>{children}</main>
            <Footer />
          </TooltipProvider>
        </Suspense>
=======
          </div>
          <main>{children}</main>
          <Footer year={year} />
        </TooltipProvider>
>>>>>>> 7e07ec1 (fix(blog): fix Error Blocking Route)
      </ThemeProvider>
    </>
  )
}
