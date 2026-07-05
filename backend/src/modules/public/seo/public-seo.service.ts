import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma/prisma.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../../common/services/api-response.service";
import { createPaginationMeta, getPagination } from "../../../common/utils/pagination.util";
import {
  buildFieldFilters,
  buildOrderBy,
  buildSearchFilter,
} from "../../../common/utils/query.util";
import { PublicQueryDto } from "../common/public-query.dto";
import { publicFindBySlug } from "../common/public-response.util";

@Injectable()
export class PublicSeoService {
  private readonly redirectReadOptions = {
    allowedFilterFields: ["statusCode"],
    allowedSortFields: ["fromPath", "toPath", "statusCode", "createdAt", "updatedAt"],
    searchableFields: ["fromPath", "toPath"],
  };

  constructor(private readonly prisma: PrismaService) {}

  async findRedirects(query: PublicQueryDto) {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const allowedFilters = this.filterPublicFields(query.filters, this.redirectReadOptions.allowedFilterFields);
    const where = {
      isActive: true,
      ...buildSearchFilter(query.search, this.redirectReadOptions.searchableFields),
      ...buildFieldFilters(allowedFilters),
    };

    const [items, total] = await Promise.all([
      this.prisma.seoRedirect.findMany({
        where,
        orderBy: buildOrderBy(this.resolveSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
        select: {
          id: true,
          fromPath: true,
          toPath: true,
          statusCode: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.seoRedirect.count({ where }),
    ]);

    return createPaginatedResponse(items, createPaginationMeta(page, limit, total));
  }

  findLandingPageBySlug(slug: string) {
    return publicFindBySlug(
      this.prisma.seoLandingPage,
      slug,
      { isActive: true },
      "SEO landing page fetched successfully",
    );
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
    if (!sortBy || !this.redirectReadOptions.allowedSortFields.includes(sortBy)) {
      return undefined;
    }
    return sortBy;
  }
}
