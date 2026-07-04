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

interface ContentItem {
  id: string;
  slug: string;
  status: string;
  createdAt: string;
  contentType?: { name: string };
  translations?: { title: string }[];
}

/** Content center for articles and guides */
export default function ContentPage() {
  const [data, setData] = useState<ContentItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiFetch<{ items: ContentItem[]; pagination: typeof pagination }>(
        `/content${buildQuery({ page, limit: 10, search })}`
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

  const columns: Column<ContentItem>[] = [
    { key: "title", header: "Title", cell: (row) => row.translations?.[0]?.title ?? row.slug },
    { key: "type", header: "Type", cell: (row) => row.contentType?.name ?? "—" },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant={row.status === "published" ? "default" : "secondary"}>{row.status}</Badge>
      ),
    },
    { key: "created", header: "Created", cell: (row) => new Date(row.createdAt).toLocaleDateString() },
  ];

  return (
    <>
      <AdminHeader title="Content Center" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <PageHeader title="Content Center" description="Manage articles, guides, and spiritual stories">
          <Button size="sm"><Plus className="mr-1 h-4 w-4" />Add Content</Button>
        </PageHeader>
        <div className="mb-4">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search content..." className="max-w-sm" />
        </div>
        <DataTable columns={columns} data={data} pagination={pagination} onPageChange={setPage} loading={loading} />
      </div>
    </>
  );
}
