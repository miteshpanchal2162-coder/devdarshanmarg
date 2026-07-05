import { apiClient, unwrapApiData } from "@/services/api-client";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";

export type DeityRecord = Record<string, unknown>;

export const deitiesService = {
  async list(params?: BaseQueryParams) {
    const response = await apiClient.get("/deities", { params });
    return unwrapApiData<PaginatedResult<DeityRecord>>(response.data);
  },

  async getById(id: string) {
    const response = await apiClient.get(`/deities/${id}`);
    return unwrapApiData<DeityRecord>(response.data);
  },

  async create(payload: Record<string, unknown>) {
    const response = await apiClient.post("/deities", payload);
    return unwrapApiData<DeityRecord>(response.data);
  },

  async update(id: string, payload: Record<string, unknown>) {
    const response = await apiClient.put(`/deities/${id}`, payload);
    return unwrapApiData<DeityRecord>(response.data);
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/deities/${id}`);
    return unwrapApiData<unknown>(response.data);
  },
};
