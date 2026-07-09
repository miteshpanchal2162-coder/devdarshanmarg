import type { Metadata } from "next";
import { GeoEntityDetailsPageContent } from "@/components/admin/geo/geo-entity-management";
import { countryConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Country Details",
  description: "View country details in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Country Details | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function CountryDetailsPage() {
  return <GeoEntityDetailsPageContent config={countryConfig} />;
}
