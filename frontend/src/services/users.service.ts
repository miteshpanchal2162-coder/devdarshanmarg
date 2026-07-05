import { apiClient, unwrapApiData } from "@/services/api-client";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";

export type UserRecord = Record<string, unknown>;

export const usersService = {
  async list(params?: BaseQueryParams) {
    const response = await apiClient.get("/users", { params });
    return unwrapApiData<PaginatedResult<UserRecord>>(response.data);
  },

  async getById(id: string) {
    const response = await apiClient.get(`/users/${id}`);
    return unwrapApiData<UserRecord>(response.data);
  },

  async create(payload: Record<string, unknown>) {
    const response = await apiClient.post("/users", payload);
    return unwrapApiData<UserRecord>(response.data);
  },

  async update(id: string, payload: Record<string, unknown>) {
    const response = await apiClient.put(`/users/${id}`, payload);
    return unwrapApiData<UserRecord>(response.data);
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/users/${id}`);
    return unwrapApiData<unknown>(response.data);
  },
};
