import { apiClient, unwrapApiData } from "@/services/api-client";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";

export type FestivalRecord = Record<string, unknown>;

export const festivalsService = {
  async list(params?: BaseQueryParams) {
    const response = await apiClient.get("/festivals", { params });
    return unwrapApiData<PaginatedResult<FestivalRecord>>(response.data);
  },

  async getById(id: string) {
    const response = await apiClient.get(`/festivals/${id}`);
    return unwrapApiData<FestivalRecord>(response.data);
  },

  async create(payload: Record<string, unknown>) {
    const response = await apiClient.post("/festivals", payload);
    return unwrapApiData<FestivalRecord>(response.data);
  },

  async update(id: string, payload: Record<string, unknown>) {
    const response = await apiClient.put(`/festivals/${id}`, payload);
    return unwrapApiData<FestivalRecord>(response.data);
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/festivals/${id}`);
    return unwrapApiData<unknown>(response.data);
  },
};
