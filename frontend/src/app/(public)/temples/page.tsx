"use client";

import { featuredBadges } from "@/components/public/common/public-entity-card";
import { PublicListPage } from "@/components/public/common/public-list-page";
import { usePublicTemples } from "@/hooks/queries/use-public";

export default function TemplesPage() {
  return (
    <PublicListPage
      config={{
        title: "Temples",
        description: "Explore temples across India from our live database.",
        basePath: "/temples",
        useList: usePublicTemples,
        badgeFn: featuredBadges,
        filters: [
          {
            key: "featured",
            label: "Featured",
            options: [
              { label: "All", value: "all" },
              { label: "Featured", value: "true" },
            ],
          },
        ],
      }}
    />
  );
}
