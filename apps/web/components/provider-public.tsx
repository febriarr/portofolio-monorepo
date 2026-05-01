import { ReactNode } from "react"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { Toaster } from "@workspace/ui/components/sonner"

export default function ProviderPublic({ children }: { children: ReactNode }) {
  return (
    <>
      <TooltipProvider>
        {children}
        <Toaster richColors={true} />
      </TooltipProvider>
    </>
  )
}
