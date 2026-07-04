/** API client for DevDarshanMarg backend */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/** Get stored auth token (client-side only) */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ddm_token");
}

export function setToken(token: string) {
  localStorage.setItem("ddm_token", token);
}

export function clearToken() {
  localStorage.removeItem("ddm_token");
}

/** Generic fetch wrapper with JWT auth */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Request failed");
  }

  return json.data;
}

/** Build query string from params */
export function buildQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== "") search.set(key, String(val));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
