import { apiClient, unwrapApiData } from "@/services/api-client";
import { createCrudService } from "@/services/create-crud-service";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";
import { serializeListParams } from "@/utils/query-params";

export type MediaRecord = Record<string, unknown>;

const mediaCrud = createCrudService("/media-library");

export const mediaService = {
  ...mediaCrud,

  async list(params?: BaseQueryParams) {
    const response = await apiClient.get("/media-library", { params: serializeListParams(params) });
    return unwrapApiData<PaginatedResult<MediaRecord>>(response.data);
  },

  async uploadImage(formData: FormData) {
    const response = await apiClient.post("/media-library/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapApiData<MediaRecord>(response.data);
  },

  async uploadDocument(formData: FormData) {
    const response = await apiClient.post("/media-library/upload/document", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapApiData<MediaRecord>(response.data);
  },

  async upload(formData: FormData) {
    const response = await apiClient.post("/media-library/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapApiData<MediaRecord>(response.data);
  },
};
