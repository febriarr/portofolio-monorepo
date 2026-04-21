"use client"
import { Button } from "@workspace/ui/components/button"
import { NavigationMenuDemo } from "@/components/testing"
import { BrainIcon } from "@phosphor-icons/react"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className={"relative container mx-auto flex items-center justify-center text-center"}>
        <BrainIcon weight={"thin"} size={"xl"} className={"absolute inset-0 opacity-20"} />
        <h1 className={"text-7xl"}>Testing</h1>
      </div>
    </div>
  )
}
