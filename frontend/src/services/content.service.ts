import { apiClient, unwrapApiData } from "@/services/api-client";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";

export type ContentRecord = Record<string, unknown>;

export const contentService = {
  async list(params?: BaseQueryParams) {
    const response = await apiClient.get("/contents", { params });
    return unwrapApiData<PaginatedResult<ContentRecord>>(response.data);
  },

  async getById(id: string) {
    const response = await apiClient.get(`/contents/${id}`);
    return unwrapApiData<ContentRecord>(response.data);
  },

  async create(payload: Record<string, unknown>) {
    const response = await apiClient.post("/contents", payload);
    return unwrapApiData<ContentRecord>(response.data);
  },

  async update(id: string, payload: Record<string, unknown>) {
    const response = await apiClient.put(`/contents/${id}`, payload);
    return unwrapApiData<ContentRecord>(response.data);
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/contents/${id}`);
    return unwrapApiData<unknown>(response.data);
  },
};
