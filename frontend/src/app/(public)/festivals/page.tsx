"use client";

import { featuredBadges } from "@/components/public/common/public-entity-card";
import { PublicListPage } from "@/components/public/common/public-list-page";
import { usePublicFestivals } from "@/hooks/queries/use-public";

export default function FestivalsPage() {
  return (
    <PublicListPage
      config={{
        title: "Festivals",
        description: "Discover festivals, rituals, and celebrations from PostgreSQL.",
        basePath: "/festivals",
        useList: usePublicFestivals,
        badgeFn: featuredBadges,
      }}
    />
  );
}
