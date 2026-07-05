import type { Metadata } from "next";
import { AdminLayout as AdminShell } from "@/components/admin/layout/admin-layout";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
