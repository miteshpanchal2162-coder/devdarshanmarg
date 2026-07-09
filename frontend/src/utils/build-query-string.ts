import type { BaseQueryParams } from "@/types/api";

export function buildQueryString(params?: BaseQueryParams) {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  if (params.status) searchParams.set("status", params.status);

  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.set(`filters[${key}]`, String(value));
      }
    });
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
