import { useQuery } from "@tanstack/react-query";
import { templesService } from "@/services/temples.service";
import { queryKeys } from "@/hooks/queries/query-keys";
import type { BaseQueryParams } from "@/types/api";

export function useTemplesQuery(params?: BaseQueryParams) {
  return useQuery({
    queryKey: queryKeys.temples.list(params),
    queryFn: () => templesService.list(params),
  });
}

export function useTempleQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.temples.detail(id),
    queryFn: () => templesService.getById(id),
    enabled: Boolean(id) && enabled,
  });
}
