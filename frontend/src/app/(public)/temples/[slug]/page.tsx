import type { Metadata } from "next";
import { breadcrumbJsonLd, buildPublicMetadata, placeJsonLd } from "@/lib/seo/metadata";
import { serverPublicApi } from "@/lib/server-public-api";
import {
  DetailField,
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
    const temple = await serverPublicApi.temples.bySlug(slug);
    return buildPublicMetadata({
      title: getString(temple, "seoTitle", entityTitle(temple)),
      description: getString(temple, "seoDescription", entitySubtitle(temple)),
      path: `/temples/${slug}`,
      image: resolvePublicMediaUrl(temple.ogImage),
    });
  } catch {
    return buildPublicMetadata({ title: "Temple", path: `/temples/${slug}`, noIndex: true });
  }
}

export default async function TempleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let temple: Record<string, unknown>;
  try {
    temple = await serverPublicApi.temples.bySlug(slug);
  } catch {
    notFound();
  }

  const cityId = getString(temple, "cityId", "");
  const related = cityId
    ? await serverPublicApi.temples
        .list({ page: 1, limit: 6, filters: { cityId } })
        .catch(() => ({ items: [] as Record<string, unknown>[] }))
    : { items: [] as Record<string, unknown>[] };

  const relatedItems = related.items.filter((item) => getString(item, "slug") !== slug).slice(0, 3);
  const title = entityTitle(temple);
  const lat = Number(temple.latitude);
  const lng = Number(temple.longitude);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Temples", path: "/temples" },
            { name: title, path: `/temples/${slug}` },
          ]),
          placeJsonLd({
            name: title,
            description: entitySubtitle(temple),
            path: `/temples/${slug}`,
            latitude: Number.isFinite(lat) ? lat : undefined,
            longitude: Number.isFinite(lng) ? lng : undefined,
            address: getString(temple, "addressLine1", ""),
          }),
        ]}
      />
      <PublicDetailLayout
        badges={featuredBadges(temple)}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Temples", href: "/temples" },
          { label: title },
        ]}
        imageSource={temple.ogImage}
        relatedBasePath="/temples"
        relatedItems={relatedItems}
        relatedTitle="Related Temples"
        subtitle={entitySubtitle(temple)}
        title={title}
      >
        <DetailSection title="About">
          <p>{getString(temple, "description")}</p>
        </DetailSection>
        <DetailSection title="Location & Contact">
          <DetailField label="Address" value={getString(temple, "addressLine1")} />
          <DetailField label="Landmark" value={getString(temple, "landmark")} />
          <DetailField label="Phone" value={getString(temple, "phone")} />
          <DetailField label="Email" value={getString(temple, "email")} />
        </DetailSection>
        <DetailSection title="Visitor Information">
          <DetailField label="Best time to visit" value={getString(temple, "bestTimeToVisit")} />
          <DetailField label="Dress code" value={getString(temple, "dressCode")} />
          <DetailField label="Famous for" value={getString(temple, "famousFor")} />
        </DetailSection>
      </PublicDetailLayout>
    </>
  );
}
