"use client";

import Link from "next/link";
import { CalendarCheck, CalendarDays, CheckCircle2, CircleDashed, Cloud, Database, FileText, Landmark, Plus, Server, Sparkles, Users, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";

import { AreaChartCard, BarChartCard, KPIGrid, KPIItem, LineChartCard } from "@/components/ui/chart-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const kpis = [
  { label: "Total Users", value: "18,420", subtitle: "+8.2% this month", icon: <Users />, trend: "Growth placeholder" },
  { label: "Total Temples", value: "1,284", subtitle: "64 new drafts", icon: <Landmark />, trend: "Reviewing" },
  { label: "Total Festivals", value: "342", subtitle: "18 upcoming", icon: <CalendarDays />, trend: "Seasonal" },
  { label: "Total Deities", value: "786", subtitle: "32 updated", icon: <Sparkles />, trend: "Stable" },
  { label: "Total Contents", value: "9,860", subtitle: "126 pending edits", icon: <FileText />, trend: "Active" },
  { label: "Total Panchang Records", value: "54,120", subtitle: "Synced today", icon: <CalendarCheck />, trend: "Healthy" },
];

const monthlyVisitors = [
  { name: "Jan", value: 18200 },
  { name: "Feb", value: 21400 },
  { name: "Mar", value: 23600 },
  { name: "Apr", value: 28800 },
  { name: "May", value: 33400 },
  { name: "Jun", value: 37200 },
];

const contentGrowth = [
  { name: "Jan", value: 420 },
  { name: "Feb", value: 560 },
  { name: "Mar", value: 610 },
  { name: "Apr", value: 780 },
  { name: "May", value: 920 },
  { name: "Jun", value: 1040 },
];

const userGrowth = [
  { name: "Jan", value: 2200 },
  { name: "Feb", value: 2800 },
  { name: "Mar", value: 3600 },
  { name: "Apr", value: 4300 },
  { name: "May", value: 5100 },
  { name: "Jun", value: 6200 },
];

const quickActions = [
  { href: "/temples/create", label: "Add Temple" },
  { href: "/festivals/create", label: "Add Festival" },
  { href: "/deities/create", label: "Add Deity" },
  { href: "/content/create", label: "Add Content" },
  { href: "/panchang/create", label: "Add Panchang" },
  { href: "/users", label: "Manage Users" },
];

const activities = [
  { title: "Kashi Vishwanath content updated", timestamp: "12 min ago", status: "Published", icon: <CheckCircle2 /> },
  { title: "Jagannath Rath Yatra draft submitted", timestamp: "42 min ago", status: "Pending", icon: <CircleDashed /> },
  { title: "Panchang records imported", timestamp: "2 hr ago", status: "Synced", icon: <CalendarCheck /> },
  { title: "User role review requested", timestamp: "Yesterday", status: "Review", icon: <Users /> },
];

const pendingReviews = [
  { type: "Temple", name: "Somnath Temple", status: "Pending" },
  { type: "Festival", name: "Navratri Guide", status: "Draft" },
  { type: "Content", name: "Aarti Collection", status: "Review" },
];

const latestContent = [
  { type: "Article", name: "Ekadashi Vrat Katha", status: "Published" },
  { type: "Temple", name: "Meenakshi Amman Guide", status: "Updated" },
  { type: "Panchang", name: "Shravan Month Records", status: "Imported" },
];

const systemStatus = [
  { title: "Database", value: "Online", icon: <Database />, tone: "success" as const },
  { title: "Storage", value: "72% used", icon: <Cloud />, tone: "warning" as const },
  { title: "API", value: "Placeholder", icon: <Server />, tone: "info" as const },
  { title: "Queue", value: "Idle", icon: <WalletCards />, tone: "success" as const },
];

const notifications = [
  "3 temple submissions awaiting review",
  "Panchang sync placeholder completed",
  "Content quality checklist ready for review",
];

function DashboardTable({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ type: string; name: string; status: string }>;
}) {
  return (
    <Card className="glass-panel shadow-soft">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
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
                <tr key={`${row.type}-${row.name}`}>
                  <td className="py-3 text-muted-foreground">{row.type}</td>
                  <td className="py-3 font-medium">{row.name}</td>
                  <td className="py-3"><Badge variant="secondary">{row.status}</Badge></td>
                  <td className="py-3 text-right">
                    <Button render={<Link href="/content" />} size="sm" variant="outline">
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardContent() {
  const [dateLabel, setDateLabel] = useState("Today");

  useEffect(() => {
    setDateLabel(new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(new Date()));
  }, []);

  return (
    <div className="space-y-8" aria-label="Enterprise dashboard">
      <section className="rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 shadow-soft sm:p-8">
        <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">Welcome Header</p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Namaste, Admin Name</h1>
            <p className="mt-2 text-sm text-muted-foreground">Here is your DevDarshanMarg overview for {dateLabel}.</p>
          </div>
          <Badge variant="primary">Enterprise Dashboard</Badge>
        </div>
      </section>

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

      <section className="grid gap-4 xl:grid-cols-3" aria-label="Analytics">
        <LineChartCard data={monthlyVisitors} description="Dummy monthly visitor trend." onExport={() => undefined} onRefresh={() => undefined} showTooltip title="Monthly Visitors" />
        <BarChartCard data={contentGrowth} description="Dummy content publishing growth." onExport={() => undefined} onRefresh={() => undefined} showTooltip title="Content Growth" />
        <AreaChartCard data={userGrowth} description="Dummy user acquisition growth." onExport={() => undefined} onRefresh={() => undefined} showTooltip title="User Growth" />
      </section>

      <section aria-label="Quick actions">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => (
            <Card hover key={action.label} variant="elevated">
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{action.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Navigation placeholder</p>
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
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {activities.map((activity) => (
                <li className="flex gap-3" key={activity.title}>
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
          </CardContent>
        </Card>
        <DashboardTable rows={pendingReviews} title="Pending Reviews" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]" aria-label="Content and system">
        <DashboardTable rows={latestContent} title="Latest Content" />
        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
      </section>

      <Card className="glass-panel shadow-soft" aria-label="Notifications">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
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
    </div>
  );
}
