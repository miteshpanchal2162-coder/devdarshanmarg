import { cn } from "@/lib/utils"

function Skeleton({
  className,
  variant = "text",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "text" | "avatar" | "card" | "table" | "form" | "list"
}) {
  return (
    <div
      aria-hidden="true"
      data-slot="skeleton"
      data-variant={variant}
      className={cn(
        "animate-pulse bg-muted",
        variant === "text" && "h-4 rounded-md",
        variant === "avatar" && "size-10 rounded-full",
        variant === "card" && "h-32 rounded-2xl",
        variant === "table" && "h-9 rounded-md",
        variant === "form" && "h-10 rounded-lg",
        variant === "list" && "h-12 rounded-xl",
        className
      )}
      {...props}
    />
  )
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 rounded-2xl border border-border bg-card p-5", className)}>
      <Skeleton className="w-1/3" />
      <Skeleton className="w-2/3" />
      <Skeleton className="h-28" variant="card" />
    </div>
  )
}

function SkeletonTable({
  rows = 6,
  columns = 5,
  className,
}: {
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-2 rounded-2xl border border-border bg-card p-4", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div className="grid gap-3" key={rowIndex} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <Skeleton key={`${rowIndex}-${columnIndex}`} variant="table" />
          ))}
        </div>
      ))}
    </div>
  )
}

function SkeletonForm({
  fields = 6,
  className,
}: {
  fields?: number
  className?: string
}) {
  return (
    <div className={cn("grid gap-5 rounded-2xl border border-border bg-card p-5 md:grid-cols-2", className)}>
      {Array.from({ length: fields }).map((_, index) => (
        <div className="space-y-2" key={index}>
          <Skeleton className="w-24" />
          <Skeleton variant="form" />
        </div>
      ))}
    </div>
  )
}

function SkeletonList({
  items = 5,
  className,
}: {
  items?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div className="flex items-center gap-3" key={index}>
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-1/3" />
            <Skeleton className="w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonForm, SkeletonList, SkeletonTable }
