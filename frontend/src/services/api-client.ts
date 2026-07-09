import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env, tokenStorageKeys } from "@/constants/env";
import { routes } from "@/constants/routes";
import { clearAuthCookies, syncAuthCookies } from "@/lib/auth-cookies";

type RefreshResponse = {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
  accessToken?: string;
  refreshToken?: string;
};

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

let refreshPromise: Promise<string | null> | null = null;

function readTokensFromBody(body: RefreshResponse | undefined) {
  return {
    accessToken: body?.data?.accessToken ?? body?.accessToken ?? null,
    refreshToken: body?.data?.refreshToken ?? body?.refreshToken ?? null,
  };
}

function resolveApiErrorMessage(error: AxiosError<ApiErrorBody>) {
  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return error.message || "Request failed";
}

function redirectToLogin() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(tokenStorageKeys.accessToken);
  localStorage.removeItem(tokenStorageKeys.refreshToken);
  clearAuthCookies();

  if (!window.location.pathname.startsWith(routes.login)) {
    window.location.href = routes.login;
  }
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

    syncAuthCookies(accessToken, nextRefreshToken ?? refreshToken);
    return accessToken;
  } catch {
    redirectToLogin();
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
  async (error: AxiosError<ApiErrorBody>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/refresh")
      ) {
        return Promise.reject(new Error(resolveApiErrorMessage(error)));
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const accessToken = await refreshPromise;
      if (accessToken) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(new Error(resolveApiErrorMessage(error)));
  },
);

export function unwrapApiData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}

export function getApiErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}
