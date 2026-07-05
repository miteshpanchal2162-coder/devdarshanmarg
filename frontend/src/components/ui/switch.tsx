"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { Loader2 } from "lucide-react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

function Switch({
  className,
  wrapperClassName,
  id,
  label,
  description,
  loading,
  disabled,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  wrapperClassName?: string
  label?: string
  description?: string
  loading?: boolean
  size?: "sm" | "default"
}) {
  const generatedId = React.useId()
  const switchId = id ?? generatedId
  const descriptionId = `${switchId}-description`

  return (
    <div
      className={cn("flex items-start justify-between gap-3", wrapperClassName)}
      data-disabled={disabled || loading || undefined}
    >
      {label || description ? (
        <div className="grid gap-1">
          {label ? (
            <Label className="leading-5" htmlFor={switchId}>
              {label}
            </Label>
          ) : null}
          {description ? (
            <p className="text-caption text-muted-foreground" id={descriptionId}>
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="relative shrink-0">
        <SwitchPrimitive.Root
          aria-describedby={description ? descriptionId : undefined}
          aria-busy={loading || undefined}
          disabled={disabled || loading}
          id={switchId}
          data-slot="switch"
          data-size={size}
          className={cn(
            "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-danger/60 dark:aria-invalid:ring-danger/30 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50",
            className
          )}
          {...props}
        >
          <SwitchPrimitive.Thumb
            data-slot="switch-thumb"
            className="pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground"
          />
        </SwitchPrimitive.Root>
        {loading ? (
          <Loader2 className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : null}
      </div>
    </div>
  )
}

export { Switch }
