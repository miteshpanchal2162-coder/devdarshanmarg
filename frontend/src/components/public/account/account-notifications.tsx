"use client";

import { Switch } from "@/components/ui/switch";
import { AsyncQueryBoundary } from "@/components/common/async-query-boundary";
import { Card, CardContent } from "@/components/ui/card";
import { AccountShell } from "@/components/public/account/account-shell";
import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/hooks/queries/use-me";
import { getBoolean } from "@/utils/record-helpers";

const preferenceFields = [
  "emailEnabled",
  "smsEnabled",
  "pushEnabled",
  "whatsappEnabled",
  "festivalReminder",
  "fastingReminder",
  "templeUpdate",
  "newsletter",
] as const;

export default function AccountNotificationsPage() {
  const { data, isLoading, isError, error, refetch } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  return (
    <AccountShell title="Notification Preferences">
      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel="Loading preferences..."
        onRetry={() => refetch()}
      >
        <Card>
          <CardContent className="grid gap-4 py-6">
            {preferenceFields.map((field) => (
              <Switch
                checked={getBoolean(data ?? {}, field)}
                key={field}
                label={field}
                onCheckedChange={(checked) => updatePreferences.mutate({ [field]: checked })}
              />
            ))}
          </CardContent>
        </Card>
      </AsyncQueryBoundary>
    </AccountShell>
  );
}
