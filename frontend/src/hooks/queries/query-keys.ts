export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params?: unknown) => ["users", "list", params] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
  temples: {
    all: ["temples"] as const,
    list: (params?: unknown) => ["temples", "list", params] as const,
    detail: (id: string) => ["temples", "detail", id] as const,
  },
  festivals: {
    all: ["festivals"] as const,
    list: (params?: unknown) => ["festivals", "list", params] as const,
    detail: (id: string) => ["festivals", "detail", id] as const,
  },
  deities: {
    all: ["deities"] as const,
    list: (params?: unknown) => ["deities", "list", params] as const,
    detail: (id: string) => ["deities", "detail", id] as const,
  },
  panchang: {
    all: ["panchang"] as const,
    list: (params?: unknown) => ["panchang", "list", params] as const,
    detail: (id: string) => ["panchang", "detail", id] as const,
  },
  content: {
    all: ["content"] as const,
    list: (params?: unknown) => ["content", "list", params] as const,
    detail: (id: string) => ["content", "detail", id] as const,
  },
  media: {
    all: ["media"] as const,
    list: (params?: unknown) => ["media", "list", params] as const,
    detail: (id: string) => ["media", "detail", id] as const,
  },
  public: {
    temples: (params?: unknown) => ["public", "temples", params] as const,
    festivals: (params?: unknown) => ["public", "festivals", params] as const,
    deities: (params?: unknown) => ["public", "deities", params] as const,
    panchang: (params?: unknown) => ["public", "panchang", params] as const,
    content: (params?: unknown) => ["public", "content", params] as const,
    media: (params?: unknown) => ["public", "media", params] as const,
  },
} as const;
