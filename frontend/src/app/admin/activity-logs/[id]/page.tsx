import type { Metadata } from "next";
import { AuditDetailsPageContent } from "@/components/admin/audit/audit-logs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Audit Details",
  description: "View audit detail placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Audit Details | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function AuditDetailsPage() {
  return <AuditDetailsPageContent />;
}
