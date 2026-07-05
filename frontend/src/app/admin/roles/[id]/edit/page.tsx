import type { Metadata } from "next";
import { RoleFormPageContent } from "@/components/admin/rbac/rbac-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Edit Role",
  description: "Edit an RBAC role through a UI-only enterprise role form.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Edit Role | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function EditRolePage() {
  return <RoleFormPageContent mode="edit" />;
}
