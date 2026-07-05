import { Injectable } from "@nestjs/common";
import { Status, UserReview } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { createPaginationMeta, getPagination } from "../../common/utils/pagination.util";
import {
  buildFieldFilters,
  buildOrderBy,
  buildSearchFilter,
  buildStatusFilter,
} from "../../common/utils/query.util";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateUserReviewDto, UserReviewQueryDto, UpdateUserReviewDto } from "./dto/user-review.dto";

type UserReviewResponse = Omit<UserReview, "deletedAt">;

@Injectable()
export class UserReviewsService extends BaseCrudService<UserReview> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(
      prisma.userReview,
      ["title", "review"],
      ["userId", "entityType", "entityId", "rating", "isVerified", "status", "createdAt", "updatedAt"],
      ["userId", "entityType", "entityId", "rating", "isVerified", "status"],
    );
  }

  async findAll(query: UserReviewQueryDto) {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.buildWhere({
      ...buildSearchFilter(query.search, ["title", "review"]),
      ...buildStatusFilter(query.status),
      ...buildFieldFilters(this.filterQueryFields(query.filters)),
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...(query.entityId ? { entityId: query.entityId } : {}),
      ...(query.isVerified === true ? { isVerified: true } : query.isVerified === false ? { isVerified: false } : {}),
      deletedAt: null,
    });

    const [items, total] = await Promise.all([
      this.prisma.userReview.findMany({
        where,
        orderBy: buildOrderBy(this.resolveSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
      }),
      this.prisma.userReview.count({ where }),
    ]);

    return createPaginatedResponse(
      items.map((item) => this.toResponse(item)),
      createPaginationMeta(page, limit, total),
    );
  }

  async findById(id: string) {
    return createApiResponse(
      "User review fetched successfully",
      this.toResponse(await super.findOne(id)),
    );
  }

  async createReview(dto: CreateUserReviewDto) {
    await this.relationValidation.validateForeignKeys({ userId: dto.userId });
    await this.relationValidation.validateUserEntity(dto.entityType, dto.entityId);

    const item = await super.create({
      ...dto,
      isVerified: dto.isVerified ?? false,
      status: dto.status ?? Status.ACTIVE,
    });

    return createApiResponse("User review created successfully", this.toResponse(item));
  }

  async updateReview(id: string, dto: UpdateUserReviewDto) {
    const existing = await super.findOne(id);
    const userId = dto.userId ?? existing.userId;
    const entityType = dto.entityType ?? existing.entityType;
    const entityId = dto.entityId ?? existing.entityId;

    await this.relationValidation.validateForeignKeys({ userId });
    await this.relationValidation.validateUserEntity(entityType, entityId);

    const item = await super.update(id, dto);
    return createApiResponse("User review updated successfully", this.toResponse(item));
  }

  async deleteReview(id: string) {
    const item = await super.delete(id);
    return createApiResponse("User review deleted successfully", this.toResponse(item));
  }

  async restoreReview(id: string) {
    const item = await super.restore(id);
    return createApiResponse("User review restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status) {
    const item = await super.update(id, { status });
    return createApiResponse("User review status updated successfully", this.toResponse(item));
  }

  private toResponse(item: UserReview): UserReviewResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }

  private filterQueryFields(filters?: Record<string, string | number | boolean>) {
    if (!filters) return filters;
    const allowed = new Set(["userId", "entityType", "entityId", "rating", "isVerified", "status"]);
    return Object.fromEntries(
      Object.entries(filters).filter(([key]) => allowed.has(key)),
    ) as Record<string, string | number | boolean>;
  }

  private buildWhere(where: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(where).filter(([, value]) => value !== undefined),
    );
  }

  private resolveSortBy(sortBy?: string) {
    if (!sortBy) return undefined;
    const allowed = new Set([
      "userId",
      "entityType",
      "entityId",
      "rating",
      "isVerified",
      "status",
      "createdAt",
      "updatedAt",
    ]);
    return allowed.has(sortBy) ? sortBy : undefined;
  }
}
