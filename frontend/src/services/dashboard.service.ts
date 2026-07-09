import { apiClient, unwrapApiData } from "@/services/api-client";

export type DashboardStats = {
  users: number;
  activeUsers: number;
  temples: number;
  festivals: number;
  deities: number;
  panchang: number;
  content: number;
  media: number;
  notifications: number;
  pendingReviews: number;
  pendingComments: number;
  todayLogins: number;
  todayRegistrations: number;
  recentActivityCount: number;
};

export const dashboardService = {
  async getStats() {
    const response = await apiClient.get("/admin/dashboard/stats");
    return unwrapApiData<DashboardStats>(response.data);
  },
};
