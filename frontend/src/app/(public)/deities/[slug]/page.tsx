import type { Metadata } from "next";
import { breadcrumbJsonLd, buildPublicMetadata } from "@/lib/seo/metadata";
import { serverPublicApi } from "@/lib/server-public-api";
import {
  DetailSection,
  JsonLd,
  PublicDetailLayout,
  entitySubtitle,
  entityTitle,
  featuredBadges,
  getString,
  notFound,
  resolvePublicMediaUrl,
} from "@/components/public/common/public-detail-layout";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const deity = await serverPublicApi.deities.bySlug(slug);
    return buildPublicMetadata({
      title: getString(deity, "seoTitle", entityTitle(deity)),
      description: getString(deity, "seoDescription", entitySubtitle(deity)),
      path: `/deities/${slug}`,
      image: resolvePublicMediaUrl(deity.image),
    });
  } catch {
    return buildPublicMetadata({ title: "Deity", path: `/deities/${slug}`, noIndex: true });
  }
}

export default async function DeityDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let deity: Record<string, unknown>;
  try {
    deity = await serverPublicApi.deities.bySlug(slug);
  } catch {
    notFound();
  }

  const related = await serverPublicApi.deities
    .list({ page: 1, limit: 6, sortBy: "createdAt", sortOrder: "desc" })
    .catch(() => ({ items: [] as Record<string, unknown>[] }));

  const relatedItems = related.items.filter((item) => getString(item, "slug") !== slug).slice(0, 3);
  const title = entityTitle(deity);

  const articles = await serverPublicApi.content
    .list({ page: 1, limit: 3, search: title })
    .catch(() => ({ items: [] as Record<string, unknown>[] }));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Deities", path: "/deities" },
          { name: title, path: `/deities/${slug}` },
        ])}
      />
      <PublicDetailLayout
        badges={featuredBadges(deity)}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Deities", href: "/deities" },
          { label: title },
        ]}
        imageSource={deity.image}
        relatedBasePath="/deities"
        relatedItems={relatedItems}
        relatedTitle="Related Deities"
        subtitle={entitySubtitle(deity)}
        title={title}
        relatedImageKey="image"
      >
        <DetailSection title="About">
          <p>{getString(deity, "description")}</p>
        </DetailSection>
        {articles.items.length ? (
          <DetailSection title="Related Articles">
            <ul className="list-disc space-y-2 pl-5">
              {articles.items.map((item) => (
                <li key={getString(item, "id")}>
                  <a className="text-primary hover:underline" href={`/articles/${getString(item, "slug")}`}>
                    {getString(item, "title")}
                  </a>
                </li>
              ))}
            </ul>
          </DetailSection>
        ) : null}
      </PublicDetailLayout>
    </>
  );
}
