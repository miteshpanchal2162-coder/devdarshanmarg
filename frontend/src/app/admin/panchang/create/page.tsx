import type { Metadata } from "next";
import { PanchangFormPageContent } from "@/components/admin/panchang/panchang-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Create Panchang",
  description: "Create a Panchang record through a UI-only enterprise Panchang form.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Create Panchang | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function CreatePanchangPage() {
  return <PanchangFormPageContent mode="create" />;
}
