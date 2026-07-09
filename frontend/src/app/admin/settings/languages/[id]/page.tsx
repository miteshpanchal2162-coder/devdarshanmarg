import type { Metadata } from "next";
import { ReferenceDataDetailsPageContent } from "@/components/admin/settings/reference-data-management";
import { languagesConfig } from "@/components/admin/settings/reference-data-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Language Details",
  description: "View supported language details in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Language Details | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function LanguageDetailsPage() {
  return <ReferenceDataDetailsPageContent config={languagesConfig} />;
}
