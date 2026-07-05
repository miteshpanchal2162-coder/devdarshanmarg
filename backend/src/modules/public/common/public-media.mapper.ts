import { MediaLibrary } from "@prisma/client";
import { getExtensionWithoutDot } from "../../../common/storage/storage.constants";

export type PublicMediaRecord = {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  extension: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  title: string;
  createdAt: Date;
};

export function mapPublicMedia(item: MediaLibrary): PublicMediaRecord {
  return {
    id: item.id,
    url: `/public/media/${item.id}/file`,
    filename: item.filename,
    originalName: item.originalName,
    mimeType: item.mimeType,
    extension: getExtensionWithoutDot(item.filename),
    size: item.fileSize,
    width: item.width,
    height: item.height,
    alt: item.altText,
    title: item.originalName,
    createdAt: item.createdAt,
  };
}
