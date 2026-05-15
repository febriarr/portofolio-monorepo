import Navbar from "@workspace/ui/components/navbar"
import { Footer } from "@workspace/ui/components/footer"

export default function LayoutMain({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
