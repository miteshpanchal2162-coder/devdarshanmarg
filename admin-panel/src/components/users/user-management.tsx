"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarClock, Eye, KeyRound, Mail, Pencil, Plus, ShieldCheck, Smartphone, Trash2, UserRound } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormActions, FormSection } from "@/components/ui/form-field";
import { Input, PasswordInput } from "@/components/ui/input";
import { AdminOnly, PermissionGate, RoleBadge, type UserRole } from "@/components/ui/permission";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type UserStatus = "ACTIVE" | "INACTIVE";
type UserRecord = {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  mobileVerified: boolean;
  lastLogin: string;
  createdDate: string;
};

const users: UserRecord[] = [
  {
    id: "usr-001",
    fullName: "Aarav Sharma",
    email: "aarav.admin@devdarshan.in",
    mobile: "9876543210",
    role: "ADMIN",
    status: "ACTIVE",
    emailVerified: true,
    mobileVerified: true,
    lastLogin: "Today, 09:42 AM",
    createdDate: "12 Jan 2026",
  },
  {
    id: "usr-002",
    fullName: "Meera Iyer",
    email: "meera.user@devdarshan.in",
    mobile: "9876501234",
    role: "USER",
    status: "ACTIVE",
    emailVerified: true,
    mobileVerified: false,
    lastLogin: "Yesterday",
    createdDate: "04 Feb 2026",
  },
  {
    id: "usr-003",
    fullName: "Rohan Trivedi",
    email: "rohan.reviewer@devdarshan.in",
    mobile: "9765432109",
    role: "USER",
    status: "INACTIVE",
    emailVerified: false,
    mobileVerified: true,
    lastLogin: "18 Jun 2026",
    createdDate: "28 Mar 2026",
  },
];

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

const verifiedOptions = [
  { label: "Any", value: "all" },
  { label: "Verified", value: "verified" },
  { label: "Not verified", value: "unverified" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatusBadge({ status }: { status: UserStatus }) {
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

function UserFilters() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      <Select options={roleOptions} placeholder="Role" />
      <Select options={statusOptions} placeholder="Status" />
      <Select options={verifiedOptions} placeholder="Email verified" />
      <Select options={verifiedOptions} placeholder="Mobile verified" />
    </div>
  );
}

const columns: ColumnDef<UserRecord>[] = [
  {
    header: "Avatar",
    cell: ({ row }) => <UserAvatar name={row.original.fullName} />,
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => <span className="font-medium">{row.original.fullName}</span>,
  },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "mobile", header: "Mobile" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <RoleBadge role={row.original.role} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  { accessorKey: "lastLogin", header: "Last Login" },
  { accessorKey: "createdDate", header: "Created Date" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        <Button aria-label={`View ${row.original.fullName}`} render={<Link href={`/users/${row.original.id}`} />} size="icon-sm" variant="ghost">
          <Eye />
        </Button>
        <AdminOnly>
          <Button aria-label={`Edit ${row.original.fullName}`} render={<Link href={`/users/${row.original.id}/edit`} />} size="icon-sm" variant="ghost">
            <Pencil />
          </Button>
          <Button aria-label="Reset password placeholder" size="icon-sm" type="button" variant="ghost">
            <KeyRound />
          </Button>
          <Button aria-label="Delete user placeholder" size="icon-sm" type="button" variant="ghost">
            <Trash2 />
          </Button>
        </AdminOnly>
      </div>
    ),
  },
];

export function UserListPageContent() {
  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Module 4</p>
            <h1 className="text-3xl font-semibold tracking-tight">User Management</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage admin users with dummy data and UI-only actions.</p>
          </div>
          <AdminOnly>
            <Button render={<Link href="/users/create" />} leftIcon={<Plus />}>
              Create User
            </Button>
          </AdminOnly>
        </header>

        <DataTable
          bulkActions={
            <AdminOnly>
              <Button size="sm" type="button" variant="destructive">Delete</Button>
              <Button size="sm" type="button" variant="outline">Activate</Button>
              <Button size="sm" type="button" variant="outline">Deactivate</Button>
            </AdminOnly>
          }
          columns={columns}
          data={users}
          exportPlaceholder={() => undefined}
          filters={<UserFilters />}
          onRefresh={() => undefined}
          searchPlaceholder="Search users..."
        />
      </div>
    </PermissionGate>
  );
}

type UserFormValues = {
  fullName: string;
  email: string;
  mobile: string;
  password?: string;
};

export function UserFormPageContent({ mode }: { mode: "create" | "edit" }) {
  const existingUser = users[0];
  const form = useForm<UserFormValues>({
    defaultValues: mode === "edit" ? existingUser : { fullName: "", email: "", mobile: "", password: "" },
  });

  return (
    <AdminOnly>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">User Management</p>
          <h1 className="text-3xl font-semibold tracking-tight">{mode === "create" ? "Create User" : "Edit User"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">UI-only form. No authentication, API, or database connection.</p>
        </header>

        <Form {...form} onSubmit={(event) => event.preventDefault()}>
          <FormSection columns={2} description="Basic account details and profile placeholder." title="Profile">
            <Input label="Full Name" required {...form.register("fullName")} />
            <Input label="Email" required type="email" {...form.register("email")} />
            <Input label="Mobile" required type="tel" {...form.register("mobile")} />
            {mode === "create" ? <PasswordInput label="Password" required {...form.register("password")} /> : null}
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-5 text-center text-sm text-muted-foreground md:col-span-2">
              Profile image placeholder
            </div>
          </FormSection>

          <FormSection columns={2} description="Role, status, and verification flags." title="Access">
            <div className="grid gap-2">
              <span className="text-sm font-medium">Role</span>
              <Select options={roleOptions.slice(1)} placeholder="Select role" />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium">Status</span>
              <Select options={statusOptions.slice(1)} placeholder="Select status" />
            </div>
            <Switch label="Email Verified" description="UI-only verification flag." defaultChecked={mode === "edit"} />
            <Switch label="Mobile Verified" description="UI-only verification flag." defaultChecked={mode === "edit"} />
          </FormSection>

          <FormActions
            canReset
            dirty={form.formState.isDirty}
            onCancel={() => undefined}
            onReset={() => form.reset()}
            sticky
            submitLabel={mode === "create" ? "Create placeholder" : "Save placeholder"}
          />
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

export function UserDetailsPageContent() {
  const user = users[0];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">User Details</p>
            <h1 className="text-3xl font-semibold tracking-tight">{user.fullName}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Profile, activity, login history, and preferences placeholders.</p>
          </div>
          <AdminOnly>
            <Button render={<Link href={`/users/${user.id}/edit`} />} leftIcon={<Pencil />}>
              Edit User
            </Button>
          </AdminOnly>
        </header>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]" aria-label="User profile">
          <Card className="glass-panel shadow-soft">
            <CardContent className="flex flex-col items-center text-center">
              <UserAvatar name={user.fullName} />
              <h2 className="mt-4 text-xl font-semibold">{user.fullName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailCard icon={<Mail />} title="Email">
              <p>{user.email}</p>
              <VerificationBadge verified={user.emailVerified} />
            </DetailCard>
            <DetailCard icon={<Smartphone />} title="Mobile">
              <p>{user.mobile}</p>
              <VerificationBadge verified={user.mobileVerified} />
            </DetailCard>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3" aria-label="User activity placeholders">
          <DetailCard icon={<CalendarClock />} title="Activity">
            <p className="text-sm text-muted-foreground">Recent activity placeholder for audit events.</p>
          </DetailCard>
          <DetailCard icon={<ShieldCheck />} title="Login History">
            <p className="text-sm text-muted-foreground">Last login: {user.lastLogin}</p>
          </DetailCard>
          <DetailCard icon={<UserRound />} title="Notification Preferences">
            <p className="text-sm text-muted-foreground">Email and mobile preference placeholders.</p>
          </DetailCard>
        </section>
      </div>
    </PermissionGate>
  );
}
