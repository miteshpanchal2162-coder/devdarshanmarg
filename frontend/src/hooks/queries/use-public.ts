"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appToast } from "@/components/ui/sonner";
import { getApiErrorMessage } from "@/services/api-client";
import { publicService } from "@/services/public.service";
import { queryKeys } from "@/hooks/queries/query-keys";
import type { BaseQueryParams } from "@/types/api";

export function usePublicTemples(params?: BaseQueryParams) {
  return useQuery({
    queryKey: queryKeys.public.temples(params),
    queryFn: () => publicService.getTemples(params),
  });
}

export function usePublicTemple(slug: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.public.temples(), "detail", slug],
    queryFn: () => publicService.getTempleBySlug(slug),
    enabled: Boolean(slug) && enabled,
  });
}

export function usePublicFestivals(params?: BaseQueryParams) {
  return useQuery({
    queryKey: queryKeys.public.festivals(params),
    queryFn: () => publicService.getFestivals(params),
  });
}

export function usePublicFestival(slug: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.public.festivals(), "detail", slug],
    queryFn: () => publicService.getFestivalBySlug(slug),
    enabled: Boolean(slug) && enabled,
  });
}

export function usePublicDeities(params?: BaseQueryParams) {
  return useQuery({
    queryKey: queryKeys.public.deities(params),
    queryFn: () => publicService.getDeities(params),
  });
}

export function usePublicDeity(slug: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.public.deities(), "detail", slug],
    queryFn: () => publicService.getDeityBySlug(slug),
    enabled: Boolean(slug) && enabled,
  });
}

export function usePublicPanchang(params?: BaseQueryParams) {
  return useQuery({
    queryKey: queryKeys.public.panchang(params),
    queryFn: () => publicService.getPanchang(params),
  });
}

export function usePublicPanchangDetail(slug: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.public.panchang(), "detail", slug],
    queryFn: () => publicService.getPanchangBySlug(slug),
    enabled: Boolean(slug) && enabled,
  });
}

export function usePublicPanchangDates(slug: string, params?: BaseQueryParams, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.public.panchang(), "dates", slug, params],
    queryFn: () => publicService.getPanchangDates(slug, params),
    enabled: Boolean(slug) && enabled,
  });
}

export function usePublicContent(params?: BaseQueryParams) {
  return useQuery({
    queryKey: queryKeys.public.content(params),
    queryFn: () => publicService.getContent(params),
  });
}

export function usePublicContentItem(slug: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.public.content(), "detail", slug],
    queryFn: () => publicService.getContentBySlug(slug),
    enabled: Boolean(slug) && enabled,
  });
}

export function usePublicMedia(params?: BaseQueryParams) {
  return useQuery({
    queryKey: queryKeys.public.media(params),
    queryFn: () => publicService.getMedia(params),
  });
}

export function useGlobalSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: ["public", "search", query],
    queryFn: async () => {
      const params = { page: 1, limit: 8, search: query };
      const [temples, festivals, deities, content] = await Promise.all([
        publicService.getTemples(params),
        publicService.getFestivals(params),
        publicService.getDeities(params),
        publicService.getContent(params),
      ]);
      return { temples, festivals, deities, content };
    },
    enabled: enabled && query.trim().length >= 2,
  });
}

export function usePublicSearchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (query: string) =>
      queryClient.fetchQuery({
        queryKey: ["public", "search", query],
        queryFn: async () => {
          const params = { page: 1, limit: 8, search: query };
          const [temples, festivals, deities, content] = await Promise.all([
            publicService.getTemples(params),
            publicService.getFestivals(params),
            publicService.getDeities(params),
            publicService.getContent(params),
          ]);
          return { temples, festivals, deities, content };
        },
      }),
    onError: (error) => appToast.error("Search failed", getApiErrorMessage(error)),
  });
}
