"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Building2,
  CalendarClock,
  Eye,
  Landmark,
  MapPin,
  Pencil,
  Plus,
  Trash2,
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
import { AdminOnly, PermissionGate, RoleBadge } from "@/components/ui/permission";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAreas,
  useCities,
  useCountries,
  useCreateTemple,
  useDeleteTemple,
  useStates,
  useTemple,
  useTemples,
  useUpdateTemple,
} from "@/hooks/queries/use-entities";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import type { EntityRecord } from "@/services/create-crud-service";
import { formatDateTime, getBoolean, getString } from "@/utils/record-helpers";

const REFERENCE_LIST_PARAMS = { page: 1, limit: 500 };

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Archived", value: "ARCHIVED" },
];

const featuredOptions = [
  { label: "Any", value: "all" },
  { label: "Featured", value: "yes" },
  { label: "Not featured", value: "no" },
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

function TempleStatusBadge({ status }: { status: string }) {
  const variant =
    status === "ACTIVE" ? "success" : status === "INACTIVE" ? "warning" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

function TempleImage() {
  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Landmark className="size-5" />
    </span>
  );
}

function TempleRowActions({ record }: { record: EntityRecord }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteTemple = useDeleteTemple();
  const id = getString(record, "id", "");
  const name = getString(record, "name");

  return (
    <div className="flex flex-wrap gap-1">
      <Button
        aria-label={`View ${name}`}
        render={<Link href={`/admin/temples/${id}`} />}
        size="icon-sm"
        variant="ghost"
      >
        <Eye />
      </Button>
      <AdminOnly>
        <Button
          aria-label={`Edit ${name}`}
          render={<Link href={`/admin/temples/${id}/edit`} />}
          size="icon-sm"
          variant="ghost"
        >
          <Pencil />
        </Button>
        <Button
          aria-label="Delete temple"
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
            deleteTemple.mutate(id, { onSuccess: () => setDeleteOpen(false) });
          }}
          onOpenChange={setDeleteOpen}
          open={deleteOpen}
          title="Delete temple"
        />
      </AdminOnly>
    </div>
  );
}

function TempleFilters({
  listParams,
  stateOptions,
  cityOptions,
}: {
  listParams: ReturnType<typeof useListQueryParams>;
  stateOptions: { label: string; value: string }[];
  cityOptions: { label: string; value: string }[];
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <Select
        onValueChange={(value) => listParams.setFilter("stateId", value === "all" ? undefined : value)}
        options={withAllOption(stateOptions, "All states")}
        placeholder="State"
        value={(listParams.state.filters.stateId as string) ?? "all"}
      />
      <Select
        onValueChange={(value) => listParams.setFilter("cityId", value === "all" ? undefined : value)}
        options={withAllOption(cityOptions, "All cities")}
        placeholder="City"
        value={(listParams.state.filters.cityId as string) ?? "all"}
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
            "featured",
            value === "yes" ? true : value === "no" ? false : undefined,
          )
        }
        options={featuredOptions}
        placeholder="Featured"
        value={
          listParams.state.filters.featured === true
            ? "yes"
            : listParams.state.filters.featured === false
              ? "no"
              : "all"
        }
      />
    </div>
  );
}

export function TempleListPageContent() {
  const listParams = useListQueryParams();
  const { data, isLoading, isError, error, refetch, isFetching } = useTemples(listParams.params);
  const { data: statesData } = useStates(REFERENCE_LIST_PARAMS);
  const selectedStateId = listParams.state.filters.stateId as string | undefined;
  const { data: citiesData } = useCities({
    ...REFERENCE_LIST_PARAMS,
    filters: selectedStateId ? { stateId: selectedStateId } : undefined,
  });

  const stateLookup = useMemo(
    () => buildLookup(statesData?.items ?? []),
    [statesData?.items],
  );
  const cityLookup = useMemo(
    () => buildLookup(citiesData?.items ?? []),
    [citiesData?.items],
  );

  const columns = useMemo<ColumnDef<EntityRecord>[]>(
    () => [
      { header: "Image", cell: () => <TempleImage /> },
      {
        accessorKey: "name",
        header: "Temple Name",
        cell: ({ row }) => <span className="font-medium">{getString(row.original, "name")}</span>,
      },
      {
        accessorKey: "templeCode",
        header: "Temple Code",
        cell: ({ row }) => getString(row.original, "templeCode"),
      },
      {
        id: "state",
        header: "State",
        cell: ({ row }) => stateLookup.get(getString(row.original, "stateId", "")) ?? "—",
      },
      {
        id: "city",
        header: "City",
        cell: ({ row }) => cityLookup.get(getString(row.original, "cityId", "")) ?? "—",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <TempleStatusBadge status={getString(row.original, "status")} />,
      },
      {
        accessorKey: "featured",
        header: "Featured",
        cell: ({ row }) => (
          <Badge variant={getBoolean(row.original, "featured") ? "success" : "secondary"}>
            {getBoolean(row.original, "featured") ? "Yes" : "No"}
          </Badge>
        ),
      },
      { id: "actions", header: "Actions", cell: ({ row }) => <TempleRowActions record={row.original} /> },
    ],
    [stateLookup, cityLookup],
  );

  const rows = data?.items ?? [];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Temples</p>
            <h1 className="text-3xl font-semibold tracking-tight">Temple Management</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage temple records from PostgreSQL via the temples API.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RoleBadge />
            <AdminOnly>
              <Button render={<Link href="/admin/temples/create" />} leftIcon={<Plus />}>
                Create Temple
              </Button>
            </AdminOnly>
          </div>
        </header>

        <DataTable
          columns={columns}
          data={rows}
          emptyState={<EmptyState description="No temples match your filters." title="No temples found" />}
          error={
            isError ? (
              <ErrorState description={error?.message ?? "Failed to load temples."} onRetry={() => void refetch()} />
            ) : undefined
          }
          filters={
            <TempleFilters
              cityOptions={recordsToOptions(citiesData?.items ?? [])}
              listParams={listParams}
              stateOptions={recordsToOptions(statesData?.items ?? [])}
            />
          }
          loading={isLoading}
          onRefresh={() => refetch()}
          refreshLoading={isFetching}
          searchPlaceholder="Search temples..."
        />

        <ServerPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
      </div>
    </PermissionGate>
  );
}

type TempleFormValues = {
  templeCode: string;
  name: string;
  slug: string;
  description: string;
  countryId: string;
  stateId: string;
  cityId: string;
  areaId: string;
  status: string;
  featured: boolean;
  popular: boolean;
  sortOrder: number;
};

export function TempleFormPageContent({ mode }: { mode: "create" | "edit" }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const templeId = mode === "edit" ? params.id : "";
  const { data: existing, isLoading, isError, error, refetch } = useTemple(templeId, mode === "edit");
  const createTemple = useCreateTemple();
  const updateTemple = useUpdateTemple();

  const { data: countriesData } = useCountries(REFERENCE_LIST_PARAMS);
  const countryOptions = recordsToOptions(countriesData?.items ?? []);

  const form = useForm<TempleFormValues>({
    values:
      mode === "edit" && existing
        ? {
            templeCode: getString(existing, "templeCode"),
            name: getString(existing, "name"),
            slug: getString(existing, "slug"),
            description: getString(existing, "description"),
            countryId: getString(existing, "countryId"),
            stateId: getString(existing, "stateId"),
            cityId: getString(existing, "cityId"),
            areaId: getString(existing, "areaId"),
            status: getString(existing, "status", "ACTIVE"),
            featured: getBoolean(existing, "featured"),
            popular: getBoolean(existing, "popular"),
            sortOrder: Number(existing.sortOrder ?? 0),
          }
        : {
            templeCode: "",
            name: "",
            slug: "",
            description: "",
            countryId: "",
            stateId: "",
            cityId: "",
            areaId: "",
            status: "ACTIVE",
            featured: false,
            popular: false,
            sortOrder: 0,
          },
  });

  const watchedCountryId = form.watch("countryId");
  const watchedStateId = form.watch("stateId");
  const watchedCityId = form.watch("cityId");

  const { data: statesData } = useStates({
    ...REFERENCE_LIST_PARAMS,
    filters: watchedCountryId ? { countryId: watchedCountryId } : undefined,
  });
  const { data: citiesData } = useCities({
    ...REFERENCE_LIST_PARAMS,
    filters: watchedStateId ? { stateId: watchedStateId } : undefined,
  });
  const { data: areasData } = useAreas({
    ...REFERENCE_LIST_PARAMS,
    filters: watchedCityId ? { cityId: watchedCityId } : undefined,
  });

  async function onSubmit(values: TempleFormValues) {
    const payload: Record<string, unknown> = {
      templeCode: values.templeCode || undefined,
      name: values.name || undefined,
      slug: values.slug,
      description: values.description || undefined,
      countryId: values.countryId,
      stateId: values.stateId,
      cityId: values.cityId,
      areaId: values.areaId,
      status: values.status,
      featured: values.featured,
      popular: values.popular,
      sortOrder: values.sortOrder,
    };

    if (mode === "create") {
      createTemple.mutate(payload, {
        onSuccess: (record) => router.push(`/admin/temples/${getString(record, "id")}`),
      });
      return;
    }

    updateTemple.mutate(
      { id: templeId, payload },
      { onSuccess: () => router.push(`/admin/temples/${templeId}`) },
    );
  }

  return (
    <AdminOnly>
      <AsyncQueryBoundary
        error={error}
        isError={mode === "edit" && isError}
        isLoading={mode === "edit" && isLoading}
        loadingLabel="Loading temple..."
        onRetry={() => refetch()}
      >
        <div className="space-y-6">
          <header>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">
              Temple Management
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {mode === "create" ? "Create Temple" : "Edit Temple"}
            </h1>
          </header>

          <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormSection columns={2} description="Core temple information." title="General">
              <Input label="Temple Code" {...form.register("templeCode")} />
              <Input label="Temple Name" required {...form.register("name", { required: true })} />
              <Input label="Slug" required {...form.register("slug", { required: true })} />
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
                checked={form.watch("featured")}
                description="Feature this temple in prominent areas."
                label="Featured"
                onCheckedChange={(checked) => form.setValue("featured", checked, { shouldDirty: true })}
              />
              <Switch
                checked={form.watch("popular")}
                description="Mark temple as popular."
                label="Popular"
                onCheckedChange={(checked) => form.setValue("popular", checked, { shouldDirty: true })}
              />
            </FormSection>

            <FormSection columns={2} description="Location hierarchy from geographic reference data." title="Location">
              <div className="grid gap-2">
                <span className="text-sm font-medium">Country</span>
                <Select
                  onValueChange={(value) => {
                    form.setValue("countryId", value, { shouldDirty: true });
                    form.setValue("stateId", "", { shouldDirty: true });
                    form.setValue("cityId", "", { shouldDirty: true });
                    form.setValue("areaId", "", { shouldDirty: true });
                  }}
                  options={countryOptions}
                  placeholder="Select country"
                  value={form.watch("countryId")}
                />
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">State</span>
                <Select
                  onValueChange={(value) => {
                    form.setValue("stateId", value, { shouldDirty: true });
                    form.setValue("cityId", "", { shouldDirty: true });
                    form.setValue("areaId", "", { shouldDirty: true });
                  }}
                  options={recordsToOptions(statesData?.items ?? [])}
                  placeholder="Select state"
                  value={form.watch("stateId")}
                />
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">City</span>
                <Select
                  onValueChange={(value) => {
                    form.setValue("cityId", value, { shouldDirty: true });
                    form.setValue("areaId", "", { shouldDirty: true });
                  }}
                  options={recordsToOptions(citiesData?.items ?? [])}
                  placeholder="Select city"
                  value={form.watch("cityId")}
                />
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Area</span>
                <Select
                  onValueChange={(value) => form.setValue("areaId", value, { shouldDirty: true })}
                  options={recordsToOptions(areasData?.items ?? [])}
                  placeholder="Select area"
                  value={form.watch("areaId")}
                />
              </div>
            </FormSection>

            <FormActions
              canReset
              dirty={form.formState.isDirty}
              submitting={createTemple.isPending || updateTemple.isPending}
              onCancel={() => router.back()}
              onReset={() => form.reset()}
              sticky
              submitLabel={mode === "create" ? "Create Temple" : "Save Changes"}
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

export function TempleDetailsPageContent() {
  const params = useParams<{ id: string }>();
  const { data: temple, isLoading, isError, error, refetch } = useTemple(params.id);
  const { data: statesData } = useStates(REFERENCE_LIST_PARAMS);
  const { data: citiesData } = useCities(REFERENCE_LIST_PARAMS);

  const stateLookup = useMemo(
    () => buildLookup(statesData?.items ?? []),
    [statesData?.items],
  );
  const cityLookup = useMemo(
    () => buildLookup(citiesData?.items ?? []),
    [citiesData?.items],
  );

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel="Loading temple..."
        onRetry={() => refetch()}
      >
        {temple ? (
          <div className="space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">
                  Temple Details
                </p>
                <h1 className="text-3xl font-semibold tracking-tight">{getString(temple, "name")}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {getString(temple, "templeCode")} ·{" "}
                  {cityLookup.get(getString(temple, "cityId", "")) ?? "—"},{" "}
                  {stateLookup.get(getString(temple, "stateId", "")) ?? "—"}
                </p>
              </div>
              <AdminOnly>
                <Button render={<Link href={`/admin/temples/${params.id}/edit`} />} leftIcon={<Pencil />}>
                  Edit Temple
                </Button>
              </AdminOnly>
            </header>

            <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]" aria-label="Temple overview">
              <Card className="glass-panel shadow-soft">
                <CardContent className="space-y-4">
                  <TempleImage />
                  <div>
                    <h2 className="text-xl font-semibold">{getString(temple, "name")}</h2>
                    <p className="text-sm text-muted-foreground">{getString(temple, "slug")}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <TempleStatusBadge status={getString(temple, "status")} />
                    {getBoolean(temple, "featured") ? <Badge variant="success">Featured</Badge> : null}
                    {getBoolean(temple, "popular") ? <Badge variant="info">Popular</Badge> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{getString(temple, "description")}</p>
                </CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailSection icon={<MapPin />} title="Location">
                  <p className="text-sm text-muted-foreground">
                    State: {stateLookup.get(getString(temple, "stateId", "")) ?? "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    City: {cityLookup.get(getString(temple, "cityId", "")) ?? "—"}
                  </p>
                </DetailSection>
                <DetailSection icon={<Building2 />} title="Identifiers">
                  <p className="text-sm text-muted-foreground">Code: {getString(temple, "templeCode")}</p>
                  <p className="text-sm text-muted-foreground">ID: {getString(temple, "id")}</p>
                </DetailSection>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3" aria-label="Temple metadata">
              <DetailSection icon={<CalendarClock />} title="Timestamps">
                <p className="text-sm text-muted-foreground">
                  Created: {formatDateTime(temple.createdAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Updated: {formatDateTime(temple.updatedAt)}
                </p>
              </DetailSection>
            </section>
          </div>
        ) : null}
      </AsyncQueryBoundary>
    </PermissionGate>
  );
}
