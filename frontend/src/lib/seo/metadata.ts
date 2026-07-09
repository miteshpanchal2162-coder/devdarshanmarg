import type { Metadata } from "next";
import { publicSiteConfig } from "@/constants/public-site";
import { env } from "@/constants/env";

type SeoInput = {
  title: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function buildPublicMetadata(input: SeoInput): Metadata {
  const title = input.title;
  const description = input.description ?? publicSiteConfig.description;
  const canonical = `${env.appUrl}${input.path}`;
  const image = input.image ?? `${env.appUrl}/og-default.png`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: publicSiteConfig.name,
      locale: publicSiteConfig.locale,
      type: input.type ?? "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${env.appUrl}${item.path}`,
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description?: string;
  path: string;
  publishedAt?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: `${env.appUrl}${input.path}`,
    datePublished: input.publishedAt,
    image: input.image,
    publisher: {
      "@type": "Organization",
      name: publicSiteConfig.name,
      url: env.appUrl,
    },
  };
}

export function placeJsonLd(input: {
  name: string;
  description?: string;
  path: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: input.name,
    description: input.description,
    url: `${env.appUrl}${input.path}`,
    geo:
      input.latitude && input.longitude
        ? { "@type": "GeoCoordinates", latitude: input.latitude, longitude: input.longitude }
        : undefined,
    address: input.address,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: publicSiteConfig.name,
    url: env.appUrl,
    description: publicSiteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${env.appUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
