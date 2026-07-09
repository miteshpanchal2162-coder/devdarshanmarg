import type { Metadata } from "next";
import { breadcrumbJsonLd, buildPublicMetadata } from "@/lib/seo/metadata";
import { serverPublicApi } from "@/lib/server-public-api";
import {
  DetailField,
  DetailSection,
  JsonLd,
  PublicDetailLayout,
  entitySubtitle,
  entityTitle,
  getString,
  notFound,
} from "@/components/public/common/public-detail-layout";
import { formatDateTime } from "@/utils/record-helpers";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const panchang = await serverPublicApi.panchang.bySlug(slug);
    return buildPublicMetadata({
      title: entityTitle(panchang),
      description: entitySubtitle(panchang),
      path: `/panchang/${slug}`,
    });
  } catch {
    return buildPublicMetadata({ title: "Panchang", path: `/panchang/${slug}`, noIndex: true });
  }
}

export default async function PanchangDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let panchang: Record<string, unknown>;
  try {
    panchang = await serverPublicApi.panchang.bySlug(slug);
  } catch {
    notFound();
  }

  const dates = await serverPublicApi.panchang
    .dates(slug, { page: 1, limit: 12, sortBy: "calendarDate", sortOrder: "desc" })
    .catch(() => ({ items: [] as Record<string, unknown>[] }));

  const today = new Intl.DateTimeFormat("en-CA").format(new Date());
  const todayDate = await serverPublicApi.panchang
    .dateByCalendarDate(slug, today)
    .catch(() => null);

  const title = entityTitle(panchang);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Panchang", path: "/panchang" },
          { name: title, path: `/panchang/${slug}` },
        ])}
      />
      <PublicDetailLayout
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Panchang", href: "/panchang" },
          { label: title },
        ]}
        subtitle={entitySubtitle(panchang)}
        title={title}
      >
        <DetailSection title="Calendar">
          <DetailField label="Calendar type" value={getString(panchang, "calendarType")} />
          <DetailField label="Timezone" value={getString(panchang, "timezone")} />
        </DetailSection>

        {todayDate ? (
          <DetailSection title={`Today (${today})`}>
            <DetailField label="Weekday" value={getString(todayDate, "weekday")} />
            <DetailField label="Paksha" value={getString(todayDate, "paksha")} />
            <DetailField label="Masa" value={getString(todayDate, "masa")} />
            <DetailField label="Ritu" value={getString(todayDate, "ritu")} />
            <DetailField label="Ayana" value={getString(todayDate, "ayana")} />
            <DetailField label="Sunrise" value={formatDateTime(todayDate.sunrise)} />
            <DetailField label="Sunset" value={formatDateTime(todayDate.sunset)} />
            <DetailField label="Moonrise" value={formatDateTime(todayDate.moonrise)} />
            <DetailField label="Moonset" value={formatDateTime(todayDate.moonset)} />
          </DetailSection>
        ) : null}

        {dates.items.length ? (
          <DetailSection title="Recent Dates">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-2">Date</th>
                    <th className="py-2">Weekday</th>
                    <th className="py-2">Paksha</th>
                    <th className="py-2">Masa</th>
                  </tr>
                </thead>
                <tbody>
                  {dates.items.map((item) => (
                    <tr className="border-b border-border/60" key={getString(item, "id")}>
                      <td className="py-2">{formatDateTime(item.calendarDate)}</td>
                      <td className="py-2">{getString(item, "weekday")}</td>
                      <td className="py-2">{getString(item, "paksha")}</td>
                      <td className="py-2">{getString(item, "masa")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DetailSection>
        ) : null}
      </PublicDetailLayout>
    </>
  );
}
