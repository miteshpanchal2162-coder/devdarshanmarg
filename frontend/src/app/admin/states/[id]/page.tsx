import type { Metadata } from "next";
import { GeoEntityDetailsPageContent } from "@/components/admin/geo/geo-entity-management";
import { stateConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "State Details",
  description: "View state details in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "State Details | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function StateDetailsPage() {
  return <GeoEntityDetailsPageContent config={stateConfig} />;
}
