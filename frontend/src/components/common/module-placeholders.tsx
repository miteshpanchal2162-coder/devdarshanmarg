import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatusTone = "success" | "warning" | "danger" | "info" | "secondary";

export function ModuleStatusBadge({
  status,
  tone,
}: {
  status: string;
  tone?: StatusTone;
}) {
  const normalized = status.toUpperCase();
  const variant =
    tone ??
    (["ACTIVE", "PUBLISHED", "SENT", "SUCCESS"].includes(normalized)
      ? "success"
      : ["DRAFT", "SCHEDULED", "WARNING"].includes(normalized)
        ? "warning"
        : ["FAILED", "ERROR", "REJECTED"].includes(normalized)
          ? "danger"
          : "secondary");

  return <Badge variant={variant}>{status}</Badge>;
}

export function ModuleFiltersShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("grid gap-2 sm:grid-cols-2 xl:grid-cols-4", className)}>{children}</div>;
}

export function ModulePlaceholderPanel({
  description,
  icon,
  title,
}: {
  description: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Card className="border-dashed" variant="outlined">
      <CardContent className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">
          {icon}
        </span>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ModuleTablePlaceholder({
  keyValue = false,
  prefix = "MOD",
  title,
}: {
  keyValue?: boolean;
  prefix?: string;
  title: string;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <caption className="sr-only">{title} placeholder table</caption>
        <thead className="border-b bg-muted/50 text-caption uppercase tracking-[0.16em] text-muted-foreground">
          <tr>
            <th className="p-3" scope="col">{keyValue ? "Key" : "Name"}</th>
            <th className="p-3" scope="col">{keyValue ? "Value" : "Code"}</th>
            <th className="p-3" scope="col">Status</th>
            <th className="p-3 text-right" scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 font-medium">{keyValue ? "Placeholder key" : `${title} sample`}</td>
            <td className="p-3">{keyValue ? "Placeholder value" : `${prefix}-${title.toUpperCase().slice(0, 4)}-001`}</td>
            <td className="p-3"><Badge variant="secondary">Placeholder</Badge></td>
            <td className="p-3 text-right"><Button size="sm" type="button" variant="outline">Manage</Button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function ModuleDetailCard({
  children,
  icon,
  title,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Card className="glass-panel shadow-soft">
      <CardHeader className="flex flex-row items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-4">
          {icon}
        </span>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
