import { ProviderDashboard } from "@/components/provider-dashboard"

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
  return (
    <ProviderDashboard>
      <div className="p-4">{children}</div>
    </ProviderDashboard>
  )
}
