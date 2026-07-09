import type { Metadata } from "next";
import { ReferenceDataDetailsPageContent } from "@/components/admin/settings/reference-data-management";
import { mediaTypesConfig } from "@/components/admin/settings/reference-data-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Media Type Details",
  description: "View media type details in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Media Type Details | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function MediaTypeDetailsPage() {
  return <ReferenceDataDetailsPageContent config={mediaTypesConfig} />;
}
