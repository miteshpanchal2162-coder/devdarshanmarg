"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Bell, Eye, Mail, Send, Users } from "lucide-react";

import { ServerPagination } from "@/components/admin/common/server-pagination";
import { AsyncQueryBoundary } from "@/components/common/async-query-boundary";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/enterprise";
import { Form, FormActions, FormSection } from "@/components/ui/form-field";
import { PermissionGate, RoleBadge, type UserRole } from "@/components/ui/permission";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUser, useUsers } from "@/hooks/queries/use-entities";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import { getApiErrorMessage } from "@/services/api-client";
import type { EntityRecord } from "@/services/create-crud-service";
import { notificationPreferencesService } from "@/services/settings.service";
import { appToast } from "@/components/ui/sonner";
import { getBoolean, getString } from "@/utils/record-helpers";

const roleOptions = [
  { label: "All roles", value: "all" },
  { label: "Admin", value: "ADMIN" },
  { label: "User", value: "USER" },
];

function UserRowActions({ record }: { record: EntityRecord }) {
  const id = getString(record, "id", "");
  const name = getString(record, "fullName");

  return (
    <Button
      aria-label={`Manage preferences for ${name}`}
      render={<Link href={`/admin/notifications/${id}`} />}
      size="icon-sm"
      variant="ghost"
    >
      <Eye />
    </Button>
  );
}

export function NotificationsPageContent() {
  const listParams = useListQueryParams();
  const { data, isLoading, isError, error, refetch, isFetching } = useUsers(listParams.params);

  const columns = useMemo<ColumnDef<EntityRecord>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "User",
        cell: ({ row }) => <span className="font-medium">{getString(row.original, "fullName")}</span>,
      },
      { accessorKey: "email", header: "Email", cell: ({ row }) => getString(row.original, "email") },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <RoleBadge role={getString(row.original, "role") as UserRole} />,
      },
      { accessorKey: "status", header: "Status", cell: ({ row }) => getString(row.original, "status") },
      { id: "actions", header: "Actions", cell: ({ row }) => <UserRowActions record={row.original} /> },
    ],
    [],
  );

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header>
          <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Notifications Center</p>
          <h1 className="text-3xl font-semibold tracking-tight">Notification Preferences</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage per-user notification preferences. There is no notification campaign API.
          </p>
        </header>

        <DataTable
          columns={columns}
          data={data?.items ?? []}
          emptyState={<EmptyState description="No users match your filters." title="No users found" />}
          error={
            isError ? (
              <ErrorState description={error?.message ?? "Failed to load users."} onRetry={() => void refetch()} />
            ) : undefined
          }
          filters={
            <Select
              onValueChange={(value) => listParams.setFilter("role", value === "all" ? undefined : value)}
              options={roleOptions}
              placeholder="Role"
              value={(listParams.state.filters.role as string) ?? "all"}
            />
          }
          loading={isLoading}
          onRefresh={() => refetch()}
          refreshLoading={isFetching}
          searchPlaceholder="Search users..."
        />

        <ServerPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
      </div>
    </PermissionGate>
  );
}

export function SendNotificationPageContent() {
  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <EmptyState
        description="Broadcast and campaign APIs are not available. Manage individual user notification preferences from the notifications list."
        icon={<Send />}
        primaryAction={<Button render={<Link href="/admin/notifications" />} variant="outline">Back to Notifications</Button>}
        title="No notification campaign API"
      />
    </PermissionGate>
  );
}

type PreferenceFormValues = {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  whatsappEnabled: boolean;
  festivalReminder: boolean;
  fastingReminder: boolean;
  templeUpdate: boolean;
  newsletter: boolean;
};

function preferenceQueryKey(userId: string) {
  return ["notification-preferences", userId] as const;
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

export function NotificationDetailsPageContent() {
  const params = useParams<{ id: string }>();
  const userId = params.id;
  const queryClient = useQueryClient();
  const { data: user, isLoading: userLoading, isError: userError, error: userFetchError, refetch: refetchUser } =
    useUser(userId);

  const {
    data: preferences,
    isLoading: prefsLoading,
    isError: prefsError,
    error: prefsFetchError,
    refetch: refetchPrefs,
  } = useQuery({
    queryKey: preferenceQueryKey(userId),
    queryFn: () => notificationPreferencesService.getByUserId(userId),
    enabled: Boolean(userId),
  });

  const updatePreferences = useMutation({
    mutationFn: (payload: Record<string, unknown>) => notificationPreferencesService.update(userId, payload),
    onSuccess: (record) => {
      queryClient.setQueryData(preferenceQueryKey(userId), record);
      appToast.success("Notification preferences saved");
    },
    onError: (error) => appToast.error("Save failed", getApiErrorMessage(error)),
  });

  const createPreferences = useMutation({
    mutationFn: (payload: Record<string, unknown>) => notificationPreferencesService.create(userId, payload),
    onSuccess: (record) => {
      queryClient.setQueryData(preferenceQueryKey(userId), record);
      appToast.success("Notification preferences created");
    },
    onError: (error) => appToast.error("Create failed", getApiErrorMessage(error)),
  });

  const preferenceRecord = preferences ?? {};

  const form = useForm<PreferenceFormValues>({
    values: {
      emailEnabled: getBoolean(preferenceRecord, "emailEnabled", true),
      smsEnabled: getBoolean(preferenceRecord, "smsEnabled"),
      pushEnabled: getBoolean(preferenceRecord, "pushEnabled", true),
      whatsappEnabled: getBoolean(preferenceRecord, "whatsappEnabled"),
      festivalReminder: getBoolean(preferenceRecord, "festivalReminder", true),
      fastingReminder: getBoolean(preferenceRecord, "fastingReminder", true),
      templeUpdate: getBoolean(preferenceRecord, "templeUpdate", true),
      newsletter: getBoolean(preferenceRecord, "newsletter"),
    },
  });

  async function onSubmit(values: PreferenceFormValues) {
    const payload = { ...values };
    if (preferences) {
      updatePreferences.mutate(payload);
      return;
    }
    createPreferences.mutate(payload);
  }

  const isLoading = userLoading || prefsLoading;
  const isError = userError || prefsError;
  const error = userFetchError ?? prefsFetchError;

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel="Loading notification preferences..."
        onRetry={() => {
          void refetchUser();
          void refetchPrefs();
        }}
      >
        {user ? (
          <div className="space-y-6">
            <header>
              <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Notification Preferences</p>
              <h1 className="text-3xl font-semibold tracking-tight">{getString(user, "fullName")}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{getString(user, "email")}</p>
            </header>

            <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]" aria-label="User notification overview">
              <Card className="glass-panel shadow-soft">
                <CardContent className="space-y-4">
                  <Bell className="size-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold">{getString(user, "fullName")}</h2>
                    <p className="text-sm text-muted-foreground">Per-user notification channel and topic preferences.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <RoleBadge role={getString(user, "role") as UserRole} />
                    <Badge variant="secondary">{getString(user, "status")}</Badge>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailCard icon={<Mail />} title="Email">
                  <p className="text-sm text-muted-foreground">{getString(user, "email")}</p>
                </DetailCard>
                <DetailCard icon={<Users />} title="User ID">
                  <p className="text-sm text-muted-foreground">{getString(user, "id")}</p>
                </DetailCard>
              </div>
            </section>

            <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
              <FormSection columns={2} description="Channel delivery preferences." title="Channels">
                <Switch
                  checked={form.watch("emailEnabled")}
                  description="Send email notifications."
                  label="Email Enabled"
                  onCheckedChange={(checked) => form.setValue("emailEnabled", checked, { shouldDirty: true })}
                />
                <Switch
                  checked={form.watch("smsEnabled")}
                  description="Send SMS notifications."
                  label="SMS Enabled"
                  onCheckedChange={(checked) => form.setValue("smsEnabled", checked, { shouldDirty: true })}
                />
                <Switch
                  checked={form.watch("pushEnabled")}
                  description="Send push notifications."
                  label="Push Enabled"
                  onCheckedChange={(checked) => form.setValue("pushEnabled", checked, { shouldDirty: true })}
                />
                <Switch
                  checked={form.watch("whatsappEnabled")}
                  description="Send WhatsApp notifications."
                  label="WhatsApp Enabled"
                  onCheckedChange={(checked) => form.setValue("whatsappEnabled", checked, { shouldDirty: true })}
                />
              </FormSection>

              <FormSection columns={2} description="Topic-level notification preferences." title="Topics">
                <Switch
                  checked={form.watch("festivalReminder")}
                  description="Festival reminder notifications."
                  label="Festival Reminders"
                  onCheckedChange={(checked) => form.setValue("festivalReminder", checked, { shouldDirty: true })}
                />
                <Switch
                  checked={form.watch("fastingReminder")}
                  description="Fasting reminder notifications."
                  label="Fasting Reminders"
                  onCheckedChange={(checked) => form.setValue("fastingReminder", checked, { shouldDirty: true })}
                />
                <Switch
                  checked={form.watch("templeUpdate")}
                  description="Temple update notifications."
                  label="Temple Updates"
                  onCheckedChange={(checked) => form.setValue("templeUpdate", checked, { shouldDirty: true })}
                />
                <Switch
                  checked={form.watch("newsletter")}
                  description="Newsletter notifications."
                  label="Newsletter"
                  onCheckedChange={(checked) => form.setValue("newsletter", checked, { shouldDirty: true })}
                />
              </FormSection>

              <FormActions
                canReset
                dirty={form.formState.isDirty}
                submitting={updatePreferences.isPending || createPreferences.isPending}
                onCancel={() => form.reset()}
                onReset={() => form.reset()}
                sticky
                submitLabel={preferences ? "Save Preferences" : "Create Preferences"}
              />
            </Form>
          </div>
        ) : null}
      </AsyncQueryBoundary>
    </PermissionGate>
  );
}
