import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/public/common/breadcrumbs";
import { JsonLd } from "@/components/public/common/json-ld";
import { PublicEntityCard, entitySubtitle, entityTitle, featuredBadges } from "@/components/public/common/public-entity-card";
import { PublicMediaImage } from "@/components/public/common/public-media-image";
import { getString } from "@/utils/record-helpers";
import { resolvePublicMediaUrl } from "@/utils/media-url";

export function PublicDetailLayout({
  breadcrumbs,
  title,
  subtitle,
  imageSource,
  badges,
  children,
  relatedTitle,
  relatedItems,
  relatedBasePath,
  relatedImageKey = "ogImage",
}: {
  breadcrumbs: Array<{ label: string; href?: string }>;
  title: string;
  subtitle?: string;
  imageSource?: unknown;
  badges?: string[];
  children: React.ReactNode;
  relatedTitle?: string;
  relatedItems?: Record<string, unknown>[];
  relatedBasePath?: string;
  relatedImageKey?: string;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumbs items={breadcrumbs} />
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            {subtitle ? <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p> : null}
            {badges?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <Badge key={badge} variant="secondary">
                    {badge}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
          {children}
        </div>
        <div className="relative min-h-[18rem] overflow-hidden rounded-3xl border">
          <PublicMediaImage alt={title} fill source={imageSource} />
        </div>
      </div>

      {relatedItems?.length && relatedBasePath ? (
        <section className="mt-14 space-y-4">
          <h2 className="text-2xl font-semibold">{relatedTitle ?? "Related"}</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {relatedItems.map((record) => {
              const slug = getString(record, "slug");
              const image = record[relatedImageKey] ?? record.image;
              return (
                <PublicEntityCard
                  badges={featuredBadges(record)}
                  href={`${relatedBasePath}/${slug}`}
                  imageSource={resolvePublicMediaUrl(image) ?? image}
                  key={getString(record, "id", slug)}
                  subtitle={entitySubtitle(record)}
                  title={entityTitle(record)}
                />
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="prose prose-neutral mt-4 max-w-none dark:prose-invert">{children}</div>
    </section>
  );
}

export function DetailField({ label, value }: { label: string; value?: string }) {
  if (!value || value === "—") return null;
  return (
    <p>
      <span className="font-medium">{label}: </span>
      {value}
    </p>
  );
}

export { JsonLd, Link, notFound, getString, entityTitle, entitySubtitle, featuredBadges, resolvePublicMediaUrl };
