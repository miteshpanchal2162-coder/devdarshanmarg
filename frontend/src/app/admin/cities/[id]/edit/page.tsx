import type { Metadata } from "next";
import { GeoEntityFormPageContent } from "@/components/admin/geo/geo-entity-management";
import { cityConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Edit City",
  description: "Edit a city in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Edit City | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function EditCityPage() {
  return <GeoEntityFormPageContent config={cityConfig} mode="edit" />;
}
