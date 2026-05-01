"use client"

import { SidebarProvider } from "@workspace/ui/components/sidebar"
import AppSidebar from "@/components/app-sidebar"

export function ProviderDashboard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar>{children}</AppSidebar>
      </SidebarProvider>
    </>
  )
}
