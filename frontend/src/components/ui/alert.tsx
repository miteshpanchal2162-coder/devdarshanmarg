"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-3 py-2.5 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        success:
          "border-success/20 bg-success/10 text-success *:data-[slot=alert-description]:text-success/85",
        warning:
          "border-warning/20 bg-warning/10 text-warning *:data-[slot=alert-description]:text-warning/85",
        error:
          "border-danger/20 bg-danger/10 text-danger *:data-[slot=alert-description]:text-danger/85",
        info:
          "border-info/20 bg-info/10 text-info *:data-[slot=alert-description]:text-info/85",
        destructive:
          "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const defaultAlertIcon = {
  default: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: XCircle,
  info: Info,
  destructive: XCircle,
} as const

function Alert({
  className,
  variant = "default",
  title,
  description,
  icon,
  close,
  action,
  onClose,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    title?: React.ReactNode
    description?: React.ReactNode
    icon?: React.ReactNode
    close?: boolean
    action?: React.ReactNode
    onClose?: () => void
  }) {
  const [visible, setVisible] = React.useState(true)
  const Icon = defaultAlertIcon[variant ?? "default"]

  if (!visible) return null

  function handleClose() {
    setVisible(false)
    onClose?.()
  }

  return (
    <div
      data-slot="alert"
      role={variant === "success" || variant === "info" ? "status" : "alert"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon === null ? null : icon ?? <Icon aria-hidden="true" />}
      {title || description ? (
        <div className="grid gap-1">
          {title ? <AlertTitle>{title}</AlertTitle> : null}
          {description ? (
            <AlertDescription>{description}</AlertDescription>
          ) : null}
        </div>
      ) : (
        children
      )}
      {action ? <AlertAction>{action}</AlertAction> : null}
      {close ? (
        <button
          aria-label="Close alert"
          className="absolute right-2 top-2 rounded-md p-1 text-current/70 transition-colors hover:text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={handleClose}
          type="button"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2 right-2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
