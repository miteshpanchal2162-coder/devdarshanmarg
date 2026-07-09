"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Clock, Eye, FileJson, UserRound } from "lucide-react";

import { ServerPagination } from "@/components/admin/common/server-pagination";
import { AsyncQueryBoundary } from "@/components/common/async-query-boundary";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/enterprise";
import { Input } from "@/components/ui/input";
import { PermissionGate } from "@/components/ui/permission";
import { Select } from "@/components/ui/select";
import { useActivityLog, useActivityLogs } from "@/hooks/queries/use-entities";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import type { EntityRecord } from "@/services/create-crud-service";
import { formatDateTime, getString } from "@/utils/record-helpers";

const actionOptions = [
  { label: "All actions", value: "all" },
  { label: "Create", value: "CREATE" },
  { label: "Update", value: "UPDATE" },
  { label: "Delete", value: "DELETE" },
];

function AuditFilters({ listParams }: { listParams: ReturnType<typeof useListQueryParams> }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <Select
        onValueChange={(value) => listParams.setFilter("action", value === "all" ? undefined : value)}
        options={actionOptions}
        placeholder="Action"
        value={(listParams.state.filters.action as string) ?? "all"}
      />
      <Input
        aria-label="Entity type filter"
        onChange={(event) =>
          listParams.setFilter("entityType", event.target.value.trim() ? event.target.value.trim() : undefined)
        }
        placeholder="Entity type"
        value={(listParams.state.filters.entityType as string) ?? ""}
      />
      <Input
        aria-label="Created from"
        onChange={(event) => listParams.setFilter("createdFrom", event.target.value || undefined)}
        type="date"
        value={(listParams.state.filters.createdFrom as string) ?? ""}
      />
      <Input
        aria-label="Created to"
        onChange={(event) => listParams.setFilter("createdTo", event.target.value || undefined)}
        type="date"
        value={(listParams.state.filters.createdTo as string) ?? ""}
      />
    </div>
  );
}

export function ActivityLogsPageContent() {
  const listParams = useListQueryParams({ sortBy: "createdAt", sortOrder: "desc" });
  const { data, isLoading, isError, error, refetch, isFetching } = useActivityLogs(listParams.params);

  const columns = useMemo<ColumnDef<EntityRecord>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => formatDateTime(row.original.createdAt),
      },
      {
        accessorKey: "userId",
        header: "User ID",
        cell: ({ row }) => <span className="font-medium">{getString(row.original, "userId")}</span>,
      },
      { accessorKey: "action", header: "Action", cell: ({ row }) => getString(row.original, "action") },
      { accessorKey: "entityType", header: "Entity Type", cell: ({ row }) => getString(row.original, "entityType") },
      { accessorKey: "entityId", header: "Entity ID", cell: ({ row }) => getString(row.original, "entityId") },
      { accessorKey: "ipAddress", header: "IP Address", cell: ({ row }) => getString(row.original, "ipAddress") },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const id = getString(row.original, "id", "");
          return (
            <Button
              aria-label={`View activity log ${id}`}
              render={<Link href={`/admin/activity-logs/${id}`} />}
              size="icon-sm"
              variant="ghost"
            >
              <Eye />
            </Button>
          );
        },
      },
    ],
    [],
  );

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Activity & Audit Logs</p>
          <h1 className="text-3xl font-semibold tracking-tight">Activity Logs</h1>
          <p className="mt-2 text-sm text-muted-foreground">Read-only audit trail from PostgreSQL via the activity-logs API.</p>
        </header>

        <DataTable
          columns={columns}
          data={data?.items ?? []}
          emptyState={<EmptyState description="No activity logs match your filters." title="No activity logs found" />}
          error={
            isError ? (
              <ErrorState description={error?.message ?? "Failed to load activity logs."} onRetry={() => void refetch()} />
            ) : undefined
          }
          filters={<AuditFilters listParams={listParams} />}
          loading={isLoading}
          onRefresh={() => refetch()}
          refreshLoading={isFetching}
          searchPlaceholder="Search activity logs..."
        />

        <ServerPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
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

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
      {JSON.stringify(value ?? {}, null, 2)}
    </pre>
  );
}

export function AuditDetailsPageContent() {
  const params = useParams<{ id: string }>();
  const { data: audit, isLoading, isError, error, refetch } = useActivityLog(params.id);

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel="Loading activity log..."
        onRetry={() => refetch()}
      >
        {audit ? (
          <div className="space-y-6">
            <header>
              <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Audit Details</p>
              <h1 className="text-3xl font-semibold tracking-tight">
                {getString(audit, "action")} · {getString(audit, "entityType")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatDateTime(audit.createdAt)} · {getString(audit, "ipAddress")}
              </p>
            </header>

            <section className="grid gap-4 lg:grid-cols-3" aria-label="Audit overview">
              <DetailCard icon={<UserRound />} title="Overview">
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">User ID:</span> {getString(audit, "userId")}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Entity ID:</span> {getString(audit, "entityId")}
                  </p>
                  <Badge variant="secondary">{getString(audit, "action")}</Badge>
                </div>
              </DetailCard>
              <DetailCard icon={<Clock />} title="Timestamp">
                <p className="text-sm text-muted-foreground">{formatDateTime(audit.createdAt)}</p>
              </DetailCard>
              <DetailCard icon={<FileJson />} title="Log ID">
                <p className="text-sm text-muted-foreground">{getString(audit, "id")}</p>
              </DetailCard>
            </section>

            <DetailCard icon={<FileJson />} title="Details">
              <JsonBlock value={audit.details} />
            </DetailCard>
          </div>
        ) : null}
      </AsyncQueryBoundary>
    </PermissionGate>
  );
}
