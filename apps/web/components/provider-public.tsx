"use client"

import { ReactNode } from "react"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { Toaster } from "@workspace/ui/components/sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AlertProvider } from "@/hooks/use-alert"
import { ThemeProvider } from "@/components/theme-provider"

export default function ProviderPublic({ children }: { children: ReactNode }) {
  const client = new QueryClient()
  return (
    <>
      <QueryClientProvider client={client}>
        <ThemeProvider>
          <AlertProvider>
            <TooltipProvider>
              {children}
              <Toaster richColors={true} position={"top-right"} />
            </TooltipProvider>
          </AlertProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  )
}
