import { apiClient, unwrapApiData } from "@/services/api-client";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";

export const publicService = {
  async getTemples(params?: BaseQueryParams) {
    const response = await apiClient.get("/public/temples", { params });
    return unwrapApiData<PaginatedResult<Record<string, unknown>>>(response.data);
  },

  async getTempleBySlug(slug: string) {
    const response = await apiClient.get(`/public/temples/${slug}`);
    return unwrapApiData<Record<string, unknown>>(response.data);
  },

  async getFestivals(params?: BaseQueryParams) {
    const response = await apiClient.get("/public/festivals", { params });
    return unwrapApiData<PaginatedResult<Record<string, unknown>>>(response.data);
  },

  async getDeities(params?: BaseQueryParams) {
    const response = await apiClient.get("/public/deities", { params });
    return unwrapApiData<PaginatedResult<Record<string, unknown>>>(response.data);
  },

  async getPanchang(params?: BaseQueryParams) {
    const response = await apiClient.get("/public/panchang", { params });
    return unwrapApiData<PaginatedResult<Record<string, unknown>>>(response.data);
  },

  async getContent(params?: BaseQueryParams) {
    const response = await apiClient.get("/public/content", { params });
    return unwrapApiData<PaginatedResult<Record<string, unknown>>>(response.data);
  },

  async getMedia(params?: BaseQueryParams) {
    const response = await apiClient.get("/public/media", { params });
    return unwrapApiData<PaginatedResult<Record<string, unknown>>>(response.data);
  },
};
