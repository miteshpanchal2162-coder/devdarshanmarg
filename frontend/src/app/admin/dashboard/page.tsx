import type { Metadata } from "next";
import { DashboardContent } from "@/components/admin/dashboard/dashboard-content";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Enterprise dashboard overview for the DevDarshanMarg admin panel.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Dashboard | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function DashboardPage() {
  return <DashboardContent />;
}
