import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env, tokenStorageKeys } from "@/constants/env";
import { routes } from "@/constants/routes";

type RefreshResponse = {
  success?: boolean;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
  accessToken?: string;
  refreshToken?: string;
};

let refreshPromise: Promise<string | null> | null = null;

function readTokensFromBody(body: RefreshResponse | undefined) {
  return {
    accessToken: body?.data?.accessToken ?? body?.accessToken ?? null,
    refreshToken: body?.data?.refreshToken ?? body?.refreshToken ?? null,
  };
}

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const refreshToken = localStorage.getItem(tokenStorageKeys.refreshToken);
  if (!refreshToken) return null;

  try {
    const response = await axios.post<RefreshResponse>(
      `${env.apiBaseUrl}/auth/refresh`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } },
    );
    const { accessToken, refreshToken: nextRefreshToken } = readTokensFromBody(response.data);

    if (!accessToken) return null;

    localStorage.setItem(tokenStorageKeys.accessToken, accessToken);
    if (nextRefreshToken) {
      localStorage.setItem(tokenStorageKeys.refreshToken, nextRefreshToken);
    }

    return accessToken;
  } catch {
    localStorage.removeItem(tokenStorageKeys.accessToken);
    localStorage.removeItem(tokenStorageKeys.refreshToken);
    window.location.href = routes.login;
    return null;
  }
}

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window === "undefined") return config;

  const token = localStorage.getItem(tokenStorageKeys.accessToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const accessToken = await refreshPromise;
    if (!accessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    return apiClient(originalRequest);
  },
);

export function unwrapApiData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}
