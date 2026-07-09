"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api";
import { formatCount } from "@/utils/record-helpers";

export function ServerPagination({
  meta,
  onPageChange,
  disabled,
}: {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Page {formatCount(meta.page)} of {formatCount(meta.totalPages)} · {formatCount(meta.total)} records
      </p>
      <div className="flex items-center gap-2">
        <Button
          disabled={disabled || !meta.hasPreviousPage}
          onClick={() => onPageChange(meta.page - 1)}
          size="sm"
          type="button"
          variant="outline"
        >
          <ChevronLeft />
          Previous
        </Button>
        <Button
          disabled={disabled || !meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}
          size="sm"
          type="button"
          variant="outline"
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
