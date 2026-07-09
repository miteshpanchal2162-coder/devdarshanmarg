"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, ShieldCheck, Users } from "lucide-react";

import { AsyncQueryBoundary } from "@/components/common/async-query-boundary";
import { ServerPagination } from "@/components/admin/common/server-pagination";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/enterprise";
import { PermissionGate, RoleBadge, type UserRole } from "@/components/ui/permission";
import { useUsers } from "@/hooks/queries/use-entities";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import type { EntityRecord } from "@/services/create-crud-service";
import { formatCount, getString } from "@/utils/record-helpers";

const KNOWN_ROLES: UserRole[] = ["ADMIN", "USER"];

type RoleSummary = {
  role: UserRole;
  label: string;
  description: string;
  usersCount: number;
};

function RoleCountCard({ role }: { role: RoleSummary }) {
  return (
    <Card className="glass-panel shadow-soft">
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <RoleBadge role={role.role} />
          <Badge variant="info">{formatCount(role.usersCount)} users</Badge>
        </div>
        <div>
          <h2 className="text-xl font-semibold">{role.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
        </div>
        <Button render={<Link href={`/admin/roles/${role.role}`} />} size="sm" variant="outline">
          View users
        </Button>
      </CardContent>
    </Card>
  );
}

export function RoleListPageContent() {
  const adminQuery = useUsers({ page: 1, limit: 1, filters: { role: "ADMIN" } });
  const userQuery = useUsers({ page: 1, limit: 1, filters: { role: "USER" } });

  const roles: RoleSummary[] = [
    {
      role: "ADMIN",
      label: "Administrator",
      description: "Full admin access enforced server-side via JWT role.",
      usersCount: adminQuery.data?.meta.total ?? 0,
    },
    {
      role: "USER",
      label: "Standard User",
      description: "Default application user role from the users API.",
      usersCount: userQuery.data?.meta.total ?? 0,
    },
  ];

  const isLoading = adminQuery.isLoading || userQuery.isLoading;
  const isError = adminQuery.isError || userQuery.isError;
  const error = adminQuery.error ?? userQuery.error;

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">RBAC</p>
          <h1 className="text-3xl font-semibold tracking-tight">Roles</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Role assignments are stored on user records. There is no separate roles API.
          </p>
        </header>

        {isError ? (
          <ErrorState
            description={error?.message ?? "Failed to load role counts."}
            onRetry={() => {
              void adminQuery.refetch();
              void userQuery.refetch();
            }}
          />
        ) : isLoading ? (
          <p className="text-sm text-muted-foreground">Loading role counts...</p>
        ) : (
          <section className="grid gap-4 md:grid-cols-2" aria-label="Role summaries">
            {roles.map((role) => (
              <RoleCountCard key={role.role} role={role} />
            ))}
          </section>
        )}
      </div>
    </PermissionGate>
  );
}

export function RoleFormPageContent(_props: { mode?: "create" | "edit" }) {
  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <EmptyState
        description="Roles are derived from the user.role field (ADMIN or USER). Create or edit users to change role assignments."
        icon={<ShieldCheck />}
        primaryAction={<Button render={<Link href="/admin/users" />} variant="outline">Go to Users</Button>}
        title="No roles API"
      />
    </PermissionGate>
  );
}

export function RoleDetailsPageContent() {
  const params = useParams<{ id: string }>();
  const role = KNOWN_ROLES.includes(params.id as UserRole) ? (params.id as UserRole) : null;
  const listParams = useListQueryParams({ filters: role ? { role } : {} });
  const { data, isLoading, isError, error, refetch, isFetching } = useUsers(listParams.params);

  const columns = useMemo<ColumnDef<EntityRecord>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Full Name",
        cell: ({ row }) => <span className="font-medium">{getString(row.original, "fullName")}</span>,
      },
      { accessorKey: "email", header: "Email", cell: ({ row }) => getString(row.original, "email") },
      { accessorKey: "status", header: "Status", cell: ({ row }) => getString(row.original, "status") },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const id = getString(row.original, "id", "");
          return (
            <Button
              aria-label={`View user ${getString(row.original, "fullName")}`}
              render={<Link href={`/admin/users/${id}`} />}
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

  if (!role) {
    return (
      <PermissionGate allowedRoles={["ADMIN"]}>
        <EmptyState
          description="Open a role from the roles page to see users assigned to ADMIN or USER."
          title="Unknown role"
        />
      </PermissionGate>
    );
  }

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Role Details</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">{role} Role</h1>
            <RoleBadge role={role} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Users assigned to this role from the users API.</p>
        </header>

        <DataTable
          columns={columns}
          data={data?.items ?? []}
          emptyState={<EmptyState description={`No users are assigned the ${role} role.`} title="No users found" />}
          error={
            isError ? (
              <ErrorState description={error?.message ?? "Failed to load users."} onRetry={() => void refetch()} />
            ) : undefined
          }
          loading={isLoading}
          onRefresh={() => refetch()}
          refreshLoading={isFetching}
          searchPlaceholder="Search users..."
        />

        <ServerPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
      </div>
    </PermissionGate>
  );
}

export function PermissionsPageContent() {
  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">RBAC</p>
          <h1 className="text-3xl font-semibold tracking-tight">Permissions</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access control is enforced server-side via JWT role claims. There is no editable permission matrix API.
          </p>
        </header>

        <Card className="glass-panel shadow-soft">
          <CardHeader className="flex flex-row items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-4">
              <ShieldCheck />
            </span>
            <CardTitle>Server-side RBAC</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Admin routes require an authenticated user with role <strong>ADMIN</strong>. Standard users receive role{" "}
              <strong>USER</strong> and cannot access admin modules.
            </p>
            <p>
              To change access, update a user&apos;s role on the{" "}
              <Link className="text-primary underline-offset-4 hover:underline" href="/admin/users">
                Users
              </Link>{" "}
              page. Permission checks are applied in NestJS guards and cannot be edited from this screen.
            </p>
            <div className="flex flex-wrap gap-2">
              <RoleBadge role="ADMIN" />
              <RoleBadge role="USER" />
            </div>
          </CardContent>
        </Card>

        <EmptyState
          description="No permission matrix is exposed by the backend. Role-based access is read-only here."
          icon={<Users />}
          title="No permission configuration API"
        />
      </div>
    </PermissionGate>
  );
}
