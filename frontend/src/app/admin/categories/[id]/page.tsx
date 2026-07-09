import type { Metadata } from "next";
import { GeoEntityDetailsPageContent } from "@/components/admin/geo/geo-entity-management";
import { contentCategoryConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Content Category Details",
  description: "View content category details in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Content Category Details | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function ContentCategoryDetailsPage() {
  return <GeoEntityDetailsPageContent config={contentCategoryConfig} />;
}
