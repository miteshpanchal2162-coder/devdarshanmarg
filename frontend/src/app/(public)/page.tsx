import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/public/common/json-ld";
import { PublicEntityCard, entitySubtitle, entityTitle, featuredBadges } from "@/components/public/common/public-entity-card";
import { publicSiteConfig } from "@/constants/public-site";
import { buildPublicMetadata, websiteJsonLd } from "@/lib/seo/metadata";
import { serverPublicApi } from "@/lib/server-public-api";
import { getString } from "@/utils/record-helpers";
import { resolvePublicMediaUrl } from "@/utils/media-url";

export const metadata: Metadata = buildPublicMetadata({
  title: publicSiteConfig.name,
  description: publicSiteConfig.description,
  path: "/",
});

export const revalidate = 60;

async function getHomeData() {
  const params = { page: 1, limit: 6, sortBy: "createdAt", sortOrder: "desc" as const };
  const featuredParams = { page: 1, limit: 6, filters: { featured: true } };

  const [temples, featuredTemples, festivals, deities, panchang, content, media] = await Promise.all([
    serverPublicApi.temples.list(params).catch(() => ({ items: [], meta: { page: 1, limit: 6, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } })),
    serverPublicApi.temples.list(featuredParams).catch(() => ({ items: [], meta: { page: 1, limit: 6, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } })),
    serverPublicApi.festivals.list(params).catch(() => ({ items: [], meta: { page: 1, limit: 6, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } })),
    serverPublicApi.deities.list(params).catch(() => ({ items: [], meta: { page: 1, limit: 6, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } })),
    serverPublicApi.panchang.list(params).catch(() => ({ items: [], meta: { page: 1, limit: 6, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } })),
    serverPublicApi.content.list(params).catch(() => ({ items: [], meta: { page: 1, limit: 6, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } })),
    serverPublicApi.media.list(params).catch(() => ({ items: [], meta: { page: 1, limit: 6, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } })),
  ]);

  return { temples, featuredTemples, festivals, deities, panchang, content, media };
}

function Section({
  href,
  items,
  title,
  basePath,
  imageKey = "ogImage",
}: {
  href: string;
  title: string;
  basePath: string;
  imageKey?: string;
  items: Record<string, unknown>[];
}) {
  if (!items.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Button render={<Link href={href} />} size="sm" variant="outline">
          View all
        </Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((record) => {
          const slug = getString(record, "slug");
          const imageSource = record[imageKey] ?? record.image;
          return (
            <PublicEntityCard
              badges={featuredBadges(record)}
              href={`${basePath}/${slug}`}
              imageSource={resolvePublicMediaUrl(imageSource) ?? imageSource}
              key={getString(record, "id", slug)}
              subtitle={entitySubtitle(record)}
              title={entityTitle(record)}
            />
          );
        })}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <section className="rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Spiritual Platform</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{publicSiteConfig.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{publicSiteConfig.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button render={<Link href="/temples" />} size="lg">
              Explore Temples
            </Button>
            <Button render={<Link href="/search" />} size="lg" variant="outline">
              Search
            </Button>
          </div>
        </section>

        <div className="mt-14 space-y-14">
          <Section basePath="/temples" href="/temples" items={data.featuredTemples.items} title="Featured Temples" />
          <Section basePath="/temples" href="/temples" items={data.temples.items} title="Latest Temples" />
          <Section basePath="/festivals" href="/festivals" items={data.festivals.items} title="Festivals" />
          <Section basePath="/deities" href="/deities" imageKey="image" items={data.deities.items} title="Deities" />
          <Section basePath="/panchang" href="/panchang" items={data.panchang.items} title="Panchang" />
          <Section basePath="/articles" href="/articles" items={data.content.items} title="Articles" />
        </div>
      </div>
    </>
  );
}
