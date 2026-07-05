import type { Metadata } from "next";
import { RoleFormPageContent } from "@/components/admin/rbac/rbac-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Create Role",
  description: "Create an RBAC role through a UI-only enterprise role form.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Create Role | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function CreateRolePage() {
  return <RoleFormPageContent mode="create" />;
}
