import { tokenStorageKeys } from "@/constants/env";

const cookieMaxAgeSeconds = 60 * 60 * 24 * 7;

function buildCookie(name: string, value: string) {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${cookieMaxAgeSeconds}; SameSite=Lax${secure}`;
}

function buildClearCookie(name: string) {
  return `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function syncAuthCookies(accessToken: string, refreshToken: string) {
  if (typeof document === "undefined") return;

  document.cookie = buildCookie(tokenStorageKeys.accessToken, accessToken);
  document.cookie = buildCookie(tokenStorageKeys.refreshToken, refreshToken);
}

export function clearAuthCookies() {
  if (typeof document === "undefined") return;

  document.cookie = buildClearCookie(tokenStorageKeys.accessToken);
  document.cookie = buildClearCookie(tokenStorageKeys.refreshToken);
}

export function readAccessTokenCookie(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${tokenStorageKeys.accessToken}=`));

  if (!match) return null;

  return decodeURIComponent(match.slice(tokenStorageKeys.accessToken.length + 1));
}
