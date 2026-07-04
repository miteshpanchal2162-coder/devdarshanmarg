import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler, getPagination, sendSuccess } from "../../utils/response";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

/** GET /api/temples - List temples with search and filters */
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = getPagination(req.query);
    const search = String(req.query.search || "");
    const isActive = req.query.isActive;

    const where = {
      ...(search && {
        OR: [
          { slug: { contains: search, mode: "insensitive" as const } },
          { translations: { some: { name: { contains: search, mode: "insensitive" as const } } } },
        ],
      }),
      ...(isActive !== undefined && { isActive: isActive === "true" }),
    };

    const [temples, total] = await Promise.all([
      prisma.temple.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          translations: { where: { language: "en" }, take: 1 },
          city: true,
          state: true,
          deityType: true,
        },
      }),
      prisma.temple.count({ where }),
    ]);

    sendSuccess(res, {
      items: temples,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

/** GET /api/temples/:id */
router.get(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const temple = await prisma.temple.findUnique({
      where: { id },
      include: {
        translations: true,
        categories: { include: { category: true } },
        timings: true,
        aartis: true,
        deityType: true,
        country: true,
        state: true,
        city: true,
      },
    });
    sendSuccess(res, temple);
  })
);

export default router;
