import type { Metadata } from "next";
import { GeoEntityFormPageContent } from "@/components/admin/geo/geo-entity-management";
import { contentCategoryConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Edit Content Category",
  description: "Edit a content category in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Edit Content Category | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function EditContentCategoryPage() {
  return <GeoEntityFormPageContent config={contentCategoryConfig} mode="edit" />;
}
