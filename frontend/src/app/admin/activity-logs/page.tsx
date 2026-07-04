"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { apiFetch, buildQuery } from "@/lib/api";
import type { PaginatedResponse, ActivityLog } from "@/types/api";

/** Activity logs audit trail */
export default function ActivityLogsPage() {
  const [data, setData] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiFetch<PaginatedResponse<ActivityLog>>(
        `/activity-logs${buildQuery({ page, limit: 10 })}`
      );
      setData(result.items);
      setPagination(result.pagination);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<ActivityLog>[] = [
    { key: "user", header: "User", cell: (row) => row.user?.name ?? "System" },
    { key: "action", header: "Action", cell: (row) => row.action },
    { key: "entity", header: "Entity", cell: (row) => `${row.entityType}${row.entityId ? ` #${row.entityId.slice(0, 8)}` : ""}` },
    { key: "time", header: "Time", cell: (row) => new Date(row.createdAt).toLocaleString() },
  ];

  return (
    <>
      <AdminHeader title="Activity Logs" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <PageHeader title="Activity Logs" description="Audit trail of admin actions" />
        <DataTable columns={columns} data={data} pagination={pagination} onPageChange={setPage} loading={loading} />
      </div>
    </>
  );
}
