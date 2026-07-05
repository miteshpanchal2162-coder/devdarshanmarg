"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye, FileArchive, FileText, ImageIcon, Languages, Pencil, Plus, RadioTower, SearchCheck, Send, Sparkles, Trash2, Video } from "lucide-react";

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

type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type ContentRecord = {
  id: string;
  title: string;
  contentCode: string;
  type: string;
  category: string;
  status: ContentStatus;
  featured: boolean;
  popular: boolean;
  language: string;
  publishedDate: string;
};

const contents: ContentRecord[] = [
  {
    id: "cnt-001",
    title: "Kashi Vishwanath Temple Guide",
    contentCode: "CNT-KASHI-001",
    type: "Temple Guide",
    category: "Temples",
    status: "PUBLISHED",
    featured: true,
    popular: true,
    language: "English",
    publishedDate: "02 Jul 2026",
  },
  {
    id: "cnt-002",
    title: "Navratri Vrat Katha",
    contentCode: "CNT-NAV-022",
    type: "Article",
    category: "Festivals",
    status: "DRAFT",
    featured: false,
    popular: true,
    language: "Hindi",
    publishedDate: "Pending",
  },
  {
    id: "cnt-003",
    title: "Morning Aarti Audio Collection",
    contentCode: "CNT-AARTI-014",
    type: "Media",
    category: "Devotional",
    status: "ARCHIVED",
    featured: false,
    popular: false,
    language: "Gujarati",
    publishedDate: "18 Jun 2026",
  },
];

const contentTypeOptions = [
  { label: "All types", value: "all" },
  { label: "Article", value: "article" },
  { label: "Temple Guide", value: "temple-guide" },
  { label: "Media", value: "media" },
];

const categoryOptions = [
  { label: "All categories", value: "all" },
  { label: "Temples", value: "temples" },
  { label: "Festivals", value: "festivals" },
  { label: "Devotional", value: "devotional" },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
];

const booleanOptions = [
  { label: "Any", value: "all" },
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const languageOptions = [
  { label: "All languages", value: "all" },
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Gujarati", value: "gu" },
];

const tabs = [
  ["general", "General"],
  ["translation", "Translation"],
  ["media", "Media"],
  ["gallery", "Gallery"],
  ["seo", "SEO"],
  ["attachments", "Attachments"],
  ["relations", "Relations"],
  ["statistics", "Statistics"],
  ["versions", "Versions"],
  ["publish-log", "Publish Log"],
] as const;

function StatusBadge({ status }: { status: ContentStatus }) {
  const variant = status === "PUBLISHED" ? "success" : status === "DRAFT" ? "warning" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

function Thumbnail() {
  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <ImageIcon className="size-5" />
    </span>
  );
}

function ContentFilters() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
      <Select options={contentTypeOptions} placeholder="Content Type" />
      <Select options={categoryOptions} placeholder="Category" />
      <Select options={statusOptions} placeholder="Status" />
      <Select options={booleanOptions} placeholder="Featured" />
      <Select options={booleanOptions} placeholder="Popular" />
      <Select options={languageOptions} placeholder="Language" />
    </div>
  );
}

const columns: ColumnDef<ContentRecord>[] = [
  { header: "Thumbnail", cell: () => <Thumbnail /> },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  { accessorKey: "contentCode", header: "Content Code" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => <Badge variant={row.original.featured ? "success" : "secondary"}>{row.original.featured ? "Yes" : "No"}</Badge>,
  },
  {
    accessorKey: "popular",
    header: "Popular",
    cell: ({ row }) => <Badge variant={row.original.popular ? "info" : "secondary"}>{row.original.popular ? "Yes" : "No"}</Badge>,
  },
  { accessorKey: "publishedDate", header: "Published Date" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        <Button aria-label={`View ${row.original.title}`} render={<Link href={`/content/${row.original.id}`} />} size="icon-sm" variant="ghost">
          <Eye />
        </Button>
        <AdminOnly>
          <Button aria-label={`Edit ${row.original.title}`} render={<Link href={`/content/${row.original.id}/edit`} />} size="icon-sm" variant="ghost">
            <Pencil />
          </Button>
          <Button aria-label="Preview placeholder" size="icon-sm" type="button" variant="ghost">
            <SearchCheck />
          </Button>
          <Button aria-label="Publish placeholder" size="icon-sm" type="button" variant="ghost">
            <Send />
          </Button>
          <Button aria-label="Duplicate placeholder" size="icon-sm" type="button" variant="ghost">
            <Copy />
          </Button>
          <Button aria-label="Delete placeholder" size="icon-sm" type="button" variant="ghost">
            <Trash2 />
          </Button>
        </AdminOnly>
      </div>
    ),
  },
];

export function ContentListPageContent() {
  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Module 5</p>
            <h1 className="text-3xl font-semibold tracking-tight">Content Engine</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage content records with dummy data and placeholder actions.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RoleBadge />
            <AdminOnly>
              <Button render={<Link href="/admin/content/create" />} leftIcon={<Plus />}>
                Create Content
              </Button>
            </AdminOnly>
          </div>
        </header>
        <DataTable
          bulkActions={
            <AdminOnly>
              <Button size="sm" type="button" variant="destructive">Delete</Button>
              <Button size="sm" type="button" variant="outline">Publish</Button>
              <Button size="sm" type="button" variant="outline">Archive</Button>
            </AdminOnly>
          }
          columns={columns}
          data={contents}
          exportPlaceholder={() => undefined}
          filters={<ContentFilters />}
          onRefresh={() => undefined}
          searchPlaceholder="Search content..."
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

function TranslationCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {["Hindi", "Gujarati", "English"].map((language) => (
        <Card key={language} variant="outlined">
          <CardHeader>
            <CardTitle>{language} Translation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Translated Title" placeholder={`${language} title`} />
            <Textarea label="Translated Description" placeholder={`${language} description`} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AttachmentsTablePlaceholder() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <caption className="sr-only">Attachments placeholder table</caption>
        <thead className="border-b bg-muted/50 text-caption uppercase tracking-[0.16em] text-muted-foreground">
          <tr>
            <th className="p-3" scope="col">File</th>
            <th className="p-3" scope="col">Type</th>
            <th className="p-3" scope="col">Size</th>
            <th className="p-3 text-right" scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 font-medium">sample-guide.pdf</td>
            <td className="p-3">Document</td>
            <td className="p-3">2.4 MB</td>
            <td className="p-3 text-right"><Button size="sm" type="button" variant="outline">Placeholder</Button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

type ContentFormValues = {
  contentCode: string;
  slug: string;
  title: string;
  shortDescription: string;
};

export function ContentFormPageContent({ mode }: { mode: "create" | "edit" }) {
  const existing = contents[0];
  const form = useForm<ContentFormValues>({
    defaultValues:
      mode === "edit"
        ? {
            contentCode: existing.contentCode,
            slug: "kashi-vishwanath-temple-guide",
            title: existing.title,
            shortDescription: "A complete guide placeholder for temple content.",
          }
        : { contentCode: "", slug: "", title: "", shortDescription: "" },
  });

  return (
    <AdminOnly>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Content Engine</p>
          <h1 className="text-3xl font-semibold tracking-tight">{mode === "create" ? "Create Content" : "Edit Content"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">UI-only content workflow with placeholders for media, SEO, relations, and publishing.</p>
        </header>
        <Form {...form} onSubmit={(event) => event.preventDefault()}>
          <Tabs defaultValue="general">
            <div className="overflow-x-auto pb-2">
              <TabsList className="min-w-max" variant="line">
                {tabs.map(([value, label]) => (
                  <TabsTrigger key={value} value={value}>{label}</TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="general">
              <FormSection columns={2} title="General" description="Core content information.">
                <Select options={contentTypeOptions.slice(1)} placeholder="Content Type" />
                <Select options={categoryOptions.slice(1)} placeholder="Category" />
                <Input label="Content Code" required {...form.register("contentCode")} />
                <Input label="Slug" required {...form.register("slug")} />
                <Input label="Title" required {...form.register("title")} />
                <Select options={statusOptions.slice(1)} placeholder="Status" />
                <Textarea label="Short Description" required wrapperClassName="md:col-span-2" {...form.register("shortDescription")} />
                <Switch label="Featured" description="Highlight content on featured surfaces." />
                <Switch label="Popular" description="Mark content as popular." />
                <Input label="Publish Date" type="datetime-local" />
                <Input label="Sort Order" type="number" />
              </FormSection>
            </TabsContent>

            <TabsContent value="translation">
              <FormSection title="Translations" description="Dynamic translation cards placeholder." divider={false}>
                <TranslationCards />
              </FormSection>
            </TabsContent>

            <TabsContent value="media">
              <FormSection columns={2} title="Media" description="Media placeholders only.">
                <PlaceholderPanel icon={<ImageIcon />} title="Image placeholder" description="Primary image upload UI placeholder." />
                <PlaceholderPanel icon={<Video />} title="Video placeholder" description="Video URL or upload placeholder." />
                <PlaceholderPanel icon={<RadioTower />} title="Audio placeholder" description="Audio file placeholder." />
                <PlaceholderPanel icon={<FileText />} title="Document placeholder" description="Document upload placeholder." />
              </FormSection>
            </TabsContent>

            <TabsContent value="gallery">
              <FormSection columns={2} title="Gallery" description="Gallery and gallery items placeholders.">
                <PlaceholderPanel icon={<ImageIcon />} title="Gallery placeholder" description="Gallery setup UI placeholder." />
                <PlaceholderPanel icon={<FileArchive />} title="Gallery Items placeholder" description="Gallery items table placeholder." />
              </FormSection>
            </TabsContent>

            <TabsContent value="seo">
              <FormSection columns={2} title="SEO" description="Search metadata and score placeholders.">
                <Input label="SEO Title" />
                <Input label="Focus Keyword" />
                <Textarea label="SEO Description" wrapperClassName="md:col-span-2" />
                <Select options={[{ label: "Index, Follow", value: "index-follow" }, { label: "Noindex, Nofollow", value: "noindex-nofollow" }]} placeholder="Robots" />
                <Switch label="Indexed" description="Search index placeholder flag." />
                <PlaceholderPanel icon={<SearchCheck />} title="SEO Score placeholder" description="Score calculation will be connected later." />
              </FormSection>
            </TabsContent>

            <TabsContent value="attachments">
              <FormSection title="Attachments" description="Enterprise table placeholder for files." divider={false}>
                <AttachmentsTablePlaceholder />
              </FormSection>
            </TabsContent>

            <TabsContent value="relations">
              <FormSection columns={3} title="Relations" description="Content relations, entity mapping, and tags placeholders.">
                <PlaceholderPanel icon={<Copy />} title="Content Relations placeholder" description="Related content mapping UI." />
                <PlaceholderPanel icon={<Sparkles />} title="Entity Mapping placeholder" description="Temple, deity, festival links." />
                <PlaceholderPanel icon={<Languages />} title="Tags placeholder" description="Tag selection placeholder." />
              </FormSection>
            </TabsContent>

            <TabsContent value="statistics">
              <PlaceholderPanel icon={<SearchCheck />} title="Statistics" description="Read-only statistics placeholder." />
            </TabsContent>
            <TabsContent value="versions">
              <PlaceholderPanel icon={<Copy />} title="Versions" description="Version history placeholder." />
            </TabsContent>
            <TabsContent value="publish-log">
              <PlaceholderPanel icon={<Send />} title="Publish Log" description="Publishing activity placeholder." />
            </TabsContent>
          </Tabs>

          <FormActions canReset dirty={form.formState.isDirty} onCancel={() => undefined} onReset={() => form.reset()} sticky submitLabel={mode === "create" ? "Create placeholder" : "Save placeholder"} />
        </Form>
      </div>
    </AdminOnly>
  );
}

function DetailSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <Card className="glass-panel shadow-soft">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function ContentDetailsPageContent() {
  const content = contents[0];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Content Details</p>
            <h1 className="text-3xl font-semibold tracking-tight">{content.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{content.contentCode} · {content.category}</p>
          </div>
          <AdminOnly>
            <Button render={<Link href={`/content/${content.id}/edit`} />} leftIcon={<Pencil />}>
              Edit Content
            </Button>
          </AdminOnly>
        </header>

        <Tabs defaultValue="overview">
          <div className="overflow-x-auto pb-2">
            <TabsList className="min-w-max" variant="line">
              {["Overview", "Media", "Gallery", "Translations", "SEO", "Statistics", "Versions", "Publish Logs"].map((label) => (
                <TabsTrigger key={label} value={label.toLowerCase().replace(/\s+/g, "-")}>{label}</TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent className="space-y-4" value="overview">
            <DetailSection title="Overview">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div><p className="text-sm text-muted-foreground">Type</p><p className="font-medium">{content.type}</p></div>
                <div><p className="text-sm text-muted-foreground">Status</p><StatusBadge status={content.status} /></div>
                <div><p className="text-sm text-muted-foreground">Featured</p><Badge variant="success">Yes</Badge></div>
                <div><p className="text-sm text-muted-foreground">Popular</p><Badge variant="info">Yes</Badge></div>
              </div>
            </DetailSection>
          </TabsContent>
          <TabsContent value="media"><PlaceholderPanel icon={<Video />} title="Media" description="Image, video, audio, and document placeholders." /></TabsContent>
          <TabsContent value="gallery"><PlaceholderPanel icon={<ImageIcon />} title="Gallery" description="Gallery and gallery item placeholders." /></TabsContent>
          <TabsContent value="translations"><TranslationCards /></TabsContent>
          <TabsContent value="seo"><PlaceholderPanel icon={<SearchCheck />} title="SEO" description="SEO metadata and score placeholder." /></TabsContent>
          <TabsContent value="statistics"><PlaceholderPanel icon={<SearchCheck />} title="Statistics" description="Read-only statistics placeholder." /></TabsContent>
          <TabsContent value="versions"><PlaceholderPanel icon={<Copy />} title="Versions" description="Version history placeholder." /></TabsContent>
          <TabsContent value="publish-logs"><PlaceholderPanel icon={<Send />} title="Publish Logs" description="Publish log placeholder." /></TabsContent>
        </Tabs>
      </div>
    </PermissionGate>
  );
}
