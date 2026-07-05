import type { Metadata } from "next";
import { PanchangFormPageContent } from "@/components/admin/panchang/panchang-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Edit Panchang",
  description: "Edit a Panchang record through a UI-only enterprise Panchang form.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Edit Panchang | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function EditPanchangPage() {
  return <PanchangFormPageContent mode="edit" />;
}
