import { ConflictException, Injectable } from "@nestjs/common";
import { Language, SeoLandingPage } from "@prisma/client";
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
import {
  CreateSeoLandingPageDto,
  SeoLandingPageQueryDto,
  UpdateSeoLandingPageDto,
} from "./dto/seo-landing-page.dto";

@Injectable()
export class SeoLandingPagesService extends BaseCrudService<SeoLandingPage> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.seoLandingPage,
      ["slug", "title", "metaTitle", "metaDescription", "content"],
      ["slug", "language", "title", "isActive", "createdAt", "updatedAt"],
      ["slug", "language", "isActive"],
    );
  }

  async findAll(query: SeoLandingPageQueryDto) {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.buildWhere({
      ...buildSearchFilter(query.search, ["slug", "title", "metaTitle", "metaDescription", "content"]),
      ...buildFieldFilters(this.filterQueryFields(query.filters)),
      ...(query.language ? { language: query.language } : {}),
      ...(query.isActive === true ? { isActive: true } : query.isActive === false ? { isActive: false } : {}),
    });

    const [items, total] = await Promise.all([
      this.prisma.seoLandingPage.findMany({
        where,
        orderBy: buildOrderBy(this.resolveSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
      }),
      this.prisma.seoLandingPage.count({ where }),
    ]);

    return createPaginatedResponse(items, createPaginationMeta(page, limit, total));
  }

  async findById(id: string) {
    return createApiResponse("SEO landing page fetched successfully", await super.findOne(id));
  }

  async createLandingPage(dto: CreateSeoLandingPageDto) {
    await this.ensureUniqueSlug(dto.slug);
    const item = await super.create({
      ...dto,
      language: dto.language ?? Language.en,
      isActive: dto.isActive ?? true,
    });
    return createApiResponse("SEO landing page created successfully", item);
  }

  async updateLandingPage(id: string, dto: UpdateSeoLandingPageDto) {
    if (dto.slug) {
      await this.ensureUniqueSlug(dto.slug, id);
    }
    const item = await super.update(id, dto);
    return createApiResponse("SEO landing page updated successfully", item);
  }

  async deleteLandingPage(id: string) {
    await super.findOne(id);
    const item = await this.prisma.seoLandingPage.delete({ where: { id } });
    return createApiResponse("SEO landing page deleted successfully", item);
  }

  private async ensureUniqueSlug(slug: string, excludeId?: string) {
    const existing = await this.prisma.seoLandingPage.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    });
    if (existing) {
      throw new ConflictException("SEO landing page slug already exists");
    }
  }

  private filterQueryFields(filters?: Record<string, string | number | boolean>) {
    if (!filters) return filters;
    const allowed = new Set(["slug", "language", "isActive"]);
    return Object.fromEntries(
      Object.entries(filters).filter(([key]) => allowed.has(key)),
    ) as Record<string, string | number | boolean>;
  }

  private buildWhere(where: Record<string, unknown>) {
    return Object.fromEntries(Object.entries(where).filter(([, value]) => value !== undefined));
  }

  private resolveSortBy(sortBy?: string) {
    if (!sortBy) return undefined;
    const allowed = new Set(["slug", "language", "title", "isActive", "createdAt", "updatedAt"]);
    return allowed.has(sortBy) ? sortBy : undefined;
  }
}
