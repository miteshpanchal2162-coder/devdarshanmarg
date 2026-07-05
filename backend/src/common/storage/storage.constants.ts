import { BadRequestException } from "@nestjs/common";
import { existsSync, mkdirSync } from "fs";
import { extname, normalize, resolve, sep } from "path";

export const MAX_FILE_SIZE = 20 * 1024 * 1024;

export const STORAGE_FOLDERS = [
  "temples",
  "festivals",
  "deities",
  "contents",
  "panchang",
  "users",
  "temp",
] as const;

export type StorageFolder = (typeof STORAGE_FOLDERS)[number];

export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"] as const;

export const DOCUMENT_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip"] as const;

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/x-zip-compressed",
] as const;

export type UploadValidationMode = "any" | "image" | "document";

export function getUploadRoot(): string {
  const configured = process.env.UPLOAD_DIR ?? process.env.UPLOAD_PATH ?? "uploads";
  const root = configured.startsWith("/") || /^[A-Za-z]:\\/.test(configured)
    ? configured
    : resolve(process.cwd(), configured);

  return normalize(root);
}

export function resolveStorageFolder(request: {
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
}): StorageFolder {
  const folder = request.body?.folder ?? request.query?.folder;

  if (typeof folder !== "string" || !STORAGE_FOLDERS.includes(folder as StorageFolder)) {
    throw new BadRequestException(
      `Invalid storage folder. Allowed values: ${STORAGE_FOLDERS.join(", ")}`,
    );
  }

  return folder as StorageFolder;
}

export function ensureDirectory(directoryPath: string): string {
  const root = resolve(getUploadRoot());
  const absolute = resolve(directoryPath);

  if (absolute !== root && !absolute.startsWith(`${root}${sep}`)) {
    throw new BadRequestException("Invalid storage path");
  }

  if (!existsSync(absolute)) {
    mkdirSync(absolute, { recursive: true });
  }

  return absolute;
}

export function ensureUploadDirectories(): void {
  const root = getUploadRoot();
  ensureDirectory(root);
  for (const folder of STORAGE_FOLDERS) {
    ensureDirectory(resolve(root, folder));
  }
}

export function normalizeExtension(filename: string): string {
  const extension = extname(filename).toLowerCase();
  return extension.startsWith(".") ? extension : `.${extension}`;
}

export function getExtensionWithoutDot(filename: string): string {
  return normalizeExtension(filename).replace(/^\./, "");
}

export function buildRelativeStoragePath(folder: StorageFolder, filename: string): string {
  return sanitizeRelativeStoragePath(`${folder}/${filename}`);
}

export function sanitizeRelativeStoragePath(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");

  if (!normalized || normalized.includes("\0") || normalized.includes("..")) {
    throw new BadRequestException("Invalid storage path");
  }

  const segments = normalized.split("/").filter(Boolean);

  if (segments.length !== 2) {
    throw new BadRequestException("Invalid storage path");
  }

  const [folder, filename] = segments;

  if (!STORAGE_FOLDERS.includes(folder as StorageFolder)) {
    throw new BadRequestException("Invalid storage path");
  }

  if (!filename || filename.includes("/") || filename.includes("\\")) {
    throw new BadRequestException("Invalid storage path");
  }

  return `${folder}/${filename}`;
}

export function resolveAbsolutePath(relativePath: string): string {
  const sanitized = sanitizeRelativeStoragePath(relativePath);
  const root = resolve(getUploadRoot());
  const absolute = resolve(root, sanitized.replace(/\//g, sep));

  if (absolute !== root && !absolute.startsWith(`${root}${sep}`)) {
    throw new BadRequestException("Invalid storage path");
  }

  return absolute;
}
