"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  orientation = "vertical",
  description,
  error,
  disabled,
  ...props
}: RadioGroupPrimitive.Props & {
  orientation?: "vertical" | "horizontal"
  description?: string
  error?: string
  disabled?: boolean
}) {
  const generatedId = React.useId()
  const messageId = `${generatedId}-message`

  return (
    <div className="grid gap-2" data-disabled={disabled || undefined}>
      <RadioGroupPrimitive
        aria-describedby={description || error ? messageId : undefined}
        aria-invalid={Boolean(error)}
        aria-orientation={orientation}
        data-orientation={orientation}
        data-slot="radio-group"
        disabled={disabled}
        className={cn(
          "grid w-full gap-2 data-[orientation=horizontal]:flex data-[orientation=horizontal]:flex-wrap",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-caption font-medium text-danger" id={messageId} role="alert">
          {error}
        </p>
      ) : description ? (
        <p className="text-caption text-muted-foreground" id={messageId}>
          {description}
        </p>
      ) : null}
    </div>
  )
}

function RadioGroupItem({
  className,
  id,
  label,
  description,
  disabled,
  ...props
}: RadioPrimitive.Root.Props & {
  label?: string
  description?: string
}) {
  const generatedId = React.useId()
  const itemId = id ?? generatedId

  return (
    <div className="flex items-start gap-3" data-disabled={disabled || undefined}>
      <RadioPrimitive.Root
        disabled={disabled}
        id={itemId}
        data-slot="radio-group-item"
        className={cn(
          "group/radio-group-item peer relative mt-0.5 flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 dark:bg-input/30 dark:aria-invalid:border-danger/60 dark:aria-invalid:ring-danger/30 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
          className
        )}
        {...props}
      >
        <RadioPrimitive.Indicator
          data-slot="radio-group-indicator"
          className="flex size-4 items-center justify-center"
        >
          <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
        </RadioPrimitive.Indicator>
      </RadioPrimitive.Root>
      {label || description ? (
        <div className="grid gap-1">
          {label ? (
            <Label className="leading-5" htmlFor={itemId}>
              {label}
            </Label>
          ) : null}
          {description ? (
            <p className="text-caption text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { RadioGroup, RadioGroupItem }
