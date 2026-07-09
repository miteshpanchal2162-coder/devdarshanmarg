import type { Metadata } from "next";
import { articleJsonLd, breadcrumbJsonLd, buildPublicMetadata } from "@/lib/seo/metadata";
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
import { formatDateTime } from "@/utils/record-helpers";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await serverPublicApi.content.bySlug(slug);
    return buildPublicMetadata({
      title: getString(article, "metaTitle", entityTitle(article)),
      description: getString(article, "metaDescription", entitySubtitle(article)),
      path: `/articles/${slug}`,
      type: "article",
      image: resolvePublicMediaUrl(article.ogImage),
    });
  } catch {
    return buildPublicMetadata({ title: "Article", path: `/articles/${slug}`, noIndex: true });
  }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let article: Record<string, unknown>;
  try {
    article = await serverPublicApi.content.bySlug(slug);
  } catch {
    notFound();
  }

  const related = await serverPublicApi.content
    .list({ page: 1, limit: 4, sortBy: "publishedAt", sortOrder: "desc" })
    .catch(() => ({ items: [] as Record<string, unknown>[] }));

  const relatedItems = related.items.filter((item) => getString(item, "slug") !== slug).slice(0, 3);
  const title = entityTitle(article);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles" },
            { name: title, path: `/articles/${slug}` },
          ]),
          articleJsonLd({
            title,
            description: entitySubtitle(article),
            path: `/articles/${slug}`,
            publishedAt: getString(article, "publishedAt", ""),
            image: resolvePublicMediaUrl(article.ogImage),
          }),
        ]}
      />
      <PublicDetailLayout
        badges={featuredBadges(article)}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Articles", href: "/articles" },
          { label: title },
        ]}
        imageSource={article.ogImage}
        relatedBasePath="/articles"
        relatedItems={relatedItems}
        relatedTitle="Related Articles"
        subtitle={entitySubtitle(article)}
        title={title}
      >
        <DetailSection title="Published">
          <p>{formatDateTime(article.publishedAt)}</p>
        </DetailSection>
        <DetailSection title="Content">
          <div dangerouslySetInnerHTML={{ __html: getString(article, "body", getString(article, "content")) }} />
        </DetailSection>
      </PublicDetailLayout>
    </>
  );
}
