import { BadRequestException } from "@nestjs/common";
import { closeSync, openSync, readSync } from "fs";
import {
  DOCUMENT_EXTENSIONS,
  DOCUMENT_MIME_TYPES,
  IMAGE_EXTENSIONS,
  IMAGE_MIME_TYPES,
  MAX_FILE_SIZE,
  UploadValidationMode,
  getExtensionWithoutDot,
} from "./storage.constants";

type UploadFile = {
  buffer?: Buffer;
  mimetype: string;
  originalname: string;
  path?: string;
  size: number;
};

const DANGEROUS_EXTENSIONS = new Set([
  "asp",
  "aspx",
  "bat",
  "cgi",
  "cmd",
  "com",
  "exe",
  "htm",
  "html",
  "jar",
  "js",
  "jsp",
  "php",
  "pl",
  "py",
  "rb",
  "sh",
  "svg",
  "vbs",
]);

const MAGIC_SIGNATURES: Array<{ extension: string; mimeType: string; bytes: number[]; offset?: number }> = [
  { extension: "jpg", mimeType: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { extension: "jpeg", mimeType: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { extension: "png", mimeType: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { extension: "gif", mimeType: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { extension: "webp", mimeType: "image/webp", bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
  { extension: "pdf", mimeType: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46] },
  { extension: "zip", mimeType: "application/zip", bytes: [0x50, 0x4b, 0x03, 0x04] },
  { extension: "doc", mimeType: "application/msword", bytes: [0xd0, 0xcf, 0x11, 0xe0] },
  { extension: "docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", bytes: [0x50, 0x4b, 0x03, 0x04] },
  { extension: "xls", mimeType: "application/vnd.ms-excel", bytes: [0xd0, 0xcf, 0x11, 0xe0] },
  { extension: "xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", bytes: [0x50, 0x4b, 0x03, 0x04] },
  { extension: "ppt", mimeType: "application/vnd.ms-powerpoint", bytes: [0xd0, 0xcf, 0x11, 0xe0] },
  { extension: "pptx", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", bytes: [0x50, 0x4b, 0x03, 0x04] },
];

export function validateUploadedFile(file: UploadFile, mode: UploadValidationMode) {
  if (!file) {
    throw new BadRequestException("File is required");
  }

  validateFileName(file.originalname);

  if (file.size > MAX_FILE_SIZE) {
    throw new BadRequestException("File size exceeds the 20 MB limit");
  }

  const extension = getExtensionWithoutDot(file.originalname);

  if (mode === "image") {
    validateImageFile(file.mimetype, extension);
    validateMagicBytes(file, extension, file.mimetype);
    return;
  }

  if (mode === "document") {
    validateDocumentFile(file.mimetype, extension);
    validateMagicBytes(file, extension, file.mimetype);
    return;
  }

  validateAnySupportedFile(file.mimetype, extension);
  validateMagicBytes(file, extension, file.mimetype);
}

export function validateImageFile(mimeType: string, extension: string) {
  if (
    !IMAGE_EXTENSIONS.includes(extension as (typeof IMAGE_EXTENSIONS)[number]) ||
    !IMAGE_MIME_TYPES.includes(mimeType as (typeof IMAGE_MIME_TYPES)[number])
  ) {
    throw new BadRequestException(
      `Unsupported image type. Allowed extensions: ${IMAGE_EXTENSIONS.join(", ")}`,
    );
  }
}

export function validateDocumentFile(mimeType: string, extension: string) {
  if (
    !DOCUMENT_EXTENSIONS.includes(extension as (typeof DOCUMENT_EXTENSIONS)[number]) ||
    !DOCUMENT_MIME_TYPES.includes(mimeType as (typeof DOCUMENT_MIME_TYPES)[number])
  ) {
    throw new BadRequestException(
      `Unsupported document type. Allowed extensions: ${DOCUMENT_EXTENSIONS.join(", ")}`,
    );
  }
}

export function validateAnySupportedFile(mimeType: string, extension: string) {
  const isImage =
    IMAGE_EXTENSIONS.includes(extension as (typeof IMAGE_EXTENSIONS)[number]) &&
    IMAGE_MIME_TYPES.includes(mimeType as (typeof IMAGE_MIME_TYPES)[number]);
  const isDocument =
    DOCUMENT_EXTENSIONS.includes(extension as (typeof DOCUMENT_EXTENSIONS)[number]) &&
    DOCUMENT_MIME_TYPES.includes(mimeType as (typeof DOCUMENT_MIME_TYPES)[number]);

  if (!isImage && !isDocument) {
    throw new BadRequestException(
      "Unsupported file type. Upload an allowed image or document format.",
    );
  }
}

export function resolveMediaType(mimeType: string, extension: string): "image" | "document" {
  try {
    validateImageFile(mimeType, extension);
    return "image";
  } catch {
    validateDocumentFile(mimeType, extension);
    return "document";
  }
}

export function validateFileName(originalName: string) {
  if (!originalName || originalName.includes("\0")) {
    throw new BadRequestException("Invalid file name");
  }

  if (originalName.includes("..") || originalName.includes("/") || originalName.includes("\\")) {
    throw new BadRequestException("Invalid file name");
  }

  const parts = originalName.toLowerCase().split(".");
  if (parts.length < 2) {
    throw new BadRequestException("Invalid file name");
  }

  const middleExtensions = parts.slice(1, -1);
  if (middleExtensions.some((part) => DANGEROUS_EXTENSIONS.has(part))) {
    throw new BadRequestException("Invalid file name");
  }
}

function validateMagicBytes(file: UploadFile, extension: string, mimeType: string) {
  const signature = MAGIC_SIGNATURES.find(
    (entry) => entry.extension === extension && entry.mimeType === mimeType,
  );

  if (!signature) {
    return;
  }

  const buffer = readUploadHeader(file);
  if (!buffer) {
    return;
  }

  const offset = signature.offset ?? 0;
  const matches = signature.bytes.every((byte, index) => buffer[offset + index] === byte);

  if (!matches) {
    throw new BadRequestException("File content does not match the declared file type");
  }
}

function readUploadHeader(file: UploadFile): Buffer | null {
  if (file.buffer?.length) {
    return file.buffer.subarray(0, 16);
  }

  if (file.path) {
    const fd = openSync(file.path, "r");
    try {
      const buffer = Buffer.alloc(16);
      readSync(fd, buffer, 0, 16, 0);
      return buffer;
    } finally {
      closeSync(fd);
    }
  }

  return null;
}
