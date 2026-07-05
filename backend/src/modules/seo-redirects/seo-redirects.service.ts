import { ConflictException, Injectable } from "@nestjs/common";
import { SeoRedirect } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { createPaginationMeta, getPagination } from "../../common/utils/pagination.util";
import {
  buildFieldFilters,
  buildOrderBy,
  buildSearchFilter,
} from "../../common/utils/query.util";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateSeoRedirectDto, SeoRedirectQueryDto, UpdateSeoRedirectDto } from "./dto/seo-redirect.dto";

@Injectable()
export class SeoRedirectsService extends BaseCrudService<SeoRedirect> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.seoRedirect,
      ["fromPath", "toPath"],
      ["fromPath", "toPath", "statusCode", "isActive", "createdAt", "updatedAt"],
      ["fromPath", "isActive", "statusCode"],
    );
  }

  async findAll(query: SeoRedirectQueryDto) {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.buildWhere({
      ...buildSearchFilter(query.search, ["fromPath", "toPath"]),
      ...buildFieldFilters(this.filterQueryFields(query.filters)),
      ...(query.isActive === true ? { isActive: true } : query.isActive === false ? { isActive: false } : {}),
    });

    const [items, total] = await Promise.all([
      this.prisma.seoRedirect.findMany({
        where,
        orderBy: buildOrderBy(this.resolveSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
      }),
      this.prisma.seoRedirect.count({ where }),
    ]);

    return createPaginatedResponse(items, createPaginationMeta(page, limit, total));
  }

  async findById(id: string) {
    return createApiResponse("SEO redirect fetched successfully", await super.findOne(id));
  }

  async createRedirect(dto: CreateSeoRedirectDto) {
    await this.ensureUniqueFromPath(dto.fromPath);
    const item = await super.create({
      ...dto,
      statusCode: dto.statusCode ?? 301,
      isActive: dto.isActive ?? true,
    });
    return createApiResponse("SEO redirect created successfully", item);
  }

  async updateRedirect(id: string, dto: UpdateSeoRedirectDto) {
    if (dto.fromPath) {
      await this.ensureUniqueFromPath(dto.fromPath, id);
    }
    const item = await super.update(id, dto);
    return createApiResponse("SEO redirect updated successfully", item);
  }

  async deleteRedirect(id: string) {
    await super.findOne(id);
    const item = await this.prisma.seoRedirect.delete({ where: { id } });
    return createApiResponse("SEO redirect deleted successfully", item);
  }

  private async ensureUniqueFromPath(fromPath: string, excludeId?: string) {
    const existing = await this.prisma.seoRedirect.findFirst({
      where: { fromPath, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    });
    if (existing) {
      throw new ConflictException("SEO redirect from path already exists");
    }
  }

  private filterQueryFields(filters?: Record<string, string | number | boolean>) {
    if (!filters) return filters;
    const allowed = new Set(["fromPath", "isActive", "statusCode"]);
    return Object.fromEntries(
      Object.entries(filters).filter(([key]) => allowed.has(key)),
    ) as Record<string, string | number | boolean>;
  }

  private buildWhere(where: Record<string, unknown>) {
    return Object.fromEntries(Object.entries(where).filter(([, value]) => value !== undefined));
  }

  private resolveSortBy(sortBy?: string) {
    if (!sortBy) return undefined;
    const allowed = new Set(["fromPath", "toPath", "statusCode", "isActive", "createdAt", "updatedAt"]);
    return allowed.has(sortBy) ? sortBy : undefined;
  }
}
