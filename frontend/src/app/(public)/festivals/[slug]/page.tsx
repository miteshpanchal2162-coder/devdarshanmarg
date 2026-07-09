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

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const festival = await serverPublicApi.festivals.bySlug(slug);
    return buildPublicMetadata({
      title: getString(festival, "metaTitle", entityTitle(festival)),
      description: getString(festival, "metaDescription", entitySubtitle(festival)),
      path: `/festivals/${slug}`,
      image: resolvePublicMediaUrl(festival.ogImage),
    });
  } catch {
    return buildPublicMetadata({ title: "Festival", path: `/festivals/${slug}`, noIndex: true });
  }
}

export default async function FestivalDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let festival: Record<string, unknown>;
  try {
    festival = await serverPublicApi.festivals.bySlug(slug);
  } catch {
    notFound();
  }

  const festivalType = getString(festival, "festivalType", "");
  const related = festivalType
    ? await serverPublicApi.festivals
        .list({ page: 1, limit: 6, filters: { festivalType } })
        .catch(() => ({ items: [] as Record<string, unknown>[] }))
    : { items: [] as Record<string, unknown>[] };

  const relatedItems = related.items.filter((item) => getString(item, "slug") !== slug).slice(0, 3);
  const title = entityTitle(festival);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Festivals", path: "/festivals" },
            { name: title, path: `/festivals/${slug}` },
          ]),
          articleJsonLd({
            title,
            description: entitySubtitle(festival),
            path: `/festivals/${slug}`,
            image: resolvePublicMediaUrl(festival.ogImage),
          }),
        ]}
      />
      <PublicDetailLayout
        badges={featuredBadges(festival)}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Festivals", href: "/festivals" },
          { label: title },
        ]}
        imageSource={festival.ogImage}
        relatedBasePath="/festivals"
        relatedItems={relatedItems}
        relatedTitle="Related Festivals"
        subtitle={entitySubtitle(festival)}
        title={title}
      >
        <DetailSection title="Description">
          <p>{getString(festival, "description")}</p>
        </DetailSection>
        <DetailSection title="Details">
          <p>Festival type: {getString(festival, "festivalType")}</p>
          <p>Importance: {getString(festival, "importanceLevel")}</p>
        </DetailSection>
      </PublicDetailLayout>
    </>
  );
}
