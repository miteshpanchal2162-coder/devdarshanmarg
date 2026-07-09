function createEntityKeys(name: string) {
  return {
    all: [name] as const,
    list: (params?: unknown) => [name, "list", params] as const,
    detail: (id: string) => [name, "detail", id] as const,
  };
}

export const queryKeys = {
  auth: {
    profile: ["auth", "profile"] as const,
  },
  dashboard: {
    stats: ["dashboard", "stats"] as const,
  },
  users: createEntityKeys("users"),
  temples: createEntityKeys("temples"),
  festivals: createEntityKeys("festivals"),
  deities: createEntityKeys("deities"),
  panchang: createEntityKeys("panchangs"),
  content: createEntityKeys("content-items"),
  media: createEntityKeys("media-library"),
  activityLogs: createEntityKeys("activity-logs"),
  userReviews: createEntityKeys("user-reviews"),
  userComments: createEntityKeys("user-comments"),
  countries: createEntityKeys("countries"),
  states: createEntityKeys("states"),
  cities: createEntityKeys("cities"),
  continents: createEntityKeys("continents"),
  areas: createEntityKeys("areas"),
  contentCategories: createEntityKeys("content-categories"),
  seoRedirects: createEntityKeys("seo-redirects"),
  seoLandingPages: createEntityKeys("seo-landing-pages"),
  supportedLanguages: createEntityKeys("supported-languages"),
  supportedMediaTypes: createEntityKeys("supported-media-types"),
  supportedContentStatuses: createEntityKeys("supported-content-statuses"),
  notificationPreferences: {
    all: ["notification-preferences"] as const,
    detail: (userId: string) => ["notification-preferences", userId] as const,
  },
  festivalRegions: (festivalId: string) => ({
    all: ["festival-regions", festivalId] as const,
    list: (params?: unknown) => ["festival-regions", festivalId, "list", params] as const,
    detail: (id: string) => ["festival-regions", festivalId, "detail", id] as const,
  }),
  festivalDates: (festivalId: string) => ({
    all: ["festival-dates", festivalId] as const,
    list: (params?: unknown) => ["festival-dates", festivalId, "list", params] as const,
    detail: (id: string) => ["festival-dates", festivalId, "detail", id] as const,
  }),
  festivalTempleMaps: (festivalId: string) => ({
    all: ["festival-temple-maps", festivalId] as const,
    list: (params?: unknown) => ["festival-temple-maps", festivalId, "list", params] as const,
    detail: (id: string) => ["festival-temple-maps", festivalId, "detail", id] as const,
  }),
  public: {
    temples: (params?: unknown) => ["public", "temples", params] as const,
    festivals: (params?: unknown) => ["public", "festivals", params] as const,
    deities: (params?: unknown) => ["public", "deities", params] as const,
    panchang: (params?: unknown) => ["public", "panchang", params] as const,
    content: (params?: unknown) => ["public", "content", params] as const,
    media: (params?: unknown) => ["public", "media", params] as const,
  },
} as const;
