import type { Metadata } from "next";
import { GeoEntityFormPageContent } from "@/components/admin/geo/geo-entity-management";
import { contentCategoryConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Create Content Category",
  description: "Create a content category in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Create Content Category | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function CreateContentCategoryPage() {
  return <GeoEntityFormPageContent config={contentCategoryConfig} mode="create" />;
}
