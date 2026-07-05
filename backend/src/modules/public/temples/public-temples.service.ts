import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma/prisma.service";
import { PublicQueryDto } from "../common/public-query.dto";
import {
  activeStatusWhere,
  publicFindBySlug,
  publicFindMany,
  publishedAtWhere,
} from "../common/public-response.util";

@Injectable()
export class PublicTemplesService {
  private readonly readOptions = {
    allowedFilterFields: [
      "countryId",
      "stateId",
      "cityId",
      "areaId",
      "featured",
      "popular",
      "verified",
      "parkingAvailable",
      "wheelchairAccessible",
    ],
    allowedSortFields: [
      "name",
      "displayName",
      "slug",
      "featured",
      "popular",
      "verified",
      "viewCount",
      "ratingAverage",
      "publishedAt",
      "sortOrder",
      "createdAt",
    ],
    searchableFields: [
      "name",
      "displayName",
      "canonicalName",
      "slug",
      "shortDescription",
      "description",
    ],
  };

  constructor(private readonly prisma: PrismaService) {}

  findAll(query: PublicQueryDto) {
    return publicFindMany(
      this.prisma.temple,
      query,
      {
        ...activeStatusWhere(),
        ...publishedAtWhere(),
        isSearchable: true,
      },
      this.readOptions,
    );
  }

  findBySlug(slug: string) {
    return publicFindBySlug(
      this.prisma.temple,
      slug,
      {
        ...activeStatusWhere(),
        ...publishedAtWhere(),
        isSearchable: true,
      },
      "Temple fetched successfully",
    );
  }
}
