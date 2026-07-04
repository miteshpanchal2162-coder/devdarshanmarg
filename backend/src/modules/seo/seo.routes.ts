import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler, getPagination, sendSuccess } from "../../utils/response";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

/** GET /api/seo/redirects */
router.get(
  "/redirects",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = getPagination(req.query);

    const [items, total] = await Promise.all([
      prisma.seoRedirect.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.seoRedirect.count(),
    ]);

    sendSuccess(res, {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

/** GET /api/seo/landing-pages */
router.get(
  "/landing-pages",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = getPagination(req.query);

    const [items, total] = await Promise.all([
      prisma.seoLandingPage.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.seoLandingPage.count(),
    ]);

    sendSuccess(res, {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

export default router;
