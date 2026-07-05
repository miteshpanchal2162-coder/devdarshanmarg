import { apiClient, unwrapApiData } from "@/services/api-client";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";

export type TempleRecord = Record<string, unknown>;

export const templesService = {
  async list(params?: BaseQueryParams) {
    const response = await apiClient.get("/temples", { params });
    return unwrapApiData<PaginatedResult<TempleRecord>>(response.data);
  },

  async getById(id: string) {
    const response = await apiClient.get(`/temples/${id}`);
    return unwrapApiData<TempleRecord>(response.data);
  },

  async create(payload: Record<string, unknown>) {
    const response = await apiClient.post("/temples", payload);
    return unwrapApiData<TempleRecord>(response.data);
  },

  async update(id: string, payload: Record<string, unknown>) {
    const response = await apiClient.put(`/temples/${id}`, payload);
    return unwrapApiData<TempleRecord>(response.data);
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/temples/${id}`);
    return unwrapApiData<unknown>(response.data);
  },
};
