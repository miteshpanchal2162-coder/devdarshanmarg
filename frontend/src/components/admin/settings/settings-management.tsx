"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { Bell, DatabaseBackup, Globe2, ImageIcon, Info, Languages, LockKeyhole, Mail, Palette, SearchCheck, Settings, ShieldCheck, Type } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Form, FormActions, FormSection } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { AdminOnly, PermissionGate, RoleBadge } from "@/components/ui/permission";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export type SettingsSection =
  | "general"
  | "site"
  | "seo"
  | "localization"
  | "languages"
  | "media-types"
  | "content-types"
  | "notifications"
  | "email"
  | "security"
  | "backup-maintenance"
  | "about";

const sections: Array<{ label: string; value: SettingsSection; href: string; icon: React.ReactNode }> = [
  { label: "General Settings", value: "general", href: "/admin/settings", icon: <Settings /> },
  { label: "Site Settings", value: "site", href: "/admin/settings/site", icon: <Palette /> },
  { label: "SEO Settings", value: "seo", href: "/admin/settings/seo", icon: <SearchCheck /> },
  { label: "Localization", value: "localization", href: "/admin/settings/localization", icon: <Globe2 /> },
  { label: "Supported Languages", value: "languages", href: "/admin/settings/languages", icon: <Languages /> },
  { label: "Media Types", value: "media-types", href: "/admin/settings/media-types", icon: <ImageIcon /> },
  { label: "Content Types", value: "content-types", href: "/admin/settings/content-types", icon: <Type /> },
  { label: "Notification Settings", value: "notifications", href: "/admin/settings/notifications", icon: <Bell /> },
  { label: "Email Settings", value: "email", href: "/admin/settings/email", icon: <Mail /> },
  { label: "Security Settings", value: "security", href: "/admin/settings/security", icon: <LockKeyhole /> },
  { label: "Backup & Maintenance", value: "backup-maintenance", href: "/admin/settings/backup-maintenance", icon: <DatabaseBackup /> },
  { label: "About System", value: "about", href: "/admin/settings/about", icon: <Info /> },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

type SettingsFormValues = {
  name: string;
  description: string;
  email: string;
};

function SettingsNav({ active }: { active: SettingsSection }) {
  return (
    <nav aria-label="Settings sections" className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
      {sections.map((section) => (
        <Link
          aria-current={active === section.value ? "page" : undefined}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-sm shadow-soft transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring aria-current:border-primary aria-current:bg-primary/10"
          href={section.href}
          key={section.value}
        >
          <span className="text-primary [&_svg]:size-4">{section.icon}</span>
          <span className="font-medium">{section.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function SettingsFormCard({
  description,
  icon,
  title,
  children,
}: {
  description: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      name: title,
      description,
      email: "admin@devdarshan.in",
    },
  });

  return (
    <Form {...form} onSubmit={(event) => event.preventDefault()}>
      <FormSection
        action={<Badge variant="secondary">Dummy Data</Badge>}
        columns={2}
        description={description}
        title={title}
      >
        <div className="md:col-span-2">
          <Card className="border-dashed" variant="outlined">
            <CardContent className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">{icon}</span>
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">UI-only settings placeholder. No API or backend connection.</p>
              </div>
            </CardContent>
          </Card>
        </div>
        {children}
      </FormSection>
      <FormActions canReset dirty={form.formState.isDirty} onCancel={() => undefined} onReset={() => form.reset()} sticky submitLabel="Save placeholder" />
    </Form>
  );
}

type TableRow = {
  name: string;
  code: string;
  status: string;
};

const tableRows: TableRow[] = [
  { name: "English", code: "en", status: "Active" },
  { name: "Hindi", code: "hi", status: "Active" },
  { name: "Gujarati", code: "gu", status: "Active" },
];

const tableColumns: ColumnDef<TableRow>[] = [
  { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  { accessorKey: "code", header: "Code" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant="success">{row.original.status}</Badge> },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <AdminOnly>
        <Button size="sm" type="button" variant="outline">Manage</Button>
      </AdminOnly>
    ),
  },
];

function SettingsTable({ title }: { title: string }) {
  return (
    <Card className="glass-panel shadow-soft">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={tableColumns}
          data={tableRows}
          enableRowSelection={false}
          exportPlaceholder={() => undefined}
          onRefresh={() => undefined}
          searchPlaceholder={`Search ${title.toLowerCase()}...`}
        />
      </CardContent>
    </Card>
  );
}

function AboutSystem() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {[
        ["Version", "0.1.0"],
        ["Framework", "Next.js 15"],
        ["Mode", "UI Only"],
      ].map(([label, value]) => (
        <Card className="glass-panel shadow-soft" key={label}>
          <CardContent>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SectionBody({ section }: { section: SettingsSection }) {
  if (section === "languages") return <SettingsTable title="Supported Languages" />;
  if (section === "media-types") return <SettingsTable title="Media Types" />;
  if (section === "content-types") return <SettingsTable title="Content Types" />;
  if (section === "about") return <AboutSystem />;

  const config = {
    general: { title: "General Settings", description: "Application-wide defaults.", icon: <Settings /> },
    site: { title: "Site Settings", description: "Branding and public site placeholders.", icon: <Palette /> },
    seo: { title: "SEO Settings", description: "Default metadata and indexing placeholders.", icon: <SearchCheck /> },
    localization: { title: "Localization", description: "Timezone, locale, and formatting placeholders.", icon: <Globe2 /> },
    notifications: { title: "Notification Settings", description: "Admin notification preference placeholders.", icon: <Bell /> },
    email: { title: "Email Settings", description: "Sender and SMTP placeholders.", icon: <Mail /> },
    security: { title: "Security Settings", description: "Session, password, and policy placeholders.", icon: <ShieldCheck /> },
    "backup-maintenance": { title: "Backup & Maintenance", description: "Backup, cleanup, and maintenance placeholders.", icon: <DatabaseBackup /> },
  }[section];

  return (
    <SettingsFormCard description={config.description} icon={config.icon} title={config.title}>
      <Input label="Setting Name" defaultValue={config.title} />
      <Select options={statusOptions} placeholder="Status" />
      <Input label="Contact Email" defaultValue="admin@devdarshan.in" type="email" />
      <Switch label="Enabled" description="Toggle placeholder for this settings group." defaultChecked />
      <Textarea label="Description" defaultValue={config.description} wrapperClassName="md:col-span-2" />
    </SettingsFormCard>
  );
}

export function SettingsPageContent({ section = "general" }: { section?: SettingsSection }) {
  const current = sections.find((item) => item.value === section) ?? sections[0];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">System Settings</p>
            <h1 className="text-3xl font-semibold tracking-tight">{current.label}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Settings UI with dummy data and placeholder persistence only.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RoleBadge />
            <Badge variant="outline">UI Only</Badge>
          </div>
        </header>
        <SettingsNav active={current.value} />
        <SectionBody section={current.value} />
      </div>
    </PermissionGate>
  );
}
