"use client";

import { PublicListPage } from "@/components/public/common/public-list-page";
import { usePublicPanchang } from "@/hooks/queries/use-public";

export default function PanchangPage() {
  return (
    <PublicListPage
      config={{
        title: "Panchang",
        description: "Daily and monthly panchang records from the database.",
        basePath: "/panchang",
        useList: usePublicPanchang,
      }}
    />
  );
}
