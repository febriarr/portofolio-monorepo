import { LoginForm } from "@/app/login/_components/login-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
}

export default function LoginPage() {
  return <LoginForm />
}
