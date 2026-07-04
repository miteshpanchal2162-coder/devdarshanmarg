"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarDays, Eye, FileText, ImageIcon, Landmark, Music, Pencil, Plus, SearchCheck, Sparkles, Trash2, Utensils, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Form, FormActions, FormSection } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { AdminOnly, PermissionGate, RoleBadge } from "@/components/ui/permission";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type FestivalStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";
type FestivalRecord = {
  id: string;
  name: string;
  festivalCode: string;
  type: string;
  month: string;
  status: FestivalStatus;
  featured: boolean;
  popular: boolean;
};

const festivals: FestivalRecord[] = [
  { id: "fest-001", name: "Maha Shivaratri", festivalCode: "FEST-SHIV-001", type: "Vrat", month: "Phalguna", status: "ACTIVE", featured: true, popular: true },
  { id: "fest-002", name: "Navratri", festivalCode: "FEST-NAV-002", type: "Utsav", month: "Ashwin", status: "ACTIVE", featured: true, popular: true },
  { id: "fest-003", name: "Janmashtami", festivalCode: "FEST-JAN-003", type: "Jayanti", month: "Bhadrapada", status: "DRAFT", featured: false, popular: true },
];

const typeOptions = [
  { label: "All types", value: "all" },
  { label: "Vrat", value: "vrat" },
  { label: "Utsav", value: "utsav" },
  { label: "Jayanti", value: "jayanti" },
];

const monthOptions = [
  { label: "All months", value: "all" },
  { label: "Phalguna", value: "phalguna" },
  { label: "Ashwin", value: "ashwin" },
  { label: "Bhadrapada", value: "bhadrapada" },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Draft", value: "DRAFT" },
  { label: "Archived", value: "ARCHIVED" },
];

const featuredOptions = [
  { label: "Any", value: "all" },
  { label: "Featured", value: "yes" },
  { label: "Not featured", value: "no" },
];

const tabs = [
  "General",
  "Dates",
  "Temples",
  "Deities",
  "Rituals",
  "Puja Vidhi",
  "Samagri",
  "Fasting Rules",
  "Foods",
  "Katha",
  "Mantras",
  "Aartis",
  "Bhajans",
  "Gallery",
  "Videos",
  "SEO",
  "Statistics",
] as const;

function tabValue(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

function FestivalStatusBadge({ status }: { status: FestivalStatus }) {
  const variant = status === "ACTIVE" ? "success" : status === "DRAFT" ? "warning" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

function FestivalImage() {
  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <CalendarDays className="size-5" />
    </span>
  );
}

function FestivalFilters() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <Select options={typeOptions} placeholder="Festival Type" />
      <Select options={monthOptions} placeholder="Month" />
      <Select options={statusOptions} placeholder="Status" />
      <Select options={featuredOptions} placeholder="Featured" />
    </div>
  );
}

const columns: ColumnDef<FestivalRecord>[] = [
  { header: "Image", cell: () => <FestivalImage /> },
  { accessorKey: "name", header: "Festival Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  { accessorKey: "festivalCode", header: "Festival Code" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "month", header: "Month" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <FestivalStatusBadge status={row.original.status} /> },
  { accessorKey: "featured", header: "Featured", cell: ({ row }) => <Badge variant={row.original.featured ? "success" : "secondary"}>{row.original.featured ? "Yes" : "No"}</Badge> },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        <Button aria-label={`View ${row.original.name}`} render={<Link href={`/festivals/${row.original.id}`} />} size="icon-sm" variant="ghost"><Eye /></Button>
        <AdminOnly>
          <Button aria-label={`Edit ${row.original.name}`} render={<Link href={`/festivals/${row.original.id}/edit`} />} size="icon-sm" variant="ghost"><Pencil /></Button>
          <Button aria-label="Preview placeholder" size="icon-sm" type="button" variant="ghost"><SearchCheck /></Button>
          <Button aria-label="Delete placeholder" size="icon-sm" type="button" variant="ghost"><Trash2 /></Button>
        </AdminOnly>
      </div>
    ),
  },
];

export function FestivalListPageContent() {
  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Module 3</p>
            <h1 className="text-3xl font-semibold tracking-tight">Festival Management</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage festival records with dummy data and placeholder actions.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RoleBadge />
            <AdminOnly>
              <Button render={<Link href="/festivals/create" />} leftIcon={<Plus />}>Create Festival</Button>
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
          data={festivals}
          exportPlaceholder={() => undefined}
          filters={<FestivalFilters />}
          onRefresh={() => undefined}
          searchPlaceholder="Search festivals..."
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

function TablePlaceholder({ title }: { title: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <caption className="sr-only">{title} placeholder table</caption>
        <thead className="border-b bg-muted/50 text-caption uppercase tracking-[0.16em] text-muted-foreground">
          <tr>
            <th className="p-3" scope="col">Name</th>
            <th className="p-3" scope="col">Code</th>
            <th className="p-3" scope="col">Status</th>
            <th className="p-3 text-right" scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 font-medium">{title} sample</td>
            <td className="p-3">FEST-{title.toUpperCase().slice(0, 4)}-001</td>
            <td className="p-3"><Badge variant="secondary">Placeholder</Badge></td>
            <td className="p-3 text-right"><Button size="sm" type="button" variant="outline">Manage</Button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

type FestivalFormValues = {
  festivalCode: string;
  name: string;
  slug: string;
  description: string;
};

export function FestivalFormPageContent({ mode }: { mode: "create" | "edit" }) {
  const existing = festivals[0];
  const form = useForm<FestivalFormValues>({
    defaultValues:
      mode === "edit"
        ? { festivalCode: existing.festivalCode, name: existing.name, slug: "maha-shivaratri", description: "Festival description placeholder." }
        : { festivalCode: "", name: "", slug: "", description: "" },
  });

  return (
    <AdminOnly>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Festival Management</p>
          <h1 className="text-3xl font-semibold tracking-tight">{mode === "create" ? "Create Festival" : "Edit Festival"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">UI-only festival workflow with reusable placeholders for all sections.</p>
        </header>
        <Form {...form} onSubmit={(event) => event.preventDefault()}>
          <Tabs defaultValue="general">
            <div className="overflow-x-auto pb-2">
              <TabsList className="min-w-max" variant="line">
                {tabs.map((label) => <TabsTrigger key={label} value={tabValue(label)}>{label}</TabsTrigger>)}
              </TabsList>
            </div>

            <TabsContent value="general">
              <FormSection columns={2} title="General" description="Core festival information.">
                <Input label="Festival Code" required {...form.register("festivalCode")} />
                <Input label="Festival Name" required {...form.register("name")} />
                <Input label="Slug" required {...form.register("slug")} />
                <Select options={typeOptions.slice(1)} placeholder="Festival Type" />
                <Textarea label="Description" required wrapperClassName="md:col-span-2" {...form.register("description")} />
                <Select options={statusOptions.slice(1)} placeholder="Status" />
                <Switch label="Featured" description="Feature this festival in prominent areas." />
                <Switch label="Popular" description="Mark festival as popular." />
                <Input label="Sort Order" type="number" />
              </FormSection>
            </TabsContent>

            {tabs.filter((label) => !["General", "SEO", "Statistics"].includes(label)).map((label) => (
              <TabsContent key={label} value={tabValue(label)}>
                <FormSection title={label} description={`${label} reusable table/form placeholder.`} divider={false}>
                  <TablePlaceholder title={label} />
                </FormSection>
              </TabsContent>
            ))}

            <TabsContent value="seo">
              <FormSection columns={2} title="SEO" description="Search metadata placeholders.">
                <Input label="SEO Title" />
                <Input label="Focus Keyword" />
                <Textarea label="SEO Description" wrapperClassName="md:col-span-2" />
                <Select options={[{ label: "Index, Follow", value: "index-follow" }, { label: "Noindex, Nofollow", value: "noindex-nofollow" }]} placeholder="Robots" />
                <Switch label="Indexed" description="Search index placeholder flag." />
              </FormSection>
            </TabsContent>
            <TabsContent value="statistics">
              <PlaceholderPanel icon={<SearchCheck />} title="Statistics" description="Read-only festival statistics placeholder." />
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

export function FestivalDetailsPageContent() {
  const festival = festivals[0];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Festival Details</p>
            <h1 className="text-3xl font-semibold tracking-tight">{festival.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{festival.festivalCode} · {festival.month}</p>
          </div>
          <AdminOnly>
            <Button render={<Link href={`/festivals/${festival.id}/edit`} />} leftIcon={<Pencil />}>Edit Festival</Button>
          </AdminOnly>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]" aria-label="Festival overview">
          <Card className="glass-panel shadow-soft">
            <CardContent className="space-y-4">
              <FestivalImage />
              <div>
                <h2 className="text-xl font-semibold">{festival.name}</h2>
                <p className="text-sm text-muted-foreground">{festival.type}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <FestivalStatusBadge status={festival.status} />
                <Badge variant="success">Featured</Badge>
                <Badge variant="info">Popular</Badge>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailSection icon={<CalendarDays />} title="Dates"><TablePlaceholder title="Dates" /></DetailSection>
            <DetailSection icon={<Landmark />} title="Temples"><TablePlaceholder title="Temples" /></DetailSection>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Festival child module placeholders">
          <DetailSection icon={<Sparkles />} title="Deities"><TablePlaceholder title="Deities" /></DetailSection>
          <DetailSection icon={<FileText />} title="Rituals"><TablePlaceholder title="Rituals" /></DetailSection>
          <DetailSection icon={<FileText />} title="Puja Vidhi"><TablePlaceholder title="Puja Vidhi" /></DetailSection>
          <DetailSection icon={<Utensils />} title="Samagri"><TablePlaceholder title="Samagri" /></DetailSection>
          <DetailSection icon={<Utensils />} title="Foods"><TablePlaceholder title="Foods" /></DetailSection>
          <DetailSection icon={<FileText />} title="Fasting Rules"><TablePlaceholder title="Fasting Rules" /></DetailSection>
          <DetailSection icon={<FileText />} title="Katha"><TablePlaceholder title="Katha" /></DetailSection>
          <DetailSection icon={<Music />} title="Mantras"><TablePlaceholder title="Mantras" /></DetailSection>
          <DetailSection icon={<Music />} title="Aartis"><TablePlaceholder title="Aartis" /></DetailSection>
          <DetailSection icon={<Music />} title="Bhajans"><TablePlaceholder title="Bhajans" /></DetailSection>
          <DetailSection icon={<ImageIcon />} title="Gallery"><TablePlaceholder title="Gallery" /></DetailSection>
          <DetailSection icon={<Video />} title="Videos"><TablePlaceholder title="Videos" /></DetailSection>
          <DetailSection icon={<SearchCheck />} title="SEO"><p className="text-sm text-muted-foreground">SEO metadata placeholder.</p></DetailSection>
          <DetailSection icon={<SearchCheck />} title="Statistics"><p className="text-sm text-muted-foreground">Statistics placeholder.</p></DetailSection>
        </section>
      </div>
    </PermissionGate>
  );
}
