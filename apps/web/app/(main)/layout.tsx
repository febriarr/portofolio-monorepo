import Navbar from "@/components/layouts/navbar"
import { Footer } from "@/components/layouts/footer"

export default function LayoutMain({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
