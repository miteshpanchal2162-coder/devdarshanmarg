import type { Metadata } from "next";
import { TempleListPageContent } from "@/components/admin/temples/temple-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Temples",
  description: "Manage temple records through the DevDarshanMarg enterprise admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Temples | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function TemplesPage() {
  return <TempleListPageContent />;
}
