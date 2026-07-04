import type { Metadata } from "next";
import { TempleDetailsPageContent } from "@/components/temples/temple-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Temple Details",
  description: "View temple details and child module placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Temple Details | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function TempleDetailsPage() {
  return <TempleDetailsPageContent />;
}
