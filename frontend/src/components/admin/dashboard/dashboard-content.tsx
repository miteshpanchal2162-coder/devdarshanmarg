"use client";

import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  Database,
  FileText,
  Landmark,
  Plus,
  Server,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AsyncQueryBoundary } from "@/components/common/async-query-boundary";
import { KPIGrid, KPIItem } from "@/components/ui/chart-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/enterprise";
import {
  useActivityLogs,
  useContentItems,
  useUserComments,
  useUserReviews,
  useUsers,
} from "@/hooks/queries/use-entities";
import { useDashboard } from "@/hooks/queries/use-dashboard";
import { useAuthStore } from "@/stores/auth-store";
import type { DashboardStats } from "@/services/dashboard.service";
import { formatCount, formatRelativeTime, getString } from "@/utils/record-helpers";

const quickActions = [
  { href: "/admin/temples/create", label: "Add Temple" },
  { href: "/admin/festivals/create", label: "Add Festival" },
  { href: "/admin/deities/create", label: "Add Deity" },
  { href: "/admin/content/create", label: "Add Content" },
  { href: "/admin/panchang/create", label: "Add Panchang" },
  { href: "/admin/users", label: "Manage Users" },
];

function buildKpis(stats: DashboardStats) {
  return [
    {
      label: "Total Users",
      value: formatCount(stats.users),
      subtitle: `${formatCount(stats.activeUsers)} active · ${formatCount(stats.todayRegistrations)} joined today`,
      icon: <Users />,
      trend: `${formatCount(stats.todayLogins)} logins today`,
    },
    {
      label: "Total Temples",
      value: formatCount(stats.temples),
      subtitle: "Live database count",
      icon: <Landmark />,
      trend: "From PostgreSQL",
    },
    {
      label: "Total Festivals",
      value: formatCount(stats.festivals),
      subtitle: "Live database count",
      icon: <CalendarCheck />,
      trend: "From PostgreSQL",
    },
    {
      label: "Total Deities",
      value: formatCount(stats.deities),
      subtitle: "Live database count",
      icon: <Sparkles />,
      trend: "From PostgreSQL",
    },
    {
      label: "Total Contents",
      value: formatCount(stats.content),
      subtitle: `${formatCount(stats.pendingReviews)} pending reviews`,
      icon: <FileText />,
      trend: `${formatCount(stats.pendingComments)} pending comments`,
    },
    {
      label: "Panchang & Media",
      value: formatCount(stats.panchang),
      subtitle: `${formatCount(stats.media)} media assets`,
      icon: <CalendarCheck />,
      trend: `${formatCount(stats.recentActivityCount)} activities today`,
    },
  ];
}

function DashboardTable({
  title,
  rows,
  emptyLabel,
  reviewHref,
}: {
  title: string;
  rows: Array<{ type: string; name: string; status: string; href?: string }>;
  emptyLabel: string;
  reviewHref?: string;
}) {
  return (
    <Card className="glass-panel shadow-soft">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <EmptyState description={emptyLabel} title="Nothing pending" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <caption className="sr-only">{title}</caption>
              <thead className="border-b text-caption uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="py-2 font-medium" scope="col">Type</th>
                  <th className="py-2 font-medium" scope="col">Name</th>
                  <th className="py-2 font-medium" scope="col">Status</th>
                  <th className="py-2 text-right font-medium" scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {rows.map((row) => (
                  <tr key={`${row.type}-${row.name}-${row.status}`}>
                    <td className="py-3 text-muted-foreground">{row.type}</td>
                    <td className="py-3 font-medium">{row.name}</td>
                    <td className="py-3"><Badge variant="secondary">{row.status}</Badge></td>
                    <td className="py-3 text-right">
                      <Button
                        render={<Link href={row.href ?? reviewHref ?? "/admin/content"} />}
                        size="sm"
                        variant="outline"
                      >
                        Open
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardContent() {
  const [dateLabel, setDateLabel] = useState("Today");
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboard();
  const { data: activities } = useActivityLogs({ page: 1, limit: 5, sortBy: "createdAt", sortOrder: "desc" });
  const { data: recentUsers } = useUsers({ page: 1, limit: 5, sortBy: "createdAt", sortOrder: "desc" });
  const { data: latestContent } = useContentItems({ page: 1, limit: 5, sortBy: "createdAt", sortOrder: "desc" });
  const { data: pendingReviews } = useUserReviews({
    page: 1,
    limit: 5,
    status: "INACTIVE",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { data: pendingComments } = useUserComments({
    page: 1,
    limit: 5,
    status: "INACTIVE",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    setDateLabel(new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(new Date()));
  }, []);

  const kpis = useMemo(() => (data ? buildKpis(data) : []), [data]);
  const welcomeName = user?.fullName ?? user?.email ?? "Admin";

  const activityRows = useMemo(
    () =>
      (activities?.items ?? []).map((item) => ({
        title: `${getString(item, "action")} · ${getString(item, "entityType")}`,
        timestamp: formatRelativeTime(item.createdAt),
        status: getString(item, "entityId", "—"),
        icon: <CheckCircle2 />,
      })),
    [activities],
  );

  const recentUserRows = useMemo(
    () =>
      (recentUsers?.items ?? []).map((item) => ({
        type: "User",
        name: getString(item, "fullName"),
        status: getString(item, "status"),
        href: `/admin/users/${getString(item, "id")}`,
      })),
    [recentUsers],
  );

  const contentRows = useMemo(
    () =>
      (latestContent?.items ?? []).map((item) => ({
        type: "Content",
        name: getString(item, "title"),
        status: getString(item, "status"),
        href: `/admin/content/${getString(item, "id")}`,
      })),
    [latestContent],
  );

  const reviewRows = useMemo(
    () =>
      (pendingReviews?.items ?? []).map((item) => ({
        type: "Review",
        name: getString(item, "title", getString(item, "id")),
        status: getString(item, "status"),
        href: `/admin/content`,
      })),
    [pendingReviews],
  );

  const commentRows = useMemo(
    () =>
      (pendingComments?.items ?? []).map((item) => ({
        type: "Comment",
        name: getString(item, "body", getString(item, "id")).slice(0, 80),
        status: getString(item, "status"),
        href: `/admin/content`,
      })),
    [pendingComments],
  );

  const pendingRows = useMemo(() => [...reviewRows, ...commentRows].slice(0, 5), [reviewRows, commentRows]);

  const systemStatus = useMemo(
    () =>
      data
        ? [
            { title: "Database", value: "Online", icon: <Database />, tone: "success" as const },
            { title: "Storage", value: `${formatCount(data.media)} assets`, icon: <WalletCards />, tone: "info" as const },
            { title: "API", value: "Connected", icon: <Server />, tone: "success" as const },
            { title: "Activity", value: `${formatCount(data.recentActivityCount)} today`, icon: <CalendarCheck />, tone: "success" as const },
          ]
        : [],
    [data],
  );

  const notifications = useMemo(
    () =>
      data
        ? [
            `${formatCount(data.pendingReviews)} reviews awaiting moderation`,
            `${formatCount(data.todayLogins)} user logins recorded today`,
            `${formatCount(data.todayRegistrations)} new registrations today`,
          ]
        : [],
    [data],
  );

  return (
    <div className="space-y-8" aria-label="Enterprise dashboard">
      <section className="rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 shadow-soft sm:p-8">
        <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Welcome Header</p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Namaste, {welcomeName}</h1>
            <p className="mt-2 text-sm text-muted-foreground">DevDarshanMarg overview for {dateLabel}.</p>
          </div>
          <Badge variant="primary">{isFetching ? "Refreshing..." : "Live Dashboard"}</Badge>
        </div>
      </section>

      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel="Loading dashboard stats..."
        onRetry={() => refetch()}
      >
        <KPIGrid className="xl:grid-cols-3 2xl:grid-cols-6">
          {kpis.map((item) => (
            <KPIItem
              description={item.subtitle}
              icon={item.icon}
              key={item.label}
              label={item.label}
              trend={item.trend}
              value={item.value}
            />
          ))}
        </KPIGrid>
      </AsyncQueryBoundary>

      <section aria-label="Quick actions">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => (
            <Card hover key={action.label} variant="elevated">
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{action.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Open module</p>
                </div>
                <Button aria-label={action.label} render={<Link href={action.href} />} size="icon" variant="outline">
                  <Plus />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]" aria-label="Operations">
        <Card className="glass-panel shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activities</CardTitle>
            <Button render={<Link href="/admin/activity-logs" />} size="sm" variant="outline">
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {activityRows.length === 0 ? (
              <EmptyState description="Activity logs from the database will appear here." title="No recent activity" />
            ) : (
              <ol className="space-y-4">
                {activityRows.map((activity) => (
                  <li className="flex gap-3" key={`${activity.title}-${activity.timestamp}`}>
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-4">
                      {activity.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                    </div>
                    <Badge variant="outline">{activity.status}</Badge>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
        <DashboardTable
          emptyLabel="No pending reviews or comments in the database."
          reviewHref="/admin/content"
          rows={pendingRows}
          title="Pending Reviews & Comments"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]" aria-label="Content and system">
        <DashboardTable
          emptyLabel="Create content in the admin panel to see latest items here."
          rows={contentRows}
          title="Latest Content"
        />
        <Card className="glass-panel shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Users</CardTitle>
            <Button render={<Link href="/admin/users" />} size="sm" variant="outline">
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {recentUserRows.length === 0 ? (
              <EmptyState description="Registered users from PostgreSQL will appear here." title="No users yet" />
            ) : (
              <ul className="space-y-3">
                {recentUserRows.map((row) => (
                  <li className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-3 py-2" key={row.href}>
                    <div>
                      <p className="font-medium">{row.name}</p>
                      <p className="text-sm text-muted-foreground">{row.type}</p>
                    </div>
                    <Badge variant="secondary">{row.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      {data ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="System status">
            {systemStatus.map((item) => (
              <Card key={item.title} variant="elevated">
                <CardContent className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">{item.icon}</span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <Badge variant={item.tone}>{item.value}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <Card className="glass-panel shadow-soft" aria-label="Notifications">
            <CardHeader>
              <CardTitle>Live Notifications Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 md:grid-cols-3">
                {notifications.map((notification) => (
                  <li className="rounded-2xl border border-border bg-muted/20 p-4 text-sm" key={notification}>
                    {notification}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
