"use client";

import { featuredBadges } from "@/components/public/common/public-entity-card";
import { PublicListPage } from "@/components/public/common/public-list-page";
import { usePublicContent } from "@/hooks/queries/use-public";

export default function ArticlesPage() {
  return (
    <PublicListPage
      config={{
        title: "Articles",
        description: "Spiritual articles and guides published from the content database.",
        basePath: "/articles",
        useList: usePublicContent,
        badgeFn: featuredBadges,
      }}
    />
  );
}
