"use client";

import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useId, useState, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  MoreHorizontal,
  RefreshCw,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, SearchBox, StatusPill } from "@/components/ui/enterprise";
import { cn } from "@/lib/utils";

type DataTableDensity = "comfortable" | "compact";

export function DataTable<TData, TValue>({
  bulkActions,
  className,
  columns,
  data,
  enableRowSelection = true,
  emptyState,
  error,
  exportPlaceholder,
  filters,
  importPlaceholder,
  loading = false,
  onRefresh,
  refreshLoading = false,
  searchPlaceholder = "Search records...",
  skeletonRows = 6,
  toolbarActions,
}: {
  bulkActions?: ReactNode;
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyState?: ReactNode;
  enableRowSelection?: boolean;
  error?: ReactNode;
  exportPlaceholder?: () => void;
  filters?: ReactNode;
  importPlaceholder?: () => void;
  loading?: boolean;
  onRefresh?: () => void;
  refreshLoading?: boolean;
  searchPlaceholder?: string;
  skeletonRows?: number;
  toolbarActions?: ReactNode;
}) {
  const tableLabelId = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [density, setDensity] = useState<DataTableDensity>("comfortable");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
      sorting,
    },
    enableRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const visibleColumnCount = table.getVisibleLeafColumns().length + (enableRowSelection ? 1 : 0);
  const rowPadding = density === "compact" ? "px-3 py-2" : "px-3 py-3";

  return (
    <section
      aria-labelledby={tableLabelId}
      className={cn("space-y-4", className)}
      data-density={density}
    >
      <h2 className="sr-only" id={tableLabelId}>
        Enterprise data table
      </h2>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBox
            className="w-full sm:max-w-xs"
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder={searchPlaceholder}
            value={globalFilter}
          />
          {filters}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Table actions">
          {selectedCount > 0 && bulkActions ? (
            <div className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm text-primary">
              {selectedCount} selected
            </div>
          ) : null}
          {selectedCount > 0 ? bulkActions : null}

          <Button
            aria-label="Refresh table"
            disabled={!onRefresh}
            loading={refreshLoading}
            onClick={onRefresh}
            size="sm"
            type="button"
            variant="outline"
          >
            {!refreshLoading ? <RefreshCw /> : null}
            Refresh
          </Button>

          <Button
            aria-label="Export table placeholder"
            disabled={!exportPlaceholder}
            onClick={exportPlaceholder}
            size="sm"
            type="button"
            variant="outline"
          >
            <Download />
            Export
          </Button>

          <Button
            aria-label="Import table placeholder"
            disabled={!importPlaceholder}
            onClick={importPlaceholder}
            size="sm"
            type="button"
            variant="outline"
          >
            <Upload />
            Import
          </Button>

          <Button
            aria-label={`Switch to ${density === "comfortable" ? "compact" : "comfortable"} density`}
            onClick={() =>
              setDensity((current) =>
                current === "comfortable" ? "compact" : "comfortable",
              )
            }
            size="sm"
            type="button"
            variant="outline"
          >
            {density === "comfortable" ? "Comfortable" : "Compact"}
          </Button>

          <details className="group/columns relative">
            <summary className="flex h-7 cursor-pointer list-none items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-[0.8rem] font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
              Columns
            </summary>
            <div className="absolute right-0 z-20 mt-2 grid min-w-44 gap-1 rounded-xl border border-border bg-popover p-2 text-sm shadow-lg">
            {table.getAllLeafColumns().map((column) => (
              <button
                aria-label={`Toggle ${column.id} column`}
                aria-pressed={column.getIsVisible()}
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                key={column.id}
                onClick={() => column.toggleVisibility(!column.getIsVisible())}
                type="button"
              >
                <span className="truncate">{column.id}</span>
                {column.getIsVisible() ? <Eye /> : <EyeOff />}
              </button>
            ))}
            </div>
          </details>

          {toolbarActions}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm" aria-busy={loading}>
            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {enableRowSelection ? (
                    <th className={cn("w-10 text-left", rowPadding)}>
                      <input
                        aria-label="Select all rows"
                        checked={table.getIsAllPageRowsSelected()}
                        className="h-4 w-4 rounded border-input accent-primary"
                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                        type="checkbox"
                      />
                    </th>
                  ) : null}
                  {headerGroup.headers.map((header) => (
                    <th
                      className={cn("text-left text-caption font-semibold uppercase tracking-wide text-muted-foreground", rowPadding)}
                      key={header.id}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          className="inline-flex items-center gap-1 rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                          disabled={!header.column.getCanSort()}
                          onClick={header.column.getToggleSortingHandler()}
                          type="button"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: "↑",
                            desc: "↓",
                          }[header.column.getIsSorted() as string] ?? null}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                  <tr className="border-t border-border/70" key={`skeleton-${rowIndex}`}>
                    {Array.from({ length: visibleColumnCount }).map((__, cellIndex) => (
                      <td className={rowPadding} key={`skeleton-${rowIndex}-${cellIndex}`}>
                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td className="px-3 py-12" colSpan={visibleColumnCount}>
                    {typeof error === "string" ? (
                      <ErrorState description={error} title="Unable to load table" />
                    ) : (
                      error
                    )}
                  </td>
                </tr>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    className="border-t border-border/70 transition-colors hover:bg-muted/30 data-[selected=true]:bg-primary/5"
                    data-selected={row.getIsSelected()}
                    key={row.id}
                  >
                    {enableRowSelection ? (
                      <td className={rowPadding}>
                        <input
                          aria-label="Select row"
                          checked={row.getIsSelected()}
                          className="h-4 w-4 rounded border-input accent-primary"
                          onChange={row.getToggleSelectedHandler()}
                          type="checkbox"
                        />
                      </td>
                    ) : null}
                    {row.getVisibleCells().map((cell) => (
                      <td className={cn("align-middle", rowPadding)} key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-3 py-12 text-center text-muted-foreground"
                    colSpan={visibleColumnCount}
                  >
                    {emptyState ?? (
                      <EmptyState
                        description="Try adjusting your search or filters."
                        title="No results found"
                      />
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </p>
        <div className="flex items-center gap-2">
          <Button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            size="sm"
            type="button"
            variant="outline"
          >
            <ChevronLeft />
            Previous
          </Button>
          <Button
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            size="sm"
            type="button"
            variant="outline"
          >
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </section>
  );
}

export function DataTableStatus({
  status,
}: {
  status: React.ComponentProps<typeof StatusPill>["status"];
}) {
  return <StatusPill status={status} />;
}

export function DataTableActionMenuPlaceholder({
  label = "Row actions",
}: {
  label?: string;
}) {
  return (
    <Button aria-label={label} size="icon-sm" type="button" variant="ghost">
      <MoreHorizontal />
    </Button>
  );
}
