import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../lib/prisma";
import { config } from "../../config";
import { asyncHandler, getPagination, sendError, sendSuccess } from "../../utils/response";
import { authMiddleware } from "../../middleware/auth";
import { logActivity } from "../../services/activityLog.service";

const router = Router();

// Local file upload config (S3-ready: swap storage engine later)
const storage = multer.diskStorage({
  destination: config.upload.dir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    cb(null, allowed.includes(file.mimetype));
  },
});

/** GET /api/media */
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = getPagination(req.query);

    const [items, total] = await Promise.all([
      prisma.mediaLibrary.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { uploadedBy: { select: { name: true } } },
      }),
      prisma.mediaLibrary.count(),
    ]);

    sendSuccess(res, {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

/** POST /api/media/upload */
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      sendError(res, 400, "No file uploaded");
      return;
    }

    const media = await prisma.mediaLibrary.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        mediaType: "image",
        storagePath: req.file.path,
        storageType: "local",
        fileSize: req.file.size,
        uploadedById: req.user?.userId,
        altText: req.body.altText || req.file.originalname,
      },
    });

    await logActivity({
      userId: req.user?.userId,
      action: "upload",
      entityType: "media",
      entityId: media.id,
    });

    sendSuccess(res, media, "File uploaded");
  })
);

export default router;
