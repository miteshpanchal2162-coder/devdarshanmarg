import type { Metadata } from "next";
import { GeoEntityListPageContent } from "@/components/admin/geo/geo-entity-management";
import { stateConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "States",
  description: "Manage states in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "States | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function StatesPage() {
  return <GeoEntityListPageContent config={stateConfig} />;
}
