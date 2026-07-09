import { apiClient, unwrapApiData } from "@/services/api-client";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";
import { serializeListParams } from "@/utils/query-params";

export type PublicRecord = Record<string, unknown>;

export const publicService = {
  async getTemples(params?: BaseQueryParams) {
    const response = await apiClient.get("/public/temples", { params: serializeListParams(params) });
    return unwrapApiData<PaginatedResult<PublicRecord>>(response.data);
  },

  async getTempleBySlug(slug: string) {
    const response = await apiClient.get(`/public/temples/${slug}`);
    return unwrapApiData<PublicRecord>(response.data);
  },

  async getFestivals(params?: BaseQueryParams) {
    const response = await apiClient.get("/public/festivals", { params: serializeListParams(params) });
    return unwrapApiData<PaginatedResult<PublicRecord>>(response.data);
  },

  async getFestivalBySlug(slug: string) {
    const response = await apiClient.get(`/public/festivals/${slug}`);
    return unwrapApiData<PublicRecord>(response.data);
  },

  async getDeities(params?: BaseQueryParams) {
    const response = await apiClient.get("/public/deities", { params: serializeListParams(params) });
    return unwrapApiData<PaginatedResult<PublicRecord>>(response.data);
  },

  async getDeityBySlug(slug: string) {
    const response = await apiClient.get(`/public/deities/${slug}`);
    return unwrapApiData<PublicRecord>(response.data);
  },

  async getPanchang(params?: BaseQueryParams) {
    const response = await apiClient.get("/public/panchang", { params: serializeListParams(params) });
    return unwrapApiData<PaginatedResult<PublicRecord>>(response.data);
  },

  async getPanchangBySlug(slug: string) {
    const response = await apiClient.get(`/public/panchang/${slug}`);
    return unwrapApiData<PublicRecord>(response.data);
  },

  async getPanchangDates(slug: string, params?: BaseQueryParams) {
    const response = await apiClient.get(`/public/panchang/${slug}/dates`, {
      params: serializeListParams(params),
    });
    return unwrapApiData<PaginatedResult<PublicRecord>>(response.data);
  },

  async getPanchangDate(slug: string, calendarDate: string) {
    const response = await apiClient.get(`/public/panchang/${slug}/dates/${calendarDate}`);
    return unwrapApiData<PublicRecord>(response.data);
  },

  async getContent(params?: BaseQueryParams) {
    const response = await apiClient.get("/public/content", { params: serializeListParams(params) });
    return unwrapApiData<PaginatedResult<PublicRecord>>(response.data);
  },

  async getContentBySlug(slug: string) {
    const response = await apiClient.get(`/public/content/${slug}`);
    return unwrapApiData<PublicRecord>(response.data);
  },

  async getMedia(params?: BaseQueryParams) {
    const response = await apiClient.get("/public/media", { params: serializeListParams(params) });
    return unwrapApiData<PaginatedResult<PublicRecord>>(response.data);
  },

  async getMediaById(id: string) {
    const response = await apiClient.get(`/public/media/${id}`);
    return unwrapApiData<PublicRecord>(response.data);
  },
};
