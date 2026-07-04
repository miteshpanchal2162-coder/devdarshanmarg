import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { prisma } from "../../lib/prisma";
import { signToken } from "../../utils/jwt";
import { asyncHandler, sendError, sendSuccess } from "../../utils/response";
import { authMiddleware } from "../../middleware/auth";
import { logActivity } from "../../services/activityLog.service";

const router = Router();

/** POST /api/auth/login */
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, "Validation failed", errors.array());
      return;
    }

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      sendError(res, 401, "Invalid credentials");
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      sendError(res, 401, "Invalid credentials");
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await logActivity({
      userId: user.id,
      action: "login",
      entityType: "user",
      entityId: user.id,
      ipAddress: req.ip,
    });

    sendSuccess(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  })
);

/** GET /api/auth/me */
router.get(
  "/me",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, name: true, role: true, lastLoginAt: true },
    });
    sendSuccess(res, user);
  })
);

export default router;
