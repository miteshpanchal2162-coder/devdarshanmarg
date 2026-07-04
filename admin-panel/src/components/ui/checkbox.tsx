"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon, MinusIcon } from "lucide-react"
import * as React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type CheckboxProps = Omit<CheckboxPrimitive.Root.Props, "children"> & {
  label?: string
  description?: string
  error?: string
  success?: string
  indeterminate?: boolean
  wrapperClassName?: string
}

function Checkbox({
  className,
  wrapperClassName,
  id,
  label,
  description,
  error,
  success,
  disabled,
  indeterminate,
  ...props
}: CheckboxProps) {
  const generatedId = React.useId()
  const checkboxId = id ?? generatedId
  const messageId = `${checkboxId}-message`

  return (
    <div
      className={cn("group flex items-start gap-3", wrapperClassName)}
      data-disabled={disabled || undefined}
    >
      <CheckboxPrimitive.Root
        aria-describedby={description || error || success ? messageId : undefined}
        aria-invalid={Boolean(error)}
        aria-checked={indeterminate ? "mixed" : undefined}
        disabled={disabled}
        id={checkboxId}
        data-indeterminate={indeterminate || undefined}
        data-slot="checkbox"
        className={cn(
          "peer relative mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 dark:bg-input/30 dark:aria-invalid:border-danger/60 dark:aria-invalid:ring-danger/30 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-[indeterminate=true]:border-primary data-[indeterminate=true]:bg-primary data-[indeterminate=true]:text-primary-foreground dark:data-checked:bg-primary",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
        >
          {indeterminate ? <MinusIcon /> : <CheckIcon />}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label || description || error || success ? (
        <div className="grid gap-1">
          {label ? (
            <Label className="leading-5" htmlFor={checkboxId}>
              {label}
            </Label>
          ) : null}
          {error ? (
            <p className="text-caption font-medium text-danger" id={messageId} role="alert">
              {error}
            </p>
          ) : success ? (
            <p className="text-caption font-medium text-success" id={messageId}>
              {success}
            </p>
          ) : description ? (
            <p className="text-caption text-muted-foreground" id={messageId}>
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { Checkbox }
