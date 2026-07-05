"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { Building2, Car, Eye, FileText, Hotel, ImageIcon, Landmark, Map, MapPin, Pencil, Plus, SearchCheck, ShieldCheck, Sparkles, Trash2, Utensils } from "lucide-react";

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

type TempleStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";
type TempleRecord = {
  id: string;
  name: string;
  templeCode: string;
  category: string;
  state: string;
  city: string;
  status: TempleStatus;
  featured: boolean;
  popular: boolean;
};

const temples: TempleRecord[] = [
  { id: "tmp-001", name: "Kashi Vishwanath Temple", templeCode: "TMP-KASHI-001", category: "Jyotirlinga", state: "Uttar Pradesh", city: "Varanasi", status: "ACTIVE", featured: true, popular: true },
  { id: "tmp-002", name: "Somnath Temple", templeCode: "TMP-SOMNATH-002", category: "Jyotirlinga", state: "Gujarat", city: "Veraval", status: "ACTIVE", featured: true, popular: false },
  { id: "tmp-003", name: "Meenakshi Amman Temple", templeCode: "TMP-MADURAI-003", category: "Shakti Peeth", state: "Tamil Nadu", city: "Madurai", status: "DRAFT", featured: false, popular: true },
];

const categoryOptions = [
  { label: "All categories", value: "all" },
  { label: "Jyotirlinga", value: "jyotirlinga" },
  { label: "Shakti Peeth", value: "shakti-peeth" },
  { label: "Char Dham", value: "char-dham" },
];

const stateOptions = [
  { label: "All states", value: "all" },
  { label: "Uttar Pradesh", value: "uttar-pradesh" },
  { label: "Gujarat", value: "gujarat" },
  { label: "Tamil Nadu", value: "tamil-nadu" },
];

const cityOptions = [
  { label: "All cities", value: "all" },
  { label: "Varanasi", value: "varanasi" },
  { label: "Veraval", value: "veraval" },
  { label: "Madurai", value: "madurai" },
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
  "Location",
  "Darshan",
  "Pooja",
  "Facilities",
  "Rules",
  "Contacts",
  "FAQs",
  "Accessibility",
  "Dress Code",
  "Routes",
  "Nearby Places",
  "Parking",
  "Accommodation",
  "Prasadam",
  "Documents",
  "Gallery",
  "SEO",
  "Statistics",
] as const;

function tabValue(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

function TempleStatusBadge({ status }: { status: TempleStatus }) {
  const variant = status === "ACTIVE" ? "success" : status === "DRAFT" ? "warning" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

function TempleImage() {
  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Landmark className="size-5" />
    </span>
  );
}

function TempleFilters() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
      <Select options={categoryOptions} placeholder="Category" />
      <Select options={stateOptions} placeholder="State" />
      <Select options={cityOptions} placeholder="City" />
      <Select options={statusOptions} placeholder="Status" />
      <Select options={featuredOptions} placeholder="Featured" />
    </div>
  );
}

const columns: ColumnDef<TempleRecord>[] = [
  { header: "Image", cell: () => <TempleImage /> },
  { accessorKey: "name", header: "Temple Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  { accessorKey: "templeCode", header: "Temple Code" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "state", header: "State" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <TempleStatusBadge status={row.original.status} /> },
  { accessorKey: "featured", header: "Featured", cell: ({ row }) => <Badge variant={row.original.featured ? "success" : "secondary"}>{row.original.featured ? "Yes" : "No"}</Badge> },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        <Button aria-label={`View ${row.original.name}`} render={<Link href={`/temples/${row.original.id}`} />} size="icon-sm" variant="ghost"><Eye /></Button>
        <AdminOnly>
          <Button aria-label={`Edit ${row.original.name}`} render={<Link href={`/temples/${row.original.id}/edit`} />} size="icon-sm" variant="ghost"><Pencil /></Button>
          <Button aria-label="Preview placeholder" size="icon-sm" type="button" variant="ghost"><SearchCheck /></Button>
          <Button aria-label="Delete placeholder" size="icon-sm" type="button" variant="ghost"><Trash2 /></Button>
        </AdminOnly>
      </div>
    ),
  },
];

export function TempleListPageContent() {
  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Module 2</p>
            <h1 className="text-3xl font-semibold tracking-tight">Temple Management</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage temple records with dummy data and placeholder actions.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RoleBadge />
            <AdminOnly>
              <Button render={<Link href="/admin/temples/create" />} leftIcon={<Plus />}>Create Temple</Button>
            </AdminOnly>
          </div>
        </header>
        <DataTable
          bulkActions={
            <AdminOnly>
              <Button size="sm" type="button" variant="destructive">Delete</Button>
              <Button size="sm" type="button" variant="outline">Activate</Button>
              <Button size="sm" type="button" variant="outline">Archive</Button>
            </AdminOnly>
          }
          columns={columns}
          data={temples}
          exportPlaceholder={() => undefined}
          filters={<TempleFilters />}
          onRefresh={() => undefined}
          searchPlaceholder="Search temples..."
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

function ChildTablePlaceholder({ title }: { title: string }) {
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
            <td className="p-3">TMP-{title.toUpperCase().slice(0, 4)}-001</td>
            <td className="p-3"><Badge variant="secondary">Placeholder</Badge></td>
            <td className="p-3 text-right"><Button size="sm" type="button" variant="outline">Manage</Button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

type TempleFormValues = {
  templeCode: string;
  name: string;
  slug: string;
  description: string;
};

export function TempleFormPageContent({ mode }: { mode: "create" | "edit" }) {
  const existing = temples[0];
  const form = useForm<TempleFormValues>({
    defaultValues:
      mode === "edit"
        ? { templeCode: existing.templeCode, name: existing.name, slug: "kashi-vishwanath-temple", description: "Temple description placeholder." }
        : { templeCode: "", name: "", slug: "", description: "" },
  });

  return (
    <AdminOnly>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Temple Management</p>
          <h1 className="text-3xl font-semibold tracking-tight">{mode === "create" ? "Create Temple" : "Edit Temple"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">UI-only temple workflow with placeholders for all child modules.</p>
        </header>
        <Form {...form} onSubmit={(event) => event.preventDefault()}>
          <Tabs defaultValue="general">
            <div className="overflow-x-auto pb-2">
              <TabsList className="min-w-max" variant="line">
                {tabs.map((label) => <TabsTrigger key={label} value={tabValue(label)}>{label}</TabsTrigger>)}
              </TabsList>
            </div>

            <TabsContent value="general">
              <FormSection columns={2} title="General" description="Core temple information.">
                <Input label="Temple Code" required {...form.register("templeCode")} />
                <Input label="Temple Name" required {...form.register("name")} />
                <Input label="Slug" required {...form.register("slug")} />
                <Select options={categoryOptions.slice(1)} placeholder="Category" />
                <Textarea label="Description" required wrapperClassName="md:col-span-2" {...form.register("description")} />
                <Select options={statusOptions.slice(1)} placeholder="Status" />
                <Switch label="Featured" description="Feature this temple in prominent areas." />
                <Switch label="Popular" description="Mark temple as popular." />
                <Input label="Sort Order" type="number" />
              </FormSection>
            </TabsContent>

            <TabsContent value="location">
              <FormSection columns={2} title="Location" description="Address and map placeholders.">
                <Input label="Country" defaultValue="India" />
                <Select options={stateOptions.slice(1)} placeholder="State" />
                <Select options={cityOptions.slice(1)} placeholder="City" />
                <Input label="Area" />
                <Input label="Latitude" type="number" />
                <Input label="Longitude" type="number" />
                <Textarea label="Address" wrapperClassName="md:col-span-2" />
                <PlaceholderPanel icon={<Map />} title="Google Map Placeholder" description="Map preview and pin selection will be wired later." />
              </FormSection>
            </TabsContent>

            {tabs.filter((label) => !["General", "Location", "SEO", "Statistics"].includes(label)).map((label) => (
              <TabsContent key={label} value={tabValue(label)}>
                <FormSection title={label} description={`${label} reusable table/form placeholder.`} divider={false}>
                  <ChildTablePlaceholder title={label} />
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
              <PlaceholderPanel icon={<SearchCheck />} title="Statistics Placeholder" description="Read-only temple statistics placeholder." />
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

export function TempleDetailsPageContent() {
  const temple = temples[0];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Temple Details</p>
            <h1 className="text-3xl font-semibold tracking-tight">{temple.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{temple.templeCode} · {temple.city}, {temple.state}</p>
          </div>
          <AdminOnly>
            <Button render={<Link href={`/temples/${temple.id}/edit`} />} leftIcon={<Pencil />}>Edit Temple</Button>
          </AdminOnly>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]" aria-label="Temple overview">
          <Card className="glass-panel shadow-soft">
            <CardContent className="space-y-4">
              <TempleImage />
              <div>
                <h2 className="text-xl font-semibold">{temple.name}</h2>
                <p className="text-sm text-muted-foreground">{temple.category}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <TempleStatusBadge status={temple.status} />
                <Badge variant="success">Featured</Badge>
                <Badge variant="info">Popular</Badge>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailSection icon={<MapPin />} title="Overview"><p className="text-sm text-muted-foreground">Address, category, status, and publishing placeholders.</p></DetailSection>
            <DetailSection icon={<ImageIcon />} title="Gallery"><p className="text-sm text-muted-foreground">Temple gallery placeholder.</p></DetailSection>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Temple child module placeholders">
          <DetailSection icon={<Building2 />} title="Facilities"><ChildTablePlaceholder title="Facilities" /></DetailSection>
          <DetailSection icon={<Sparkles />} title="Darshan"><ChildTablePlaceholder title="Darshan" /></DetailSection>
          <DetailSection icon={<ShieldCheck />} title="Pooja"><ChildTablePlaceholder title="Pooja" /></DetailSection>
          <DetailSection icon={<FileText />} title="Rules"><ChildTablePlaceholder title="Rules" /></DetailSection>
          <DetailSection icon={<Map />} title="Routes"><ChildTablePlaceholder title="Routes" /></DetailSection>
          <DetailSection icon={<Landmark />} title="Nearby Places"><ChildTablePlaceholder title="Nearby Places" /></DetailSection>
          <DetailSection icon={<Car />} title="Parking"><p className="text-sm text-muted-foreground">Parking placeholder.</p></DetailSection>
          <DetailSection icon={<Hotel />} title="Accommodation"><p className="text-sm text-muted-foreground">Accommodation placeholder.</p></DetailSection>
          <DetailSection icon={<Utensils />} title="Prasadam"><p className="text-sm text-muted-foreground">Prasadam placeholder.</p></DetailSection>
          <DetailSection icon={<SearchCheck />} title="Statistics Placeholder"><p className="text-sm text-muted-foreground">Temple statistics placeholder.</p></DetailSection>
        </section>
      </div>
    </PermissionGate>
  );
}
