"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { Eye, EyeOff, Loader2, Minus, Plus, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type InputProps = Omit<React.ComponentProps<"input">, "prefix"> & {
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

function FieldMessage({
  id,
  error,
  success,
  description,
}: {
  id: string
  error?: string
  success?: string
  description?: string
}) {
  if (error) {
    return (
      <p className="text-caption font-medium text-danger" id={id} role="alert">
        {error}
      </p>
    )
  }

  if (success) {
    return (
      <p className="text-caption font-medium text-success" id={id}>
        {success}
      </p>
    )
  }

  if (description) {
    return (
      <p className="text-caption text-muted-foreground" id={id}>
        {description}
      </p>
    )
  }

  return null
}

function Input({
  className,
  wrapperClassName,
  type,
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
}: InputProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const counterId = `${inputId}-counter`
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

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
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
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      ) : null}
      <div
        className={cn(
          "flex min-h-8 w-full items-center rounded-lg border border-input bg-background text-base transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 md:text-sm dark:bg-input/30",
          error && "border-danger focus-within:border-danger focus-within:ring-danger/20",
          disabled && "cursor-not-allowed bg-input/50 opacity-50 dark:bg-input/80",
          readOnly && "bg-muted/40",
          className
        )}
      >
        {leftIcon ? (
          <span className="ml-2.5 text-muted-foreground [&_svg]:size-4">
            {leftIcon}
          </span>
        ) : null}
        {prefix ? (
          <span className="ml-2.5 text-sm text-muted-foreground">{prefix}</span>
        ) : null}
        <InputPrimitive
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(error)}
          aria-readonly={readOnly || undefined}
          disabled={disabled || loading}
          id={inputId}
          maxLength={maxLength}
          readOnly={readOnly}
          required={required}
          type={type}
          value={currentValue}
          data-slot="input"
          className="h-8 min-w-0 flex-1 bg-transparent px-2.5 py-1 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed"
          onChange={handleChange}
          {...props}
        />
        {suffix ? (
          <span className="mr-2.5 text-sm text-muted-foreground">{suffix}</span>
        ) : null}
        {loading ? (
          <Loader2 className="mr-2.5 size-4 animate-spin text-muted-foreground" />
        ) : clearButton && currentValue && !disabled && !readOnly ? (
          <Button
            aria-label="Clear input"
            className="mr-1"
            onClick={handleClear}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <X />
          </Button>
        ) : rightIcon ? (
          <span className="mr-2.5 text-muted-foreground [&_svg]:size-4">
            {rightIcon}
          </span>
        ) : null}
      </div>
      <div className="flex items-start justify-between gap-3">
        <FieldMessage
          description={description}
          error={error}
          id={messageId}
          success={success}
        />
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

function PasswordInput({
  description = "Password strength indicator will appear here.",
  ...props
}: Omit<InputProps, "type" | "rightIcon">) {
  const [visible, setVisible] = React.useState(false)

  return (
    <Input
      autoComplete="current-password"
      description={description}
      rightIcon={
        <button
          aria-label={visible ? "Hide password" : "Show password"}
          className="rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setVisible((state) => !state)}
          type="button"
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      }
      type={visible ? "text" : "password"}
      {...props}
    />
  )
}

function SearchInput(props: Omit<InputProps, "type" | "leftIcon" | "clearButton">) {
  return <Input clearButton leftIcon={<Search />} type="search" {...props} />
}

function NumberInput({
  min,
  max,
  step = 1,
  value,
  defaultValue,
  onChange,
  ...props
}: Omit<InputProps, "type" | "rightIcon">) {
  const [internalValue, setInternalValue] = React.useState(
    String(value ?? defaultValue ?? "")
  )
  const currentValue = String(value ?? internalValue)

  function emit(nextValue: string) {
    setInternalValue(nextValue)
    const event = {
      target: { value: nextValue },
      currentTarget: { value: nextValue },
    } as unknown as React.ChangeEvent<HTMLInputElement>

    onChange?.(event)
  }

  function adjust(direction: 1 | -1) {
    const parsed = Number(currentValue || 0)
    const next = parsed + Number(step) * direction
    const minValue = min === undefined ? next : Number(min)
    const maxValue = max === undefined ? next : Number(max)
    emit(String(Math.min(Math.max(next, minValue), maxValue)))
  }

  return (
    <Input
      defaultValue={defaultValue}
      max={max}
      min={min}
      onChange={(event) => {
        setInternalValue(event.target.value)
        onChange?.(event)
      }}
      rightIcon={
        <span className="flex items-center gap-1">
          <Button
            aria-label="Decrease number"
            onClick={() => adjust(-1)}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <Minus />
          </Button>
          <Button
            aria-label="Increase number"
            onClick={() => adjust(1)}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <Plus />
          </Button>
        </span>
      }
      step={step}
      type="number"
      value={currentValue}
      {...props}
    />
  )
}

export { Input, NumberInput, PasswordInput, SearchInput }
