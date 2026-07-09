import type { Metadata } from "next";
import { GeoEntityDetailsPageContent } from "@/components/admin/geo/geo-entity-management";
import { cityConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "City Details",
  description: "View city details in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "City Details | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function CityDetailsPage() {
  return <GeoEntityDetailsPageContent config={cityConfig} />;
}
