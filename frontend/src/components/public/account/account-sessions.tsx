"use client";

import { AsyncQueryBoundary } from "@/components/common/async-query-boundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AccountShell } from "@/components/public/account/account-shell";
import { useDeleteSession, useLogoutAllSessions, useMeSessions } from "@/hooks/queries/use-me";
import { formatDateTime, getString } from "@/utils/record-helpers";

export default function AccountSessionsPage() {
  const { data, isLoading, isError, error, refetch } = useMeSessions({ page: 1, limit: 20 });
  const deleteSession = useDeleteSession();
  const logoutAll = useLogoutAllSessions();

  return (
    <AccountShell title="Sessions">
      <div className="mb-4">
        <Button loading={logoutAll.isPending} onClick={() => logoutAll.mutate()} variant="destructive">
          Logout All Devices
        </Button>
      </div>
      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel="Loading sessions..."
        onRetry={() => refetch()}
      >
        <div className="space-y-3">
          {(data?.items ?? []).map((session) => (
            <Card key={getString(session, "id")}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
                <div>
                  <p className="font-medium">{getString(session, "deviceName", getString(session, "browser"))}</p>
                  <p className="text-muted-foreground">
                    {getString(session, "os")} · {getString(session, "ipAddress")} · Last active{" "}
                    {formatDateTime(session.lastActivity)}
                  </p>
                </div>
                <Button
                  loading={deleteSession.isPending}
                  onClick={() => deleteSession.mutate(getString(session, "id"))}
                  size="sm"
                  variant="outline"
                >
                  Revoke
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </AsyncQueryBoundary>
    </AccountShell>
  );
}
