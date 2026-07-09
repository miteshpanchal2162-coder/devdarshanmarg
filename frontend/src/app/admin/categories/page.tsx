import type { Metadata } from "next";
import { GeoEntityListPageContent } from "@/components/admin/geo/geo-entity-management";
import { contentCategoryConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Content Categories",
  description: "Manage content categories in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Content Categories | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function ContentCategoriesPage() {
  return <GeoEntityListPageContent config={contentCategoryConfig} />;
}
