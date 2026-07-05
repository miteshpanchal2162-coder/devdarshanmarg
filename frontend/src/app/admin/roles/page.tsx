import type { Metadata } from "next";
import { RoleListPageContent } from "@/components/admin/rbac/rbac-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Roles",
  description: "Manage RBAC roles through the DevDarshanMarg enterprise admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Roles | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function RolesPage() {
  return <RoleListPageContent />;
}
