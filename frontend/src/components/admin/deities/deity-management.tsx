"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarClock, Eye, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";

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
import { AdminOnly, PermissionGate, RoleBadge } from "@/components/ui/permission";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateDeity,
  useDeleteDeity,
  useDeities,
  useDeity,
  useUpdateDeity,
} from "@/hooks/queries/use-entities";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import { createCrudService } from "@/services/create-crud-service";
import type { EntityRecord } from "@/services/create-crud-service";
import { formatDateTime, getBoolean, getString } from "@/utils/record-helpers";

const REFERENCE_LIST_PARAMS = { page: 1, limit: 500 };
const deityTypesService = createCrudService("/deity-types");

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

function DeityStatusBadge({ status }: { status: string }) {
  const variant =
    status === "ACTIVE" ? "success" : status === "INACTIVE" ? "warning" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

function DeityImage() {
  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Sparkles className="size-5" />
    </span>
  );
}

function DeityRowActions({ record }: { record: EntityRecord }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteDeity = useDeleteDeity();
  const id = getString(record, "id", "");
  const name = getString(record, "name");

  return (
    <div className="flex flex-wrap gap-1">
      <Button
        aria-label={`View ${name}`}
        render={<Link href={`/admin/deities/${id}`} />}
        size="icon-sm"
        variant="ghost"
      >
        <Eye />
      </Button>
      <AdminOnly>
        <Button
          aria-label={`Edit ${name}`}
          render={<Link href={`/admin/deities/${id}/edit`} />}
          size="icon-sm"
          variant="ghost"
        >
          <Pencil />
        </Button>
        <Button
          aria-label="Delete deity"
          onClick={() => setDeleteOpen(true)}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <Trash2 />
        </Button>
        <ConfirmationDialog
          action="delete"
          message={`Delete ${name}? This action updates the database record.`}
          onConfirm={() => {
            deleteDeity.mutate(id, { onSuccess: () => setDeleteOpen(false) });
          }}
          onOpenChange={setDeleteOpen}
          open={deleteOpen}
          title="Delete deity"
        />
      </AdminOnly>
    </div>
  );
}

function DeityFilters({
  listParams,
  typeOptions,
}: {
  listParams: ReturnType<typeof useListQueryParams>;
  typeOptions: { label: string; value: string }[];
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <Select
        onValueChange={(value) =>
          listParams.setFilter("deityTypeId", value === "all" ? undefined : value)
        }
        options={withAllOption(typeOptions, "All types")}
        placeholder="Deity Type"
        value={(listParams.state.filters.deityTypeId as string) ?? "all"}
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
      <Select
        onValueChange={(value) =>
          listParams.setFilter(
            "isPopular",
            value === "yes" ? true : value === "no" ? false : undefined,
          )
        }
        options={booleanFilterOptions}
        placeholder="Popular"
        value={
          listParams.state.filters.isPopular === true
            ? "yes"
            : listParams.state.filters.isPopular === false
              ? "no"
              : "all"
        }
      />
    </div>
  );
}

export function DeityListPageContent() {
  const listParams = useListQueryParams();
  const { data, isLoading, isError, error, refetch, isFetching } = useDeities(listParams.params);
  const { data: deityTypesData } = useQuery({
    queryKey: ["deity-types", "list", REFERENCE_LIST_PARAMS],
    queryFn: () => deityTypesService.list(REFERENCE_LIST_PARAMS),
  });

  const typeLookup = useMemo(
    () => buildLookup(deityTypesData?.items ?? []),
    [deityTypesData?.items],
  );

  const columns = useMemo<ColumnDef<EntityRecord>[]>(
    () => [
      { header: "Image", cell: () => <DeityImage /> },
      {
        accessorKey: "name",
        header: "Deity Name",
        cell: ({ row }) => <span className="font-medium">{getString(row.original, "name")}</span>,
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => getString(row.original, "slug"),
      },
      {
        id: "type",
        header: "Type",
        cell: ({ row }) => typeLookup.get(getString(row.original, "deityTypeId", "")) ?? "—",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <DeityStatusBadge status={getString(row.original, "status")} />,
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
      { id: "actions", header: "Actions", cell: ({ row }) => <DeityRowActions record={row.original} /> },
    ],
    [typeLookup],
  );

  const rows = data?.items ?? [];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Deities</p>
            <h1 className="text-3xl font-semibold tracking-tight">Deity Management</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage deity records from PostgreSQL via the deities API.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RoleBadge />
            <AdminOnly>
              <Button render={<Link href="/admin/deities/create" />} leftIcon={<Plus />}>
                Create Deity
              </Button>
            </AdminOnly>
          </div>
        </header>

        <DataTable
          columns={columns}
          data={rows}
          emptyState={<EmptyState description="No deities match your filters." title="No deities found" />}
          error={
            isError ? (
              <ErrorState description={error?.message ?? "Failed to load deities."} onRetry={() => void refetch()} />
            ) : undefined
          }
          filters={
            <DeityFilters
              listParams={listParams}
              typeOptions={recordsToOptions(deityTypesData?.items ?? [])}
            />
          }
          loading={isLoading}
          onRefresh={() => refetch()}
          refreshLoading={isFetching}
          searchPlaceholder="Search deities..."
        />

        <ServerPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
      </div>
    </PermissionGate>
  );
}

type DeityFormValues = {
  name: string;
  slug: string;
  description: string;
  deityTypeId: string;
  status: string;
  isFeatured: boolean;
  isPopular: boolean;
  sortOrder: number;
};

export function DeityFormPageContent({ mode }: { mode: "create" | "edit" }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const deityId = mode === "edit" ? params.id : "";
  const { data: existing, isLoading, isError, error, refetch } = useDeity(deityId, mode === "edit");
  const createDeity = useCreateDeity();
  const updateDeity = useUpdateDeity();

  const { data: deityTypesData } = useQuery({
    queryKey: ["deity-types", "list", REFERENCE_LIST_PARAMS],
    queryFn: () => deityTypesService.list(REFERENCE_LIST_PARAMS),
  });
  const typeOptions = recordsToOptions(deityTypesData?.items ?? []);

  const form = useForm<DeityFormValues>({
    values:
      mode === "edit" && existing
        ? {
            name: getString(existing, "name"),
            slug: getString(existing, "slug"),
            description: getString(existing, "description"),
            deityTypeId: getString(existing, "deityTypeId"),
            status: getString(existing, "status", "ACTIVE"),
            isFeatured: getBoolean(existing, "isFeatured"),
            isPopular: getBoolean(existing, "isPopular"),
            sortOrder: Number(existing.sortOrder ?? 0),
          }
        : {
            name: "",
            slug: "",
            description: "",
            deityTypeId: "",
            status: "ACTIVE",
            isFeatured: false,
            isPopular: false,
            sortOrder: 0,
          },
  });

  async function onSubmit(values: DeityFormValues) {
    const payload: Record<string, unknown> = {
      name: values.name || undefined,
      slug: values.slug,
      description: values.description || undefined,
      deityTypeId: values.deityTypeId,
      status: values.status,
      isFeatured: values.isFeatured,
      isPopular: values.isPopular,
      sortOrder: values.sortOrder,
    };

    if (mode === "create") {
      createDeity.mutate(payload, {
        onSuccess: (record) => router.push(`/admin/deities/${getString(record, "id")}`),
      });
      return;
    }

    updateDeity.mutate(
      { id: deityId, payload },
      { onSuccess: () => router.push(`/admin/deities/${deityId}`) },
    );
  }

  return (
    <AdminOnly>
      <AsyncQueryBoundary
        error={error}
        isError={mode === "edit" && isError}
        isLoading={mode === "edit" && isLoading}
        loadingLabel="Loading deity..."
        onRetry={() => refetch()}
      >
        <div className="space-y-6">
          <header>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Deity Management</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {mode === "create" ? "Create Deity" : "Edit Deity"}
            </h1>
          </header>

          <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormSection columns={2} description="Core deity information." title="General">
              <Input label="Name" required {...form.register("name", { required: true })} />
              <Input label="Slug" required {...form.register("slug", { required: true })} />
              <div className="grid gap-2">
                <span className="text-sm font-medium">Deity Type</span>
                <Select
                  onValueChange={(value) => form.setValue("deityTypeId", value, { shouldDirty: true })}
                  options={typeOptions}
                  placeholder="Select deity type"
                  value={form.watch("deityTypeId")}
                />
              </div>
              <Textarea
                label="Description"
                wrapperClassName="md:col-span-2"
                {...form.register("description")}
              />
              <div className="grid gap-2">
                <span className="text-sm font-medium">Status</span>
                <Select
                  onValueChange={(value) => form.setValue("status", value, { shouldDirty: true })}
                  options={statusOptions.slice(1)}
                  placeholder="Select status"
                  value={form.watch("status")}
                />
              </div>
              <Input
                label="Sort Order"
                type="number"
                {...form.register("sortOrder", { valueAsNumber: true })}
              />
              <Switch
                checked={form.watch("isFeatured")}
                description="Feature this deity in prominent areas."
                label="Featured"
                onCheckedChange={(checked) =>
                  form.setValue("isFeatured", checked, { shouldDirty: true })
                }
              />
              <Switch
                checked={form.watch("isPopular")}
                description="Mark deity as popular."
                label="Popular"
                onCheckedChange={(checked) =>
                  form.setValue("isPopular", checked, { shouldDirty: true })
                }
              />
            </FormSection>

            <FormActions
              canReset
              dirty={form.formState.isDirty}
              submitting={createDeity.isPending || updateDeity.isPending}
              onCancel={() => router.back()}
              onReset={() => form.reset()}
              sticky
              submitLabel={mode === "create" ? "Create Deity" : "Save Changes"}
            />
          </Form>
        </div>
      </AsyncQueryBoundary>
    </AdminOnly>
  );
}

function DetailSection({
  children,
  icon,
  title,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Card className="glass-panel shadow-soft">
      <CardHeader className="flex flex-row items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-4">
          {icon}
        </span>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function DeityDetailsPageContent() {
  const params = useParams<{ id: string }>();
  const { data: deity, isLoading, isError, error, refetch } = useDeity(params.id);
  const { data: deityTypesData } = useQuery({
    queryKey: ["deity-types", "list", REFERENCE_LIST_PARAMS],
    queryFn: () => deityTypesService.list(REFERENCE_LIST_PARAMS),
  });

  const typeLookup = useMemo(
    () => buildLookup(deityTypesData?.items ?? []),
    [deityTypesData?.items],
  );

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel="Loading deity..."
        onRetry={() => refetch()}
      >
        {deity ? (
          <div className="space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">
                  Deity Details
                </p>
                <h1 className="text-3xl font-semibold tracking-tight">{getString(deity, "name")}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {typeLookup.get(getString(deity, "deityTypeId", "")) ?? "—"} · {getString(deity, "slug")}
                </p>
              </div>
              <AdminOnly>
                <Button render={<Link href={`/admin/deities/${params.id}/edit`} />} leftIcon={<Pencil />}>
                  Edit Deity
                </Button>
              </AdminOnly>
            </header>

            <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]" aria-label="Deity overview">
              <Card className="glass-panel shadow-soft">
                <CardContent className="space-y-4">
                  <DeityImage />
                  <div>
                    <h2 className="text-xl font-semibold">{getString(deity, "name")}</h2>
                    <p className="text-sm text-muted-foreground">
                      {typeLookup.get(getString(deity, "deityTypeId", "")) ?? "—"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <DeityStatusBadge status={getString(deity, "status")} />
                    {getBoolean(deity, "isFeatured") ? <Badge variant="success">Featured</Badge> : null}
                    {getBoolean(deity, "isPopular") ? <Badge variant="info">Popular</Badge> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{getString(deity, "description")}</p>
                </CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailSection icon={<Sparkles />} title="Profile">
                  <p className="text-sm text-muted-foreground">
                    Mantra: {getString(deity, "primaryMantra")}
                  </p>
                  <p className="text-sm text-muted-foreground">Symbol: {getString(deity, "symbol")}</p>
                  <p className="text-sm text-muted-foreground">Consort: {getString(deity, "consort")}</p>
                </DetailSection>
                <DetailSection icon={<CalendarClock />} title="Timestamps">
                  <p className="text-sm text-muted-foreground">
                    Created: {formatDateTime(deity.createdAt)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Updated: {formatDateTime(deity.updatedAt)}
                  </p>
                </DetailSection>
              </div>
            </section>
          </div>
        ) : null}
      </AsyncQueryBoundary>
    </PermissionGate>
  );
}
