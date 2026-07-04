import type { Metadata } from "next";
import { FestivalDetailsPageContent } from "@/components/festivals/festival-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Festival Details",
  description: "View festival details and child module placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Festival Details | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function FestivalDetailsPage() {
  return <FestivalDetailsPageContent />;
}
