"use client";

import Link from "next/link";
import { Bell, DatabaseBackup, Globe2, ImageIcon, Info, Languages, LockKeyhole, Mail, Palette, SearchCheck, Settings, ShieldCheck, Type } from "lucide-react";

import { ReferenceDataListPageContent } from "@/components/admin/settings/reference-data-management";
import {
  contentStatusesConfig,
  languagesConfig,
  mediaTypesConfig,
} from "@/components/admin/settings/reference-data-configs";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/enterprise";
import { PermissionGate, RoleBadge } from "@/components/ui/permission";

export type SettingsSection =
  | "general"
  | "site"
  | "seo"
  | "localization"
  | "languages"
  | "media-types"
  | "content-types"
  | "notifications"
  | "email"
  | "security"
  | "backup-maintenance"
  | "about";

const sections: Array<{ label: string; value: SettingsSection; href: string; icon: React.ReactNode }> = [
  { label: "General Settings", value: "general", href: "/admin/settings", icon: <Settings /> },
  { label: "Site Settings", value: "site", href: "/admin/settings/site", icon: <Palette /> },
  { label: "SEO Settings", value: "seo", href: "/admin/settings/seo", icon: <SearchCheck /> },
  { label: "Localization", value: "localization", href: "/admin/settings/localization", icon: <Globe2 /> },
  { label: "Supported Languages", value: "languages", href: "/admin/settings/languages", icon: <Languages /> },
  { label: "Media Types", value: "media-types", href: "/admin/settings/media-types", icon: <ImageIcon /> },
  { label: "Content Types", value: "content-types", href: "/admin/settings/content-types", icon: <Type /> },
  { label: "Notification Settings", value: "notifications", href: "/admin/settings/notifications", icon: <Bell /> },
  { label: "Email Settings", value: "email", href: "/admin/settings/email", icon: <Mail /> },
  { label: "Security Settings", value: "security", href: "/admin/settings/security", icon: <LockKeyhole /> },
  { label: "Backup & Maintenance", value: "backup-maintenance", href: "/admin/settings/backup-maintenance", icon: <DatabaseBackup /> },
  { label: "About System", value: "about", href: "/admin/settings/about", icon: <Info /> },
];

const noApiSections: Record<
  Exclude<SettingsSection, "languages" | "media-types" | "content-types" | "about">,
  { title: string; description: string; icon: React.ReactNode }
> = {
  general: {
    title: "General Settings",
    description: "No general settings API endpoint is available yet.",
    icon: <Settings />,
  },
  site: {
    title: "Site Settings",
    description: "No site settings API endpoint is available yet.",
    icon: <Palette />,
  },
  seo: {
    title: "SEO Settings",
    description: "No site-wide SEO settings API endpoint is available. Use the SEO module for redirects and landing pages.",
    icon: <SearchCheck />,
  },
  localization: {
    title: "Localization",
    description: "No localization settings API endpoint is available yet.",
    icon: <Globe2 />,
  },
  notifications: {
    title: "Notification Settings",
    description: "Global notification settings are not exposed by the API. Manage per-user preferences from the Notifications center.",
    icon: <Bell />,
  },
  email: {
    title: "Email Settings",
    description: "No email/SMTP settings API endpoint is available yet.",
    icon: <Mail />,
  },
  security: {
    title: "Security Settings",
    description: "No security settings API endpoint is available yet. RBAC is enforced server-side via JWT role.",
    icon: <ShieldCheck />,
  },
  "backup-maintenance": {
    title: "Backup & Maintenance",
    description: "No backup or maintenance API endpoint is available yet.",
    icon: <DatabaseBackup />,
  },
};

function SettingsNav({ active }: { active: SettingsSection }) {
  return (
    <nav aria-label="Settings sections" className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
      {sections.map((section) => (
        <Link
          aria-current={active === section.value ? "page" : undefined}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-sm shadow-soft transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring aria-current:border-primary aria-current:bg-primary/10"
          href={section.href}
          key={section.value}
        >
          <span className="text-primary [&_svg]:size-4">{section.icon}</span>
          <span className="font-medium">{section.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function AboutSystem() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {[
        ["Version", "0.1.0"],
        ["Framework", "Next.js 15"],
        ["Backend", "NestJS + PostgreSQL"],
      ].map(([label, value]) => (
        <Card className="glass-panel shadow-soft" key={label}>
          <CardContent>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function NoApiSection({ section }: { section: keyof typeof noApiSections }) {
  const config = noApiSections[section];
  return (
    <EmptyState
      description={config.description}
      icon={config.icon}
      title={config.title}
    />
  );
}

function SectionBody({ section }: { section: SettingsSection }) {
  if (section === "languages") return <ReferenceDataListPageContent config={languagesConfig} />;
  if (section === "media-types") return <ReferenceDataListPageContent config={mediaTypesConfig} />;
  if (section === "content-types") return <ReferenceDataListPageContent config={contentStatusesConfig} />;
  if (section === "about") return <AboutSystem />;
  return <NoApiSection section={section} />;
}

export function SettingsPageContent({ section = "general" }: { section?: SettingsSection }) {
  const current = sections.find((item) => item.value === section) ?? sections[0];

  return (
    <PermissionGate allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-primary">System Settings</p>
            <h1 className="text-3xl font-semibold tracking-tight">{current.label}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Reference data sections use live APIs. Other settings pages show availability status only.
            </p>
          </div>
          <RoleBadge />
        </header>
        <SettingsNav active={current.value} />
        <SectionBody section={current.value} />
      </div>
    </PermissionGate>
  );
}
