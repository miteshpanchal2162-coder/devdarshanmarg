import type { Metadata } from "next";
import { GeoEntityFormPageContent } from "@/components/admin/geo/geo-entity-management";
import { countryConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Create Country",
  description: "Create a country in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Create Country | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function CreateCountryPage() {
  return <GeoEntityFormPageContent config={countryConfig} mode="create" />;
}
