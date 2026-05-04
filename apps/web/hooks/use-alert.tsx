"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { WarningIcon, XIcon } from "@phosphor-icons/react"
import { usePathname } from "next/navigation"

type AlertState = {
  title: string
  description: string
}

type AlertContextType = {
  alert: (title: string, description: string) => void
  hide: () => void
}

const AlertContext = createContext<AlertContextType | null>(null)

export const useAlert = () => {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error("useAlert must be used inside AlertProvider")
  return ctx
}

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AlertState | null>(null)
  const pathname = usePathname()

  const alert = (title: string, description: string) => {
    setState({ title, description })
  }

  const hide = () => {
    setState(null)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(null)
  }, [pathname])

  return (
    <AlertContext.Provider value={{ alert, hide }}>
      {children}

      {state && (
        <div className="fixed top-4 right-4 z-99999 w-96">
          <Alert variant="destructive" className="relative max-w-md">
            <WarningIcon />
            <AlertTitle>{state.title}</AlertTitle>
            <AlertDescription className="whitespace-pre-line">{state.description}</AlertDescription>
            <Button
              variant="outline"
              size="icon-xs"
              className="absolute top-2 right-2 border-none"
              onClick={hide}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </Alert>
        </div>
      )}
    </AlertContext.Provider>
  )
}

export function formatApiError(error: any) {
  const err = error?.error ?? error

  const title = err?.code || "ERROR"

  const messages: string[] = []

  if (err?.message) messages.push(err?.message)

  if (err?.field) messages.push(`Field: ${err.field.join(", ")}`)

  if (err?.details) {
    messages.push(typeof err.details === "string" ? err.details : JSON.stringify(err.details))
  }

  return {
    title,
    description: messages.join("\n"),
  }
}
