import type { Metadata } from "next";
import { ActivityLogsPageContent } from "@/components/admin/audit/audit-logs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Activity Logs",
  description: "Review activity and audit logs in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Activity Logs | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function ActivityLogsPage() {
  return <ActivityLogsPageContent />;
}
