import { Request, Response, NextFunction } from "express";

/** Standard API success response */
export function sendSuccess<T>(res: Response, data: T, message = "Success") {
  return res.json({ success: true, message, data });
}

/** Standard API error response */
export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown
) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

/** Catch async route errors */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

/** Build pagination meta from query params */
export function getPagination(query: Record<string, unknown>) {
  const page = Math.max(1, parseInt(String(query.page || "1"), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || "10"), 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/** Create slug from text */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
