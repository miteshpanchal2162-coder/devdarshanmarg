export const routes = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
