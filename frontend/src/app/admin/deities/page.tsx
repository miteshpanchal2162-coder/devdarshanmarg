import type { Metadata } from "next";
import { DeityListPageContent } from "@/components/admin/deities/deity-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Deities",
  description: "Manage deity records through the DevDarshanMarg enterprise admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Deities | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function DeitiesPage() {
  return <DeityListPageContent />;
}
