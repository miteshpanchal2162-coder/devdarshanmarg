"use client"

import * as React from "react"
import { Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type TextareaProps = Omit<React.ComponentProps<"textarea">, "prefix"> & {
  label?: string
  description?: string
  error?: string
  success?: string
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  characterCounter?: boolean
  clearButton?: boolean
  onClear?: () => void
  wrapperClassName?: string
}

function Textarea({
  className,
  wrapperClassName,
  id,
  label,
  description,
  required,
  disabled,
  readOnly,
  loading,
  error,
  success,
  leftIcon,
  rightIcon,
  prefix,
  suffix,
  characterCounter,
  clearButton,
  onClear,
  maxLength,
  value,
  defaultValue,
  onChange,
  ...props
}: TextareaProps) {
  const generatedId = React.useId()
  const textareaId = id ?? generatedId
  const messageId = `${textareaId}-message`
  const counterId = `${textareaId}-counter`
  const [internalValue, setInternalValue] = React.useState(
    String(value ?? defaultValue ?? "")
  )
  const currentValue = String(value ?? internalValue)
  const describedBy = [
    description || error || success ? messageId : null,
    characterCounter ? counterId : null,
  ]
    .filter(Boolean)
    .join(" ")

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInternalValue(event.target.value)
    onChange?.(event)
  }

  function handleClear() {
    setInternalValue("")
    onClear?.()
  }

  return (
    <div
      className={cn("group grid gap-2", wrapperClassName)}
      data-disabled={disabled || undefined}
    >
      {label ? (
        <Label htmlFor={textareaId} required={required}>
          {label}
        </Label>
      ) : null}
      <div
        className={cn(
          "flex min-h-20 w-full rounded-lg border border-input bg-background text-base transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 md:text-sm dark:bg-input/30",
          error && "border-danger focus-within:border-danger focus-within:ring-danger/20",
          disabled && "cursor-not-allowed bg-input/50 opacity-50 dark:bg-input/80",
          readOnly && "bg-muted/40",
          className
        )}
      >
        {leftIcon ? (
          <span className="ml-2.5 mt-2.5 text-muted-foreground [&_svg]:size-4">
            {leftIcon}
          </span>
        ) : null}
        {prefix ? (
          <span className="ml-2.5 mt-2 text-sm text-muted-foreground">
            {prefix}
          </span>
        ) : null}
        <textarea
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(error)}
          aria-readonly={readOnly || undefined}
          data-slot="textarea"
          disabled={disabled || loading}
          id={textareaId}
          maxLength={maxLength}
          readOnly={readOnly}
          required={required}
          value={currentValue}
          className="field-sizing-content min-h-20 flex-1 resize-y bg-transparent px-2.5 py-2 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          onChange={handleChange}
          {...props}
        />
        {suffix ? (
          <span className="mr-2.5 mt-2 text-sm text-muted-foreground">
            {suffix}
          </span>
        ) : null}
        {loading ? (
          <Loader2 className="mr-2.5 mt-2.5 size-4 animate-spin text-muted-foreground" />
        ) : clearButton && currentValue && !disabled && !readOnly ? (
          <Button
            aria-label="Clear textarea"
            className="mr-1 mt-1"
            onClick={handleClear}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <X />
          </Button>
        ) : rightIcon ? (
          <span className="mr-2.5 mt-2.5 text-muted-foreground [&_svg]:size-4">
            {rightIcon}
          </span>
        ) : null}
      </div>
      <div className="flex items-start justify-between gap-3">
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
        {characterCounter ? (
          <p
            className="ml-auto shrink-0 text-caption text-muted-foreground"
            id={counterId}
          >
            {currentValue.length}
            {maxLength ? `/${maxLength}` : null}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export { Textarea }
