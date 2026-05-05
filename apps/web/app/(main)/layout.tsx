import Navbar from "@/components/layouts/navbar"

export default function LayoutMain({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
