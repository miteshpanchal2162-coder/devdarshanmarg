import type { BaseQueryParams } from "@/types/api";

export function serializeListParams(params?: BaseQueryParams) {
  if (!params) return undefined;

  const { filters, ...rest } = params;
  return {
    ...rest,
    ...(filters && Object.keys(filters).length ? { filters } : {}),
  };
}

export const DEFAULT_LIST_PARAMS: Required<Pick<BaseQueryParams, "page" | "limit">> = {
  page: 1,
  limit: 20,
};
