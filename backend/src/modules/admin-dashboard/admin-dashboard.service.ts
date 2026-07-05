import { Injectable } from "@nestjs/common";
import { Status } from "@prisma/client";
import { createApiResponse } from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";

@Injectable()
export class AdminDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      users,
      activeUsers,
      temples,
      festivals,
      deities,
      panchang,
      content,
      media,
      notifications,
      pendingReviews,
      pendingComments,
      todayLogins,
      todayRegistrations,
      recentActivityCount,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { deletedAt: null, status: Status.ACTIVE } }),
      this.prisma.temple.count({ where: { deletedAt: null } }),
      this.prisma.festival.count({ where: { deletedAt: null } }),
      this.prisma.deity.count({ where: { deletedAt: null } }),
      this.prisma.panchang.count({ where: { deletedAt: null } }),
      this.prisma.contentItem.count({ where: { deletedAt: null } }),
      this.prisma.mediaLibrary.count(),
      this.prisma.userNotificationPreference.count(),
      this.prisma.userReview.count({
        where: { deletedAt: null, status: Status.INACTIVE },
      }),
      this.prisma.userComment.count({
        where: { deletedAt: null, status: Status.INACTIVE },
      }),
      this.prisma.user.count({
        where: { deletedAt: null, lastLoginAt: { gte: startOfDay } },
      }),
      this.prisma.user.count({
        where: { deletedAt: null, createdAt: { gte: startOfDay } },
      }),
      this.prisma.activityLog.count({
        where: { createdAt: { gte: startOfDay } },
      }),
    ]);

    return createApiResponse("Dashboard stats fetched successfully", {
      users,
      activeUsers,
      temples,
      festivals,
      deities,
      panchang,
      content,
      media,
      notifications,
      pendingReviews,
      pendingComments,
      todayLogins,
      todayRegistrations,
      recentActivityCount,
    });
  }
}
