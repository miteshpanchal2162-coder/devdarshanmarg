"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { ServerPagination } from "@/components/admin/common/server-pagination";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState, ErrorState } from "@/components/ui/enterprise";
import { Form, FormActions, FormSection } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { AdminOnly, PermissionGate } from "@/components/ui/permission";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  useCreateSeoLandingPage,
  useCreateSeoRedirect,
  useDeleteSeoLandingPage,
  useDeleteSeoRedirect,
  useSeoLandingPages,
  useSeoRedirects,
  useSupportedLanguages,
  useUpdateSeoLandingPage,
  useUpdateSeoRedirect,
} from "@/hooks/queries/use-entities";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import type { EntityRecord } from "@/services/create-crud-service";
import { formatDateTime, getBoolean, getString } from "@/utils/record-helpers";

function ActiveBadge({ active }: { active: boolean }) {
  return <Badge variant={active ? "success" : "secondary"}>{active ? "Active" : "Inactive"}</Badge>;
}

function SeoRowActions({
  record,
  entityLabel,
  onEdit,
  useDelete,
}: {
  record: EntityRecord;
  entityLabel: string;
  onEdit: (record: EntityRecord) => void;
  useDelete: () => ReturnType<typeof useDeleteSeoRedirect>;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteEntity = useDelete();
  const id = getString(record, "id", "");
  const label = getString(record, "fromPath") || getString(record, "slug") || getString(record, "title");

  return (
    <div className="flex flex-wrap gap-1">
      <AdminOnly>
        <Button aria-label={`Edit ${label}`} onClick={() => onEdit(record)} size="icon-sm" type="button" variant="ghost">
          <Pencil />
        </Button>
        <Button aria-label={`Delete ${label}`} onClick={() => setDeleteOpen(true)} size="icon-sm" type="button" variant="ghost">
          <Trash2 />
        </Button>
        <ConfirmationDialog
          action="delete"
          message={`Delete this ${entityLabel.toLowerCase()}? This action updates the database record.`}
          onConfirm={() => deleteEntity.mutate(id, { onSuccess: () => setDeleteOpen(false) })}
          onOpenChange={setDeleteOpen}
          open={deleteOpen}
          title={`Delete ${entityLabel.toLowerCase()}`}
        />
      </AdminOnly>
    </div>
  );
}

type RedirectFormValues = {
  fromPath: string;
  toPath: string;
  statusCode: string;
  isActive: boolean;
};

function RedirectFormDialog({
  mode,
  open,
  onOpenChange,
  initial,
}: {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: EntityRecord;
}) {
  const createRedirect = useCreateSeoRedirect();
  const updateRedirect = useUpdateSeoRedirect();

  const form = useForm<RedirectFormValues>({
    values: {
      fromPath: initial ? getString(initial, "fromPath", "") : "",
      toPath: initial ? getString(initial, "toPath", "") : "",
      statusCode: initial ? getString(initial, "statusCode", "301") : "301",
      isActive: initial ? getBoolean(initial, "isActive", true) : true,
    },
  });

  function onSubmit(values: RedirectFormValues) {
    const payload = {
      fromPath: values.fromPath,
      toPath: values.toPath,
      statusCode: Number(values.statusCode),
      isActive: values.isActive,
    };

    if (mode === "create") {
      createRedirect.mutate(payload, { onSuccess: () => onOpenChange(false) });
      return;
    }

    updateRedirect.mutate(
      { id: getString(initial ?? {}, "id", ""), payload },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Redirect" : "Edit Redirect"}</DialogTitle>
          <DialogDescription>Manage URL redirect rules for SEO.</DialogDescription>
        </DialogHeader>
        <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
          <FormSection columns={1} divider={false} title="Redirect">
            <Input label="From Path" required {...form.register("fromPath", { required: true })} />
            <Input label="To Path" required {...form.register("toPath", { required: true })} />
            <Input label="Status Code" required type="number" {...form.register("statusCode", { required: true })} />
            <Switch
              checked={form.watch("isActive")}
              label="Active"
              onCheckedChange={(checked) => form.setValue("isActive", checked, { shouldDirty: true })}
            />
          </FormSection>
          <FormActions
            submitting={createRedirect.isPending || updateRedirect.isPending}
            onCancel={() => onOpenChange(false)}
            submitLabel={mode === "create" ? "Create Redirect" : "Save Changes"}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function RedirectsTab() {
  const listParams = useListQueryParams();
  const { data, isLoading, isError, error, refetch, isFetching } = useSeoRedirects(listParams.params);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<EntityRecord | undefined>();

  const columns = useMemo<ColumnDef<EntityRecord>[]>(
    () => [
      { accessorKey: "fromPath", header: "From Path", cell: ({ row }) => <span className="font-medium">{getString(row.original, "fromPath")}</span> },
      { accessorKey: "toPath", header: "To Path", cell: ({ row }) => getString(row.original, "toPath") },
      { accessorKey: "statusCode", header: "Code", cell: ({ row }) => getString(row.original, "statusCode") },
      {
        accessorKey: "isActive",
        header: "Active",
        cell: ({ row }) => <ActiveBadge active={getBoolean(row.original, "isActive")} />,
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => formatDateTime(row.original.updatedAt),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <SeoRowActions
            entityLabel="Redirect"
            onEdit={(record) => {
              setSelected(record);
              setDialogMode("edit");
              setDialogOpen(true);
            }}
            record={row.original}
            useDelete={useDeleteSeoRedirect}
          />
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AdminOnly>
          <Button
            leftIcon={<Plus />}
            onClick={() => {
              setSelected(undefined);
              setDialogMode("create");
              setDialogOpen(true);
            }}
            type="button"
          >
            Create Redirect
          </Button>
        </AdminOnly>
      </div>
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        emptyState={<EmptyState description="No redirects match your filters." title="No redirects found" />}
        error={
          isError ? (
            <ErrorState description={error?.message ?? "Failed to load redirects."} onRetry={() => refetch()} />
          ) : undefined
        }
        loading={isLoading}
        onRefresh={() => refetch()}
        refreshLoading={isFetching}
        searchPlaceholder="Search redirects..."
      />
      <ServerPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
      <RedirectFormDialog initial={selected} mode={dialogMode} onOpenChange={setDialogOpen} open={dialogOpen} />
    </div>
  );
}

type LandingPageFormValues = {
  slug: string;
  language: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  isActive: boolean;
};

function LandingPageFormDialog({
  mode,
  open,
  onOpenChange,
  initial,
}: {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: EntityRecord;
}) {
  const createLandingPage = useCreateSeoLandingPage();
  const updateLandingPage = useUpdateSeoLandingPage();
  const { data: languagesData } = useSupportedLanguages({ page: 1, limit: 100, status: "ACTIVE" });
  const languageOptions = useMemo(
    () =>
      (languagesData?.items ?? []).map((item) => ({
        label: getString(item, "name", getString(item, "code")),
        value: getString(item, "code"),
      })),
    [languagesData],
  );

  const form = useForm<LandingPageFormValues>({
    values: {
      slug: initial ? getString(initial, "slug", "") : "",
      language: initial ? getString(initial, "language", "en") : "en",
      title: initial ? getString(initial, "title", "") : "",
      metaTitle: initial ? getString(initial, "metaTitle", "") : "",
      metaDescription: initial ? getString(initial, "metaDescription", "") : "",
      content: initial ? getString(initial, "content", "") : "",
      isActive: initial ? getBoolean(initial, "isActive", true) : true,
    },
  });

  function onSubmit(values: LandingPageFormValues) {
    const payload = {
      slug: values.slug,
      language: values.language,
      title: values.title,
      metaTitle: values.metaTitle || undefined,
      metaDescription: values.metaDescription || undefined,
      content: values.content || undefined,
      isActive: values.isActive,
    };

    if (mode === "create") {
      createLandingPage.mutate(payload, { onSuccess: () => onOpenChange(false) });
      return;
    }

    updateLandingPage.mutate(
      { id: getString(initial ?? {}, "id", ""), payload },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Landing Page" : "Edit Landing Page"}</DialogTitle>
          <DialogDescription>Manage SEO landing page metadata and content.</DialogDescription>
        </DialogHeader>
        <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
          <FormSection columns={2} divider={false} title="Landing Page">
            <Input label="Slug" required {...form.register("slug", { required: true })} />
            <div className="grid gap-2">
              <span className="text-sm font-medium">Language</span>
              <Select
                onValueChange={(value) => form.setValue("language", value, { shouldDirty: true })}
                options={languageOptions}
                placeholder="Select language"
                value={form.watch("language")}
              />
            </div>
            <Input label="Title" required wrapperClassName="md:col-span-2" {...form.register("title", { required: true })} />
            <Input label="Meta Title" wrapperClassName="md:col-span-2" {...form.register("metaTitle")} />
            <Textarea label="Meta Description" wrapperClassName="md:col-span-2" {...form.register("metaDescription")} />
            <Textarea label="Content" wrapperClassName="md:col-span-2" {...form.register("content")} />
            <Switch
              checked={form.watch("isActive")}
              label="Active"
              onCheckedChange={(checked) => form.setValue("isActive", checked, { shouldDirty: true })}
            />
          </FormSection>
          <FormActions
            submitting={createLandingPage.isPending || updateLandingPage.isPending}
            onCancel={() => onOpenChange(false)}
            submitLabel={mode === "create" ? "Create Landing Page" : "Save Changes"}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function LandingPagesTab() {
  const listParams = useListQueryParams();
  const { data, isLoading, isError, error, refetch, isFetching } = useSeoLandingPages(listParams.params);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<EntityRecord | undefined>();

  const columns = useMemo<ColumnDef<EntityRecord>[]>(
    () => [
      { accessorKey: "slug", header: "Slug", cell: ({ row }) => <span className="font-medium">{getString(row.original, "slug")}</span> },
      { accessorKey: "language", header: "Language", cell: ({ row }) => getString(row.original, "language") },
      { accessorKey: "title", header: "Title", cell: ({ row }) => getString(row.original, "title") },
      {
        accessorKey: "isActive",
        header: "Active",
        cell: ({ row }) => <ActiveBadge active={getBoolean(row.original, "isActive")} />,
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => formatDateTime(row.original.updatedAt),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <SeoRowActions
            entityLabel="Landing page"
            onEdit={(record) => {
              setSelected(record);
              setDialogMode("edit");
              setDialogOpen(true);
            }}
            record={row.original}
            useDelete={useDeleteSeoLandingPage}
          />
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AdminOnly>
          <Button
            leftIcon={<Plus />}
            onClick={() => {
              setSelected(undefined);
              setDialogMode("create");
              setDialogOpen(true);
            }}
            type="button"
          >
            Create Landing Page
          </Button>
        </AdminOnly>
      </div>
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        emptyState={<EmptyState description="No landing pages match your filters." title="No landing pages found" />}
        error={
          isError ? (
            <ErrorState description={error?.message ?? "Failed to load landing pages."} onRetry={() => refetch()} />
          ) : undefined
        }
        loading={isLoading}
        onRefresh={() => refetch()}
        refreshLoading={isFetching}
        searchPlaceholder="Search landing pages..."
      />
      <ServerPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
      <LandingPageFormDialog initial={selected} mode={dialogMode} onOpenChange={setDialogOpen} open={dialogOpen} />
    </div>
  );
}

export function SeoManagementPageContent() {
  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">SEO</p>
            <h1 className="text-3xl font-semibold tracking-tight">SEO Management</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage redirects and landing pages from the SEO API.</p>
          </div>
          <Button render={<Link href="/admin/settings/seo" />} type="button" variant="outline">
            SEO Settings
          </Button>
        </header>

        <Tabs defaultValue="redirects">
          <TabsList variant="line">
            <TabsTrigger value="redirects">Redirects</TabsTrigger>
            <TabsTrigger value="landing-pages">Landing Pages</TabsTrigger>
          </TabsList>
          <TabsContent value="redirects">
            <RedirectsTab />
          </TabsContent>
          <TabsContent value="landing-pages">
            <LandingPagesTab />
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGate>
  );
}
