import { Injectable } from "@nestjs/common";
import { Status } from "@prisma/client";
import { PrismaService } from "../../../database/prisma/prisma.service";
import { STORAGE_FOLDERS } from "../../../common/storage/storage.constants";
import { activeStatusWhere, publishedAtWhere } from "../common/public-response.util";

@Injectable()
export class PublicMediaVisibilityService {
  private cache: { expiresAt: number; paths: Set<string> } | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async getVisibleStoragePaths(): Promise<Set<string>> {
    const now = Date.now();
    if (this.cache && this.cache.expiresAt > now) {
      return this.cache.paths;
    }

    const paths = await this.collectVisibleStoragePaths();
    this.cache = { expiresAt: now + 30_000, paths };
    return paths;
  }

  async isStoragePathPubliclyVisible(storagePath: string): Promise<boolean> {
    const paths = await this.getVisibleStoragePaths();
    return paths.has(storagePath);
  }

  private async collectVisibleStoragePaths(): Promise<Set<string>> {
    const paths = new Set<string>();
    const now = new Date();
    const publishedTempleWhere = {
      ...activeStatusWhere(),
      ...publishedAtWhere(now),
      isSearchable: true,
    };
    const publishedContentWhere = {
      ...activeStatusWhere(),
      ...publishedAtWhere(now),
    };
    const activeWhere = activeStatusWhere();

    const [
      temples,
      templeMedia,
      festivals,
      festivalGalleries,
      deities,
      deityAvatars,
      deitySymbols,
      contentMedia,
      contentSeo,
      contentAttachments,
    ] = await Promise.all([
      this.prisma.temple.findMany({
        where: publishedTempleWhere,
        select: { ogImage: true },
      }),
      this.prisma.templeMedia.findMany({
        where: {
          deletedAt: null,
          status: Status.ACTIVE,
          temple: publishedTempleWhere,
        },
        select: { fileUrl: true, thumbnailUrl: true },
      }),
      this.prisma.festival.findMany({
        where: activeWhere,
        select: { heroImage: true, bannerImage: true, icon: true },
      }),
      this.prisma.festivalGallery.findMany({
        where: {
          deletedAt: null,
          status: Status.ACTIVE,
          festival: activeWhere,
        },
        select: { fileUrl: true, thumbnailUrl: true },
      }),
      this.prisma.deity.findMany({
        where: activeWhere,
        select: { image: true, icon: true },
      }),
      this.prisma.deityAvatar.findMany({
        where: {
          deletedAt: null,
          status: Status.ACTIVE,
          deity: activeWhere,
        },
        select: { image: true },
      }),
      this.prisma.deitySymbol.findMany({
        where: {
          deletedAt: null,
          status: Status.ACTIVE,
          deity: activeWhere,
        },
        select: { image: true },
      }),
      this.prisma.contentMedia.findMany({
        where: {
          deletedAt: null,
          status: Status.ACTIVE,
          content: publishedContentWhere,
        },
        select: { fileUrl: true, thumbnailUrl: true },
      }),
      this.prisma.contentSeo.findMany({
        where: {
          content: publishedContentWhere,
        },
        select: { ogImage: true, twitterImage: true },
      }),
      this.prisma.contentAttachment.findMany({
        where: {
          deletedAt: null,
          status: Status.ACTIVE,
          content: publishedContentWhere,
        },
        select: { fileUrl: true },
      }),
    ]);

    for (const record of temples) {
      this.addPathFromUrl(paths, record.ogImage);
    }

    for (const record of templeMedia) {
      this.addPathFromUrl(paths, record.fileUrl);
      this.addPathFromUrl(paths, record.thumbnailUrl);
    }

    for (const record of festivals) {
      this.addPathFromUrl(paths, record.heroImage);
      this.addPathFromUrl(paths, record.bannerImage);
      this.addPathFromUrl(paths, record.icon);
    }

    for (const record of festivalGalleries) {
      this.addPathFromUrl(paths, record.fileUrl);
      this.addPathFromUrl(paths, record.thumbnailUrl);
    }

    for (const record of deities) {
      this.addPathFromUrl(paths, record.image);
      this.addPathFromUrl(paths, record.icon);
    }

    for (const record of deityAvatars) {
      this.addPathFromUrl(paths, record.image);
    }

    for (const record of deitySymbols) {
      this.addPathFromUrl(paths, record.image);
    }

    for (const record of contentMedia) {
      this.addPathFromUrl(paths, record.fileUrl);
      this.addPathFromUrl(paths, record.thumbnailUrl);
    }

    for (const record of contentSeo) {
      this.addPathFromUrl(paths, record.ogImage);
      this.addPathFromUrl(paths, record.twitterImage);
    }

    for (const record of contentAttachments) {
      this.addPathFromUrl(paths, record.fileUrl);
    }

    return paths;
  }

  private addPathFromUrl(paths: Set<string>, value: string | null | undefined) {
    const storagePath = extractStoragePath(value);
    if (storagePath) {
      paths.add(storagePath);
    }
  }
}

export function extractStoragePath(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/\\/g, "/").trim();
  const folderPattern = STORAGE_FOLDERS.join("|");
  const match = normalized.match(
    new RegExp(`(?:^|/uploads/|uploads/)((?:${folderPattern})/[^/?#\\s/]+)(?:$|[?#])`, "i"),
  );

  if (!match?.[1] || match[1].includes("..") || match[1].includes("\0")) {
    return null;
  }

  const segments = match[1].split("/");
  if (segments.length !== 2 || !segments[0] || !segments[1] || segments[1].includes("/")) {
    return null;
  }

  return `${segments[0]}/${segments[1]}`;
}
