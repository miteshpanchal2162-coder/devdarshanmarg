"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarClock, Eye, Mail, Pencil, Plus, ShieldCheck, Smartphone, Trash2, UserRound } from "lucide-react";

import { ServerPagination } from "@/components/admin/common/server-pagination";
import { AsyncQueryBoundary } from "@/components/common/async-query-boundary";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { EmptyState, ErrorState } from "@/components/ui/enterprise";
import { Form, FormActions, FormSection } from "@/components/ui/form-field";
import { Input, PasswordInput } from "@/components/ui/input";
import { AdminOnly, PermissionGate, RoleBadge, type UserRole } from "@/components/ui/permission";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUpdateUserStatus,
  useUser,
  useUsers,
} from "@/hooks/queries/use-entities";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import type { EntityRecord } from "@/services/create-crud-service";
import { formatDateTime, getBoolean, getString } from "@/utils/record-helpers";

const roleOptions = [
  { label: "All roles", value: "all" },
  { label: "Admin", value: "ADMIN" },
  { label: "User", value: "USER" },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={status === "ACTIVE" ? "success" : "secondary"}>
      {status === "ACTIVE" ? "Active" : "Inactive"}
    </Badge>
  );
}

function VerificationBadge({ verified }: { verified: boolean }) {
  return <Badge variant={verified ? "success" : "warning"}>{verified ? "Verified" : "Pending"}</Badge>;
}

function UserAvatar({ name }: { name: string }) {
  return (
    <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
      {initials(name)}
    </span>
  );
}

function UserRowActions({ record }: { record: EntityRecord }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteUser = useDeleteUser();
  const updateStatus = useUpdateUserStatus();
  const id = getString(record, "id", "");
  const name = getString(record, "fullName");
  const status = getString(record, "status");

  return (
    <div className="flex flex-wrap gap-1">
      <Button aria-label={`View ${name}`} render={<Link href={`/admin/users/${id}`} />} size="icon-sm" variant="ghost">
        <Eye />
      </Button>
      <AdminOnly>
        <Button aria-label={`Edit ${name}`} render={<Link href={`/admin/users/${id}/edit`} />} size="icon-sm" variant="ghost">
          <Pencil />
        </Button>
        <Button
          aria-label={status === "ACTIVE" ? "Deactivate user" : "Activate user"}
          disabled={updateStatus.isPending}
          onClick={() => updateStatus.mutate({ id, status: status === "ACTIVE" ? "INACTIVE" : "ACTIVE" })}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <ShieldCheck />
        </Button>
        <Button aria-label="Delete user" onClick={() => setDeleteOpen(true)} size="icon-sm" type="button" variant="ghost">
          <Trash2 />
        </Button>
        <ConfirmationDialog
          action="delete"
          message={`Delete ${name}? This action updates the database record.`}
          onConfirm={() => {
            deleteUser.mutate(id, { onSuccess: () => setDeleteOpen(false) });
          }}
          onOpenChange={setDeleteOpen}
          open={deleteOpen}
          title="Delete user"
        />
      </AdminOnly>
    </div>
  );
}

export function UserListPageContent() {
  const listParams = useListQueryParams();
  const { data, isLoading, isError, error, refetch, isFetching } = useUsers(listParams.params);

  const columns = useMemo<ColumnDef<EntityRecord>[]>(
    () => [
      { header: "Avatar", cell: ({ row }) => <UserAvatar name={getString(row.original, "fullName")} /> },
      {
        accessorKey: "fullName",
        header: "Full Name",
        cell: ({ row }) => <span className="font-medium">{getString(row.original, "fullName")}</span>,
      },
      { accessorKey: "email", header: "Email", cell: ({ row }) => getString(row.original, "email") },
      { accessorKey: "mobile", header: "Mobile", cell: ({ row }) => getString(row.original, "mobile") },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <RoleBadge role={getString(row.original, "role") as UserRole} />,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={getString(row.original, "status")} />,
      },
      {
        accessorKey: "lastLoginAt",
        header: "Last Login",
        cell: ({ row }) => formatDateTime(row.original.lastLoginAt),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => formatDateTime(row.original.createdAt),
      },
      { id: "actions", header: "Actions", cell: ({ row }) => <UserRowActions record={row.original} /> },
    ],
    [],
  );

  const rows = data?.items ?? [];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Users</p>
            <h1 className="text-3xl font-semibold tracking-tight">User Management</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage users from PostgreSQL via the users API.</p>
          </div>
          <AdminOnly>
            <Button render={<Link href="/admin/users/create" />} leftIcon={<Plus />}>
              Create User
            </Button>
          </AdminOnly>
        </header>

        <DataTable
          columns={columns}
          data={rows}
          emptyState={<EmptyState description="No users match your filters." title="No users found" />}
          error={isError ? <ErrorState description={error?.message ?? "Failed to load users."} onRetry={() => refetch()} /> : undefined}
          filters={
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <Select
                onValueChange={(value) => listParams.setFilter("role", value === "all" ? undefined : value)}
                options={roleOptions}
                placeholder="Role"
                value={(listParams.state.filters.role as string) ?? "all"}
              />
              <Select
                onValueChange={(value) => listParams.setStatus(value === "all" ? undefined : value)}
                options={statusOptions}
                placeholder="Status"
                value={listParams.state.status ?? "all"}
              />
            </div>
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

type UserFormValues = {
  fullName: string;
  email: string;
  mobile: string;
  password?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  mobileVerified: boolean;
};

export function UserFormPageContent({ mode }: { mode: "create" | "edit" }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const userId = mode === "edit" ? params.id : "";
  const { data: existing, isLoading, isError, error, refetch } = useUser(userId, mode === "edit");
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const form = useForm<UserFormValues>({
    values:
      mode === "edit" && existing
        ? {
            fullName: getString(existing, "fullName"),
            email: getString(existing, "email"),
            mobile: getString(existing, "mobile"),
            role: getString(existing, "role", "USER"),
            status: getString(existing, "status", "ACTIVE"),
            emailVerified: getBoolean(existing, "emailVerified"),
            mobileVerified: getBoolean(existing, "mobileVerified"),
          }
        : {
            fullName: "",
            email: "",
            mobile: "",
            password: "",
            role: "USER",
            status: "ACTIVE",
            emailVerified: false,
            mobileVerified: false,
          },
  });

  async function onSubmit(values: UserFormValues) {
    const payload: Record<string, unknown> = {
      fullName: values.fullName,
      email: values.email,
      mobile: values.mobile,
      role: values.role,
      status: values.status,
      emailVerified: values.emailVerified,
      mobileVerified: values.mobileVerified,
    };

    if (mode === "create") {
      payload.password = values.password;
      createUser.mutate(payload, {
        onSuccess: (record) => router.push(`/admin/users/${getString(record, "id")}`),
      });
      return;
    }

    updateUser.mutate(
      { id: userId, payload },
      { onSuccess: () => router.push(`/admin/users/${userId}`) },
    );
  }

  return (
    <AdminOnly>
      <AsyncQueryBoundary
        error={error}
        isError={mode === "edit" && isError}
        isLoading={mode === "edit" && isLoading}
        loadingLabel="Loading user..."
        onRetry={() => refetch()}
      >
        <div className="space-y-6">
          <header>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">User Management</p>
            <h1 className="text-3xl font-semibold tracking-tight">{mode === "create" ? "Create User" : "Edit User"}</h1>
          </header>

          <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormSection columns={2} description="Basic account details." title="Profile">
              <Input label="Full Name" required {...form.register("fullName", { required: true })} />
              <Input label="Email" required type="email" {...form.register("email", { required: true })} />
              <Input label="Mobile" required type="tel" {...form.register("mobile", { required: true })} />
              {mode === "create" ? (
                <PasswordInput label="Password" required {...form.register("password", { required: true, minLength: 8 })} />
              ) : null}
            </FormSection>

            <FormSection columns={2} description="Role, status, and verification flags." title="Access">
              <div className="grid gap-2">
                <span className="text-sm font-medium">Role</span>
                <Select
                  onValueChange={(value) => form.setValue("role", value, { shouldDirty: true })}
                  options={roleOptions.slice(1)}
                  placeholder="Select role"
                  value={form.watch("role")}
                />
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Status</span>
                <Select
                  onValueChange={(value) => form.setValue("status", value, { shouldDirty: true })}
                  options={statusOptions.slice(1)}
                  placeholder="Select status"
                  value={form.watch("status")}
                />
              </div>
              <Switch
                checked={form.watch("emailVerified")}
                description="Email verification flag."
                label="Email Verified"
                onCheckedChange={(checked) => form.setValue("emailVerified", checked, { shouldDirty: true })}
              />
              <Switch
                checked={form.watch("mobileVerified")}
                description="Mobile verification flag."
                label="Mobile Verified"
                onCheckedChange={(checked) => form.setValue("mobileVerified", checked, { shouldDirty: true })}
              />
            </FormSection>

            <FormActions
              canReset
              dirty={form.formState.isDirty}
              submitting={createUser.isPending || updateUser.isPending}
              onCancel={() => router.back()}
              onReset={() => form.reset()}
              sticky
              submitLabel={mode === "create" ? "Create User" : "Save Changes"}
            />
          </Form>
        </div>
      </AsyncQueryBoundary>
    </AdminOnly>
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

export function UserDetailsPageContent() {
  const params = useParams<{ id: string }>();
  const { data: user, isLoading, isError, error, refetch } = useUser(params.id);

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel="Loading user..."
        onRetry={() => refetch()}
      >
        {user ? (
          <div className="space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">User Details</p>
                <h1 className="text-3xl font-semibold tracking-tight">{getString(user, "fullName")}</h1>
              </div>
              <AdminOnly>
                <Button render={<Link href={`/admin/users/${params.id}/edit`} />} leftIcon={<Pencil />}>
                  Edit User
                </Button>
              </AdminOnly>
            </header>

            <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]" aria-label="User profile">
              <Card className="glass-panel shadow-soft">
                <CardContent className="flex flex-col items-center text-center">
                  <UserAvatar name={getString(user, "fullName")} />
                  <h2 className="mt-4 text-xl font-semibold">{getString(user, "fullName")}</h2>
                  <p className="text-sm text-muted-foreground">{getString(user, "email")}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <RoleBadge role={getString(user, "role") as UserRole} />
                    <StatusBadge status={getString(user, "status")} />
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailCard icon={<Mail />} title="Email">
                  <p>{getString(user, "email")}</p>
                  <VerificationBadge verified={getBoolean(user, "emailVerified")} />
                </DetailCard>
                <DetailCard icon={<Smartphone />} title="Mobile">
                  <p>{getString(user, "mobile")}</p>
                  <VerificationBadge verified={getBoolean(user, "mobileVerified")} />
                </DetailCard>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3" aria-label="User metadata">
              <DetailCard icon={<CalendarClock />} title="Timestamps">
                <p className="text-sm text-muted-foreground">Created: {formatDateTime(user.createdAt)}</p>
                <p className="text-sm text-muted-foreground">Updated: {formatDateTime(user.updatedAt)}</p>
              </DetailCard>
              <DetailCard icon={<ShieldCheck />} title="Last Login">
                <p className="text-sm text-muted-foreground">{formatDateTime(user.lastLoginAt)}</p>
              </DetailCard>
              <DetailCard icon={<UserRound />} title="User ID">
                <p className="text-sm text-muted-foreground">{getString(user, "id")}</p>
              </DetailCard>
            </section>
          </div>
        ) : null}
      </AsyncQueryBoundary>
    </PermissionGate>
  );
}
