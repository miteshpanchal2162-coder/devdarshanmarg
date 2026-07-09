"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appToast } from "@/components/ui/sonner";
import type { CrudService } from "@/services/create-crud-service";
import type { BaseQueryParams } from "@/types/api";
import { getApiErrorMessage } from "@/services/api-client";

export type EntityQueryKeys = {
  all: readonly unknown[];
  list: (params?: unknown) => readonly unknown[];
  detail: (id: string) => readonly unknown[];
};

export function createCrudHooks(entityLabel: string, keys: EntityQueryKeys, service: CrudService) {
  function useList(params?: BaseQueryParams) {
    return useQuery({
      queryKey: keys.list(params),
      queryFn: () => service.list(params),
    });
  }

  function useDetail(id: string, enabled = true) {
    return useQuery({
      queryKey: keys.detail(id),
      queryFn: () => service.getById(id),
      enabled: Boolean(id) && enabled,
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: Record<string, unknown>) => service.create(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.all });
        appToast.success(`${entityLabel} created`);
      },
      onError: (error) => appToast.error(`Failed to create ${entityLabel}`, getApiErrorMessage(error)),
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
        service.update(id, payload),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: keys.all });
        queryClient.invalidateQueries({ queryKey: keys.detail(variables.id) });
        appToast.success(`${entityLabel} updated`);
      },
      onError: (error) => appToast.error(`Failed to update ${entityLabel}`, getApiErrorMessage(error)),
    });
  }

  function useDelete() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => service.remove(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.all });
        appToast.success(`${entityLabel} deleted`);
      },
      onError: (error) => appToast.error(`Failed to delete ${entityLabel}`, getApiErrorMessage(error)),
    });
  }

  function useRestore() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => service.restore(id),
      onSuccess: (_data, id) => {
        queryClient.invalidateQueries({ queryKey: keys.all });
        queryClient.invalidateQueries({ queryKey: keys.detail(id) });
        appToast.success(`${entityLabel} restored`);
      },
      onError: (error) => appToast.error(`Failed to restore ${entityLabel}`, getApiErrorMessage(error)),
    });
  }

  function useUpdateStatus() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, status }: { id: string; status: string }) => service.updateStatus(id, status),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: keys.all });
        queryClient.invalidateQueries({ queryKey: keys.detail(variables.id) });
        appToast.success(`${entityLabel} status updated`);
      },
      onError: (error) =>
        appToast.error(`Failed to update ${entityLabel} status`, getApiErrorMessage(error)),
    });
  }

  return {
    useList,
    useDetail,
    useCreate,
    useUpdate,
    useDelete,
    useRestore,
    useUpdateStatus,
  };
}
