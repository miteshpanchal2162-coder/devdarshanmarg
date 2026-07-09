"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { CalendarClock, Eye, Pencil, Plus, Trash2 } from "lucide-react";

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

export type GeoEntityHooks = {
  useList: (params?: BaseQueryParams) => UseQueryResult<PaginatedResult<EntityRecord>>;
  useDetail: (id: string, enabled?: boolean) => UseQueryResult<EntityRecord>;
  useCreate: () => UseMutationResult<EntityRecord, Error, Record<string, unknown>>;
  useUpdate: () => UseMutationResult<EntityRecord, Error, { id: string; payload: Record<string, unknown> }>;
  useDelete: () => UseMutationResult<unknown, Error, string>;
};

export type GeoFormField = {
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "textarea" | "number";
  placeholder?: string;
};

export type GeoEntityConfig = {
  entityLabel: string;
  basePath: string;
  hooks: GeoEntityHooks;
  nameField?: string;
  codeField?: string;
  sectionLabel?: string;
  description?: string;
  formFields?: GeoFormField[];
  includeSlug?: boolean;
  showStatusFilter?: boolean;
};

const statusFilterOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Draft", value: "DRAFT" },
  { label: "Archived", value: "ARCHIVED" },
];

const statusFormOptions = statusFilterOptions.slice(1);

function EntityStatusBadge({ status }: { status: string }) {
  const variant =
    status === "ACTIVE" ? "success" : status === "DRAFT" ? "warning" : status === "ARCHIVED" ? "secondary" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

function GeoEntityRowActions({
  record,
  config,
}: {
  record: EntityRecord;
  config: GeoEntityConfig;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteEntity = config.hooks.useDelete();
  const id = getString(record, "id", "");
  const name = getString(record, config.nameField ?? "name");
  const adminBase = `/admin/${config.basePath}`;

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
          onConfirm={() => {
            deleteEntity.mutate(id, { onSuccess: () => setDeleteOpen(false) });
          }}
          onOpenChange={setDeleteOpen}
          open={deleteOpen}
          title={`Delete ${config.entityLabel.toLowerCase()}`}
        />
      </AdminOnly>
    </div>
  );
}

export function GeoEntityListPageContent({ config }: { config: GeoEntityConfig }) {
  const listParams = useListQueryParams();
  const { data, isLoading, isError, error, refetch, isFetching } = config.hooks.useList(listParams.params);
  const nameField = config.nameField ?? "name";
  const adminBase = `/admin/${config.basePath}`;

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
          return status && status !== "—" ? <EntityStatusBadge status={status} /> : "—";
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => formatDateTime(row.original.createdAt),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <GeoEntityRowActions config={config} record={row.original} />,
      },
    );

    return cols;
  }, [config, nameField]);

  const rows = data?.items ?? [];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">
              {config.sectionLabel ?? "Geo"}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">{config.entityLabel} Management</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {config.description ?? `Manage ${config.entityLabel.toLowerCase()} records from the API.`}
            </p>
          </div>
          <AdminOnly>
            <Button render={<Link href={`${adminBase}/create`} />} leftIcon={<Plus />}>
              Create {config.entityLabel}
            </Button>
          </AdminOnly>
        </header>

        <DataTable
          columns={columns}
          data={rows}
          emptyState={
            <EmptyState
              description={`No ${config.entityLabel.toLowerCase()} records match your filters.`}
              title={`No ${config.entityLabel.toLowerCase()} records found`}
            />
          }
          error={
            isError ? (
              <ErrorState
                description={error?.message ?? `Failed to load ${config.entityLabel.toLowerCase()} records.`}
                onRetry={() => refetch()}
              />
            ) : undefined
          }
          filters={
            config.showStatusFilter !== false ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <Select
                  onValueChange={(value) => listParams.setStatus(value === "all" ? undefined : value)}
                  options={statusFilterOptions}
                  placeholder="Status"
                  value={listParams.state.status ?? "all"}
                />
              </div>
            ) : undefined
          }
          loading={isLoading}
          onRefresh={() => refetch()}
          refreshLoading={isFetching}
          searchPlaceholder={`Search ${config.entityLabel.toLowerCase()} records...`}
        />

        <ServerPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
      </div>
    </PermissionGate>
  );
}

type GeoEntityFormValues = Record<string, string>;

function buildDefaultFormValues(
  config: GeoEntityConfig,
  existing?: EntityRecord,
): GeoEntityFormValues {
  const nameField = config.nameField ?? "name";
  const values: GeoEntityFormValues = {
    [nameField]: existing ? getString(existing, nameField, "") : "",
    status: existing ? getString(existing, "status", "ACTIVE") : "ACTIVE",
  };

  if (config.codeField) {
    values[config.codeField] = existing ? getString(existing, config.codeField, "") : "";
  }

  if (config.includeSlug !== false && config.codeField !== "slug") {
    values.slug = existing ? getString(existing, "slug", "") : "";
  }

  for (const field of config.formFields ?? []) {
    values[field.name] = existing ? getString(existing, field.name, "") : "";
  }

  return values;
}

function buildPayload(values: GeoEntityFormValues, config: GeoEntityConfig) {
  const payload: Record<string, unknown> = { ...values };

  for (const field of config.formFields ?? []) {
    if (field.type === "number" && values[field.name]) {
      payload[field.name] = Number(values[field.name]);
    }
  }

  if (payload.sortOrder !== undefined && payload.sortOrder !== "") {
    payload.sortOrder = Number(payload.sortOrder);
  }

  return payload;
}

export function GeoEntityFormPageContent({ config, mode }: { config: GeoEntityConfig; mode: "create" | "edit" }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const entityId = mode === "edit" ? params.id : "";
  const { data: existing, isLoading, isError, error, refetch } = config.hooks.useDetail(entityId, mode === "edit");
  const createEntity = config.hooks.useCreate();
  const updateEntity = config.hooks.useUpdate();
  const nameField = config.nameField ?? "name";
  const adminBase = `/admin/${config.basePath}`;

  const form = useForm<GeoEntityFormValues>({
    values: buildDefaultFormValues(config, mode === "edit" ? existing : undefined),
  });

  async function onSubmit(values: GeoEntityFormValues) {
    const payload = buildPayload(values, config);

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
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">
              {config.sectionLabel ?? "Geo"}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {mode === "create" ? `Create ${config.entityLabel}` : `Edit ${config.entityLabel}`}
            </h1>
          </header>

          <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormSection columns={2} description={`Core ${config.entityLabel.toLowerCase()} details.`} title="Details">
              <Input
                label="Name"
                required
                {...form.register(nameField, { required: true })}
              />
              {config.codeField ? (
                <Input
                  label={config.codeField === "slug" ? "Slug" : "Code"}
                  required
                  {...form.register(config.codeField, { required: true })}
                />
              ) : null}
              {config.includeSlug !== false && config.codeField !== "slug" ? (
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
                    placeholder={field.placeholder}
                    required={field.required}
                    wrapperClassName="md:col-span-2"
                    {...form.register(field.name, { required: field.required })}
                  />
                ) : (
                  <Input
                    key={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
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
              submitLabel={mode === "create" ? `Create ${config.entityLabel}` : "Save Changes"}
            />
          </Form>
        </div>
      </AsyncQueryBoundary>
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

export function GeoEntityDetailsPageContent({ config }: { config: GeoEntityConfig }) {
  const params = useParams<{ id: string }>();
  const { data: record, isLoading, isError, error, refetch } = config.hooks.useDetail(params.id);
  const nameField = config.nameField ?? "name";
  const adminBase = `/admin/${config.basePath}`;

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
                <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">
                  {config.entityLabel} Details
                </p>
                <h1 className="text-3xl font-semibold tracking-tight">{getString(record, nameField)}</h1>
                {config.codeField ? (
                  <p className="mt-2 text-sm text-muted-foreground">{getString(record, config.codeField)}</p>
                ) : null}
              </div>
              <AdminOnly>
                <Button render={<Link href={`${adminBase}/${params.id}/edit`} />} leftIcon={<Pencil />}>
                  Edit {config.entityLabel}
                </Button>
              </AdminOnly>
            </header>

            <section className="grid gap-4 lg:grid-cols-3" aria-label={`${config.entityLabel} metadata`}>
              <DetailCard icon={<CalendarClock />} title="Timestamps">
                <p className="text-sm text-muted-foreground">Created: {formatDateTime(record.createdAt)}</p>
                <p className="text-sm text-muted-foreground">Updated: {formatDateTime(record.updatedAt)}</p>
              </DetailCard>
              <DetailCard icon={<Eye />} title="Status">
                <EntityStatusBadge status={getString(record, "status", "ACTIVE")} />
              </DetailCard>
              <DetailCard icon={<Pencil />} title="Identifier">
                <p className="text-sm text-muted-foreground">{getString(record, "id")}</p>
              </DetailCard>
            </section>
          </div>
        ) : null}
      </AsyncQueryBoundary>
    </PermissionGate>
  );
}
