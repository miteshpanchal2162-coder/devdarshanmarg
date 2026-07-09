import { apiClient, unwrapApiData } from "@/services/api-client";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";
import { serializeListParams } from "@/utils/query-params";

export type EntityRecord = Record<string, unknown>;

export type CrudService = {
  list: (params?: BaseQueryParams) => Promise<PaginatedResult<EntityRecord>>;
  getById: (id: string) => Promise<EntityRecord>;
  create: (payload: Record<string, unknown>) => Promise<EntityRecord>;
  update: (id: string, payload: Record<string, unknown>) => Promise<EntityRecord>;
  remove: (id: string) => Promise<unknown>;
  restore: (id: string) => Promise<EntityRecord>;
  updateStatus: (id: string, status: string) => Promise<EntityRecord>;
};

export function createCrudService(basePath: string): CrudService {
  return {
    async list(params?: BaseQueryParams) {
      const response = await apiClient.get(basePath, { params: serializeListParams(params) });
      return unwrapApiData<PaginatedResult<EntityRecord>>(response.data);
    },

    async getById(id: string) {
      const response = await apiClient.get(`${basePath}/${id}`);
      return unwrapApiData<EntityRecord>(response.data);
    },

    async create(payload: Record<string, unknown>) {
      const response = await apiClient.post(basePath, payload);
      return unwrapApiData<EntityRecord>(response.data);
    },

    async update(id: string, payload: Record<string, unknown>) {
      const response = await apiClient.patch(`${basePath}/${id}`, payload);
      return unwrapApiData<EntityRecord>(response.data);
    },

    async remove(id: string) {
      const response = await apiClient.delete(`${basePath}/${id}`);
      return unwrapApiData<unknown>(response.data);
    },

    async restore(id: string) {
      const response = await apiClient.patch(`${basePath}/${id}/restore`);
      return unwrapApiData<EntityRecord>(response.data);
    },

    async updateStatus(id: string, status: string) {
      const response = await apiClient.patch(`${basePath}/${id}/status`, { status });
      return unwrapApiData<EntityRecord>(response.data);
    },
  };
}

export function createNestedCrudService(basePath: string): CrudService {
  return createCrudService(basePath);
}
