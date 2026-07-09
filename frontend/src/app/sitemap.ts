import type { MetadataRoute } from "next";
import { env } from "@/constants/env";
import { serverPublicApi } from "@/lib/server-public-api";
import { getString } from "@/utils/record-helpers";

async function slugEntries(basePath: string, fetcher: () => Promise<{ items: Record<string, unknown>[] }>) {
  try {
    const data = await fetcher();
    return data.items.map((item) => ({
      url: `${env.appUrl}${basePath}/${getString(item, "slug")}`,
      lastModified: new Date(),
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/temples", "/festivals", "/deities", "/panchang", "/articles", "/search"].map((path) => ({
    url: `${env.appUrl}${path}`,
    lastModified: new Date(),
  }));

  const [temples, festivals, deities, panchang, articles] = await Promise.all([
    slugEntries("/temples", () => serverPublicApi.temples.list({ page: 1, limit: 100 })),
    slugEntries("/festivals", () => serverPublicApi.festivals.list({ page: 1, limit: 100 })),
    slugEntries("/deities", () => serverPublicApi.deities.list({ page: 1, limit: 100 })),
    slugEntries("/panchang", () => serverPublicApi.panchang.list({ page: 1, limit: 100 })),
    slugEntries("/articles", () => serverPublicApi.content.list({ page: 1, limit: 100 })),
  ]);

  return [...staticRoutes, ...temples, ...festivals, ...deities, ...panchang, ...articles];
}
