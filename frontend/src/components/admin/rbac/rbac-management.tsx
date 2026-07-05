"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye, Pencil, Plus, ShieldCheck, Trash2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DataTable } from "@/components/ui/data-table";
import { Form, FormActions, FormSection } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { AdminOnly, PermissionGate, RoleBadge } from "@/components/ui/permission";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type RoleStatus = "ACTIVE" | "INACTIVE";
type RoleRecord = {
  id: string;
  roleName: string;
  roleCode: string;
  description: string;
  usersCount: number;
  status: RoleStatus;
};

const roles: RoleRecord[] = [
  {
    id: "role-001",
    roleName: "Super Admin",
    roleCode: "SUPER_ADMIN",
    description: "Full access to all admin modules.",
    usersCount: 2,
    status: "ACTIVE",
  },
  {
    id: "role-002",
    roleName: "Content Manager",
    roleCode: "CONTENT_MANAGER",
    description: "Manages content, media, and publishing workflows.",
    usersCount: 6,
    status: "ACTIVE",
  },
  {
    id: "role-003",
    roleName: "Reviewer",
    roleCode: "REVIEWER",
    description: "Reviews records and approves selected changes.",
    usersCount: 4,
    status: "INACTIVE",
  },
];

const permissionCategories = [
  "Dashboard",
  "Users",
  "Content",
  "Temples",
  "Festivals",
  "Deities",
  "Panchang",
  "Media",
  "Settings",
  "Roles",
  "Notifications",
  "Audit Logs",
] as const;

const permissionTypes = [
  "View",
  "Create",
  "Update",
  "Delete",
  "Publish",
  "Approve",
  "Import",
  "Export",
  "Manage",
] as const;

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

function RoleStatusBadge({ status }: { status: RoleStatus }) {
  return <Badge variant={status === "ACTIVE" ? "success" : "secondary"}>{status}</Badge>;
}

export function PermissionMatrix({ readOnly = false }: { readOnly?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[56rem] text-sm">
        <caption className="sr-only">Permission matrix</caption>
        <thead className="border-b bg-muted/50 text-caption uppercase tracking-[0.16em] text-muted-foreground">
          <tr>
            <th className="p-3 text-left" scope="col">Category</th>
            {permissionTypes.map((type) => (
              <th className="p-3 text-center" key={type} scope="col">{type}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">
          {permissionCategories.map((category, categoryIndex) => (
            <tr key={category}>
              <th className="p-3 text-left font-medium" scope="row">{category}</th>
              {permissionTypes.map((type, typeIndex) => (
                <td className="p-3 text-center" key={`${category}-${type}`}>
                  <Checkbox
                    aria-label={`${category} ${type}`}
                    checked={categoryIndex < 3 || typeIndex === 0}
                    disabled={readOnly}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoleActionButtons({ role }: { role: RoleRecord }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-1">
      <Button aria-label={`View ${role.roleName}`} render={<Link href={`/roles/${role.id}`} />} size="icon-sm" variant="ghost"><Eye /></Button>
      <AdminOnly>
        <Button aria-label={`Edit ${role.roleName}`} render={<Link href={`/roles/${role.id}/edit`} />} size="icon-sm" variant="ghost"><Pencil /></Button>
        <Button aria-label="Clone role placeholder" onClick={() => setCloneOpen(true)} size="icon-sm" type="button" variant="ghost"><Copy /></Button>
        <Button aria-label="Delete role placeholder" onClick={() => setDeleteOpen(true)} size="icon-sm" type="button" variant="ghost"><Trash2 /></Button>
        <ConfirmationDialog
          action="delete"
          message="Delete role placeholder only. No data will be changed."
          onConfirm={() => setDeleteOpen(false)}
          onOpenChange={setDeleteOpen}
          open={deleteOpen}
          title="Delete role"
        />
        <ConfirmationDialog
          action="restore"
          confirmLabel="Clone"
          message="Clone role placeholder only. No data will be changed."
          onConfirm={() => setCloneOpen(false)}
          onOpenChange={setCloneOpen}
          open={cloneOpen}
          title="Clone role"
        />
      </AdminOnly>
    </div>
  );
}

const columns: ColumnDef<RoleRecord>[] = [
  { accessorKey: "roleName", header: "Role Name", cell: ({ row }) => <span className="font-medium">{row.original.roleName}</span> },
  { accessorKey: "roleCode", header: "Role Code" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "usersCount", header: "Users Count" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <RoleStatusBadge status={row.original.status} /> },
  { id: "actions", header: "Actions", cell: ({ row }) => <RoleActionButtons role={row.original} /> },
];

export function RoleListPageContent() {
  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">RBAC</p>
            <h1 className="text-3xl font-semibold tracking-tight">Roles</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage role definitions and permission assignments with dummy data.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RoleBadge />
            <AdminOnly>
              <Button render={<Link href="/admin/roles/create" />} leftIcon={<Plus />}>Create Role</Button>
            </AdminOnly>
          </div>
        </header>
        <DataTable
          columns={columns}
          data={roles}
          exportPlaceholder={() => undefined}
          onRefresh={() => undefined}
          searchPlaceholder="Search roles..."
        />
      </div>
    </PermissionGate>
  );
}

type RoleFormValues = {
  roleName: string;
  roleCode: string;
  description: string;
};

export function RoleFormPageContent({ mode }: { mode: "create" | "edit" }) {
  const existing = roles[0];
  const form = useForm<RoleFormValues>({
    defaultValues:
      mode === "edit"
        ? { roleName: existing.roleName, roleCode: existing.roleCode, description: existing.description }
        : { roleName: "", roleCode: "", description: "" },
  });

  return (
    <AdminOnly>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">RBAC</p>
          <h1 className="text-3xl font-semibold tracking-tight">{mode === "create" ? "Create Role" : "Edit Role"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">UI-only role form with reusable permission matrix.</p>
        </header>
        <Form {...form} onSubmit={(event) => event.preventDefault()}>
          <FormSection columns={2} title="Role Details" description="Role metadata and status.">
            <Input label="Role Name" required {...form.register("roleName")} />
            <Input label="Role Code" required {...form.register("roleCode")} />
            <Select options={statusOptions} placeholder="Status" />
            <Textarea label="Description" required wrapperClassName="md:col-span-2" {...form.register("description")} />
          </FormSection>
          <FormSection title="Permissions" description="Assign capabilities by module and action." divider={false}>
            <PermissionMatrix />
          </FormSection>
          <FormActions canReset dirty={form.formState.isDirty} onCancel={() => undefined} onReset={() => form.reset()} sticky submitLabel={mode === "create" ? "Create placeholder" : "Save placeholder"} />
        </Form>
      </div>
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

export function RoleDetailsPageContent() {
  const role = roles[0];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Role Details</p>
            <h1 className="text-3xl font-semibold tracking-tight">{role.roleName}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{role.roleCode}</p>
          </div>
          <AdminOnly>
            <Button render={<Link href={`/roles/${role.id}/edit`} />} leftIcon={<Pencil />}>Edit Role</Button>
          </AdminOnly>
        </header>
        <section className="grid gap-4 lg:grid-cols-3" aria-label="Role overview">
          <DetailCard icon={<ShieldCheck />} title="Overview">
            <p className="text-sm text-muted-foreground">{role.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <RoleStatusBadge status={role.status} />
              <Badge variant="info">{role.usersCount} users</Badge>
            </div>
          </DetailCard>
          <DetailCard icon={<Users />} title="Assigned Users Placeholder">
            <p className="text-sm text-muted-foreground">Assigned user list placeholder only.</p>
          </DetailCard>
          <DetailCard icon={<Copy />} title="Clone Placeholder">
            <p className="text-sm text-muted-foreground">Role clone action remains UI-only.</p>
          </DetailCard>
        </section>
        <Card className="glass-panel shadow-soft">
          <CardHeader>
            <CardTitle>Assigned Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <PermissionMatrix readOnly />
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
}

export function PermissionsPageContent() {
  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">RBAC</p>
            <h1 className="text-3xl font-semibold tracking-tight">Permissions</h1>
            <p className="mt-2 text-sm text-muted-foreground">Reusable permission matrix across admin modules.</p>
          </div>
          <RoleBadge />
        </header>
        <Card className="glass-panel shadow-soft">
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <PermissionMatrix />
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
}
