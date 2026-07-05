import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma/prisma.service";
import { PublicQueryDto } from "../common/public-query.dto";
import { activeStatusWhere, publicFindBySlug, publicFindMany } from "../common/public-response.util";

@Injectable()
export class PublicDeitiesService {
  private readonly readOptions = {
    allowedFilterFields: ["deityTypeId", "isFeatured", "isPopular"],
    allowedSortFields: [
      "name",
      "displayName",
      "slug",
      "shortName",
      "isFeatured",
      "isPopular",
      "sortOrder",
      "createdAt",
    ],
    searchableFields: ["name", "displayName", "slug", "shortName", "alternateNames", "seoTitle"],
  };

  constructor(private readonly prisma: PrismaService) {}

  findAll(query: PublicQueryDto) {
    return publicFindMany(this.prisma.deity, query, activeStatusWhere(), this.readOptions);
  }

  findBySlug(slug: string) {
    return publicFindBySlug(
      this.prisma.deity,
      slug,
      activeStatusWhere(),
      "Deity fetched successfully",
    );
  }
}
