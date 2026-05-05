import { cn } from "@workspace/ui/lib/utils"

export type TypographyProps = React.HTMLAttributes<HTMLDivElement>

export function TypographyH1({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl",
        className
      )}
    >
      {children}
    </h1>
  )
}

export function TypographyH2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl",
        className
      )}
    >
      {children}
    </h2>
  )
}

export function TypographyH3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn("l scroll-m-20 text-xl font-semibold tracking-tight md:text-2xl", className)}>
      {children}
    </h3>
  )
}

export function TypographyH4({ children, className }: TypographyProps) {
  return (
    <h4 className={cn("scroll-m-20 text-lg font-medium tracking-tight md:text-xl", className)}>
      {children}
    </h4>
  )
}

export function TypographyP({ children, className }: TypographyProps) {
  return <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>{children}</p>
}

export function TypographyBlockquote({ children, className }: TypographyProps) {
  return (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>{children}</blockquote>
  )
}

export function TypographyList({ children, className }: TypographyProps) {
  return <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>{children}</ul>
}

export function TypographyLead({ children, className }: TypographyProps) {
  return <p className={cn("text-xl text-muted-foreground", className)}>{children}</p>
}

export function TypographyLarge({ children, className }: TypographyProps) {
  return <div className={cn("text-lg font-medium", className)}>{children}</div>
}

export function TypographySmall({ children, className }: TypographyProps) {
  return <small className={cn("text-sm leading-none font-medium", className)}>{children}</small>
}

export function TypographyMuted({ children, className }: TypographyProps) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
}
