"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { apiFetch, buildQuery } from "@/lib/api";
import type { PaginatedResponse, User } from "@/types/api";

/** Users management page (admin only) */
export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiFetch<PaginatedResponse<User & { isActive?: boolean; createdAt?: string; lastLoginAt?: string }>>(
        `/users${buildQuery({ page, limit: 10 })}`
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

  const columns: Column<User & { isActive?: boolean; createdAt?: string; lastLoginAt?: string }>[] = [
    { key: "name", header: "Name", cell: (row) => row.name },
    { key: "email", header: "Email", cell: (row) => row.email },
    {
      key: "role",
      header: "Role",
      cell: (row) => <Badge variant="outline">{row.role}</Badge>,
    },
    {
      key: "lastLogin",
      header: "Last Login",
      cell: (row) => row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleDateString() : "Never",
    },
  ];

  return (
    <>
      <AdminHeader title="Users" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <PageHeader title="Users" description="Manage admin panel users and roles">
          <Button size="sm"><Plus className="mr-1 h-4 w-4" />Add User</Button>
        </PageHeader>
        <DataTable columns={columns} data={data} pagination={pagination} onPageChange={setPage} loading={loading} />
      </div>
    </>
  );
}
