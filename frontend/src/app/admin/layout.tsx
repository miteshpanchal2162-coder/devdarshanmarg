"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AuthGuard } from "@/components/admin/auth-guard";

/** Admin panel shell — login page renders without sidebar */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="min-h-screen">{children}</SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
