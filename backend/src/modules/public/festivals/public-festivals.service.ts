import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma/prisma.service";
import { PublicQueryDto } from "../common/public-query.dto";
import { activeStatusWhere, publicFindBySlug, publicFindMany } from "../common/public-response.util";

@Injectable()
export class PublicFestivalsService {
  private readonly readOptions = {
    allowedFilterFields: [
      "festivalType",
      "isFeatured",
      "isPopular",
      "isNational",
      "isRegional",
      "isInternational",
      "isPublicHoliday",
    ],
    allowedSortFields: [
      "name",
      "displayName",
      "slug",
      "festivalType",
      "importanceLevel",
      "isFeatured",
      "isPopular",
      "sortOrder",
      "createdAt",
    ],
    searchableFields: [
      "name",
      "displayName",
      "slug",
      "alternateNames",
      "metaTitle",
      "festivalType",
    ],
  };

  constructor(private readonly prisma: PrismaService) {}

  findAll(query: PublicQueryDto) {
    return publicFindMany(this.prisma.festival, query, activeStatusWhere(), this.readOptions);
  }

  findBySlug(slug: string) {
    return publicFindBySlug(
      this.prisma.festival,
      slug,
      activeStatusWhere(),
      "Festival fetched successfully",
    );
  }
}
