import type { Metadata } from "next";
import { PanchangListPageContent } from "@/components/admin/panchang/panchang-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Panchang",
  description: "Manage Panchang records through the DevDarshanMarg enterprise admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Panchang | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function PanchangPage() {
  return <PanchangListPageContent />;
}
