"use client";

import { useMemo } from "react";
import { AsyncQueryBoundary } from "@/components/common/async-query-boundary";
import { EmptyState, SearchBox } from "@/components/ui/enterprise";
import { Select } from "@/components/ui/select";
import { PublicEntityCard, entitySubtitle, entityTitle } from "@/components/public/common/public-entity-card";
import { PublicPagination } from "@/components/public/common/public-pagination";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";
import { getString } from "@/utils/record-helpers";
import { resolvePublicMediaUrl } from "@/utils/media-url";

type PublicListConfig = {
  title: string;
  description: string;
  basePath: string;
  imageKey?: string;
  badgeFn?: (record: Record<string, unknown>) => string[];
  filters?: Array<{
    key: string;
    label: string;
    options: Array<{ label: string; value: string }>;
    type?: "status" | "filter";
  }>;
  useList: (params?: BaseQueryParams) => {
    data?: PaginatedResult<Record<string, unknown>>;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
    isFetching: boolean;
  };
};

export function PublicListPage({ config }: { config: PublicListConfig }) {
  const listParams = useListQueryParams({ limit: 12 });
  const { data, isLoading, isError, error, refetch, isFetching } = config.useList(listParams.params);

  const cards = useMemo(() => data?.items ?? [], [data]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{config.title}</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">{config.description}</p>
      </header>

      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_auto]">
        <SearchBox
          aria-label={`Search ${config.title.toLowerCase()}`}
          onChange={(event) => listParams.setSearch(event.target.value)}
          placeholder={`Search ${config.title.toLowerCase()}...`}
          value={listParams.state.search}
        />
        <div className="flex flex-wrap gap-2">
          {config.filters?.map((filter) => (
            <Select
              key={filter.key}
              onValueChange={(value) =>
                filter.type === "status"
                  ? listParams.setStatus(value === "all" ? undefined : value)
                  : listParams.setFilter(filter.key, value === "all" ? undefined : value)
              }
              options={filter.options}
              placeholder={filter.label}
              value={
                filter.type === "status"
                  ? (listParams.state.status ?? "all")
                  : String(listParams.state.filters[filter.key] ?? "all")
              }
            />
          ))}
        </div>
      </div>

      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel={`Loading ${config.title.toLowerCase()}...`}
        onRetry={() => refetch()}
      >
        {cards.length === 0 ? (
          <EmptyState description="Try adjusting your search or filters." title={`No ${config.title.toLowerCase()} found`} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((record) => {
              const slug = getString(record, "slug");
              const title = entityTitle(record);
              const imageKey = config.imageKey ?? "ogImage";
              const imageSource = record[imageKey] ?? record.image ?? record.coverImage;
              return (
                <PublicEntityCard
                  badges={config.badgeFn?.(record)}
                  href={`${config.basePath}/${slug}`}
                  imageSource={resolvePublicMediaUrl(imageSource) ?? imageSource}
                  key={getString(record, "id", slug)}
                  subtitle={entitySubtitle(record)}
                  title={title}
                />
              );
            })}
          </div>
        )}
        <PublicPagination disabled={isFetching} meta={data?.meta} onPageChange={listParams.setPage} />
      </AsyncQueryBoundary>
    </div>
  );
}

