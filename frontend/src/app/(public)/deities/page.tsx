"use client";

import { featuredBadges } from "@/components/public/common/public-entity-card";
import { PublicListPage } from "@/components/public/common/public-list-page";
import { usePublicDeities } from "@/hooks/queries/use-public";

export default function DeitiesPage() {
  return (
    <PublicListPage
      config={{
        title: "Deities",
        description: "Browse deity profiles sourced from the database.",
        basePath: "/deities",
        imageKey: "image",
        useList: usePublicDeities,
        badgeFn: featuredBadges,
      }}
    />
  );
}
