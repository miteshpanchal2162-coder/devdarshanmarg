import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PublicMediaImage } from "@/components/public/common/public-media-image";
import { getBoolean, getString } from "@/utils/record-helpers";

export function PublicEntityCard({
  href,
  imageSource,
  subtitle,
  title,
  badges,
}: {
  href: string;
  imageSource?: unknown;
  subtitle?: string;
  title: string;
  badges?: string[];
}) {
  return (
    <Card hover variant="elevated">
      <Link href={href}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
          <PublicMediaImage alt={title} fill source={imageSource} />
        </div>
        <CardContent className="space-y-2">
          <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
          {subtitle ? <p className="line-clamp-2 text-sm text-muted-foreground">{subtitle}</p> : null}
          {badges?.length ? (
            <div className="flex flex-wrap gap-1">
              {badges.map((badge) => (
                <Badge key={badge} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Link>
    </Card>
  );
}

export function entityTitle(record: Record<string, unknown>, fallbackKeys = ["displayName", "name", "title"]) {
  for (const key of fallbackKeys) {
    const value = getString(record, key, "");
    if (value !== "—") return value;
  }
  return getString(record, "slug");
}

export function entitySubtitle(record: Record<string, unknown>) {
  return getString(record, "shortDescription", getString(record, "description")).slice(0, 160);
}

export function featuredBadges(record: Record<string, unknown>) {
  const badges: string[] = [];
  if (getBoolean(record, "featured") || getBoolean(record, "isFeatured")) badges.push("Featured");
  if (getBoolean(record, "popular") || getBoolean(record, "isPopular")) badges.push("Popular");
  if (getBoolean(record, "verified")) badges.push("Verified");
  return badges;
}
