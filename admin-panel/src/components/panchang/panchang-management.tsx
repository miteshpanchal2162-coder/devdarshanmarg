"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { Activity, CalendarDays, Clock, Eye, Globe2, History, Link2, MapPin, Pencil, Plus, SearchCheck, Sparkles, Trash2 } from "lucide-react";

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

type PanchangStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";
type PanchangRecord = {
  id: string;
  name: string;
  panchangCode: string;
  timezone: string;
  region: string;
  status: PanchangStatus;
  defaultPanchang: boolean;
};

const panchangs: PanchangRecord[] = [
  { id: "pan-001", name: "North India Panchang", panchangCode: "PAN-NORTH-001", timezone: "Asia/Kolkata", region: "North India", status: "ACTIVE", defaultPanchang: true },
  { id: "pan-002", name: "Gujarati Panchang", panchangCode: "PAN-GUJ-002", timezone: "Asia/Kolkata", region: "Gujarat", status: "ACTIVE", defaultPanchang: false },
  { id: "pan-003", name: "Tamil Panchang", panchangCode: "PAN-TAM-003", timezone: "Asia/Kolkata", region: "Tamil Nadu", status: "DRAFT", defaultPanchang: false },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Draft", value: "DRAFT" },
  { label: "Archived", value: "ARCHIVED" },
];

const regionOptions = [
  { label: "All regions", value: "all" },
  { label: "North India", value: "north-india" },
  { label: "Gujarat", value: "gujarat" },
  { label: "Tamil Nadu", value: "tamil-nadu" },
];

const defaultOptions = [
  { label: "Any", value: "all" },
  { label: "Default", value: "yes" },
  { label: "Not default", value: "no" },
];

const calendarTypeOptions = [
  { label: "Vikram Samvat", value: "vikram-samvat" },
  { label: "Shaka Samvat", value: "shaka-samvat" },
  { label: "Tamil Calendar", value: "tamil-calendar" },
];

const tabs = [
  "General",
  "Regions",
  "Calendar Dates",
  "Day Elements",
  "Muhurat",
  "Choghadiya",
  "Rahu Kaal",
  "Gulika Kaal",
  "Yamaganda",
  "Abhijit Muhurat",
  "Vrats",
  "Special Days",
  "Planet Positions",
  "Rashi Transits",
  "Sources",
  "External Links",
  "SEO",
  "Statistics",
  "Change History",
] as const;

function tabValue(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

function PanchangStatusBadge({ status }: { status: PanchangStatus }) {
  const variant = status === "ACTIVE" ? "success" : status === "DRAFT" ? "warning" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

function PanchangFilters() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      <Select options={statusOptions} placeholder="Status" />
      <Select options={regionOptions} placeholder="Region" />
      <Select options={defaultOptions} placeholder="Default Panchang" />
    </div>
  );
}

const columns: ColumnDef<PanchangRecord>[] = [
  { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  { accessorKey: "panchangCode", header: "Panchang Code" },
  { accessorKey: "timezone", header: "Timezone" },
  { accessorKey: "region", header: "Region" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <PanchangStatusBadge status={row.original.status} /> },
  { accessorKey: "defaultPanchang", header: "Default", cell: ({ row }) => <Badge variant={row.original.defaultPanchang ? "success" : "secondary"}>{row.original.defaultPanchang ? "Yes" : "No"}</Badge> },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        <Button aria-label={`View ${row.original.name}`} render={<Link href={`/panchang/${row.original.id}`} />} size="icon-sm" variant="ghost"><Eye /></Button>
        <AdminOnly>
          <Button aria-label={`Edit ${row.original.name}`} render={<Link href={`/panchang/${row.original.id}/edit`} />} size="icon-sm" variant="ghost"><Pencil /></Button>
          <Button aria-label="Preview placeholder" size="icon-sm" type="button" variant="ghost"><SearchCheck /></Button>
          <Button aria-label="Delete placeholder" size="icon-sm" type="button" variant="ghost"><Trash2 /></Button>
        </AdminOnly>
      </div>
    ),
  },
];

export function PanchangListPageContent() {
  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Module 7</p>
            <h1 className="text-3xl font-semibold tracking-tight">Panchang Management</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage Panchang records with dummy data and placeholder actions.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RoleBadge />
            <AdminOnly>
              <Button render={<Link href="/panchang/create" />} leftIcon={<Plus />}>Create Panchang</Button>
            </AdminOnly>
          </div>
        </header>
        <DataTable
          bulkActions={
            <AdminOnly>
              <Button size="sm" type="button" variant="destructive">Delete</Button>
              <Button size="sm" type="button" variant="outline">Set Active</Button>
              <Button size="sm" type="button" variant="outline">Archive</Button>
            </AdminOnly>
          }
          columns={columns}
          data={panchangs}
          exportPlaceholder={() => undefined}
          filters={<PanchangFilters />}
          onRefresh={() => undefined}
          searchPlaceholder="Search Panchang records..."
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
            <td className="p-3">PAN-{title.toUpperCase().slice(0, 4)}-001</td>
            <td className="p-3"><Badge variant="secondary">Placeholder</Badge></td>
            <td className="p-3 text-right"><Button size="sm" type="button" variant="outline">Manage</Button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

type PanchangFormValues = {
  panchangCode: string;
  name: string;
  slug: string;
  description: string;
};

export function PanchangFormPageContent({ mode }: { mode: "create" | "edit" }) {
  const existing = panchangs[0];
  const form = useForm<PanchangFormValues>({
    defaultValues:
      mode === "edit"
        ? { panchangCode: existing.panchangCode, name: existing.name, slug: "north-india-panchang", description: "Panchang description placeholder." }
        : { panchangCode: "", name: "", slug: "", description: "" },
  });

  return (
    <AdminOnly>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Panchang Management</p>
          <h1 className="text-3xl font-semibold tracking-tight">{mode === "create" ? "Create Panchang" : "Edit Panchang"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">UI-only Panchang workflow with reusable placeholders for all sections.</p>
        </header>
        <Form {...form} onSubmit={(event) => event.preventDefault()}>
          <Tabs defaultValue="general">
            <div className="overflow-x-auto pb-2">
              <TabsList className="min-w-max" variant="line">
                {tabs.map((label) => <TabsTrigger key={label} value={tabValue(label)}>{label}</TabsTrigger>)}
              </TabsList>
            </div>

            <TabsContent value="general">
              <FormSection columns={2} title="General" description="Core Panchang information.">
                <Input label="Panchang Code" required {...form.register("panchangCode")} />
                <Input label="Name" required {...form.register("name")} />
                <Input label="Slug" required {...form.register("slug")} />
                <Select options={calendarTypeOptions} placeholder="Calendar Type" />
                <Textarea label="Description" required wrapperClassName="md:col-span-2" {...form.register("description")} />
                <Input label="Timezone" defaultValue="Asia/Kolkata" />
                <Switch label="Default" description="Use as default Panchang placeholder." />
                <Select options={statusOptions.slice(1)} placeholder="Status" />
                <Input label="Sort Order" type="number" />
              </FormSection>
            </TabsContent>

            {tabs.filter((label) => !["General", "SEO", "Statistics", "Change History"].includes(label)).map((label) => (
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
              <PlaceholderPanel icon={<Activity />} title="Statistics" description="Read-only Panchang statistics placeholder." />
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

export function PanchangDetailsPageContent() {
  const panchang = panchangs[0];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Panchang Details</p>
            <h1 className="text-3xl font-semibold tracking-tight">{panchang.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{panchang.panchangCode} · {panchang.region}</p>
          </div>
          <AdminOnly>
            <Button render={<Link href={`/panchang/${panchang.id}/edit`} />} leftIcon={<Pencil />}>Edit Panchang</Button>
          </AdminOnly>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]" aria-label="Panchang overview">
          <Card className="glass-panel shadow-soft">
            <CardContent className="space-y-4">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><CalendarDays className="size-6" /></span>
              <div>
                <h2 className="text-xl font-semibold">{panchang.name}</h2>
                <p className="text-sm text-muted-foreground">{panchang.timezone}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <PanchangStatusBadge status={panchang.status} />
                <Badge variant={panchang.defaultPanchang ? "success" : "secondary"}>{panchang.defaultPanchang ? "Default" : "Regional"}</Badge>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailSection icon={<MapPin />} title="Regions"><TablePlaceholder title="Regions" /></DetailSection>
            <DetailSection icon={<CalendarDays />} title="Calendar"><TablePlaceholder title="Calendar Dates" /></DetailSection>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Panchang child module placeholders">
          <DetailSection icon={<Sparkles />} title="Day Elements"><TablePlaceholder title="Day Elements" /></DetailSection>
          <DetailSection icon={<Clock />} title="Muhurat"><TablePlaceholder title="Muhurat" /></DetailSection>
          <DetailSection icon={<Sparkles />} title="Vrats"><TablePlaceholder title="Vrats" /></DetailSection>
          <DetailSection icon={<CalendarDays />} title="Special Days"><TablePlaceholder title="Special Days" /></DetailSection>
          <DetailSection icon={<Globe2 />} title="Planet Positions"><TablePlaceholder title="Planet Positions" /></DetailSection>
          <DetailSection icon={<Globe2 />} title="Rashi Transits"><TablePlaceholder title="Rashi Transits" /></DetailSection>
          <DetailSection icon={<SearchCheck />} title="Sources"><TablePlaceholder title="Sources" /></DetailSection>
          <DetailSection icon={<Link2 />} title="External Links"><TablePlaceholder title="External Links" /></DetailSection>
          <DetailSection icon={<SearchCheck />} title="SEO"><p className="text-sm text-muted-foreground">SEO metadata placeholder.</p></DetailSection>
          <DetailSection icon={<Activity />} title="Statistics"><p className="text-sm text-muted-foreground">Statistics placeholder.</p></DetailSection>
          <DetailSection icon={<History />} title="History"><p className="text-sm text-muted-foreground">Change history timeline placeholder.</p></DetailSection>
        </section>
      </div>
    </PermissionGate>
  );
}
