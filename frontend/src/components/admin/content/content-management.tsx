"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarClock, Eye, ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useContentCategories,
  useContentItem,
  useContentItems,
  useCreateContentItem,
  useDeleteContentItem,
  useUpdateContentItem,
  useUpdateContentItemStatus,
} from "@/hooks/queries/use-entities";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import { createCrudService } from "@/services/create-crud-service";
import type { EntityRecord } from "@/services/create-crud-service";
import { formatDateTime, getBoolean, getString } from "@/utils/record-helpers";

const REFERENCE_LIST_PARAMS = { page: 1, limit: 500 };
const contentTypesService = createCrudService("/content-types");

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Archived", value: "ARCHIVED" },
];

const booleanFilterOptions = [
  { label: "Any", value: "all" },
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

function recordsToOptions(records: EntityRecord[], labelKey = "name") {
  return records
    .map((record) => ({
      label: getString(record, labelKey),
      value: getString(record, "id", ""),
    }))
    .filter((option) => option.value);
}

function withAllOption(options: { label: string; value: string }[], allLabel: string) {
  return [{ label: allLabel, value: "all" }, ...options];
}

function buildLookup(records: EntityRecord[]) {
  return new Map(records.map((record) => [getString(record, "id", ""), getString(record, "name")]));
}

function ContentStatusBadge({ status }: { status: string }) {
  const variant =
    status === "ACTIVE" ? "success" : status === "INACTIVE" ? "warning" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

function ContentThumbnail() {
  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <ImageIcon className="size-5" />
    </span>
  );
}

function ContentRowActions({ record }: { record: EntityRecord }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteContent = useDeleteContentItem();
  const updateStatus = useUpdateContentItemStatus();
  const id = getString(record, "id", "");
  const title = getString(record, "title");
  const status = getString(record, "status");

  return (
    <div className="flex flex-wrap gap-1">
      <Button aria-label={`View ${title}`} render={<Link href={`/admin/content/${id}`} />} size="icon-sm" variant="ghost">
        <Eye />
      </Button>
      <AdminOnly>
        <Button aria-label={`Edit ${title}`} render={<Link href={`/admin/content/${id}/edit`} />} size="icon-sm" variant="ghost">
          <Pencil />
        </Button>
        <Button
          aria-label={status === "ACTIVE" ? "Archive content" : "Activate content"}
          disabled={updateStatus.isPending}
          onClick={() =>
            updateStatus.mutate({
              id,
              status: status === "ACTIVE" ? "ARCHIVED" : "ACTIVE",
            })
          }
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <CalendarClock />
        </Button>
        <Button aria-label="Delete content" onClick={() => setDeleteOpen(true)} size="icon-sm" type="button" variant="ghost">
          <Trash2 />
        </Button>
        <ConfirmationDialog
          action="delete"
          message={`Delete ${title}? This action updates the database record.`}
          onConfirm={() => deleteContent.mutate(id, { onSuccess: () => setDeleteOpen(false) })}
          onOpenChange={setDeleteOpen}
          open={deleteOpen}
          title="Delete content"
        />
      </AdminOnly>
    </div>
  );
}

export function ContentListPageContent() {
  const listParams = useListQueryParams();
  const { data, isLoading, isError, error, refetch, isFetching } = useContentItems(listParams.params);
  const { data: contentTypesData } = useQuery({
    queryKey: ["content-types", "list", REFERENCE_LIST_PARAMS],
    queryFn: () => contentTypesService.list(REFERENCE_LIST_PARAMS),
  });
  const { data: categoriesData } = useContentCategories(REFERENCE_LIST_PARAMS);

  const typeLookup = useMemo(() => buildLookup(contentTypesData?.items ?? []), [contentTypesData?.items]);
  const categoryLookup = useMemo(() => buildLookup(categoriesData?.items ?? []), [categoriesData?.items]);

  const columns = useMemo<ColumnDef<EntityRecord>[]>(
    () => [
      { header: "Thumbnail", cell: () => <ContentThumbnail /> },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => <span className="font-medium">{getString(row.original, "title")}</span>,
      },
      { accessorKey: "contentCode", header: "Content Code", cell: ({ row }) => getString(row.original, "contentCode") },
      {
        id: "type",
        header: "Type",
        cell: ({ row }) => typeLookup.get(getString(row.original, "contentTypeId", "")) ?? "—",
      },
      {
        id: "category",
        header: "Category",
        cell: ({ row }) => categoryLookup.get(getString(row.original, "categoryId", "")) ?? "—",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <ContentStatusBadge status={getString(row.original, "status")} />,
      },
      {
        accessorKey: "isFeatured",
        header: "Featured",
        cell: ({ row }) => (
          <Badge variant={getBoolean(row.original, "isFeatured") ? "success" : "secondary"}>
            {getBoolean(row.original, "isFeatured") ? "Yes" : "No"}
          </Badge>
        ),
      },
      {
        accessorKey: "isPopular",
        header: "Popular",
        cell: ({ row }) => (
          <Badge variant={getBoolean(row.original, "isPopular") ? "info" : "secondary"}>
            {getBoolean(row.original, "isPopular") ? "Yes" : "No"}
          </Badge>
        ),
      },
      {
        accessorKey: "publishedAt",
        header: "Published",
        cell: ({ row }) => formatDateTime(row.original.publishedAt),
      },
      { id: "actions", header: "Actions", cell: ({ row }) => <ContentRowActions record={row.original} /> },
    ],
    [categoryLookup, typeLookup],
  );

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Content</p>
            <h1 className="text-3xl font-semibold tracking-tight">Content Engine</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage content items from PostgreSQL via the content-items API.</p>
          </div>
          <AdminOnly>
            <Button render={<Link href="/admin/content/create" />} leftIcon={<Plus />}>
              Create Content
            </Button>
          </AdminOnly>
        </header>

        <DataTable
          columns={columns}
          data={data?.items ?? []}
          emptyState={<EmptyState description="No content items match your filters." title="No content found" />}
          error={
            isError ? (
              <ErrorState description={error?.message ?? "Failed to load content."} onRetry={() => void refetch()} />
            ) : undefined
          }
          filters={
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <Select
                onValueChange={(value) =>
                  listParams.setFilter("contentTypeId", value === "all" ? undefined : value)
                }
                options={withAllOption(recordsToOptions(contentTypesData?.items ?? []), "All types")}
                placeholder="Content Type"
                value={(listParams.state.filters.contentTypeId as string) ?? "all"}
              />
              <Select
                onValueChange={(value) => listParams.setFilter("categoryId", value === "all" ? undefined : value)}
                options={withAllOption(recordsToOptions(categoriesData?.items ?? []), "All categories")}
                placeholder="Category"
                value={(listParams.state.filters.categoryId as string) ?? "all"}
              />
              <Select
                onValueChange={(value) => listParams.setStatus(value === "all" ? undefined : value)}
                options={statusOptions}
                placeholder="Status"
                value={listParams.state.status ?? "all"}
              />
              <Select
                onValueChange={(value) =>
                  listParams.setFilter(
                    "isFeatured",
                    value === "yes" ? true : value === "no" ? false : undefined,
                  )
                }
                options={booleanFilterOptions}
                placeholder="Featured"
                value={
                  listParams.state.filters.isFeatured === true
                    ? "yes"
                    : listParams.state.filters.isFeatured === false
                      ? "no"
                      : "all"
                }
              />
            </div>
          }
          loading={isLoading}
          onRefresh={() => refetch()}
          refreshLoading={isFetching}
          searchPlaceholder="Search content..."
        />

        <ServerPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
      </div>
    </PermissionGate>
  );
}

type ContentFormValues = {
  contentTypeId: string;
  categoryId: string;
  contentCode: string;
  slug: string;
  title: string;
  shortDescription: string;
  status: string;
  isFeatured: boolean;
  isPopular: boolean;
  publishedAt: string;
  sortOrder: number;
};

export function ContentFormPageContent({ mode }: { mode: "create" | "edit" }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const contentId = mode === "edit" ? params.id : "";
  const { data: existing, isLoading, isError, error, refetch } = useContentItem(contentId, mode === "edit");
  const createContent = useCreateContentItem();
  const updateContent = useUpdateContentItem();

  const { data: contentTypesData } = useQuery({
    queryKey: ["content-types", "list", REFERENCE_LIST_PARAMS],
    queryFn: () => contentTypesService.list(REFERENCE_LIST_PARAMS),
  });
  const { data: categoriesData } = useContentCategories(REFERENCE_LIST_PARAMS);
  const typeOptions = recordsToOptions(contentTypesData?.items ?? []);
  const categoryOptions = recordsToOptions(categoriesData?.items ?? []);

  const form = useForm<ContentFormValues>({
    values:
      mode === "edit" && existing
        ? {
            contentTypeId: getString(existing, "contentTypeId"),
            categoryId: getString(existing, "categoryId", ""),
            contentCode: getString(existing, "contentCode"),
            slug: getString(existing, "slug"),
            title: getString(existing, "title"),
            shortDescription: getString(existing, "shortDescription", ""),
            status: getString(existing, "status", "ACTIVE"),
            isFeatured: getBoolean(existing, "isFeatured"),
            isPopular: getBoolean(existing, "isPopular"),
            publishedAt: existing.publishedAt ? String(existing.publishedAt).slice(0, 16) : "",
            sortOrder: Number(existing.sortOrder ?? 0),
          }
        : {
            contentTypeId: "",
            categoryId: "",
            contentCode: "",
            slug: "",
            title: "",
            shortDescription: "",
            status: "ACTIVE",
            isFeatured: false,
            isPopular: false,
            publishedAt: "",
            sortOrder: 0,
          },
  });

  async function onSubmit(values: ContentFormValues) {
    const payload: Record<string, unknown> = {
      contentTypeId: values.contentTypeId,
      categoryId: values.categoryId || undefined,
      contentCode: values.contentCode,
      slug: values.slug,
      title: values.title,
      shortDescription: values.shortDescription || undefined,
      status: values.status,
      isFeatured: values.isFeatured,
      isPopular: values.isPopular,
      publishedAt: values.publishedAt ? new Date(values.publishedAt).toISOString() : undefined,
      sortOrder: values.sortOrder,
    };

    if (mode === "create") {
      createContent.mutate(payload, {
        onSuccess: (record) => router.push(`/admin/content/${getString(record, "id")}`),
      });
      return;
    }

    updateContent.mutate({ id: contentId, payload }, { onSuccess: () => router.push(`/admin/content/${contentId}`) });
  }

  return (
    <AdminOnly>
      <AsyncQueryBoundary
        error={error}
        isError={mode === "edit" && isError}
        isLoading={mode === "edit" && isLoading}
        loadingLabel="Loading content..."
        onRetry={() => refetch()}
      >
        <div className="space-y-6">
          <header>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Content Engine</p>
            <h1 className="text-3xl font-semibold tracking-tight">{mode === "create" ? "Create Content" : "Edit Content"}</h1>
          </header>

          <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormSection columns={2} description="Core content information." title="General">
              <div className="grid gap-2">
                <span className="text-sm font-medium">Content Type</span>
                <Select
                  onValueChange={(value) => form.setValue("contentTypeId", value, { shouldDirty: true })}
                  options={typeOptions}
                  placeholder="Select content type"
                  value={form.watch("contentTypeId")}
                />
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Category</span>
                <Select
                  onValueChange={(value) => form.setValue("categoryId", value, { shouldDirty: true })}
                  options={categoryOptions}
                  placeholder="Select category"
                  value={form.watch("categoryId")}
                />
              </div>
              <Input label="Content Code" required {...form.register("contentCode", { required: true })} />
              <Input label="Slug" required {...form.register("slug", { required: true })} />
              <Input label="Title" required {...form.register("title", { required: true })} />
              <div className="grid gap-2">
                <span className="text-sm font-medium">Status</span>
                <Select
                  onValueChange={(value) => form.setValue("status", value, { shouldDirty: true })}
                  options={statusOptions.slice(1)}
                  placeholder="Select status"
                  value={form.watch("status")}
                />
              </div>
              <Textarea label="Short Description" wrapperClassName="md:col-span-2" {...form.register("shortDescription")} />
              <Input label="Publish Date" type="datetime-local" {...form.register("publishedAt")} />
              <Input label="Sort Order" type="number" {...form.register("sortOrder", { valueAsNumber: true })} />
              <Switch
                checked={form.watch("isFeatured")}
                description="Highlight content on featured surfaces."
                label="Featured"
                onCheckedChange={(checked) => form.setValue("isFeatured", checked, { shouldDirty: true })}
              />
              <Switch
                checked={form.watch("isPopular")}
                description="Mark content as popular."
                label="Popular"
                onCheckedChange={(checked) => form.setValue("isPopular", checked, { shouldDirty: true })}
              />
            </FormSection>

            <FormActions
              canReset
              dirty={form.formState.isDirty}
              submitting={createContent.isPending || updateContent.isPending}
              onCancel={() => router.back()}
              onReset={() => form.reset()}
              sticky
              submitLabel={mode === "create" ? "Create Content" : "Save Changes"}
            />
          </Form>
        </div>
      </AsyncQueryBoundary>
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
  const params = useParams<{ id: string }>();
  const { data: content, isLoading, isError, error, refetch } = useContentItem(params.id);
  const { data: contentTypesData } = useQuery({
    queryKey: ["content-types", "list", REFERENCE_LIST_PARAMS],
    queryFn: () => contentTypesService.list(REFERENCE_LIST_PARAMS),
  });
  const { data: categoriesData } = useContentCategories(REFERENCE_LIST_PARAMS);
  const typeLookup = useMemo(() => buildLookup(contentTypesData?.items ?? []), [contentTypesData?.items]);
  const categoryLookup = useMemo(() => buildLookup(categoriesData?.items ?? []), [categoriesData?.items]);

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel="Loading content..."
        onRetry={() => refetch()}
      >
        {content ? (
          <div className="space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Content Details</p>
                <h1 className="text-3xl font-semibold tracking-tight">{getString(content, "title")}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {getString(content, "contentCode")} · {categoryLookup.get(getString(content, "categoryId", "")) ?? "—"}
                </p>
              </div>
              <AdminOnly>
                <Button render={<Link href={`/admin/content/${params.id}/edit`} />} leftIcon={<Pencil />}>
                  Edit Content
                </Button>
              </AdminOnly>
            </header>

            <DetailSection title="Overview">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{typeLookup.get(getString(content, "contentTypeId", "")) ?? "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <ContentStatusBadge status={getString(content, "status")} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Featured</p>
                  <Badge variant={getBoolean(content, "isFeatured") ? "success" : "secondary"}>
                    {getBoolean(content, "isFeatured") ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Popular</p>
                  <Badge variant={getBoolean(content, "isPopular") ? "info" : "secondary"}>
                    {getBoolean(content, "isPopular") ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{getString(content, "shortDescription")}</p>
            </DetailSection>

            <section className="grid gap-4 lg:grid-cols-3" aria-label="Content metadata">
              <DetailSection title="Published">
                <p className="text-sm text-muted-foreground">{formatDateTime(content.publishedAt)}</p>
              </DetailSection>
              <DetailSection title="Created">
                <p className="text-sm text-muted-foreground">{formatDateTime(content.createdAt)}</p>
              </DetailSection>
              <DetailSection title="Updated">
                <p className="text-sm text-muted-foreground">{formatDateTime(content.updatedAt)}</p>
              </DetailSection>
            </section>
          </div>
        ) : null}
      </AsyncQueryBoundary>
    </PermissionGate>
  );
}
