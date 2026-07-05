import type { Metadata } from "next";
import { PanchangDetailsPageContent } from "@/components/admin/panchang/panchang-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Panchang Details",
  description: "View Panchang details and child module placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Panchang Details | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function PanchangDetailsPage() {
  return <PanchangDetailsPageContent />;
}
