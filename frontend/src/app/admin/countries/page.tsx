import type { Metadata } from "next";
import { GeoEntityListPageContent } from "@/components/admin/geo/geo-entity-management";
import { countryConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Countries",
  description: "Manage countries in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Countries | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function CountriesPage() {
  return <GeoEntityListPageContent config={countryConfig} />;
}
