import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { queryKeys } from "@/hooks/queries/query-keys";

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => dashboardService.getStats(),
    staleTime: 60_000,
  });
}
