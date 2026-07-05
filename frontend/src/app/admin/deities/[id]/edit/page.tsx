import type { Metadata } from "next";
import { DeityFormPageContent } from "@/components/admin/deities/deity-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Edit Deity",
  description: "Edit a deity record through a UI-only enterprise deity form.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Edit Deity | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function EditDeityPage() {
  return <DeityFormPageContent mode="edit" />;
}
