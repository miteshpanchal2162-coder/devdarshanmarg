import type { Metadata } from "next";
import { GeoEntityFormPageContent } from "@/components/admin/geo/geo-entity-management";
import { countryConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Edit Country",
  description: "Edit a country in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Edit Country | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function EditCountryPage() {
  return <GeoEntityFormPageContent config={countryConfig} mode="edit" />;
}
