"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarDays, CalendarClock, Eye, Landmark, Pencil, Plus, Trash2 } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateFestival,
  useDeleteFestival,
  useFestival,
  useFestivalDates,
  useFestivalRegions,
  useFestivalTempleMaps,
  useFestivals,
  useUpdateFestival,
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

const booleanFilterOptions = [
  { label: "Any", value: "all" },
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

function FestivalStatusBadge({ status }: { status: string }) {
  const variant =
    status === "ACTIVE" ? "success" : status === "INACTIVE" ? "warning" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

function FestivalImage() {
  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <CalendarDays className="size-5" />
    </span>
  );
}

function FestivalRowActions({ record }: { record: EntityRecord }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteFestival = useDeleteFestival();
  const id = getString(record, "id", "");
  const name = getString(record, "name");

  return (
    <div className="flex flex-wrap gap-1">
      <Button
        aria-label={`View ${name}`}
        render={<Link href={`/admin/festivals/${id}`} />}
        size="icon-sm"
        variant="ghost"
      >
        <Eye />
      </Button>
      <AdminOnly>
        <Button
          aria-label={`Edit ${name}`}
          render={<Link href={`/admin/festivals/${id}/edit`} />}
          size="icon-sm"
          variant="ghost"
        >
          <Pencil />
        </Button>
        <Button
          aria-label="Delete festival"
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
            deleteFestival.mutate(id, { onSuccess: () => setDeleteOpen(false) });
          }}
          onOpenChange={setDeleteOpen}
          open={deleteOpen}
          title="Delete festival"
        />
      </AdminOnly>
    </div>
  );
}

function FestivalFilters({ listParams }: { listParams: ReturnType<typeof useListQueryParams> }) {
  return (
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

export function FestivalListPageContent() {
  const listParams = useListQueryParams();
  const { data, isLoading, isError, error, refetch, isFetching } = useFestivals(listParams.params);

  const columns = useMemo<ColumnDef<EntityRecord>[]>(
    () => [
      { header: "Image", cell: () => <FestivalImage /> },
      {
        accessorKey: "name",
        header: "Festival Name",
        cell: ({ row }) => <span className="font-medium">{getString(row.original, "name")}</span>,
      },
      {
        accessorKey: "festivalCode",
        header: "Festival Code",
        cell: ({ row }) => getString(row.original, "festivalCode"),
      },
      {
        accessorKey: "festivalType",
        header: "Type",
        cell: ({ row }) => getString(row.original, "festivalType"),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <FestivalStatusBadge status={getString(row.original, "status")} />,
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
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <FestivalRowActions record={row.original} />,
      },
    ],
    [],
  );

  const rows = data?.items ?? [];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Festivals</p>
            <h1 className="text-3xl font-semibold tracking-tight">Festival Management</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage festival records from PostgreSQL via the festivals API.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RoleBadge />
            <AdminOnly>
              <Button render={<Link href="/admin/festivals/create" />} leftIcon={<Plus />}>
                Create Festival
              </Button>
            </AdminOnly>
          </div>
        </header>

        <DataTable
          columns={columns}
          data={rows}
          emptyState={
            <EmptyState description="No festivals match your filters." title="No festivals found" />
          }
          error={
            isError ? (
              <ErrorState
                description={error?.message ?? "Failed to load festivals."}
                onRetry={() => void refetch()}
              />
            ) : undefined
          }
          filters={<FestivalFilters listParams={listParams} />}
          loading={isLoading}
          onRefresh={() => refetch()}
          refreshLoading={isFetching}
          searchPlaceholder="Search festivals..."
        />

        <ServerPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
      </div>
    </PermissionGate>
  );
}

type FestivalFormValues = {
  festivalCode: string;
  name: string;
  slug: string;
  description: string;
  festivalType: string;
  status: string;
  isFeatured: boolean;
  isPopular: boolean;
  sortOrder: number;
};

export function FestivalFormPageContent({ mode }: { mode: "create" | "edit" }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const festivalId = mode === "edit" ? params.id : "";
  const { data: existing, isLoading, isError, error, refetch } = useFestival(festivalId, mode === "edit");
  const createFestival = useCreateFestival();
  const updateFestival = useUpdateFestival();

  const form = useForm<FestivalFormValues>({
    values:
      mode === "edit" && existing
        ? {
            festivalCode: getString(existing, "festivalCode"),
            name: getString(existing, "name"),
            slug: getString(existing, "slug"),
            description: getString(existing, "description"),
            festivalType: getString(existing, "festivalType"),
            status: getString(existing, "status", "ACTIVE"),
            isFeatured: getBoolean(existing, "isFeatured"),
            isPopular: getBoolean(existing, "isPopular"),
            sortOrder: Number(existing.sortOrder ?? 0),
          }
        : {
            festivalCode: "",
            name: "",
            slug: "",
            description: "",
            festivalType: "",
            status: "ACTIVE",
            isFeatured: false,
            isPopular: false,
            sortOrder: 0,
          },
  });

  async function onSubmit(values: FestivalFormValues) {
    const payload: Record<string, unknown> = {
      festivalCode: values.festivalCode || undefined,
      name: values.name || undefined,
      slug: values.slug,
      description: values.description || undefined,
      festivalType: values.festivalType || undefined,
      status: values.status,
      isFeatured: values.isFeatured,
      isPopular: values.isPopular,
      sortOrder: values.sortOrder,
    };

    if (mode === "create") {
      createFestival.mutate(payload, {
        onSuccess: (record) => router.push(`/admin/festivals/${getString(record, "id")}`),
      });
      return;
    }

    updateFestival.mutate(
      { id: festivalId, payload },
      { onSuccess: () => router.push(`/admin/festivals/${festivalId}`) },
    );
  }

  return (
    <AdminOnly>
      <AsyncQueryBoundary
        error={error}
        isError={mode === "edit" && isError}
        isLoading={mode === "edit" && isLoading}
        loadingLabel="Loading festival..."
        onRetry={() => refetch()}
      >
        <div className="space-y-6">
          <header>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">
              Festival Management
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {mode === "create" ? "Create Festival" : "Edit Festival"}
            </h1>
          </header>

          <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormSection columns={2} description="Core festival information." title="General">
              <Input label="Festival Code" {...form.register("festivalCode")} />
              <Input label="Festival Name" required {...form.register("name", { required: true })} />
              <Input label="Slug" required {...form.register("slug", { required: true })} />
              <Input label="Festival Type" {...form.register("festivalType")} />
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
                description="Feature this festival in prominent areas."
                label="Featured"
                onCheckedChange={(checked) =>
                  form.setValue("isFeatured", checked, { shouldDirty: true })
                }
              />
              <Switch
                checked={form.watch("isPopular")}
                description="Mark festival as popular."
                label="Popular"
                onCheckedChange={(checked) =>
                  form.setValue("isPopular", checked, { shouldDirty: true })
                }
              />
            </FormSection>

            <FormActions
              canReset
              dirty={form.formState.isDirty}
              submitting={createFestival.isPending || updateFestival.isPending}
              onCancel={() => router.back()}
              onReset={() => form.reset()}
              sticky
              submitLabel={mode === "create" ? "Create Festival" : "Save Changes"}
            />
          </Form>
        </div>
      </AsyncQueryBoundary>
    </AdminOnly>
  );
}

function ReadOnlyTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: { key: string; header: string }[];
  rows: EntityRecord[];
}) {
  if (!rows.length) {
    return <p className="text-sm text-muted-foreground">No records found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b bg-muted/50 text-caption uppercase tracking-[0.16em] text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th className="p-3" key={column.key} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="border-b border-border/60 last:border-0" key={getString(row, "id", "")}>
              {columns.map((column) => (
                <td className="p-3" key={column.key}>
                  {column.key === "status" ? (
                    <FestivalStatusBadge status={getString(row, "status")} />
                  ) : column.key === "highlight" ? (
                    getBoolean(row, "highlight") ? "Yes" : "No"
                  ) : (
                    getString(row, column.key)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FestivalRelatedTabs({ festivalId }: { festivalId: string }) {
  const regionHooks = useFestivalRegions(festivalId);
  const dateHooks = useFestivalDates(festivalId);
  const templeMapHooks = useFestivalTempleMaps(festivalId);

  const regionsQuery = regionHooks.useList({ page: 1, limit: 50 });
  const datesQuery = dateHooks.useList({ page: 1, limit: 50 });
  const templeMapsQuery = templeMapHooks.useList({ page: 1, limit: 50 });

  return (
    <Tabs defaultValue="regions">
      <TabsList variant="line">
        <TabsTrigger value="regions">Regions</TabsTrigger>
        <TabsTrigger value="dates">Dates</TabsTrigger>
        <TabsTrigger value="temples">Temple Maps</TabsTrigger>
      </TabsList>

      <TabsContent value="regions">
        <AsyncQueryBoundary
          error={regionsQuery.error}
          isError={regionsQuery.isError}
          isLoading={regionsQuery.isLoading}
          loadingLabel="Loading regions..."
          onRetry={() => regionsQuery.refetch()}
        >
          <ReadOnlyTable
            caption="Festival regions"
            columns={[
              { key: "importance", header: "Importance" },
              { key: "description", header: "Description" },
              { key: "status", header: "Status" },
            ]}
            rows={regionsQuery.data?.items ?? []}
          />
        </AsyncQueryBoundary>
      </TabsContent>

      <TabsContent value="dates">
        <AsyncQueryBoundary
          error={datesQuery.error}
          isError={datesQuery.isError}
          isLoading={datesQuery.isLoading}
          loadingLabel="Loading dates..."
          onRetry={() => datesQuery.refetch()}
        >
          <ReadOnlyTable
            caption="Festival dates"
            columns={[
              { key: "year", header: "Year" },
              { key: "masa", header: "Masa" },
              { key: "tithi", header: "Tithi" },
              { key: "status", header: "Status" },
            ]}
            rows={datesQuery.data?.items ?? []}
          />
        </AsyncQueryBoundary>
      </TabsContent>

      <TabsContent value="temples">
        <AsyncQueryBoundary
          error={templeMapsQuery.error}
          isError={templeMapsQuery.isError}
          isLoading={templeMapsQuery.isLoading}
          loadingLabel="Loading temple maps..."
          onRetry={() => templeMapsQuery.refetch()}
        >
          <ReadOnlyTable
            caption="Festival temple maps"
            columns={[
              { key: "templeId", header: "Temple ID" },
              { key: "highlight", header: "Highlight" },
              { key: "sortOrder", header: "Sort Order" },
            ]}
            rows={templeMapsQuery.data?.items ?? []}
          />
        </AsyncQueryBoundary>
      </TabsContent>
    </Tabs>
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

export function FestivalDetailsPageContent() {
  const params = useParams<{ id: string }>();
  const { data: festival, isLoading, isError, error, refetch } = useFestival(params.id);

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel="Loading festival..."
        onRetry={() => refetch()}
      >
        {festival ? (
          <div className="space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">
                  Festival Details
                </p>
                <h1 className="text-3xl font-semibold tracking-tight">{getString(festival, "name")}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {getString(festival, "festivalCode")} · {getString(festival, "festivalType")}
                </p>
              </div>
              <AdminOnly>
                <Button render={<Link href={`/admin/festivals/${params.id}/edit`} />} leftIcon={<Pencil />}>
                  Edit Festival
                </Button>
              </AdminOnly>
            </header>

            <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]" aria-label="Festival overview">
              <Card className="glass-panel shadow-soft">
                <CardContent className="space-y-4">
                  <FestivalImage />
                  <div>
                    <h2 className="text-xl font-semibold">{getString(festival, "name")}</h2>
                    <p className="text-sm text-muted-foreground">{getString(festival, "festivalType")}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <FestivalStatusBadge status={getString(festival, "status")} />
                    {getBoolean(festival, "isFeatured") ? <Badge variant="success">Featured</Badge> : null}
                    {getBoolean(festival, "isPopular") ? <Badge variant="info">Popular</Badge> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{getString(festival, "description")}</p>
                </CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailSection icon={<CalendarDays />} title="Overview">
                  <p className="text-sm text-muted-foreground">Slug: {getString(festival, "slug")}</p>
                  <p className="text-sm text-muted-foreground">ID: {getString(festival, "id")}</p>
                </DetailSection>
                <DetailSection icon={<Landmark />} title="Timestamps">
                  <p className="text-sm text-muted-foreground">
                    Created: {formatDateTime(festival.createdAt)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Updated: {formatDateTime(festival.updatedAt)}
                  </p>
                </DetailSection>
              </div>
            </section>

            <section aria-label="Festival related records">
              <Card className="glass-panel shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarClock className="size-5 text-primary" />
                    Related Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FestivalRelatedTabs festivalId={params.id} />
                </CardContent>
              </Card>
            </section>
          </div>
        ) : null}
      </AsyncQueryBoundary>
    </PermissionGate>
  );
}
