"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Landmark,
  Sparkles,
  Tags,
  Globe,
  Map,
  Building2,
  Calendar,
  Image,
  FileText,
  Search,
  Users,
  Activity,
  Settings,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { APP_NAME, ADMIN_NAV } from "@/lib/constants";

/** Map icon names from constants to Lucide components */
const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Landmark,
  Sparkles,
  Tags,
  Globe,
  Map,
  Building2,
  Calendar,
  Image,
  FileText,
  Search,
  Users,
  Activity,
  Settings,
};

/** Left sidebar navigation for admin panel */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            🙏
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-sidebar-foreground">{APP_NAME}</span>
            <span className="text-xs text-sidebar-foreground/60">Admin Panel</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_NAV.map((item) => {
                const Icon = ICONS[item.icon];
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <p className="text-xs text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
          DevDarshanMarg v1.0
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
