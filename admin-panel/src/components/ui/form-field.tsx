"use client";

import {
  FormProvider,
  useFormContext,
  type FieldValues,
  type FormProviderProps,
  type Path,
} from "react-hook-form";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldGroupColumns = 1 | 2 | 3;

function getNestedValue(source: unknown, path?: string): unknown {
  if (!path || typeof source !== "object" || source === null) return undefined;

  return path.split(".").reduce<unknown>((current, key) => {
    if (typeof current !== "object" || current === null) return undefined;
    return (current as Record<string, unknown>)[key];
  }, source);
}

function messageFromError(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : undefined;
  }

  return undefined;
}

export function Form<TFieldValues extends FieldValues>({
  children,
  className,
  onSubmit,
  ...form
}: FormProviderProps<TFieldValues> & {
  children: React.ReactNode;
  className?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}) {
  return (
    <FormProvider {...form}>
      <form
        className={cn("grid gap-6", className)}
        noValidate
        onSubmit={onSubmit}
      >
        {children}
      </form>
    </FormProvider>
  );
}

export function FieldGroup({
  children,
  className,
  columns = 1,
}: {
  children: React.ReactNode;
  className?: string;
  columns?: FieldGroupColumns;
}) {
  return (
    <div
      className={cn(
        "grid gap-5",
        columns === 2 && "md:grid-cols-2",
        columns === 3 && "md:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FormField<TFieldValues extends FieldValues>({
  id,
  label,
  description,
  hint,
  error,
  success,
  required,
  disabled,
  name,
  dirty,
  children,
  className,
}: {
  id?: string;
  label?: string;
  description?: string;
  hint?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  dirty?: boolean;
  name?: Path<TFieldValues>;
  children: React.ReactNode;
  className?: string;
}) {
  const context = useFormContext<TFieldValues>();
  const fieldError = error ?? messageFromError(getNestedValue(context?.formState?.errors, name));
  const fieldDirty =
    dirty ?? Boolean(name ? getNestedValue(context?.formState?.dirtyFields, name) : false);
  const messageId = id ? `${id}-message` : undefined;
  const fieldHint = hint ?? description;

  return (
    <div className={cn("group grid gap-2", className)} data-disabled={disabled}>
      {label ? (
        <Label className={cn(disabled && "opacity-50")} htmlFor={id} required={required}>
          {label}
          {fieldDirty ? (
            <span className="rounded-full bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning">
              Unsaved
            </span>
          ) : null}
        </Label>
      ) : null}
      {children}
      {fieldHint && !fieldError ? (
        <p className="text-caption text-muted-foreground" id={messageId}>
          {fieldHint}
        </p>
      ) : null}
      {fieldError ? (
        <p className="text-caption font-medium text-danger" id={messageId} role="alert">
          {fieldError}
        </p>
      ) : null}
      {success && !fieldError ? (
        <p className="flex items-center gap-1 text-caption font-medium text-success">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {success}
        </p>
      ) : null}
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
  divider = true,
  columns = 1,
  action,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  divider?: boolean;
  columns?: FieldGroupColumns;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-soft", className)}>
      <div
        className={cn(
          "mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
          divider && "border-b border-border/70 pb-4",
        )}
      >
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <FieldGroup columns={columns}>{children}</FieldGroup>
    </section>
  );
}

export function FormActions({
  cancelLabel = "Cancel",
  canReset,
  children,
  className,
  dirty,
  onCancel,
  onReset,
  resetLabel = "Reset",
  sticky = false,
  submitLabel = "Save",
  submitting,
}: {
  cancelLabel?: string;
  canReset?: boolean;
  children?: React.ReactNode;
  className?: string;
  dirty?: boolean;
  onCancel?: () => void;
  onReset?: () => void;
  resetLabel?: string;
  sticky?: boolean;
  submitLabel?: string;
  submitting?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 border-t border-border bg-background/90 py-4 sm:flex-row sm:items-center sm:justify-between",
        sticky && "sticky bottom-0 z-20 backdrop-blur",
        className,
      )}
    >
      <div className="min-h-5 text-caption text-muted-foreground" aria-live="polite">
        {dirty ? "You have unsaved changes." : null}
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
        {onCancel ? (
          <Button onClick={onCancel} type="button" variant="outline">
            {cancelLabel}
          </Button>
        ) : null}
        {canReset || onReset ? (
          <Button disabled={!dirty || submitting} onClick={onReset} type="button" variant="ghost">
            {resetLabel}
          </Button>
        ) : null}
        {children ?? (
          <Button loading={submitting} type="submit">
            {submitLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export function FormErrorSummary({
  errors,
  title = "Please fix the following errors",
}: {
  errors?: Record<string, unknown>;
  title?: string;
}) {
  const entries = Object.entries(errors ?? {})
    .map(([field, value]) => ({ field, message: messageFromError(value) }))
    .filter((entry): entry is { field: string; message: string } => Boolean(entry.message));

  if (!entries.length) return null;

  return (
    <div
      className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-danger"
      role="alert"
      tabIndex={-1}
    >
      <div className="flex items-center gap-2 font-medium">
        <AlertCircle className="h-4 w-4" />
        {title}
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
        {entries.map((entry) => (
          <li key={entry.field}>
            <a className="underline-offset-4 hover:underline" href={`#${entry.field}`}>
              {entry.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
