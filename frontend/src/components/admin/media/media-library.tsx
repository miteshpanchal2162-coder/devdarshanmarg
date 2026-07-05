"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { Archive, Download, Eye, FileAudio, FileText, Folder, Grid2X2, History, ImageIcon, Move, Plus, Replace, SearchCheck, Table2, Trash2, Upload, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DataTable } from "@/components/ui/data-table";
import { Form, FormActions, FormSection } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { AdminOnly, PermissionGate, RoleBadge } from "@/components/ui/permission";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type MediaStatus = "ACTIVE" | "ARCHIVED" | "DRAFT";
type MediaType = "Image" | "Video" | "Audio" | "Document";
type MediaRecord = {
  id: string;
  title: string;
  mediaCode: string;
  type: MediaType;
  size: string;
  language: string;
  uploadedBy: string;
  createdDate: string;
  status: MediaStatus;
};

const mediaItems: MediaRecord[] = [
  { id: "med-001", title: "Kashi Temple Hero", mediaCode: "MED-IMG-001", type: "Image", size: "1.8 MB", language: "English", uploadedBy: "Admin Name", createdDate: "01 Jul 2026", status: "ACTIVE" },
  { id: "med-002", title: "Morning Aarti Audio", mediaCode: "MED-AUD-002", type: "Audio", size: "8.4 MB", language: "Hindi", uploadedBy: "Content Team", createdDate: "28 Jun 2026", status: "ACTIVE" },
  { id: "med-003", title: "Festival Guide PDF", mediaCode: "MED-DOC-003", type: "Document", size: "2.1 MB", language: "Gujarati", uploadedBy: "Reviewer", createdDate: "20 Jun 2026", status: "ARCHIVED" },
  { id: "med-004", title: "Temple Walkthrough", mediaCode: "MED-VID-004", type: "Video", size: "48 MB", language: "English", uploadedBy: "Admin Name", createdDate: "12 Jun 2026", status: "DRAFT" },
];

const typeOptions = [
  { label: "All media", value: "all" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "Audio", value: "audio" },
  { label: "Document", value: "document" },
];

const languageOptions = [
  { label: "All languages", value: "all" },
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Gujarati", value: "gu" },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Archived", value: "ARCHIVED" },
  { label: "Draft", value: "DRAFT" },
];

const uploaderOptions = [
  { label: "All uploaders", value: "all" },
  { label: "Admin Name", value: "admin" },
  { label: "Content Team", value: "content-team" },
  { label: "Reviewer", value: "reviewer" },
];

function MediaIcon({ type }: { type: MediaType }) {
  const icon = {
    Image: <ImageIcon />,
    Video: <Video />,
    Audio: <FileAudio />,
    Document: <FileText />,
  }[type];

  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">
      {icon}
    </span>
  );
}

function MediaStatusBadge({ status }: { status: MediaStatus }) {
  const variant = status === "ACTIVE" ? "success" : status === "ARCHIVED" ? "secondary" : "warning";
  return <Badge variant={variant}>{status}</Badge>;
}

function MediaFilters() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
      <Select options={typeOptions} placeholder="Media Type" />
      <Select options={languageOptions} placeholder="Language" />
      <Select options={statusOptions} placeholder="Status" />
      <Input aria-label="Date filter" placeholder="Date" type="date" />
      <Select options={uploaderOptions} placeholder="Uploader" />
    </div>
  );
}

function MediaActions({ item }: { item: MediaRecord }) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-1">
      <Button aria-label={`View ${item.title}`} render={<Link href={`/media/${item.id}`} />} size="icon-sm" variant="ghost"><Eye /></Button>
      <AdminOnly>
        <Button aria-label="Download placeholder" size="icon-sm" type="button" variant="ghost"><Download /></Button>
        <Button aria-label="Replace placeholder" size="icon-sm" type="button" variant="ghost"><Replace /></Button>
        <Button aria-label="Delete placeholder" onClick={() => setDeleteOpen(true)} size="icon-sm" type="button" variant="ghost"><Trash2 /></Button>
        <ConfirmationDialog
          action="delete"
          message="Delete media placeholder only. No file will be changed."
          onConfirm={() => setDeleteOpen(false)}
          onOpenChange={setDeleteOpen}
          open={deleteOpen}
          title="Delete media"
        />
      </AdminOnly>
    </div>
  );
}

const columns: ColumnDef<MediaRecord>[] = [
  { header: "Thumbnail", cell: ({ row }) => <MediaIcon type={row.original.type} /> },
  { accessorKey: "title", header: "Title", cell: ({ row }) => <span className="font-medium">{row.original.title}</span> },
  { accessorKey: "mediaCode", header: "Media Code" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "size", header: "Size" },
  { accessorKey: "language", header: "Language" },
  { accessorKey: "uploadedBy", header: "Uploaded By" },
  { accessorKey: "createdDate", header: "Created Date" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <MediaStatusBadge status={row.original.status} /> },
  { id: "actions", header: "Actions", cell: ({ row }) => <MediaActions item={row.original} /> },
];

function MediaGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Media grid">
      {mediaItems.map((item) => (
        <Card hover key={item.id} variant="elevated">
          <CardContent className="space-y-4">
            <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20">
              <MediaIcon type={item.type} />
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.mediaCode} · {item.size}</p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <MediaStatusBadge status={item.status} />
              <MediaActions item={item} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MediaLibraryPageContent() {
  const [view, setView] = useState<"grid" | "table">("grid");

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Media Library</p>
            <h1 className="text-3xl font-semibold tracking-tight">Enterprise Media Library</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage media assets with dummy data and placeholder actions.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RoleBadge />
            <AdminOnly>
              <Button render={<Link href="/admin/media/upload" />} leftIcon={<Upload />}>Upload Media</Button>
            </AdminOnly>
          </div>
        </header>

        <Card className="glass-panel shadow-soft">
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <MediaFilters />
              <div className="flex gap-2" role="toolbar" aria-label="Media view switcher">
                <Button aria-pressed={view === "grid"} onClick={() => setView("grid")} size="sm" type="button" variant={view === "grid" ? "primary" : "outline"}><Grid2X2 />Grid</Button>
                <Button aria-pressed={view === "table"} onClick={() => setView("table")} size="sm" type="button" variant={view === "table" ? "primary" : "outline"}><Table2 />Table</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {view === "grid" ? (
          <>
            <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Bulk media actions">
              <Button size="sm" type="button" variant="destructive"><Trash2 />Delete</Button>
              <Button size="sm" type="button" variant="outline"><Archive />Archive</Button>
              <Button size="sm" type="button" variant="outline"><Download />Download</Button>
              <Button size="sm" type="button" variant="outline"><Move />Move</Button>
              <Button size="sm" type="button" variant="outline"><Replace />Replace Placeholder</Button>
            </div>
            <MediaGrid />
          </>
        ) : (
          <DataTable
            bulkActions={
              <AdminOnly>
                <Button size="sm" type="button" variant="destructive">Delete</Button>
                <Button size="sm" type="button" variant="outline">Archive</Button>
                <Button size="sm" type="button" variant="outline">Download</Button>
                <Button size="sm" type="button" variant="outline">Move</Button>
                <Button size="sm" type="button" variant="outline">Replace</Button>
              </AdminOnly>
            }
            columns={columns}
            data={mediaItems}
            exportPlaceholder={() => undefined}
            filters={<MediaFilters />}
            onRefresh={() => undefined}
            searchPlaceholder="Search media..."
          />
        )}
      </div>
    </PermissionGate>
  );
}

type UploadFormValues = {
  title: string;
  mediaCode: string;
  description: string;
};

function UploadPlaceholder({ description, icon, title }: { description: string; icon: React.ReactNode; title: string }) {
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

export function UploadMediaPageContent() {
  const form = useForm<UploadFormValues>({ defaultValues: { title: "", mediaCode: "", description: "" } });

  return (
    <AdminOnly>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Media Library</p>
          <h1 className="text-3xl font-semibold tracking-tight">Upload Media</h1>
          <p className="mt-2 text-sm text-muted-foreground">Upload workflow placeholders only. No files are stored.</p>
        </header>
        <Form {...form} onSubmit={(event) => event.preventDefault()}>
          <FormSection columns={2} title="Upload Details" description="Media metadata and upload placeholders.">
            <Input label="Title" required {...form.register("title")} />
            <Input label="Media Code" required {...form.register("mediaCode")} />
            <Select options={typeOptions.slice(1)} placeholder="Media Type" />
            <Select options={languageOptions.slice(1)} placeholder="Language" />
            <Textarea label="Description" wrapperClassName="md:col-span-2" {...form.register("description")} />
          </FormSection>
          <FormSection columns={2} title="Upload Placeholders" description="Single, multiple, drag & drop, and folder placeholders.">
            <UploadPlaceholder icon={<Upload />} title="Single Upload Placeholder" description="Single asset upload UI placeholder." />
            <UploadPlaceholder icon={<Plus />} title="Multiple Upload Placeholder" description="Multiple asset upload UI placeholder." />
            <UploadPlaceholder icon={<Move />} title="Drag & Drop Placeholder" description="Drop zone placeholder for future uploads." />
            <UploadPlaceholder icon={<Folder />} title="Folder Placeholder" description="Folder selection placeholder." />
          </FormSection>
          <FormActions canReset dirty={form.formState.isDirty} onCancel={() => undefined} onReset={() => form.reset()} sticky submitLabel="Upload placeholder" />
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

export function MediaDetailsPageContent() {
  const item = mediaItems[0];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Media Details</p>
          <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{item.mediaCode} · {item.type}</p>
        </header>
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]" aria-label="Media preview and metadata">
          <Card className="glass-panel shadow-soft">
            <CardContent>
              <div className="flex aspect-video items-center justify-center rounded-3xl border border-dashed border-border bg-muted/20">
                <MediaIcon type={item.type} />
              </div>
            </CardContent>
          </Card>
          <DetailCard icon={<FileText />} title="Metadata">
            <div className="grid gap-3 text-sm">
              <p><span className="text-muted-foreground">Size:</span> {item.size}</p>
              <p><span className="text-muted-foreground">Language:</span> {item.language}</p>
              <p><span className="text-muted-foreground">Uploaded By:</span> {item.uploadedBy}</p>
              <p><span className="text-muted-foreground">Created:</span> {item.createdDate}</p>
              <MediaStatusBadge status={item.status} />
            </div>
          </DetailCard>
        </section>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Media operational placeholders">
          <DetailCard icon={<SearchCheck />} title="SEO"><p className="text-sm text-muted-foreground">SEO metadata placeholder.</p></DetailCard>
          <DetailCard icon={<Eye />} title="Usage Placeholder"><p className="text-sm text-muted-foreground">Content and entity usage placeholder.</p></DetailCard>
          <DetailCard icon={<Replace />} title="Versions Placeholder"><p className="text-sm text-muted-foreground">Media version history placeholder.</p></DetailCard>
          <DetailCard icon={<History />} title="History Placeholder"><p className="text-sm text-muted-foreground">Audit history placeholder.</p></DetailCard>
        </section>
      </div>
    </PermissionGate>
  );
}
