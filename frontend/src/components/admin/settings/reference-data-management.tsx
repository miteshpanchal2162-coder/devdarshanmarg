"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import type { EntityRecord } from "@/services/create-crud-service";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";
import { formatDateTime, getString } from "@/utils/record-helpers";

export type ReferenceDataHooks = {
  useList: (params?: BaseQueryParams) => UseQueryResult<PaginatedResult<EntityRecord>>;
  useDetail: (id: string, enabled?: boolean) => UseQueryResult<EntityRecord>;
  useCreate: () => UseMutationResult<EntityRecord, Error, Record<string, unknown>>;
  useUpdate: () => UseMutationResult<EntityRecord, Error, { id: string; payload: Record<string, unknown> }>;
  useDelete: () => UseMutationResult<unknown, Error, string>;
};

export type ReferenceFormField = {
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "textarea" | "number";
};

export type ReferenceDataConfig = {
  entityLabel: string;
  basePath: string;
  hooks: ReferenceDataHooks;
  nameField?: string;
  codeField?: string;
  description?: string;
  formFields?: ReferenceFormField[];
  requireSlug?: boolean;
};

const statusFilterOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const statusFormOptions = statusFilterOptions.slice(1);

function ReferenceStatusBadge({ status }: { status: string }) {
  return <Badge variant={status === "ACTIVE" ? "success" : "secondary"}>{status}</Badge>;
}

function ReferenceRowActions({ config, record }: { config: ReferenceDataConfig; record: EntityRecord }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteEntity = config.hooks.useDelete();
  const id = getString(record, "id", "");
  const name = getString(record, config.nameField ?? "name");
  const adminBase = `/admin/settings/${config.basePath}`;

  return (
    <div className="flex flex-wrap gap-1">
      <Button aria-label={`View ${name}`} render={<Link href={`${adminBase}/${id}`} />} size="icon-sm" variant="ghost">
        <Eye />
      </Button>
      <AdminOnly>
        <Button aria-label={`Edit ${name}`} render={<Link href={`${adminBase}/${id}/edit`} />} size="icon-sm" variant="ghost">
          <Pencil />
        </Button>
        <Button aria-label={`Delete ${name}`} onClick={() => setDeleteOpen(true)} size="icon-sm" type="button" variant="ghost">
          <Trash2 />
        </Button>
        <ConfirmationDialog
          action="delete"
          message={`Delete ${name}? This action updates the database record.`}
          onConfirm={() => deleteEntity.mutate(id, { onSuccess: () => setDeleteOpen(false) })}
          onOpenChange={setDeleteOpen}
          open={deleteOpen}
          title={`Delete ${config.entityLabel.toLowerCase()}`}
        />
      </AdminOnly>
    </div>
  );
}

export function ReferenceDataListPageContent({ config }: { config: ReferenceDataConfig }) {
  const listParams = useListQueryParams();
  const { data, isLoading, isError, error, refetch, isFetching } = config.hooks.useList(listParams.params);
  const nameField = config.nameField ?? "name";
  const adminBase = `/admin/settings/${config.basePath}`;

  const columns = useMemo<ColumnDef<EntityRecord>[]>(() => {
    const cols: ColumnDef<EntityRecord>[] = [
      {
        accessorKey: nameField,
        header: "Name",
        cell: ({ row }) => <span className="font-medium">{getString(row.original, nameField)}</span>,
      },
    ];

    if (config.codeField) {
      cols.push({
        accessorKey: config.codeField,
        header: "Code",
        cell: ({ row }) => getString(row.original, config.codeField!),
      });
    }

    cols.push(
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = getString(row.original, "status", "");
          return status && status !== "—" ? <ReferenceStatusBadge status={status} /> : "—";
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => formatDateTime(row.original.updatedAt),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ReferenceRowActions config={config} record={row.original} />,
      },
    );

    return cols;
  }, [config, nameField]);

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Reference Data</p>
            <h1 className="text-3xl font-semibold tracking-tight">{config.entityLabel}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {config.description ?? `Manage ${config.entityLabel.toLowerCase()} from the API.`}
            </p>
          </div>
          <AdminOnly>
            <Button render={<Link href={`${adminBase}/create`} />} leftIcon={<Plus />}>
              Create {config.entityLabel.replace(/s$/, "")}
            </Button>
          </AdminOnly>
        </header>

        <DataTable
          columns={columns}
          data={data?.items ?? []}
          emptyState={
            <EmptyState
              description={`No ${config.entityLabel.toLowerCase()} match your filters.`}
              title={`No ${config.entityLabel.toLowerCase()} found`}
            />
          }
          error={
            isError ? (
              <ErrorState
                description={error?.message ?? `Failed to load ${config.entityLabel.toLowerCase()}.`}
                onRetry={() => refetch()}
              />
            ) : undefined
          }
          filters={
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <Select
                onValueChange={(value) => listParams.setStatus(value === "all" ? undefined : value)}
                options={statusFilterOptions}
                placeholder="Status"
                value={listParams.state.status ?? "all"}
              />
            </div>
          }
          loading={isLoading}
          onRefresh={() => refetch()}
          refreshLoading={isFetching}
          searchPlaceholder={`Search ${config.entityLabel.toLowerCase()}...`}
        />

        <ServerPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
      </div>
    </PermissionGate>
  );
}

type ReferenceFormValues = Record<string, string>;

function buildReferenceDefaults(config: ReferenceDataConfig, existing?: EntityRecord): ReferenceFormValues {
  const nameField = config.nameField ?? "name";
  const values: ReferenceFormValues = {
    [nameField]: existing ? getString(existing, nameField, "") : "",
    status: existing ? getString(existing, "status", "ACTIVE") : "ACTIVE",
  };

  if (config.codeField) {
    values[config.codeField] = existing ? getString(existing, config.codeField, "") : "";
  }

  if (config.requireSlug && config.codeField !== "slug") {
    values.slug = existing ? getString(existing, "slug", "") : "";
  }

  for (const field of config.formFields ?? []) {
    values[field.name] = existing ? getString(existing, field.name, "") : "";
  }

  return values;
}

export function ReferenceDataFormPageContent({
  config,
  mode,
}: {
  config: ReferenceDataConfig;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const entityId = mode === "edit" ? params.id : "";
  const { data: existing, isLoading, isError, error, refetch } = config.hooks.useDetail(entityId, mode === "edit");
  const createEntity = config.hooks.useCreate();
  const updateEntity = config.hooks.useUpdate();
  const nameField = config.nameField ?? "name";
  const adminBase = `/admin/settings/${config.basePath}`;

  const form = useForm<ReferenceFormValues>({
    values: buildReferenceDefaults(config, mode === "edit" ? existing : undefined),
  });

  async function onSubmit(values: ReferenceFormValues) {
    const payload: Record<string, unknown> = { ...values };

    if (payload.sortOrder) {
      payload.sortOrder = Number(payload.sortOrder);
    }

    if (mode === "create") {
      createEntity.mutate(payload, {
        onSuccess: (record) => router.push(`${adminBase}/${getString(record, "id")}`),
      });
      return;
    }

    updateEntity.mutate({ id: entityId, payload }, { onSuccess: () => router.push(`${adminBase}/${entityId}`) });
  }

  return (
    <AdminOnly>
      <AsyncQueryBoundary
        error={error}
        isError={mode === "edit" && isError}
        isLoading={mode === "edit" && isLoading}
        loadingLabel={`Loading ${config.entityLabel.toLowerCase()}...`}
        onRetry={() => refetch()}
      >
        <div className="space-y-6">
          <header>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Reference Data</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {mode === "create" ? `Create ${config.entityLabel.replace(/s$/, "")}` : `Edit ${config.entityLabel.replace(/s$/, "")}`}
            </h1>
          </header>

          <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormSection columns={2} title="Details">
              <Input label="Name" required {...form.register(nameField, { required: true })} />
              {config.codeField ? (
                <Input
                  label={config.codeField === "slug" ? "Slug" : "Code"}
                  required={config.requireSlug || config.codeField === "slug"}
                  {...form.register(config.codeField, { required: config.requireSlug || config.codeField === "slug" })}
                />
              ) : null}
              {config.requireSlug && config.codeField !== "slug" ? (
                <Input label="Slug" required {...form.register("slug", { required: true })} />
              ) : null}
              <div className="grid gap-2">
                <span className="text-sm font-medium">Status</span>
                <Select
                  onValueChange={(value) => form.setValue("status", value, { shouldDirty: true })}
                  options={statusFormOptions}
                  placeholder="Select status"
                  value={form.watch("status")}
                />
              </div>
              {(config.formFields ?? []).map((field) =>
                field.type === "textarea" ? (
                  <Textarea
                    key={field.name}
                    label={field.label}
                    required={field.required}
                    wrapperClassName="md:col-span-2"
                    {...form.register(field.name, { required: field.required })}
                  />
                ) : (
                  <Input
                    key={field.name}
                    label={field.label}
                    required={field.required}
                    type={field.type === "number" ? "number" : "text"}
                    {...form.register(field.name, { required: field.required })}
                  />
                ),
              )}
            </FormSection>

            <FormActions
              canReset
              dirty={form.formState.isDirty}
              submitting={createEntity.isPending || updateEntity.isPending}
              onCancel={() => router.back()}
              onReset={() => form.reset()}
              sticky
              submitLabel={mode === "create" ? "Create" : "Save Changes"}
            />
          </Form>
        </div>
      </AsyncQueryBoundary>
    </AdminOnly>
  );
}

export function ReferenceDataDetailsPageContent({ config }: { config: ReferenceDataConfig }) {
  const params = useParams<{ id: string }>();
  const { data: record, isLoading, isError, error, refetch } = config.hooks.useDetail(params.id);
  const nameField = config.nameField ?? "name";
  const adminBase = `/admin/settings/${config.basePath}`;

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel={`Loading ${config.entityLabel.toLowerCase()}...`}
        onRetry={() => refetch()}
      >
        {record ? (
          <div className="space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Reference Data</p>
                <h1 className="text-3xl font-semibold tracking-tight">{getString(record, nameField)}</h1>
              </div>
              <AdminOnly>
                <Button render={<Link href={`${adminBase}/${params.id}/edit`} />} leftIcon={<Pencil />}>
                  Edit
                </Button>
              </AdminOnly>
            </header>

            <Card className="glass-panel shadow-soft">
              <CardHeader>
                <CardTitle>Record Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {config.codeField ? <p>Code: {getString(record, config.codeField)}</p> : null}
                <p>Status: {getString(record, "status")}</p>
                <p>Created: {formatDateTime(record.createdAt)}</p>
                <p>Updated: {formatDateTime(record.updatedAt)}</p>
                <p>ID: {getString(record, "id")}</p>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </AsyncQueryBoundary>
    </PermissionGate>
  );
}
