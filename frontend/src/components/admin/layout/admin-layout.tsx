"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Bell, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, CircleUserRound, FileText, Flower2, ImageIcon, KeyRound, LayoutDashboard, LogOut, Menu, Search, Settings, Shield, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageShell } from "@/components/admin/layout/page-shell";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/ui/permission";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeModeToggle } from "@/components/ui/theme-mode-toggle";
import { AppBreadcrumb } from "@/components/ui/enterprise";
import { siteConfig } from "@/constants/site";
import { routes } from "@/constants/routes";
import { useLogoutMutation } from "@/hooks/mutations/use-auth-mutations";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

type SidebarNavItem = {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  items?: SidebarNavItem[];
};

const sidebarItems: Array<{ title: string; items: SidebarNavItem[] }> = [
  {
    title: "Workspace",
    items: [
      { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard /> },
      {
        title: "Administration",
        icon: <Shield />,
        items: [
          { title: "Users", href: "/admin/users" },
          { title: "Roles", href: "/admin/roles" },
          { title: "Permissions", href: "/admin/permissions" },
        ],
      },
    ],
  },
  {
    title: "Content",
    items: [
      { title: "Content Engine", href: "/admin/content", icon: <FileText /> },
      { title: "Temples", href: "/admin/temples", icon: <Sparkles /> },
      { title: "Festivals", href: "/admin/festivals", icon: <Flower2 /> },
      { title: "Deities", href: "/admin/deities", icon: <Sparkles /> },
      { title: "Panchang", href: "/admin/panchang", icon: <CalendarDays /> },
      { title: "Media Library", href: "/admin/media", icon: <ImageIcon /> },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Notifications", href: "/admin/notifications", icon: <Bell /> },
      { title: "Activity Logs", href: "/admin/activity-logs", icon: <Activity /> },
      { title: "Settings", href: "/admin/settings", icon: <Settings /> },
      { title: "Security", href: "/admin/settings/security", icon: <KeyRound /> },
    ],
  },
];

function BrandMark({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl gradient-saffron-gold text-lg font-semibold text-primary-foreground shadow-premium">
        <span aria-hidden="true">ॐ</span>
        <span className="absolute -bottom-2 -right-2 size-7 rounded-full border border-white/30 opacity-50" />
      </div>
      {!collapsed ? (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{siteConfig.shortName}</p>
          <p className="truncate text-xs text-muted-foreground">Enterprise admin</p>
        </div>
      ) : null}
    </div>
  );
}

export function SidebarItem({
  item,
  collapsed = false,
  pathname,
}: {
  item: SidebarNavItem;
  collapsed?: boolean;
  pathname: string;
}) {
  const [open, setOpen] = useState(true);
  const active = item.href && item.href !== "#" ? pathname === item.href : false;
  const hasChildren = Boolean(item.items?.length);

  const content = (
    <>
      {item.icon ? <span className="shrink-0 [&_svg]:size-4">{item.icon}</span> : null}
      {!collapsed ? <span className="min-w-0 flex-1 truncate">{item.title}</span> : null}
      {!collapsed && hasChildren ? (
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      ) : null}
    </>
  );

  if (hasChildren) {
    return (
      <li>
        <button
          aria-expanded={open}
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-xl px-3 text-sm text-muted-foreground transition hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            collapsed && "justify-center px-2",
          )}
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {content}
        </button>
        {open && !collapsed ? (
          <ul className="mt-1 space-y-1 border-l border-border/70 pl-4">
            {item.items?.map((child) => (
              <SidebarItem item={child} key={child.title} pathname={pathname} />
            ))}
          </ul>
        ) : null}
      </li>
    );
  }

  return (
    <li>
      <Link
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex h-9 items-center gap-2 rounded-xl px-3 text-sm text-muted-foreground transition hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active && "bg-primary text-primary-foreground shadow-soft hover:bg-primary hover:text-primary-foreground",
          collapsed && "justify-center px-2",
        )}
        href={item.href ?? "#"}
      >
        {content}
      </Link>
    </li>
  );
}

export function SidebarGroup({
  collapsed = false,
  group,
  pathname,
}: {
  collapsed?: boolean;
  group: (typeof sidebarItems)[number];
  pathname: string;
}) {
  return (
    <section aria-label={group.title} className="space-y-2">
      {!collapsed ? (
        <h2 className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {group.title}
        </h2>
      ) : null}
      <ul className="space-y-1">
        {group.items.map((item) => (
          <SidebarItem collapsed={collapsed} item={item} key={item.title} pathname={pathname} />
        ))}
      </ul>
    </section>
  );
}

export function SidebarFooter({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={cn("rounded-2xl border border-primary/10 bg-primary/5 p-3", collapsed && "p-2")}>
      <div className="flex items-center justify-center rounded-xl border border-dashed border-primary/20 py-3 text-primary">
        <span aria-hidden="true" className="flex items-end gap-0.5">
          <span className="h-3 w-2 rounded-t-sm bg-current opacity-60" />
          <span className="h-5 w-5 rounded-t-full border border-current opacity-70" />
          <span className="h-3 w-2 rounded-t-sm bg-current opacity-60" />
        </span>
        {!collapsed ? <span className="ml-2 text-xs font-medium">Subtle temple branding</span> : null}
      </div>
    </div>
  );
}

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const setCollapsed = useUiStore((state) => state.setSidebarCollapsed);

  return (
    <aside
      aria-label="Primary navigation"
      className={cn(
        "flex h-full flex-col border-border/70 bg-card/80 text-card-foreground backdrop-blur-xl",
        mobile ? "w-full border-r-0" : "sticky top-0 hidden h-svh border-r lg:flex",
        !mobile && (collapsed ? "w-[5.25rem]" : "w-72"),
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border/70 px-4">
        <BrandMark collapsed={!mobile && collapsed} />
        {!mobile ? (
          <Button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed(!collapsed)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        ) : null}
      </div>
      <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {sidebarItems.map((group) => (
          <SidebarGroup collapsed={!mobile && collapsed} group={group} key={group.title} pathname={pathname} />
        ))}
      </nav>
      <div className="border-t border-border/70 p-3">
        <SidebarFooter collapsed={!mobile && collapsed} />
      </div>
    </aside>
  );
}

export function GlobalSearch() {
  return (
    <label className="relative hidden w-full max-w-md lg:block">
      <span className="sr-only">Search admin panel</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        className="h-9 w-full rounded-xl border border-border bg-background/80 pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30"
        placeholder="Search temples, festivals, users..."
        type="search"
      />
    </label>
  );
}

export function NotificationMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button aria-label="Open notifications" size="icon" variant="outline" />}>
        <Bell />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-6 text-center text-sm text-muted-foreground">
          Notification center placeholder
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ProfileMenu() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogoutMutation();
  const router = useRouter();
  const displayName = user?.fullName ?? user?.email ?? "Admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button className="gap-2" variant="outline" />}>
        <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CircleUserRound className="size-4" />
        </span>
        <span className="hidden text-sm sm:inline">{displayName}</span>
        <ChevronsUpDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className="block font-medium text-foreground">{displayName}</span>
          <span className="mt-1 block"><RoleBadge role={user?.role} /></span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<Settings />} onClick={() => router.push(routes.adminSettings)}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          icon={<LogOut />}
          onClick={() => logout.mutate()}
          variant="destructive"
        >
          {logout.isPending ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Breadcrumbs() {
  const pathname = usePathname();
  const items = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => ({
      label: segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      href: `/${segments.slice(0, index + 1).join("/")}`,
    }));
  }, [pathname]);

  return <AppBreadcrumb homeHref="/admin/dashboard" items={items.length ? items : [{ label: "Dashboard" }]} />;
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <Button aria-label="Open sidebar" className="lg:hidden" onClick={onMenuClick} size="icon" type="button" variant="outline">
          <Menu />
        </Button>
        <div className="min-w-0 flex-1">
          <Breadcrumbs />
        </div>
        <GlobalSearch />
        <NotificationMenu />
        <ThemeModeToggle />
        <ProfileMenu />
      </div>
    </header>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-svh bg-cream/40 text-foreground dark:bg-charcoal">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,oklch(0.68_0.19_45_/_0.08),transparent_30%),radial-gradient(circle_at_bottom_right,oklch(0.78_0.14_80_/_0.08),transparent_35%)]" />
      <Sheet onOpenChange={setMobileOpen} open={mobileOpen}>
        <SheetContent className="w-[min(100%,20rem)] p-0" side="left" showCloseButton>
          <SheetHeader className="sr-only">
            <SheetTitle>Admin navigation</SheetTitle>
            <SheetDescription>Primary admin sidebar navigation</SheetDescription>
          </SheetHeader>
          <Sidebar mobile />
        </SheetContent>
      </Sheet>
      <div className="flex min-h-svh">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="min-h-0 flex-1 overflow-y-auto" id="admin-content">
            <PageShell maxWidth="full" padding="lg">
              {children}
            </PageShell>
          </main>
        </div>
      </div>
    </div>
  );
}
