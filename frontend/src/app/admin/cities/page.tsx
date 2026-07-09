import type { Metadata } from "next";
import { GeoEntityListPageContent } from "@/components/admin/geo/geo-entity-management";
import { cityConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Cities",
  description: "Manage cities in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Cities | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function CitiesPage() {
  return <GeoEntityListPageContent config={cityConfig} />;
}
