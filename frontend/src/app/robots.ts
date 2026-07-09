import type { MetadataRoute } from "next";
import { env } from "@/constants/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/account/"],
    },
    sitemap: `${env.appUrl}/sitemap.xml`,
  };
}
