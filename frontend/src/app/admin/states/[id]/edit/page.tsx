import type { Metadata } from "next";
import { GeoEntityFormPageContent } from "@/components/admin/geo/geo-entity-management";
import { stateConfig } from "@/components/admin/geo/geo-entity-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Edit State",
  description: "Edit a state in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Edit State | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function EditStatePage() {
  return <GeoEntityFormPageContent config={stateConfig} mode="edit" />;
}
