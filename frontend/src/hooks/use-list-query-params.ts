"use client";

import { useCallback, useMemo, useState } from "react";
import type { BaseQueryParams } from "@/types/api";
import { DEFAULT_LIST_PARAMS } from "@/utils/query-params";

type ListQueryState = {
  page: number;
  limit: number;
  search: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  filters: Record<string, string | number | boolean>;
};

const INITIAL_STATE: ListQueryState = {
  page: DEFAULT_LIST_PARAMS.page,
  limit: DEFAULT_LIST_PARAMS.limit,
  search: "",
  filters: {},
};

export function useListQueryParams(initial?: Partial<ListQueryState>) {
  const [state, setState] = useState<ListQueryState>({ ...INITIAL_STATE, ...initial });

  const params = useMemo<BaseQueryParams>(() => {
    const next: BaseQueryParams = {
      page: state.page,
      limit: state.limit,
    };

    if (state.search.trim()) next.search = state.search.trim();
    if (state.sortBy) next.sortBy = state.sortBy;
    if (state.sortOrder) next.sortOrder = state.sortOrder;
    if (state.status) next.status = state.status;

    const filters = { ...state.filters };
    if (Object.keys(filters).length) next.filters = filters;

    return next;
  }, [state]);

  const setSearch = useCallback((search: string) => {
    setState((current) => ({ ...current, search, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState((current) => ({ ...current, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setState((current) => ({ ...current, limit, page: 1 }));
  }, []);

  const setSort = useCallback((sortBy: string, sortOrder: "asc" | "desc" = "desc") => {
    setState((current) => ({ ...current, sortBy, sortOrder, page: 1 }));
  }, []);

  const setStatus = useCallback((status?: string) => {
    setState((current) => ({ ...current, status, page: 1 }));
  }, []);

  const setFilter = useCallback((key: string, value?: string | number | boolean) => {
    setState((current) => {
      const filters = { ...current.filters };
      if (value === undefined || value === "" || value === "all") {
        delete filters[key];
      } else {
        filters[key] = value;
      }
      return { ...current, filters, page: 1 };
    });
  }, []);

  const reset = useCallback(() => {
    setState({ ...INITIAL_STATE, ...initial });
  }, [initial]);

  return {
    params,
    state,
    setSearch,
    setPage,
    setLimit,
    setSort,
    setStatus,
    setFilter,
    reset,
  };
}
