import { Metadata } from "next"
import { ContactSection } from "@/components/layouts/contact-section"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Febri Ardiansyah for collaborations, freelance projects, or fullstack web development opportunities.",
  keywords: [
    "Contact Febri Ardiansyah",
    "fullstack developer",
    "web developer",
    "hire developer",
    "freelance developer",
    "Next.js developer",
    "Node.js developer",
    "software engineer",
  ],
}

export default function ContactPage() {
  return (
    <div className="flex min-h-dvh w-full justify-center">
      <div className="container">
        <h1 className="sr-only">Contact</h1>
        <ContactSection />
      </div>
    </div>
  )
}
