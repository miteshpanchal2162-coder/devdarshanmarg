import { apiClient, unwrapApiData } from "@/services/api-client";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";

export type MediaRecord = Record<string, unknown>;

export const mediaService = {
  async list(params?: BaseQueryParams) {
    const response = await apiClient.get("/media-library", { params });
    return unwrapApiData<PaginatedResult<MediaRecord>>(response.data);
  },

  async getById(id: string) {
    const response = await apiClient.get(`/media-library/${id}`);
    return unwrapApiData<MediaRecord>(response.data);
  },

  async upload(formData: FormData) {
    const response = await apiClient.post("/media-library/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapApiData<MediaRecord>(response.data);
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/media-library/${id}`);
    return unwrapApiData<unknown>(response.data);
  },
};
