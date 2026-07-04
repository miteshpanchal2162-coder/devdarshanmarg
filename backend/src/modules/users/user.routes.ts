import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler, getPagination, sendSuccess } from "../../utils/response";
import { authMiddleware, adminOnly } from "../../middleware/auth";

const router = Router();

/** GET /api/users */
router.get(
  "/",
  authMiddleware,
  adminOnly,
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = getPagination(req.query);

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    sendSuccess(res, {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

export default router;
