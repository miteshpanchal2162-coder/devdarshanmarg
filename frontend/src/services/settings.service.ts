import { apiClient, unwrapApiData } from "@/services/api-client";

export const settingsService = {
  async getSupportedLanguages() {
    const response = await apiClient.get("/supported-languages");
    return unwrapApiData<unknown>(response.data);
  },

  async getSupportedMediaTypes() {
    const response = await apiClient.get("/supported-media-types");
    return unwrapApiData<unknown>(response.data);
  },

  async getSupportedContentStatuses() {
    const response = await apiClient.get("/supported-content-statuses");
    return unwrapApiData<unknown>(response.data);
  },

  async getSeoRedirects(params?: Record<string, unknown>) {
    const response = await apiClient.get("/seo-redirects", { params });
    return unwrapApiData<unknown>(response.data);
  },

  async getSeoLandingPages(params?: Record<string, unknown>) {
    const response = await apiClient.get("/seo-landing-pages", { params });
    return unwrapApiData<unknown>(response.data);
  },
};
