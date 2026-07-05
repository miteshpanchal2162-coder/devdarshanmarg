import type { Metadata } from "next";
import { TempleFormPageContent } from "@/components/admin/temples/temple-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Edit Temple",
  description: "Edit a temple record through a UI-only enterprise temple form.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Edit Temple | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function EditTemplePage() {
  return <TempleFormPageContent mode="edit" />;
}
