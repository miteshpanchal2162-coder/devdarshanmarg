import { env } from "@/constants/env";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";
import { buildQueryString } from "@/utils/build-query-string";

export type PublicRecord = Record<string, unknown>;

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

async function serverGet<T>(path: string, params?: BaseQueryParams, revalidate = 60): Promise<T> {
  const url = `${env.apiBaseUrl}${path}${buildQueryString(params)}`;
  const response = await fetch(url, {
    next: { revalidate },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Public API ${response.status}: ${path}`);
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
}

export const serverPublicApi = {
  temples: {
    list: (params?: BaseQueryParams) =>
      serverGet<PaginatedResult<PublicRecord>>("/public/temples", params),
    bySlug: (slug: string) => serverGet<PublicRecord>(`/public/temples/${slug}`),
  },
  festivals: {
    list: (params?: BaseQueryParams) =>
      serverGet<PaginatedResult<PublicRecord>>("/public/festivals", params),
    bySlug: (slug: string) => serverGet<PublicRecord>(`/public/festivals/${slug}`),
  },
  deities: {
    list: (params?: BaseQueryParams) =>
      serverGet<PaginatedResult<PublicRecord>>("/public/deities", params),
    bySlug: (slug: string) => serverGet<PublicRecord>(`/public/deities/${slug}`),
  },
  panchang: {
    list: (params?: BaseQueryParams) =>
      serverGet<PaginatedResult<PublicRecord>>("/public/panchang", params),
    bySlug: (slug: string) => serverGet<PublicRecord>(`/public/panchang/${slug}`),
    dates: (slug: string, params?: BaseQueryParams) =>
      serverGet<PaginatedResult<PublicRecord>>(`/public/panchang/${slug}/dates`, params),
    dateByCalendarDate: (slug: string, calendarDate: string) =>
      serverGet<PublicRecord>(`/public/panchang/${slug}/dates/${calendarDate}`),
  },
  content: {
    list: (params?: BaseQueryParams) =>
      serverGet<PaginatedResult<PublicRecord>>("/public/content", params),
    bySlug: (slug: string) => serverGet<PublicRecord>(`/public/content/${slug}`),
  },
  media: {
    list: (params?: BaseQueryParams) =>
      serverGet<PaginatedResult<PublicRecord>>("/public/media", params),
    byId: (id: string) => serverGet<PublicRecord>(`/public/media/${id}`),
  },
  seo: {
    landingPage: (slug: string) => serverGet<PublicRecord>(`/public/seo/landing-pages/${slug}`),
  },
};
