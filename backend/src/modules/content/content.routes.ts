import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler, getPagination, sendSuccess } from "../../utils/response";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

/** GET /api/content */
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = getPagination(req.query);

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          contentType: true,
          translations: { where: { language: "en" }, take: 1 },
        },
      }),
      prisma.content.count(),
    ]);

    sendSuccess(res, {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

/** GET /api/content/types */
router.get(
  "/types",
  authMiddleware,
  asyncHandler(async (_req: Request, res: Response) => {
    const types = await prisma.contentType.findMany({ orderBy: { name: "asc" } });
    sendSuccess(res, types);
  })
);

export default router;
