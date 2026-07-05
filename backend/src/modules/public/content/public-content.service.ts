import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma/prisma.service";
import { PublicQueryDto } from "../common/public-query.dto";
import {
  activeStatusWhere,
  legacyPublishedWhere,
  publicFindBySlug,
  publicFindMany,
  publishedAtWhere,
} from "../common/public-response.util";

@Injectable()
export class PublicContentService {
  private readonly contentItemReadOptions = {
    allowedFilterFields: ["contentTypeId", "categoryId", "isFeatured", "isPopular"],
    allowedSortFields: [
      "title",
      "slug",
      "isFeatured",
      "isPopular",
      "publishedAt",
      "sortOrder",
      "createdAt",
    ],
    searchableFields: ["title", "slug", "shortDescription"],
  };

  private readonly legacyContentReadOptions = {
    allowedFilterFields: ["contentTypeId"],
    allowedSortFields: ["slug", "publishedAt", "createdAt", "updatedAt"],
    searchableFields: ["slug"],
  };

  constructor(private readonly prisma: PrismaService) {}

  findAllItems(query: PublicQueryDto) {
    return publicFindMany(
      this.prisma.contentItem,
      query,
      {
        ...activeStatusWhere(),
        ...publishedAtWhere(),
      },
      this.contentItemReadOptions,
    );
  }

  findItemBySlug(slug: string) {
    return publicFindBySlug(
      this.prisma.contentItem,
      slug,
      {
        ...activeStatusWhere(),
        ...publishedAtWhere(),
      },
      "Content item fetched successfully",
    );
  }

  findAllLegacyPages(query: PublicQueryDto) {
    return publicFindMany(
      this.prisma.content,
      query,
      legacyPublishedWhere(),
      this.legacyContentReadOptions,
    );
  }

  findLegacyPageBySlug(slug: string) {
    return publicFindBySlug(
      this.prisma.content,
      slug,
      legacyPublishedWhere(),
      "Content page fetched successfully",
    );
  }
}
