import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { env } from "@/constants/env";

export const publicSiteConfig = {
  name: APP_NAME,
  shortName: APP_NAME,
  tagline: APP_TAGLINE,
  description:
    "India's Temple, Pilgrimage & Spiritual Knowledge Platform — temples, festivals, deities, panchang, and articles from our live database.",
  company: APP_NAME,
  url: env.appUrl,
  locale: "en_IN",
} as const;

export const publicNav = [
  { label: "Temples", href: "/temples" },
  { label: "Festivals", href: "/festivals" },
  { label: "Deities", href: "/deities" },
  { label: "Panchang", href: "/panchang" },
  { label: "Articles", href: "/articles" },
  { label: "Search", href: "/search" },
] as const;

export const accountNav = [
  { label: "Profile", href: "/account" },
  { label: "Favorites", href: "/account/favorites" },
  { label: "Ratings", href: "/account/ratings" },
  { label: "Reviews", href: "/account/reviews" },
  { label: "Comments", href: "/account/comments" },
  { label: "Notifications", href: "/account/notifications" },
  { label: "Sessions", href: "/account/sessions" },
] as const;
