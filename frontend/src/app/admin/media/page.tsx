"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { getToken } from "@/lib/api";
import type { PaginatedResponse, MediaItem } from "@/types/api";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/** Media library with image upload */
export default function MediaPage() {
  const [data, setData] = useState<MediaItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/media?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data.items);
        setPagination(json.data.pagination);
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/media/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Image uploaded");
        fetchData();
      } else {
        toast.error(json.message || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const columns: Column<MediaItem>[] = [
    { key: "name", header: "File", cell: (row) => row.originalName },
    { key: "type", header: "Type", cell: (row) => row.mediaType },
    {
      key: "size",
      header: "Size",
      cell: (row) => `${(row.fileSize / 1024).toFixed(1)} KB`,
    },
    {
      key: "uploaded",
      header: "Uploaded",
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <>
      <AdminHeader title="Media Library" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <PageHeader title="Media Library" description="Upload and manage images and media files">
          <Button size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
            <Upload className="mr-1 h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </PageHeader>
        <DataTable columns={columns} data={data} pagination={pagination} onPageChange={setPage} loading={loading} />
      </div>
    </>
  );
}
