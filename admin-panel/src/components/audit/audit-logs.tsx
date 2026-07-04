"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRightLeft, Clock, Download, Eye, FileJson, History, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { AdminOnly, PermissionGate, RoleBadge } from "@/components/ui/permission";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type AuditStatus = "SUCCESS" | "FAILED" | "WARNING";
type AuditLogRecord = {
  id: string;
  date: string;
  user: string;
  module: string;
  action: string;
  entity: string;
  entityId: string;
  ipAddress: string;
  status: AuditStatus;
};

const auditLogs: AuditLogRecord[] = [
  {
    id: "audit-001",
    date: "04 Jul 2026, 11:32 AM",
    user: "Admin Name",
    module: "Temple",
    action: "Update",
    entity: "Kashi Vishwanath Temple",
    entityId: "tmp-001",
    ipAddress: "103.21.244.12",
    status: "SUCCESS",
  },
  {
    id: "audit-002",
    date: "04 Jul 2026, 10:18 AM",
    user: "Content Manager",
    module: "Content",
    action: "Publish",
    entity: "Navratri Guide",
    entityId: "cnt-002",
    ipAddress: "103.21.244.33",
    status: "SUCCESS",
  },
  {
    id: "audit-003",
    date: "03 Jul 2026, 08:52 PM",
    user: "Reviewer",
    module: "Users",
    action: "Delete",
    entity: "Temporary User",
    entityId: "usr-018",
    ipAddress: "103.21.244.78",
    status: "WARNING",
  },
  {
    id: "audit-004",
    date: "03 Jul 2026, 06:10 PM",
    user: "Admin Name",
    module: "Settings",
    action: "Export",
    entity: "SEO Settings",
    entityId: "set-seo",
    ipAddress: "103.21.244.12",
    status: "FAILED",
  },
];

const userOptions = [
  { label: "All users", value: "all" },
  { label: "Admin Name", value: "admin" },
  { label: "Content Manager", value: "content-manager" },
  { label: "Reviewer", value: "reviewer" },
];

const moduleOptions = [
  { label: "All modules", value: "all" },
  { label: "Temple", value: "temple" },
  { label: "Content", value: "content" },
  { label: "Users", value: "users" },
  { label: "Settings", value: "settings" },
];

const actionOptions = [
  { label: "All actions", value: "all" },
  { label: "Create", value: "create" },
  { label: "Update", value: "update" },
  { label: "Delete", value: "delete" },
  { label: "Publish", value: "publish" },
  { label: "Export", value: "export" },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Success", value: "SUCCESS" },
  { label: "Warning", value: "WARNING" },
  { label: "Failed", value: "FAILED" },
];

function AuditStatusBadge({ status }: { status: AuditStatus }) {
  const variant = status === "SUCCESS" ? "success" : status === "WARNING" ? "warning" : "danger";
  return <Badge variant={variant}>{status}</Badge>;
}

function AuditFilters() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
      <Select options={userOptions} placeholder="User" />
      <Select options={moduleOptions} placeholder="Module" />
      <Select options={actionOptions} placeholder="Action" />
      <Input aria-label="Date range filter" placeholder="Date range" type="date" />
      <Select options={statusOptions} placeholder="Status" />
    </div>
  );
}

const columns: ColumnDef<AuditLogRecord>[] = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "user", header: "User", cell: ({ row }) => <span className="font-medium">{row.original.user}</span> },
  { accessorKey: "module", header: "Module" },
  { accessorKey: "action", header: "Action" },
  { accessorKey: "entity", header: "Entity" },
  { accessorKey: "entityId", header: "Entity ID" },
  { accessorKey: "ipAddress", header: "IP Address" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <AuditStatusBadge status={row.original.status} /> },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        <Button aria-label={`View audit ${row.original.id}`} render={<Link href={`/activity-logs/${row.original.id}`} />} size="icon-sm" variant="ghost">
          <Eye />
        </Button>
        <AdminOnly>
          <Button aria-label="Export audit placeholder" size="icon-sm" type="button" variant="ghost">
            <Download />
          </Button>
        </AdminOnly>
      </div>
    ),
  },
];

export function ActivityLogsPageContent() {
  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Activity & Audit Logs</p>
            <h1 className="text-3xl font-semibold tracking-tight">Activity Logs</h1>
            <p className="mt-2 text-sm text-muted-foreground">Audit activity UI with dummy data and export placeholders.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RoleBadge />
            <AdminOnly>
              <Button type="button" variant="outline"><Download />Export Placeholder</Button>
            </AdminOnly>
          </div>
        </header>
        <DataTable
          columns={columns}
          data={auditLogs}
          exportPlaceholder={() => undefined}
          filters={<AuditFilters />}
          onRefresh={() => undefined}
          searchPlaceholder="Search audit logs..."
        />
      </div>
    </PermissionGate>
  );
}

function DetailCard({ children, icon, title }: { children: React.ReactNode; icon: React.ReactNode; title: string }) {
  return (
    <Card className="glass-panel shadow-soft">
      <CardHeader className="flex flex-row items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-4">{icon}</span>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function JsonPlaceholder({ label }: { label: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
{`{
  "placeholder": "${label}",
  "changedBy": "Admin Name",
  "source": "UI only"
}`}
    </pre>
  );
}

export function AuditDetailsPageContent() {
  const audit = auditLogs[0];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Audit Details</p>
            <h1 className="text-3xl font-semibold tracking-tight">{audit.action} · {audit.entity}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{audit.date} · {audit.ipAddress}</p>
          </div>
          <AdminOnly>
            <Button type="button" variant="outline"><Download />Export Placeholder</Button>
          </AdminOnly>
        </header>

        <section className="grid gap-4 lg:grid-cols-3" aria-label="Audit overview">
          <DetailCard icon={<UserRound />} title="Overview">
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">User:</span> {audit.user}</p>
              <p><span className="text-muted-foreground">Module:</span> {audit.module}</p>
              <p><span className="text-muted-foreground">Entity ID:</span> {audit.entityId}</p>
              <AuditStatusBadge status={audit.status} />
            </div>
          </DetailCard>
          <DetailCard icon={<Clock />} title="Timeline Placeholder">
            <p className="text-sm text-muted-foreground">Request received, validated, applied, and logged timeline placeholder.</p>
          </DetailCard>
          <DetailCard icon={<ArrowRightLeft />} title="JSON Diff Placeholder">
            <p className="text-sm text-muted-foreground">Visual JSON diff placeholder for changed fields.</p>
          </DetailCard>
        </section>

        <section className="grid gap-4 lg:grid-cols-2" aria-label="Audit payload placeholders">
          <DetailCard icon={<FileJson />} title="Before Placeholder"><JsonPlaceholder label="before" /></DetailCard>
          <DetailCard icon={<FileJson />} title="After Placeholder"><JsonPlaceholder label="after" /></DetailCard>
        </section>

        <DetailCard icon={<History />} title="History Placeholder">
          <p className="text-sm text-muted-foreground">Related audit event history placeholder.</p>
        </DetailCard>
      </div>
    </PermissionGate>
  );
}
