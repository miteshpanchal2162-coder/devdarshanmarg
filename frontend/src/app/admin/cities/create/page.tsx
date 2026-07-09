import type { Metadata } from "next";
import { GeoEntityFormPageContent } from "@/components/admin/geo/geo-entity-management";
import { cityConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Create City",
  description: "Create a city in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Create City | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function CreateCityPage() {
  return <GeoEntityFormPageContent config={cityConfig} mode="create" />;
}
