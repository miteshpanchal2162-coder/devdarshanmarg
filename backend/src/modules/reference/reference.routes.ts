import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler, getPagination, sendSuccess } from "../../utils/response";
import { authMiddleware } from "../../middleware/auth";

/** Generic CRUD list handler for simple slug-based entities */
function createListRoute(model: keyof typeof prisma) {
  const router = Router();

  router.get(
    "/",
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const { page, limit, skip } = getPagination(req.query);
      const search = String(req.query.search || "");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const delegate = (prisma as any)[model];
      const where = search
        ? { slug: { contains: search, mode: "insensitive" } }
        : {};

      const [items, total] = await Promise.all([
        delegate.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
        delegate.count({ where }),
      ]);

      sendSuccess(res, {
        items,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    })
  );

  return router;
}

export const deityRoutes = createListRoute("deityType");
export const categoryRoutes = createListRoute("templeCategory");
export const countryRoutes = createListRoute("country");
export const festivalRoutes = createListRoute("festival");

// States need country filter
export const stateRoutes = Router();
stateRoutes.get(
  "/",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = getPagination(req.query);
    const countryId = req.query.countryId as string | undefined;
    const where = countryId ? { countryId } : {};

    const [items, total] = await Promise.all([
      prisma.state.findMany({ where, skip, take: limit, orderBy: { slug: "asc" }, include: { country: true } }),
      prisma.state.count({ where }),
    ]);

    sendSuccess(res, {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// Cities need state filter
export const cityRoutes = Router();
cityRoutes.get(
  "/",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = getPagination(req.query);
    const stateId = req.query.stateId as string | undefined;
    const where = stateId ? { stateId } : {};

    const [items, total] = await Promise.all([
      prisma.city.findMany({ where, skip, take: limit, orderBy: { slug: "asc" }, include: { state: true } }),
      prisma.city.count({ where }),
    ]);

    sendSuccess(res, {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);
