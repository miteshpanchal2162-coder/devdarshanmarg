import { apiClient, unwrapApiData } from "@/services/api-client";
import { createCrudService } from "@/services/create-crud-service";

export const settingsService = {
  languages: createCrudService("/supported-languages"),
  mediaTypes: createCrudService("/supported-media-types"),
  contentStatuses: createCrudService("/supported-content-statuses"),
  seoRedirects: createCrudService("/seo-redirects"),
  seoLandingPages: createCrudService("/seo-landing-pages"),
};

export const notificationPreferencesService = {
  async getByUserId(userId: string) {
    const response = await apiClient.get(`/users/${userId}/notification-preferences`);
    return unwrapApiData<Record<string, unknown>>(response.data);
  },

  async create(userId: string, payload: Record<string, unknown>) {
    const response = await apiClient.post(`/users/${userId}/notification-preferences`, payload);
    return unwrapApiData<Record<string, unknown>>(response.data);
  },

  async update(userId: string, payload: Record<string, unknown>) {
    const response = await apiClient.patch(`/users/${userId}/notification-preferences`, payload);
    return unwrapApiData<Record<string, unknown>>(response.data);
  },

  async remove(userId: string) {
    const response = await apiClient.delete(`/users/${userId}/notification-preferences`);
    return unwrapApiData<unknown>(response.data);
  },
};
