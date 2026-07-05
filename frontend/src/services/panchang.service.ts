import { apiClient, unwrapApiData } from "@/services/api-client";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";

export type PanchangRecord = Record<string, unknown>;

export const panchangService = {
  async list(params?: BaseQueryParams) {
    const response = await apiClient.get("/panchangs", { params });
    return unwrapApiData<PaginatedResult<PanchangRecord>>(response.data);
  },

  async getById(id: string) {
    const response = await apiClient.get(`/panchangs/${id}`);
    return unwrapApiData<PanchangRecord>(response.data);
  },

  async create(payload: Record<string, unknown>) {
    const response = await apiClient.post("/panchangs", payload);
    return unwrapApiData<PanchangRecord>(response.data);
  },

  async update(id: string, payload: Record<string, unknown>) {
    const response = await apiClient.put(`/panchangs/${id}`, payload);
    return unwrapApiData<PanchangRecord>(response.data);
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/panchangs/${id}`);
    return unwrapApiData<unknown>(response.data);
  },
};
