import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { config } from "../config";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

/** Create JWT token for authenticated user */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
  });
}

/** Verify and decode JWT token */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
}
