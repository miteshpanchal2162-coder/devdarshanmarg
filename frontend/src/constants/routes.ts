export const routes = {
  home: "/",
  login: "/login",
  forgotPassword: "/forgot-password",
  otpVerification: "/otp-verification",
  resetPassword: "/reset-password",
  adminDashboard: "/admin/dashboard",
  adminUsers: "/admin/users",
  adminTemples: "/admin/temples",
  adminFestivals: "/admin/festivals",
  adminDeities: "/admin/deities",
  adminPanchang: "/admin/panchang",
  adminContent: "/admin/content",
  adminMedia: "/admin/media",
  adminSettings: "/admin/settings",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];

export const adminRoutePrefixes = ["/admin"] as const;

export const publicAuthRoutes = [
  routes.login,
  routes.forgotPassword,
  routes.otpVerification,
  routes.resetPassword,
] as const;
