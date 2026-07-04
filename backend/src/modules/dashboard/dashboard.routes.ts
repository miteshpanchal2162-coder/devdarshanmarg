import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler, sendSuccess } from "../../utils/response";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

/** GET /api/dashboard/stats */
router.get(
  "/stats",
  authMiddleware,
  asyncHandler(async (_req: Request, res: Response) => {
    const [
      templeCount,
      festivalCount,
      mediaCount,
      userCount,
      contentCount,
      recentActivity,
    ] = await Promise.all([
      prisma.temple.count(),
      prisma.festival.count(),
      prisma.mediaLibrary.count(),
      prisma.user.count(),
      prisma.content.count(),
      prisma.activityLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      }),
    ]);

    sendSuccess(res, {
      counts: {
        temples: templeCount,
        festivals: festivalCount,
        media: mediaCount,
        users: userCount,
        contents: contentCount,
      },
      recentActivity,
    });
  })
);

export default router;
