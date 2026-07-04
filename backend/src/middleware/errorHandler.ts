import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

/** Global error handler */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[Error]", err.message);

  // Prisma unique constraint violation
  if (err.message.includes("Unique constraint")) {
    return sendError(res, 409, "Record already exists");
  }

  return sendError(res, 500, "Internal server error");
}
