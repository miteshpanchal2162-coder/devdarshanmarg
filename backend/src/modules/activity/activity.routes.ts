import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler, getPagination, sendSuccess } from "../../utils/response";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

/** GET /api/activity-logs */
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = getPagination(req.query);

    const [items, total] = await Promise.all([
      prisma.activityLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.activityLog.count(),
    ]);

    sendSuccess(res, {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

export default router;
