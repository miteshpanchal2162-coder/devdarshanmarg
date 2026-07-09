"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  FileAudio,
  FileText,
  Grid2X2,
  ImageIcon,
  Table2,
  Trash2,
  Upload,
  Video,
} from "lucide-react";

import { ServerPagination } from "@/components/admin/common/server-pagination";
import { AsyncQueryBoundary } from "@/components/common/async-query-boundary";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { EmptyState, ErrorState } from "@/components/ui/enterprise";
import { Form, FormActions, FormSection } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { AdminOnly, PermissionGate } from "@/components/ui/permission";
import { Select } from "@/components/ui/select";
import { useUploadMedia } from "@/hooks/mutations/use-media-mutations";
import { useDeleteMediaItem, useMediaItem, useMediaItems } from "@/hooks/queries/use-entities";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import type { EntityRecord } from "@/services/create-crud-service";
import { formatDateTime, getNumber, getString } from "@/utils/record-helpers";

const mediaTypeOptions = [
  { label: "All media", value: "all" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "Document", value: "document" },
];

const folderOptions = [
  { label: "Temples", value: "temples" },
  { label: "Festivals", value: "festivals" },
  { label: "Deities", value: "deities" },
  { label: "Contents", value: "contents" },
  { label: "Panchang", value: "panchang" },
  { label: "Users", value: "users" },
  { label: "Temp", value: "temp" },
];

function formatFileSize(bytes: number) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function mediaTypeIcon(type: string) {
  switch (type) {
    case "image":
      return <ImageIcon />;
    case "video":
      return <Video />;
    case "document":
      return <FileText />;
    default:
      return <FileAudio />;
  }
}

function MediaIcon({ type }: { type: string }) {
  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">
      {mediaTypeIcon(type)}
    </span>
  );
}

function MediaRowActions({ record }: { record: EntityRecord }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteMedia = useDeleteMediaItem();
  const id = getString(record, "id", "");
  const name = getString(record, "originalName");

  return (
    <div className="flex flex-wrap gap-1">
      <Button aria-label={`View ${name}`} render={<Link href={`/admin/media/${id}`} />} size="icon-sm" variant="ghost">
        <Eye />
      </Button>
      <AdminOnly>
        <Button aria-label="Delete media" onClick={() => setDeleteOpen(true)} size="icon-sm" type="button" variant="ghost">
          <Trash2 />
        </Button>
        <ConfirmationDialog
          action="delete"
          message={`Delete ${name}? The file will be removed from storage.`}
          onConfirm={() => deleteMedia.mutate(id, { onSuccess: () => setDeleteOpen(false) })}
          onOpenChange={setDeleteOpen}
          open={deleteOpen}
          title="Delete media"
        />
      </AdminOnly>
    </div>
  );
}

function MediaFilters({
  listParams,
}: {
  listParams: ReturnType<typeof useListQueryParams>;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      <Select
        onValueChange={(value) => listParams.setFilter("mediaType", value === "all" ? undefined : value)}
        options={mediaTypeOptions}
        placeholder="Media Type"
        value={(listParams.state.filters.mediaType as string) ?? "all"}
      />
    </div>
  );
}

function MediaGrid({ items }: { items: EntityRecord[] }) {
  if (!items.length) {
    return <EmptyState description="No media items match your filters." title="No media found" />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Media grid">
      {items.map((item) => {
        const id = getString(item, "id", "");
        const name = getString(item, "originalName");
        const type = getString(item, "mediaType", "document");
        return (
          <Card hover key={id} variant="elevated">
            <CardContent className="space-y-4">
              <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20">
                <MediaIcon type={type} />
              </div>
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-muted-foreground">
                  {getString(item, "mimeType")} · {formatFileSize(getNumber(item, "fileSize"))}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary">{type}</Badge>
                <MediaRowActions record={item} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function MediaLibraryPageContent() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const listParams = useListQueryParams();
  const { data, isLoading, isError, error, refetch, isFetching } = useMediaItems(listParams.params);

  const columns = useMemo<ColumnDef<EntityRecord>[]>(
    () => [
      { header: "Preview", cell: ({ row }) => <MediaIcon type={getString(row.original, "mediaType", "document")} /> },
      {
        accessorKey: "originalName",
        header: "Name",
        cell: ({ row }) => <span className="font-medium">{getString(row.original, "originalName")}</span>,
      },
      { accessorKey: "filename", header: "Filename", cell: ({ row }) => getString(row.original, "filename") },
      { accessorKey: "mediaType", header: "Type", cell: ({ row }) => getString(row.original, "mediaType") },
      {
        accessorKey: "fileSize",
        header: "Size",
        cell: ({ row }) => formatFileSize(getNumber(row.original, "fileSize")),
      },
      { accessorKey: "mimeType", header: "MIME Type", cell: ({ row }) => getString(row.original, "mimeType") },
      {
        accessorKey: "createdAt",
        header: "Uploaded",
        cell: ({ row }) => formatDateTime(row.original.createdAt),
      },
      { id: "actions", header: "Actions", cell: ({ row }) => <MediaRowActions record={row.original} /> },
    ],
    [],
  );

  const rows = data?.items ?? [];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Media Library</p>
            <h1 className="text-3xl font-semibold tracking-tight">Enterprise Media Library</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage media assets from PostgreSQL via the media-library API.</p>
          </div>
          <AdminOnly>
            <Button render={<Link href="/admin/media/upload" />} leftIcon={<Upload />}>
              Upload Media
            </Button>
          </AdminOnly>
        </header>

        <Card className="glass-panel shadow-soft">
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <MediaFilters listParams={listParams} />
              <div className="flex gap-2" role="toolbar" aria-label="Media view switcher">
                <Button
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                  size="sm"
                  type="button"
                  variant={view === "grid" ? "primary" : "outline"}
                >
                  <Grid2X2 />
                  Grid
                </Button>
                <Button
                  aria-pressed={view === "table"}
                  onClick={() => setView("table")}
                  size="sm"
                  type="button"
                  variant={view === "table" ? "primary" : "outline"}
                >
                  <Table2 />
                  Table
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {view === "grid" ? (
          <>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading media...</p>
            ) : isError ? (
              <ErrorState description={error?.message ?? "Failed to load media."} onRetry={() => void refetch()} />
            ) : (
              <MediaGrid items={rows} />
            )}
            <ServerPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
          </>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={rows}
              emptyState={<EmptyState description="No media items match your filters." title="No media found" />}
              error={
                isError ? (
                  <ErrorState description={error?.message ?? "Failed to load media."} onRetry={() => void refetch()} />
                ) : undefined
              }
              filters={<MediaFilters listParams={listParams} />}
              loading={isLoading}
              onRefresh={() => refetch()}
              refreshLoading={isFetching}
              searchPlaceholder="Search media..."
            />
            <ServerPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
          </>
        )}
      </div>
    </PermissionGate>
  );
}

type UploadFormValues = {
  folder: string;
  altText: string;
};

function resolveUploadKind(file: File): "image" | "document" | "any" {
  if (file.type.startsWith("image/")) return "image";
  if (
    file.type.startsWith("application/") ||
    file.type.includes("pdf") ||
    file.type.includes("document")
  ) {
    return "document";
  }
  return "any";
}

export function UploadMediaPageContent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const uploadMedia = useUploadMedia();

  const form = useForm<UploadFormValues>({
    defaultValues: { folder: "contents", altText: "" },
  });

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  }

  async function onSubmit(values: UploadFormValues) {
    if (!selectedFile) return;

    uploadMedia.mutate(
      {
        file: selectedFile,
        folder: values.folder,
        altText: values.altText || undefined,
        kind: resolveUploadKind(selectedFile),
      },
      {
        onSuccess: (record) => router.push(`/admin/media/${getString(record, "id")}`),
      },
    );
  }

  return (
    <AdminOnly>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Media Library</p>
          <h1 className="text-3xl font-semibold tracking-tight">Upload Media</h1>
          <p className="mt-2 text-sm text-muted-foreground">Upload files to the media library with live preview.</p>
        </header>

        <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
          <FormSection columns={2} description="Select a file and storage folder." title="Upload Details">
            <div className="grid gap-2 md:col-span-2">
              <span className="text-sm font-medium">File</span>
              <Input
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                onChange={onFileChange}
                ref={fileInputRef}
                type="file"
              />
              {selectedFile ? (
                <p className="text-sm text-muted-foreground">
                  {selectedFile.name} · {formatFileSize(selectedFile.size)}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium">Folder</span>
              <Select
                onValueChange={(value) => form.setValue("folder", value, { shouldDirty: true })}
                options={folderOptions}
                placeholder="Select folder"
                value={form.watch("folder")}
              />
            </div>
            <Input label="Alt Text" {...form.register("altText")} />
            <div className="md:col-span-2">
              <Card className="border-dashed" variant="outlined">
                <CardContent className="flex min-h-48 items-center justify-center">
                  {previewUrl && selectedFile?.type.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={form.watch("altText") || selectedFile.name} className="max-h-64 rounded-xl object-contain" src={previewUrl} />
                  ) : selectedFile ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <MediaIcon type={resolveUploadKind(selectedFile) === "image" ? "image" : "document"} />
                      <p className="text-sm">{selectedFile.name}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="size-8" />
                      <p className="text-sm">Choose a file to preview</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </FormSection>

          <FormActions
            canReset
            dirty={Boolean(selectedFile) || form.formState.isDirty}
            submitting={uploadMedia.isPending}
            onCancel={() => router.push("/admin/media")}
            onReset={() => {
              form.reset();
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            sticky
            submitLabel="Upload Media"
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

export function MediaDetailsPageContent() {
  const params = useParams<{ id: string }>();
  const { data: item, isLoading, isError, error, refetch } = useMediaItem(params.id);

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel="Loading media..."
        onRetry={() => refetch()}
      >
        {item ? (
          <div className="space-y-6">
            <header>
              <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Media Details</p>
              <h1 className="text-3xl font-semibold tracking-tight">{getString(item, "originalName")}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {getString(item, "mimeType")} · {getString(item, "mediaType")}
              </p>
            </header>

            <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]" aria-label="Media preview and metadata">
              <Card className="glass-panel shadow-soft">
                <CardContent>
                  <div className="flex aspect-video items-center justify-center rounded-3xl border border-dashed border-border bg-muted/20">
                    <MediaIcon type={getString(item, "mediaType", "document")} />
                  </div>
                </CardContent>
              </Card>
              <DetailCard icon={<FileText />} title="Metadata">
                <div className="grid gap-3 text-sm">
                  <p>
                    <span className="text-muted-foreground">Filename:</span> {getString(item, "filename")}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Size:</span> {formatFileSize(getNumber(item, "fileSize"))}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Storage Path:</span> {getString(item, "storagePath")}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Alt Text:</span> {getString(item, "altText")}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Uploaded:</span> {formatDateTime(item.createdAt)}
                  </p>
                  <Badge variant="secondary">{getString(item, "mediaType")}</Badge>
                </div>
              </DetailCard>
            </section>
          </div>
        ) : null}
      </AsyncQueryBoundary>
    </PermissionGate>
  );
}
