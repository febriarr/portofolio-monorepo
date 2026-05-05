"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginPayload } from "@workspace/validator"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel, FieldError, FieldGroup } from "@workspace/ui/components/field"
import { useLogin } from "@/hooks/use-auth"
import { formatApiError, useAlert } from "@/hooks/use-alert"

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin()
  const { hide, alert } = useAlert()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginPayload) => {
    login(data, {
      onSuccess: () => {
        hide()
      },
      onError: (error) => {
        const { title, description } = formatApiError(error)
        alert(title, description)
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 border bg-card p-8 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                placeholder="Enter your username"
                disabled={isPending}
                {...register("username")}
              />
              <FieldError errors={[errors.username]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                disabled={isPending}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>
          </FieldGroup>

          {/* Server error */}
          {error && <FieldError>{error.message}</FieldError>}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  )
}
