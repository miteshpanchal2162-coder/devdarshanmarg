"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { Activity, BookOpen, Eye, History, ImageIcon, KeyRound, Link2, Pencil, Plus, SearchCheck, ShieldCheck, Sparkles, Star, Trash2, Users } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormActions, FormSection } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { AdminOnly, PermissionGate, RoleBadge } from "@/components/ui/permission";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type DeityStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";
type DeityRecord = {
  id: string;
  name: string;
  deityCode: string;
  type: string;
  status: DeityStatus;
  featured: boolean;
  popular: boolean;
};

const deities: DeityRecord[] = [
  { id: "deity-001", name: "Lord Shiva", deityCode: "DEITY-SHIVA-001", type: "Deva", status: "ACTIVE", featured: true, popular: true },
  { id: "deity-002", name: "Maa Durga", deityCode: "DEITY-DURGA-002", type: "Devi", status: "ACTIVE", featured: true, popular: true },
  { id: "deity-003", name: "Lord Ganesha", deityCode: "DEITY-GANESHA-003", type: "Deva", status: "DRAFT", featured: false, popular: true },
];

const typeOptions = [
  { label: "All types", value: "all" },
  { label: "Deva", value: "deva" },
  { label: "Devi", value: "devi" },
  { label: "Avatar", value: "avatar" },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Draft", value: "DRAFT" },
  { label: "Archived", value: "ARCHIVED" },
];

const booleanOptions = [
  { label: "Any", value: "all" },
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const tabs = [
  "General",
  "Profile",
  "Avatars",
  "Relations",
  "Symbols",
  "Attributes",
  "Blessings",
  "Associations",
  "Festivals",
  "External Links",
  "SEO",
  "Statistics",
  "Change History",
] as const;

function tabValue(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

function DeityStatusBadge({ status }: { status: DeityStatus }) {
  const variant = status === "ACTIVE" ? "success" : status === "DRAFT" ? "warning" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

function DeityImage() {
  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Sparkles className="size-5" />
    </span>
  );
}

function DeityFilters() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <Select options={typeOptions} placeholder="Deity Type" />
      <Select options={statusOptions} placeholder="Status" />
      <Select options={booleanOptions} placeholder="Featured" />
      <Select options={booleanOptions} placeholder="Popular" />
    </div>
  );
}

const columns: ColumnDef<DeityRecord>[] = [
  { header: "Image", cell: () => <DeityImage /> },
  { accessorKey: "name", header: "Deity Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  { accessorKey: "deityCode", header: "Deity Code" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <DeityStatusBadge status={row.original.status} /> },
  { accessorKey: "featured", header: "Featured", cell: ({ row }) => <Badge variant={row.original.featured ? "success" : "secondary"}>{row.original.featured ? "Yes" : "No"}</Badge> },
  { accessorKey: "popular", header: "Popular", cell: ({ row }) => <Badge variant={row.original.popular ? "info" : "secondary"}>{row.original.popular ? "Yes" : "No"}</Badge> },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        <Button aria-label={`View ${row.original.name}`} render={<Link href={`/deities/${row.original.id}`} />} size="icon-sm" variant="ghost"><Eye /></Button>
        <AdminOnly>
          <Button aria-label={`Edit ${row.original.name}`} render={<Link href={`/deities/${row.original.id}/edit`} />} size="icon-sm" variant="ghost"><Pencil /></Button>
          <Button aria-label="Preview placeholder" size="icon-sm" type="button" variant="ghost"><SearchCheck /></Button>
          <Button aria-label="Delete placeholder" size="icon-sm" type="button" variant="ghost"><Trash2 /></Button>
        </AdminOnly>
      </div>
    ),
  },
];

export function DeityListPageContent() {
  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Module 6</p>
            <h1 className="text-3xl font-semibold tracking-tight">Deity Management</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage deity records with dummy data and placeholder actions.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RoleBadge />
            <AdminOnly>
              <Button render={<Link href="/deities/create" />} leftIcon={<Plus />}>Create Deity</Button>
            </AdminOnly>
          </div>
        </header>
        <DataTable
          bulkActions={
            <AdminOnly>
              <Button size="sm" type="button" variant="destructive">Delete</Button>
              <Button size="sm" type="button" variant="outline">Feature</Button>
              <Button size="sm" type="button" variant="outline">Archive</Button>
            </AdminOnly>
          }
          columns={columns}
          data={deities}
          exportPlaceholder={() => undefined}
          filters={<DeityFilters />}
          onRefresh={() => undefined}
          searchPlaceholder="Search deities..."
        />
      </div>
    </PermissionGate>
  );
}

function PlaceholderPanel({ description, icon, title }: { description: string; icon: React.ReactNode; title: string }) {
  return (
    <Card className="border-dashed" variant="outlined">
      <CardContent className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">{icon}</span>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TablePlaceholder({ title, keyValue = false }: { title: string; keyValue?: boolean }) {
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
            <td className="p-3 font-medium">{keyValue ? "Symbolic attribute" : `${title} sample`}</td>
            <td className="p-3">{keyValue ? "Placeholder value" : `DEITY-${title.toUpperCase().slice(0, 4)}-001`}</td>
            <td className="p-3"><Badge variant="secondary">Placeholder</Badge></td>
            <td className="p-3 text-right"><Button size="sm" type="button" variant="outline">Manage</Button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

type DeityFormValues = {
  deityCode: string;
  name: string;
  slug: string;
  description: string;
};

export function DeityFormPageContent({ mode }: { mode: "create" | "edit" }) {
  const existing = deities[0];
  const form = useForm<DeityFormValues>({
    defaultValues:
      mode === "edit"
        ? { deityCode: existing.deityCode, name: existing.name, slug: "lord-shiva", description: "Deity description placeholder." }
        : { deityCode: "", name: "", slug: "", description: "" },
  });

  return (
    <AdminOnly>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Deity Management</p>
          <h1 className="text-3xl font-semibold tracking-tight">{mode === "create" ? "Create Deity" : "Edit Deity"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">UI-only deity workflow with placeholders for all child sections.</p>
        </header>
        <Form {...form} onSubmit={(event) => event.preventDefault()}>
          <Tabs defaultValue="general">
            <div className="overflow-x-auto pb-2">
              <TabsList className="min-w-max" variant="line">
                {tabs.map((label) => <TabsTrigger key={label} value={tabValue(label)}>{label}</TabsTrigger>)}
              </TabsList>
            </div>

            <TabsContent value="general">
              <FormSection columns={2} title="General" description="Core deity information.">
                <Input label="Deity Code" required {...form.register("deityCode")} />
                <Input label="Name" required {...form.register("name")} />
                <Input label="Slug" required {...form.register("slug")} />
                <Select options={typeOptions.slice(1)} placeholder="Type" />
                <Textarea label="Description" required wrapperClassName="md:col-span-2" {...form.register("description")} />
                <Select options={statusOptions.slice(1)} placeholder="Status" />
                <Switch label="Featured" description="Feature this deity in prominent areas." />
                <Switch label="Popular" description="Mark deity as popular." />
                <Input label="Sort Order" type="number" />
              </FormSection>
            </TabsContent>

            <TabsContent value="profile">
              <FormSection columns={2} title="Profile" description="Reusable deity profile fields.">
                <Input label="Sanskrit Name" />
                <Input label="Primary Mantra" />
                <Input label="Consort" />
                <Input label="Vahana" />
                <Textarea label="Profile Summary" wrapperClassName="md:col-span-2" />
              </FormSection>
            </TabsContent>

            <TabsContent value="avatars">
              <FormSection title="Avatars" description="Reusable table with image placeholder." divider={false}>
                <PlaceholderPanel icon={<ImageIcon />} title="Image placeholder" description="Avatar image upload placeholder." />
                <TablePlaceholder title="Avatars" />
              </FormSection>
            </TabsContent>

            {["Relations", "Symbols", "Blessings", "Associations", "Festivals", "External Links"].map((label) => (
              <TabsContent key={label} value={tabValue(label)}>
                <FormSection title={label} description={`${label} reusable table placeholder.`} divider={false}>
                  <TablePlaceholder title={label} />
                </FormSection>
              </TabsContent>
            ))}

            <TabsContent value="attributes">
              <FormSection title="Attributes" description="Reusable key-value table." divider={false}>
                <TablePlaceholder keyValue title="Attributes" />
              </FormSection>
            </TabsContent>

            <TabsContent value="seo">
              <FormSection columns={2} title="SEO" description="Reusable SEO section placeholder.">
                <Input label="SEO Title" />
                <Input label="Focus Keyword" />
                <Textarea label="SEO Description" wrapperClassName="md:col-span-2" />
                <Select options={[{ label: "Index, Follow", value: "index-follow" }, { label: "Noindex, Nofollow", value: "noindex-nofollow" }]} placeholder="Robots" />
                <Switch label="Indexed" description="Search index placeholder flag." />
              </FormSection>
            </TabsContent>

            <TabsContent value="statistics">
              <PlaceholderPanel icon={<Activity />} title="Statistics" description="Read-only deity statistics placeholder." />
            </TabsContent>
            <TabsContent value="change-history">
              <PlaceholderPanel icon={<History />} title="Change History" description="Read-only timeline placeholder." />
            </TabsContent>
          </Tabs>
          <FormActions canReset dirty={form.formState.isDirty} onCancel={() => undefined} onReset={() => form.reset()} sticky submitLabel={mode === "create" ? "Create placeholder" : "Save placeholder"} />
        </Form>
      </div>
    </AdminOnly>
  );
}

function DetailSection({ children, icon, title }: { children: React.ReactNode; icon: React.ReactNode; title: string }) {
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

export function DeityDetailsPageContent() {
  const deity = deities[0];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Deity Details</p>
            <h1 className="text-3xl font-semibold tracking-tight">{deity.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{deity.deityCode} · {deity.type}</p>
          </div>
          <AdminOnly>
            <Button render={<Link href={`/deities/${deity.id}/edit`} />} leftIcon={<Pencil />}>Edit Deity</Button>
          </AdminOnly>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]" aria-label="Deity overview">
          <Card className="glass-panel shadow-soft">
            <CardContent className="space-y-4">
              <DeityImage />
              <div>
                <h2 className="text-xl font-semibold">{deity.name}</h2>
                <p className="text-sm text-muted-foreground">{deity.type}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <DeityStatusBadge status={deity.status} />
                <Badge variant="success">Featured</Badge>
                <Badge variant="info">Popular</Badge>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailSection icon={<BookOpen />} title="Profile"><p className="text-sm text-muted-foreground">Profile, mantra, associations, and summary placeholders.</p></DetailSection>
            <DetailSection icon={<ImageIcon />} title="Avatars"><TablePlaceholder title="Avatars" /></DetailSection>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Deity child module placeholders">
          <DetailSection icon={<Users />} title="Relations"><TablePlaceholder title="Relations" /></DetailSection>
          <DetailSection icon={<Star />} title="Symbols"><TablePlaceholder title="Symbols" /></DetailSection>
          <DetailSection icon={<KeyRound />} title="Attributes"><TablePlaceholder keyValue title="Attributes" /></DetailSection>
          <DetailSection icon={<ShieldCheck />} title="Blessings"><TablePlaceholder title="Blessings" /></DetailSection>
          <DetailSection icon={<Sparkles />} title="Associations"><TablePlaceholder title="Associations" /></DetailSection>
          <DetailSection icon={<Star />} title="Festivals"><TablePlaceholder title="Festivals" /></DetailSection>
          <DetailSection icon={<SearchCheck />} title="SEO"><p className="text-sm text-muted-foreground">SEO metadata placeholder.</p></DetailSection>
          <DetailSection icon={<Activity />} title="Statistics"><p className="text-sm text-muted-foreground">Statistics placeholder.</p></DetailSection>
          <DetailSection icon={<History />} title="History"><p className="text-sm text-muted-foreground">Change history timeline placeholder.</p></DetailSection>
          <DetailSection icon={<Link2 />} title="External Links"><TablePlaceholder title="External Links" /></DetailSection>
        </section>
      </div>
    </PermissionGate>
  );
}
