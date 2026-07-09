import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/services/api-client";
import { queryKeys } from "@/hooks/queries/query-keys";
import { routes } from "@/constants/routes";
import { useAuthStore } from "@/stores/auth-store";
import type { LoginPayload } from "@/services/auth.service";

export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      if (data.user.role !== "ADMIN") {
        clearSession();
        toast.error("Admin access is required for this console.");
        return;
      }

      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      const next = searchParams.get("next");
      router.push(next?.startsWith("/admin") ? next : routes.adminDashboard);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useLogoutMutation() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    },
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.push(routes.login);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export const useLogin = useLoginMutation;
export const useLogout = useLogoutMutation;
