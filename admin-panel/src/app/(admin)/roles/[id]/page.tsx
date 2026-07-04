import type { Metadata } from "next";
import { RoleDetailsPageContent } from "@/components/rbac/rbac-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Role Details",
  description: "View RBAC role details and assigned permission placeholders.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Role Details | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function RoleDetailsPage() {
  return <RoleDetailsPageContent />;
}
