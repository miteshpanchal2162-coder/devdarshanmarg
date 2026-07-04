import type { Metadata } from "next";
import { PermissionsPageContent } from "@/components/rbac/rbac-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Permissions",
  description: "Manage RBAC permission matrix placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Permissions | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function PermissionsPage() {
  return <PermissionsPageContent />;
}
