import { env } from "@/constants/env";

export function resolvePublicMediaUrl(source?: unknown) {
  if (!source) return undefined;

  if (typeof source === "string") {
    if (source.startsWith("http://") || source.startsWith("https://")) return source;
    if (source.startsWith("/public/media/")) return `${env.apiBaseUrl}${source}`;
    if (/^[0-9a-f-]{36}$/i.test(source)) return `${env.apiBaseUrl}/public/media/${source}/file`;
    return source.startsWith("/") ? `${env.apiBaseUrl}${source}` : source;
  }

  if (typeof source === "object" && source !== null) {
    const record = source as Record<string, unknown>;
    if (typeof record.url === "string") return resolvePublicMediaUrl(record.url);
    if (typeof record.id === "string") return `${env.apiBaseUrl}/public/media/${record.id}/file`;
  }

  return undefined;
}
