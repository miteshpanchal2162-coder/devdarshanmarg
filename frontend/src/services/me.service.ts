import { apiClient, unwrapApiData } from "@/services/api-client";
import type { BaseQueryParams, PaginatedResult } from "@/types/api";
import { serializeListParams } from "@/utils/query-params";

export type MeRecord = Record<string, unknown>;

export const meService = {
  async getProfile() {
    const response = await apiClient.get("/me");
    return unwrapApiData<MeRecord>(response.data);
  },

  async updateProfile(payload: Record<string, unknown>) {
    const response = await apiClient.patch("/me", payload);
    return unwrapApiData<MeRecord>(response.data);
  },

  async getAuthProfile() {
    const response = await apiClient.get("/auth/profile");
    return unwrapApiData<MeRecord>(response.data);
  },

  favorites: {
    list: async (params?: BaseQueryParams) => {
      const response = await apiClient.get("/me/favorites", { params: serializeListParams(params) });
      return unwrapApiData<PaginatedResult<MeRecord>>(response.data);
    },
    create: async (payload: { entityType: string; entityId: string }) => {
      const response = await apiClient.post("/me/favorites", payload);
      return unwrapApiData<MeRecord>(response.data);
    },
    remove: async (id: string) => {
      const response = await apiClient.delete(`/me/favorites/${id}`);
      return unwrapApiData<unknown>(response.data);
    },
  },

  ratings: {
    list: async (params?: BaseQueryParams) => {
      const response = await apiClient.get("/me/ratings", { params: serializeListParams(params) });
      return unwrapApiData<PaginatedResult<MeRecord>>(response.data);
    },
    create: async (payload: { entityType: string; entityId: string; rating: number }) => {
      const response = await apiClient.post("/me/ratings", payload);
      return unwrapApiData<MeRecord>(response.data);
    },
    update: async (id: string, payload: Record<string, unknown>) => {
      const response = await apiClient.patch(`/me/ratings/${id}`, payload);
      return unwrapApiData<MeRecord>(response.data);
    },
    remove: async (id: string) => {
      const response = await apiClient.delete(`/me/ratings/${id}`);
      return unwrapApiData<unknown>(response.data);
    },
  },

  reviews: {
    list: async (params?: BaseQueryParams) => {
      const response = await apiClient.get("/me/reviews", { params: serializeListParams(params) });
      return unwrapApiData<PaginatedResult<MeRecord>>(response.data);
    },
    create: async (payload: Record<string, unknown>) => {
      const response = await apiClient.post("/me/reviews", payload);
      return unwrapApiData<MeRecord>(response.data);
    },
    update: async (id: string, payload: Record<string, unknown>) => {
      const response = await apiClient.patch(`/me/reviews/${id}`, payload);
      return unwrapApiData<MeRecord>(response.data);
    },
    remove: async (id: string) => {
      const response = await apiClient.delete(`/me/reviews/${id}`);
      return unwrapApiData<unknown>(response.data);
    },
  },

  comments: {
    list: async (params?: BaseQueryParams) => {
      const response = await apiClient.get("/me/comments", { params: serializeListParams(params) });
      return unwrapApiData<PaginatedResult<MeRecord>>(response.data);
    },
    create: async (payload: Record<string, unknown>) => {
      const response = await apiClient.post("/me/comments", payload);
      return unwrapApiData<MeRecord>(response.data);
    },
    update: async (id: string, payload: Record<string, unknown>) => {
      const response = await apiClient.patch(`/me/comments/${id}`, payload);
      return unwrapApiData<MeRecord>(response.data);
    },
    remove: async (id: string) => {
      const response = await apiClient.delete(`/me/comments/${id}`);
      return unwrapApiData<unknown>(response.data);
    },
  },

  sessions: {
    list: async (params?: BaseQueryParams) => {
      const response = await apiClient.get("/me/sessions", { params: serializeListParams(params) });
      return unwrapApiData<PaginatedResult<MeRecord>>(response.data);
    },
    remove: async (id: string) => {
      const response = await apiClient.delete(`/me/sessions/${id}`);
      return unwrapApiData<unknown>(response.data);
    },
    logoutAll: async () => {
      const response = await apiClient.post("/me/logout-all");
      return unwrapApiData<{ count: number; tokenCount: number }>(response.data);
    },
  },

  notificationPreferences: {
    get: async () => {
      const response = await apiClient.get("/me/notification-preferences");
      return unwrapApiData<MeRecord>(response.data);
    },
    update: async (payload: Record<string, unknown>) => {
      const response = await apiClient.patch("/me/notification-preferences", payload);
      return unwrapApiData<MeRecord>(response.data);
    },
  },
};
