import Link from "next/link";
import { AlertTriangle, Archive, Calendar, CheckCircle2, ChevronRight, CircleDashed, Clock, FileText, FileUp, Home, RefreshCw, Search, ShieldAlert, Wrench, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "success" | "warning" | "danger" | "info" | "saffron";
type StatusValue =
  | "active"
  | "inactive"
  | "draft"
  | "published"
  | "pending"
  | "approved"
  | "rejected"
  | "archived";

const statusToneClass: Record<StatusTone, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  danger: "border-danger/20 bg-danger/10 text-danger",
  info: "border-info/20 bg-info/10 text-info",
  saffron: "border-primary/20 bg-primary/10 text-primary",
};

const statusConfig: Record<
  StatusValue,
  { label: string; tone: StatusTone; icon: React.ReactNode }
> = {
  active: { label: "Active", tone: "success", icon: <CheckCircle2 /> },
  inactive: { label: "Inactive", tone: "neutral", icon: <CircleDashed /> },
  draft: { label: "Draft", tone: "info", icon: <FileText /> },
  published: { label: "Published", tone: "success", icon: <CheckCircle2 /> },
  pending: { label: "Pending", tone: "warning", icon: <Clock /> },
  approved: { label: "Approved", tone: "success", icon: <CheckCircle2 /> },
  rejected: { label: "Rejected", tone: "danger", icon: <XCircle /> },
  archived: { label: "Archived", tone: "neutral", icon: <Archive /> },
};

export function StatusPill({
  children,
  status,
  tone = "neutral",
  className,
}: {
  children?: React.ReactNode;
  status?: StatusValue;
  tone?: StatusTone;
  className?: string;
}) {
  const config = status ? statusConfig[status] : null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium [&_svg]:size-3.5",
        statusToneClass[config?.tone ?? tone],
        className,
      )}
    >
      {config?.icon}
      {children ?? config?.label}
    </span>
  );
}

export function SearchBox({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="pl-8" type="search" {...props} />
    </div>
  );
}

export function DatePickerPlaceholder({
  label = "Select date",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-8 w-full items-center gap-2 rounded-lg border border-dashed border-input bg-background px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <Calendar className="h-4 w-4" />
      {label}
    </button>
  );
}

export function TimePickerPlaceholder({
  label = "Select time",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-8 w-full items-center gap-2 rounded-lg border border-dashed border-input bg-background px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <Clock className="h-4 w-4" />
      {label}
    </button>
  );
}

export function FileUploadPlaceholder({
  title = "Upload file",
  description = "Drag and drop support will be wired in a later step.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <FileUp className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-medium">{title}</p>
      <p className="mt-1 text-caption text-muted-foreground">{description}</p>
    </div>
  );
}

export function PageHeader({
  breadcrumb,
  eyebrow,
  primaryAction,
  secondaryAction,
  subtitle,
  title,
  description,
  actions,
}: {
  breadcrumb?: React.ReactNode;
  eyebrow?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  subtitle?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const resolvedDescription = subtitle ?? description;
  const resolvedActions = actions ?? (
    primaryAction || secondaryAction ? (
      <>
        {secondaryAction}
        {primaryAction}
      </>
    ) : null
  );

  return (
    <header className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumb ? <div className="mb-4">{breadcrumb}</div> : null}
        {eyebrow ? (
          <p className="mb-2 text-small font-semibold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-heading font-semibold">{title}</h1>
        {resolvedDescription ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{resolvedDescription}</p>
        ) : null}
      </div>
      {resolvedActions ? <div className="flex shrink-0 flex-wrap gap-2">{resolvedActions}</div> : null}
    </header>
  );
}

export function AppBreadcrumb({
  items,
  homeHref = "/",
}: {
  items: Array<{ label: string; href?: string; icon?: React.ReactNode }>;
  homeHref?: string;
}) {
  const allItems = [
    { label: "Home", href: homeHref, icon: <Home className="h-3.5 w-3.5" /> },
    ...items,
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-caption text-muted-foreground">
      {allItems.map((item, index) => {
        const current = index === allItems.length - 1;

        return (
        <span className="flex items-center gap-2" key={`${item.label}-${index}`}>
          {item.href && !current ? (
            <Link className="inline-flex items-center gap-1.5 rounded-md transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={item.href}>
              {item.icon}
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="inline-flex items-center gap-1.5 text-foreground">
              {item.icon}
              {item.label}
            </span>
          )}
          {index < allItems.length - 1 ? <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" /> : null}
        </span>
      )})}
    </nav>
  );
}

export function Loader({
  className,
  label = "Loading...",
  overlay = false,
  size = "md",
}: {
  className?: string;
  label?: string;
  overlay?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "fullscreen" | "overlay";
}) {
  const fullscreen = size === "fullscreen";
  const isOverlay = overlay || size === "overlay";

  return (
    <div
      aria-live="polite"
      className={cn(
        "flex items-center justify-center gap-2 text-sm text-muted-foreground",
        fullscreen && "min-h-svh",
        isOverlay && "absolute inset-0 z-20 bg-background/70 backdrop-blur-sm",
        className,
      )}
      role="status"
    >
      <span
        className={cn(
          "animate-spin rounded-full border-2 border-primary border-t-transparent",
          size === "xs" && "h-3 w-3",
          size === "sm" && "h-4 w-4",
          (size === "md" || size === "overlay") && "h-5 w-5",
          (size === "lg" || size === "fullscreen") && "h-7 w-7",
        )}
      />
      <span>{label}</span>
    </div>
  );
}

export function PageLoader({ label = "Loading page..." }: { label?: string }) {
  return <Loader label={label} size="fullscreen" />;
}

export function EmptyState({
  title = "No records found",
  description = "There is nothing to show yet.",
  icon,
  illustration,
  primaryAction,
  secondaryAction,
  action,
}: {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  illustration?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-8 text-center shadow-soft sm:p-10">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-saffron-gold text-primary-foreground opacity-90 [&_svg]:h-6 [&_svg]:w-6">
        {icon ?? illustration ?? <FileText />}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action || primaryAction || secondaryAction ? (
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          {secondaryAction}
          {primaryAction ?? action}
        </div>
      ) : null}
    </div>
  );
}

export function ErrorState({
  backHref,
  title = "Unable to load",
  description = "Please try again.",
  errorCode,
  onRetry,
  action,
}: {
  backHref?: string;
  title?: string;
  description?: string;
  errorCode?: string | number;
  onRetry?: () => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center text-danger">
      <AlertTriangle className="mx-auto h-8 w-8" />
      {errorCode ? (
        <p className="mt-3 text-caption font-semibold uppercase tracking-[0.18em] text-danger/70">
          Error {errorCode}
        </p>
      ) : null}
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-danger/80">{description}</p>
      {action || onRetry || backHref ? (
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          {backHref ? (
            <Button render={<Link href={backHref} />} variant="outline">
              Go back
            </Button>
          ) : null}
          {onRetry ? (
            <Button onClick={onRetry} type="button">
              Retry
            </Button>
          ) : null}
          {action}
        </div>
      ) : null}
    </div>
  );
}

export function NoPermissionState({
  contactAction,
  description = "You do not have permission to access this area.",
  onBack,
  title = "Access denied",
}: {
  contactAction?: React.ReactNode;
  description?: string;
  onBack?: () => void;
  title?: string;
}) {
  return (
    <EmptyState
      description={description}
      icon={<ShieldAlert />}
      primaryAction={
        onBack ? (
          <Button onClick={onBack} type="button" variant="outline">
            Go back
          </Button>
        ) : undefined
      }
      secondaryAction={contactAction}
      title={title}
    />
  );
}

export function MaintenanceState({
  description = "We are performing scheduled maintenance. Please refresh in a few minutes.",
  onRefresh,
  title = "Maintenance in progress",
}: {
  description?: string;
  onRefresh?: () => void;
  title?: string;
}) {
  return (
    <EmptyState
      description={description}
      icon={<Wrench />}
      primaryAction={
        onRefresh ? (
          <Button leftIcon={<RefreshCw />} onClick={onRefresh} type="button">
            Refresh
          </Button>
        ) : undefined
      }
      title={title}
    />
  );
}

export function SectionHeader({
  actionButton,
  title,
  description,
  action,
}: {
  actionButton?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-subheading font-semibold">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ?? actionButton}
    </div>
  );
}

export function StatisticCard({
  loading,
  label,
  title,
  value,
  subtitle,
  trend,
  icon,
}: {
  loading?: boolean;
  label?: string;
  title?: string;
  value?: string | number;
  subtitle?: string;
  trend?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="glass-panel shadow-soft" loading={loading}>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-sm text-muted-foreground">{title ?? label}</CardTitle>
        {icon ? <div className="text-primary">{icon}</div> : null}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{loading ? "—" : value}</p>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        {trend ? <Badge className="mt-3" variant="secondary">{trend}</Badge> : null}
      </CardContent>
    </Card>
  );
}

export function Divider({
  className,
  label,
  orientation = "horizontal",
}: {
  className?: string;
  label?: React.ReactNode;
  orientation?: "horizontal" | "vertical";
}) {
  if (orientation === "vertical") {
    return (
      <div
        aria-orientation="vertical"
        className={cn("h-full min-h-6 w-px bg-border", className)}
        role="separator"
      />
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)} role="separator">
      <div className="h-px flex-1 bg-border" />
      {label ? <span className="text-caption text-muted-foreground">{label}</span> : null}
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function Container({
  children,
  className,
  size = "xl",
  spacing = "md",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  spacing?: "none" | "sm" | "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        size === "sm" && "max-w-3xl",
        size === "md" && "max-w-5xl",
        size === "lg" && "max-w-6xl",
        size === "xl" && "max-w-7xl",
        size === "full" && "max-w-none",
        spacing === "sm" && "px-4",
        spacing === "md" && "px-4 sm:px-6",
        spacing === "lg" && "px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SkeletonBlock() {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}
