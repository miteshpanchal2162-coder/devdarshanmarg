"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { PageHeader } from "@/components/admin/page-header";
import { SearchInput } from "@/components/admin/search-input";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { apiFetch, buildQuery } from "@/lib/api";
import type { PaginatedResponse, Temple } from "@/types/api";

/** Temples management page */
export default function TemplesPage() {
  const [data, setData] = useState<Temple[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiFetch<PaginatedResponse<Temple>>(
        `/temples${buildQuery({ page, limit: 10, search })}`
      );
      setData(result.items);
      setPagination(result.pagination);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const columns: Column<Temple>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => row.translations?.[0]?.name ?? row.slug,
    },
    { key: "slug", header: "Slug", cell: (row) => <code className="text-xs">{row.slug}</code> },
    { key: "city", header: "City", cell: (row) => row.city?.slug ?? "—" },
    { key: "state", header: "State", cell: (row) => row.state?.slug ?? "—" },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <div className="flex gap-1">
          <Badge variant={row.isActive ? "default" : "secondary"}>
            {row.isActive ? "Active" : "Inactive"}
          </Badge>
          {row.isFeatured && <Badge variant="outline">Featured</Badge>}
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Temples" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <PageHeader title="Temples" description="Manage temple listings across India">
          <Button size="sm"><Plus className="mr-1 h-4 w-4" />Add Temple</Button>
        </PageHeader>
        <div className="mb-4">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search temples..." className="max-w-sm" />
        </div>
        <DataTable columns={columns} data={data} pagination={pagination} onPageChange={setPage} loading={loading} />
      </div>
    </>
  );
}
