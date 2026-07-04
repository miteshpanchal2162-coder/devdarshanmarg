"use client";

import { useEffect, useState } from "react";
import { Landmark, Calendar, Image, Users, FileText } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import type { DashboardStats } from "@/types/api";

/** Admin dashboard with stats and recent activity */
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<DashboardStats>("/dashboard/stats")
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminHeader title="Dashboard" description="Overview of DevDarshanMarg platform" />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Temples" value={loading ? "—" : stats?.counts.temples ?? 0} icon={Landmark} />
          <StatCard title="Festivals" value={loading ? "—" : stats?.counts.festivals ?? 0} icon={Calendar} />
          <StatCard title="Media" value={loading ? "—" : stats?.counts.media ?? 0} icon={Image} />
          <StatCard title="Users" value={loading ? "—" : stats?.counts.users ?? 0} icon={Users} />
          <StatCard title="Content" value={loading ? "—" : stats?.counts.contents ?? 0} icon={FileText} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats?.recentActivity?.length ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              <ul className="space-y-3">
                {stats.recentActivity.map((log) => (
                  <li key={log.id} className="flex items-center justify-between text-sm">
                    <span>
                      <span className="font-medium">{log.user?.name ?? "System"}</span>
                      {" "}{log.action} {log.entityType}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
