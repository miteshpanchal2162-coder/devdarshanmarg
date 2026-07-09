"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarDays, Eye, Pencil, Plus, Trash2 } from "lucide-react";

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
  useCreatePanchang,
  useDeletePanchang,
  usePanchang,
  usePanchangList,
  useUpdatePanchang,
  useUpdatePanchangStatus,
} from "@/hooks/queries/use-entities";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import type { EntityRecord } from "@/services/create-crud-service";
import { formatDateTime, getBoolean, getString } from "@/utils/record-helpers";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Archived", value: "ARCHIVED" },
];

const defaultFilterOptions = [
  { label: "Any", value: "all" },
  { label: "Default", value: "yes" },
  { label: "Not default", value: "no" },
];

function PanchangStatusBadge({ status }: { status: string }) {
  const variant =
    status === "ACTIVE" ? "success" : status === "INACTIVE" ? "warning" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

function PanchangRowActions({ record }: { record: EntityRecord }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deletePanchang = useDeletePanchang();
  const updateStatus = useUpdatePanchangStatus();
  const id = getString(record, "id", "");
  const name = getString(record, "name");
  const status = getString(record, "status");

  return (
    <div className="flex flex-wrap gap-1">
      <Button
        aria-label={`View ${name}`}
        render={<Link href={`/admin/panchang/${id}`} />}
        size="icon-sm"
        variant="ghost"
      >
        <Eye />
      </Button>
      <AdminOnly>
        <Button
          aria-label={`Edit ${name}`}
          render={<Link href={`/admin/panchang/${id}/edit`} />}
          size="icon-sm"
          variant="ghost"
        >
          <Pencil />
        </Button>
        <Button
          aria-label={status === "ACTIVE" ? "Archive panchang" : "Activate panchang"}
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
          <CalendarDays />
        </Button>
        <Button aria-label="Delete panchang" onClick={() => setDeleteOpen(true)} size="icon-sm" type="button" variant="ghost">
          <Trash2 />
        </Button>
        <ConfirmationDialog
          action="delete"
          message={`Delete ${name}? This action updates the database record.`}
          onConfirm={() => deletePanchang.mutate(id, { onSuccess: () => setDeleteOpen(false) })}
          onOpenChange={setDeleteOpen}
          open={deleteOpen}
          title="Delete panchang"
        />
      </AdminOnly>
    </div>
  );
}

export function PanchangListPageContent() {
  const listParams = useListQueryParams();
  const { data, isLoading, isError, error, refetch, isFetching } = usePanchangList(listParams.params);

  const columns = useMemo<ColumnDef<EntityRecord>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <span className="font-medium">{getString(row.original, "name")}</span>,
      },
      { accessorKey: "panchangCode", header: "Panchang Code", cell: ({ row }) => getString(row.original, "panchangCode") },
      { accessorKey: "timezone", header: "Timezone", cell: ({ row }) => getString(row.original, "timezone") },
      { accessorKey: "calendarType", header: "Calendar Type", cell: ({ row }) => getString(row.original, "calendarType") },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <PanchangStatusBadge status={getString(row.original, "status")} />,
      },
      {
        accessorKey: "isDefault",
        header: "Default",
        cell: ({ row }) => (
          <Badge variant={getBoolean(row.original, "isDefault") ? "success" : "secondary"}>
            {getBoolean(row.original, "isDefault") ? "Yes" : "No"}
          </Badge>
        ),
      },
      { id: "actions", header: "Actions", cell: ({ row }) => <PanchangRowActions record={row.original} /> },
    ],
    [],
  );

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Panchang</p>
            <h1 className="text-3xl font-semibold tracking-tight">Panchang Management</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage panchang records from PostgreSQL via the panchangs API.</p>
          </div>
          <AdminOnly>
            <Button render={<Link href="/admin/panchang/create" />} leftIcon={<Plus />}>
              Create Panchang
            </Button>
          </AdminOnly>
        </header>

        <DataTable
          columns={columns}
          data={data?.items ?? []}
          emptyState={<EmptyState description="No panchang records match your filters." title="No panchang found" />}
          error={
            isError ? (
              <ErrorState description={error?.message ?? "Failed to load panchang records."} onRetry={() => void refetch()} />
            ) : undefined
          }
          filters={
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              <Select
                onValueChange={(value) => listParams.setStatus(value === "all" ? undefined : value)}
                options={statusOptions}
                placeholder="Status"
                value={listParams.state.status ?? "all"}
              />
              <Select
                onValueChange={(value) =>
                  listParams.setFilter(
                    "isDefault",
                    value === "yes" ? true : value === "no" ? false : undefined,
                  )
                }
                options={defaultFilterOptions}
                placeholder="Default Panchang"
                value={
                  listParams.state.filters.isDefault === true
                    ? "yes"
                    : listParams.state.filters.isDefault === false
                      ? "no"
                      : "all"
                }
              />
            </div>
          }
          loading={isLoading}
          onRefresh={() => refetch()}
          refreshLoading={isFetching}
          searchPlaceholder="Search panchang..."
        />

        <ServerPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
      </div>
    </PermissionGate>
  );
}

type PanchangFormValues = {
  panchangCode: string;
  name: string;
  slug: string;
  description: string;
  calendarType: string;
  timezone: string;
  status: string;
  isDefault: boolean;
  sortOrder: number;
};

export function PanchangFormPageContent({ mode }: { mode: "create" | "edit" }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const panchangId = mode === "edit" ? params.id : "";
  const { data: existing, isLoading, isError, error, refetch } = usePanchang(panchangId, mode === "edit");
  const createPanchang = useCreatePanchang();
  const updatePanchang = useUpdatePanchang();

  const form = useForm<PanchangFormValues>({
    values:
      mode === "edit" && existing
        ? {
            panchangCode: getString(existing, "panchangCode"),
            name: getString(existing, "name"),
            slug: getString(existing, "slug"),
            description: getString(existing, "description", ""),
            calendarType: getString(existing, "calendarType", ""),
            timezone: getString(existing, "timezone", "Asia/Kolkata"),
            status: getString(existing, "status", "ACTIVE"),
            isDefault: getBoolean(existing, "isDefault"),
            sortOrder: Number(existing.sortOrder ?? 0),
          }
        : {
            panchangCode: "",
            name: "",
            slug: "",
            description: "",
            calendarType: "",
            timezone: "Asia/Kolkata",
            status: "ACTIVE",
            isDefault: false,
            sortOrder: 0,
          },
  });

  async function onSubmit(values: PanchangFormValues) {
    const payload: Record<string, unknown> = {
      panchangCode: values.panchangCode,
      name: values.name,
      slug: values.slug,
      description: values.description || undefined,
      calendarType: values.calendarType || undefined,
      timezone: values.timezone || undefined,
      status: values.status,
      isDefault: values.isDefault,
      sortOrder: values.sortOrder,
    };

    if (mode === "create") {
      createPanchang.mutate(payload, {
        onSuccess: (record) => router.push(`/admin/panchang/${getString(record, "id")}`),
      });
      return;
    }

    updatePanchang.mutate({ id: panchangId, payload }, { onSuccess: () => router.push(`/admin/panchang/${panchangId}`) });
  }

  return (
    <AdminOnly>
      <AsyncQueryBoundary
        error={error}
        isError={mode === "edit" && isError}
        isLoading={mode === "edit" && isLoading}
        loadingLabel="Loading panchang..."
        onRetry={() => refetch()}
      >
        <div className="space-y-6">
          <header>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Panchang Management</p>
            <h1 className="text-3xl font-semibold tracking-tight">{mode === "create" ? "Create Panchang" : "Edit Panchang"}</h1>
          </header>

          <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormSection columns={2} description="Core panchang information." title="General">
              <Input label="Panchang Code" required {...form.register("panchangCode", { required: true })} />
              <Input label="Name" required {...form.register("name", { required: true })} />
              <Input label="Slug" required {...form.register("slug", { required: true })} />
              <Input label="Calendar Type" {...form.register("calendarType")} />
              <Input label="Timezone" {...form.register("timezone")} />
              <div className="grid gap-2">
                <span className="text-sm font-medium">Status</span>
                <Select
                  onValueChange={(value) => form.setValue("status", value, { shouldDirty: true })}
                  options={statusOptions.slice(1)}
                  placeholder="Select status"
                  value={form.watch("status")}
                />
              </div>
              <Textarea label="Description" wrapperClassName="md:col-span-2" {...form.register("description")} />
              <Input label="Sort Order" type="number" {...form.register("sortOrder", { valueAsNumber: true })} />
              <Switch
                checked={form.watch("isDefault")}
                description="Mark as the default panchang."
                label="Default Panchang"
                onCheckedChange={(checked) => form.setValue("isDefault", checked, { shouldDirty: true })}
              />
            </FormSection>

            <FormActions
              canReset
              dirty={form.formState.isDirty}
              submitting={createPanchang.isPending || updatePanchang.isPending}
              onCancel={() => router.back()}
              onReset={() => form.reset()}
              sticky
              submitLabel={mode === "create" ? "Create Panchang" : "Save Changes"}
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

export function PanchangDetailsPageContent() {
  const params = useParams<{ id: string }>();
  const { data: panchang, isLoading, isError, error, refetch } = usePanchang(params.id);

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel="Loading panchang..."
        onRetry={() => refetch()}
      >
        {panchang ? (
          <div className="space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Panchang Details</p>
                <h1 className="text-3xl font-semibold tracking-tight">{getString(panchang, "name")}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {getString(panchang, "panchangCode")} · {getString(panchang, "timezone")}
                </p>
              </div>
              <AdminOnly>
                <Button render={<Link href={`/admin/panchang/${params.id}/edit`} />} leftIcon={<Pencil />}>
                  Edit Panchang
                </Button>
              </AdminOnly>
            </header>

            <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]" aria-label="Panchang overview">
              <Card className="glass-panel shadow-soft">
                <CardContent className="space-y-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <CalendarDays className="size-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold">{getString(panchang, "name")}</h2>
                    <p className="text-sm text-muted-foreground">{getString(panchang, "slug")}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <PanchangStatusBadge status={getString(panchang, "status")} />
                    <Badge variant={getBoolean(panchang, "isDefault") ? "success" : "secondary"}>
                      {getBoolean(panchang, "isDefault") ? "Default" : "Regional"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{getString(panchang, "description")}</p>
                </CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailCard icon={<CalendarDays />} title="Calendar">
                  <p className="text-sm">{getString(panchang, "calendarType")}</p>
                </DetailCard>
                <DetailCard icon={<CalendarDays />} title="Sort Order">
                  <p className="text-sm">{String(panchang.sortOrder ?? 0)}</p>
                </DetailCard>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3" aria-label="Panchang metadata">
              <DetailCard icon={<CalendarDays />} title="Created">
                <p className="text-sm text-muted-foreground">{formatDateTime(panchang.createdAt)}</p>
              </DetailCard>
              <DetailCard icon={<CalendarDays />} title="Updated">
                <p className="text-sm text-muted-foreground">{formatDateTime(panchang.updatedAt)}</p>
              </DetailCard>
              <DetailCard icon={<CalendarDays />} title="Panchang ID">
                <p className="text-sm text-muted-foreground">{getString(panchang, "id")}</p>
              </DetailCard>
            </section>
          </div>
        ) : null}
      </AsyncQueryBoundary>
    </PermissionGate>
  );
}
