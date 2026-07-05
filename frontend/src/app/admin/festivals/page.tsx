import type { Metadata } from "next";
import { FestivalListPageContent } from "@/components/admin/festivals/festival-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Festivals",
  description: "Manage festival records through the DevDarshanMarg enterprise admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Festivals | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function FestivalsPage() {
  return <FestivalListPageContent />;
}
