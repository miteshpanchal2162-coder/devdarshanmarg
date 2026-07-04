"use client";

import { useState, useEffect, useCallback } from "react";
import { SearchInput } from "@/components/admin/search-input";
import { DataTable, type Column } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { apiFetch, buildQuery } from "@/lib/api";
import type { PaginatedResponse, SlugEntity } from "@/types/api";

interface EntityListPageProps {
  title: string;
  description: string;
  endpoint: string;
  entityName: string;
}

/** Generic list page for slug-based entities (deities, categories, etc.) */
export function EntityListPage({ title, description, endpoint, entityName }: EntityListPageProps) {
  const [data, setData] = useState<SlugEntity[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiFetch<PaginatedResponse<SlugEntity>>(
        `${endpoint}${buildQuery({ page, limit: 10, search })}`
      );
      setData(result.items);
      setPagination(result.pagination);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, search]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const columns: Column<SlugEntity>[] = [
    { key: "slug", header: "Slug", cell: (row) => <span className="font-medium">{row.slug}</span> },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <span className={row.isActive !== false ? "text-green-600" : "text-muted-foreground"}>
          {row.isActive !== false ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "created",
      header: "Created",
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <PageHeader title={title} description={description}>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Add {entityName}
        </Button>
      </PageHeader>

      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder={`Search ${entityName.toLowerCase()}...`}
          className="max-w-sm"
        />
      </div>

      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        onPageChange={setPage}
        loading={loading}
        emptyMessage={`No ${entityName.toLowerCase()} found.`}
      />
    </div>
  );
}
