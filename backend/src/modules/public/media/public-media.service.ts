import {
  Injectable,
  NotFoundException,
  StreamableFile,
} from "@nestjs/common";
import { createReadStream, existsSync } from "fs";
import { MediaLibrary } from "@prisma/client";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../../common/services/api-response.service";
import { StorageService } from "../../../common/storage/storage.service";
import { createPaginationMeta, getPagination } from "../../../common/utils/pagination.util";
import {
  buildFieldFilters,
  buildOrderBy,
  buildSearchFilter,
} from "../../../common/utils/query.util";
import { PrismaService } from "../../../database/prisma/prisma.service";
import { PublicQueryDto } from "../common/public-query.dto";
import { mapPublicMedia } from "../common/public-media.mapper";
import { PublicMediaVisibilityService } from "./public-media-visibility.service";

@Injectable()
export class PublicMediaService {
  private readonly readOptions = {
    allowedFilterFields: ["mimeType"],
    allowedSortFields: [
      "filename",
      "originalName",
      "mimeType",
      "fileSize",
      "createdAt",
      "updatedAt",
    ],
    searchableFields: ["filename", "originalName", "mimeType", "altText"],
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly visibilityService: PublicMediaVisibilityService,
    private readonly storageService: StorageService,
  ) {}

  async findAll(query: PublicQueryDto) {
    const visiblePaths = await this.visibilityService.getVisibleStoragePaths();
    if (visiblePaths.size === 0) {
      const { page, limit } = getPagination(query.page, query.limit);
      return createPaginatedResponse([], createPaginationMeta(page, limit, 0));
    }

    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const allowedFilters = this.filterPublicFields(query.filters, this.readOptions.allowedFilterFields);
    const where = {
      storagePath: { in: [...visiblePaths] },
      ...buildSearchFilter(query.search, this.readOptions.searchableFields),
      ...buildFieldFilters(allowedFilters),
    };

    const [items, total] = await Promise.all([
      this.prisma.mediaLibrary.findMany({
        where,
        orderBy: buildOrderBy(this.resolveSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
      }),
      this.prisma.mediaLibrary.count({ where }),
    ]);

    return createPaginatedResponse(
      items.map((item) => mapPublicMedia(item)),
      createPaginationMeta(page, limit, total),
    );
  }

  async findById(id: string) {
    const item = await this.getVisibleMediaOrThrow(id);
    return createApiResponse("Media item fetched successfully", mapPublicMedia(item));
  }

  async streamFile(id: string) {
    const item = await this.getVisibleMediaOrThrow(id);
    const absolutePath = this.storageService.getAbsolutePath(item.storagePath);

    if (!existsSync(absolutePath)) {
      throw new NotFoundException("Media file not found");
    }

    const stream = createReadStream(absolutePath);
    return new StreamableFile(stream, {
      type: item.mimeType,
      disposition: `inline; filename="${sanitizeContentDispositionFilename(item.originalName)}"`,
    });
  }

  private async getVisibleMediaOrThrow(id: string): Promise<MediaLibrary> {
    const item = await this.prisma.mediaLibrary.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException("Media item not found");
    }

    const isVisible = await this.visibilityService.isStoragePathPubliclyVisible(item.storagePath);
    if (!isVisible) {
      throw new NotFoundException("Media item not found");
    }

    return item;
  }

  private filterPublicFields(
    filters?: Record<string, string | number | boolean>,
    allowedFields?: string[],
  ) {
    if (!filters || !allowedFields?.length) return filters;
    const allowed = new Set(allowedFields);
    return Object.fromEntries(Object.entries(filters).filter(([key]) => allowed.has(key))) as Record<
      string,
      string | number | boolean
    >;
  }

  private resolveSortBy(sortBy: string | undefined) {
    if (!sortBy || !this.readOptions.allowedSortFields.includes(sortBy)) {
      return undefined;
    }
    return sortBy;
  }
}

function sanitizeContentDispositionFilename(filename: string) {
  return filename.replace(/[\r\n"]/g, "").slice(0, 255);
}
