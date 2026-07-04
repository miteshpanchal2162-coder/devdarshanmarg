import type { Metadata } from "next";
import { DeityDetailsPageContent } from "@/components/deities/deity-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Deity Details",
  description: "View deity details and child module placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Deity Details | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function DeityDetailsPage() {
  return <DeityDetailsPageContent />;
}
