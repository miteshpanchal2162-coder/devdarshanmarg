/** DevDarshanMarg brand colors and app constants */

export const APP_NAME = "DevDarshanMarg";
export const APP_TAGLINE = "India's Temple, Pilgrimage & Spiritual Knowledge Platform";

/** Saffron primary, gold accent */
export const COLORS = {
  saffron: "#FF7A00",
  gold: "#D4AF37",
  white: "#FFFFFF",
} as const;

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "gu", label: "Gujarati" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

/** Admin sidebar navigation modules */
export const ADMIN_NAV = [
  { title: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { title: "Temples", href: "/admin/temples", icon: "Landmark" },
  { title: "Deities", href: "/admin/deities", icon: "Sparkles" },
  { title: "Categories", href: "/admin/categories", icon: "Tags" },
  { title: "Countries", href: "/admin/countries", icon: "Globe" },
  { title: "States", href: "/admin/states", icon: "Map" },
  { title: "Cities", href: "/admin/cities", icon: "Building2" },
  { title: "Festivals", href: "/admin/festivals", icon: "Calendar" },
  { title: "Media Library", href: "/admin/media", icon: "Image" },
  { title: "Content Center", href: "/admin/content", icon: "FileText" },
  { title: "SEO", href: "/admin/seo", icon: "Search" },
  { title: "Users", href: "/admin/users", icon: "Users" },
  { title: "Activity Logs", href: "/admin/activity-logs", icon: "Activity" },
  { title: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;
