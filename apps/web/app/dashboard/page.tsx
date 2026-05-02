import { TypographyH2, TypographyP } from "@workspace/ui/components/typography"
import PlanningAction from "@/app/dashboard/_components/planning-action"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default function DashboardPage() {
  return (
    <div className="w-full flex-1 items-center justify-center">
      <div className="space-y-6">
        <TypographyH2>Hallo King!</TypographyH2>
        <TypographyP>Mau ngapain kita hari ini?</TypographyP>
        <PlanningAction />
      </div>
    </div>
  )
}
