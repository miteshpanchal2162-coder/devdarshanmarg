import { ConflictException, Injectable } from "@nestjs/common";
import { UserEntityType, UserRating } from "@prisma/client";
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
} from "../../common/utils/query.util";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateUserRatingDto, UserRatingQueryDto } from "./dto/user-rating.dto";
import { UpdateUserRatingDto } from "./dto/update-user-rating.dto";

@Injectable()
export class UserRatingsService extends BaseCrudService<UserRating> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(
      prisma.userRating,
      ["entityId"],
      ["userId", "entityType", "entityId", "rating", "createdAt", "updatedAt"],
      ["userId", "entityType", "entityId", "rating"],
    );
  }

  async findAll(query: UserRatingQueryDto) {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.buildWhere({
      ...buildSearchFilter(query.search, ["entityId"]),
      ...buildFieldFilters(this.filterQueryFields(query.filters)),
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...(query.entityId ? { entityId: query.entityId } : {}),
    });

    const [items, total] = await Promise.all([
      this.prisma.userRating.findMany({
        where,
        orderBy: buildOrderBy(this.resolveSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
      }),
      this.prisma.userRating.count({ where }),
    ]);

    return createPaginatedResponse(items, createPaginationMeta(page, limit, total));
  }

  async findById(id: string) {
    return createApiResponse("User rating fetched successfully", await super.findOne(id));
  }

  async createRating(dto: CreateUserRatingDto) {
    await this.relationValidation.validateForeignKeys({ userId: dto.userId });
    await this.relationValidation.validateUserEntity(dto.entityType, dto.entityId);
    await this.ensureUniqueRating(dto.userId, dto.entityType, dto.entityId);

    const item = await super.create(dto);
    return createApiResponse("User rating created successfully", item);
  }

  async updateRating(id: string, dto: UpdateUserRatingDto) {
    const existing = await super.findOne(id);
    const userId = dto.userId ?? existing.userId;
    const entityType = dto.entityType ?? existing.entityType;
    const entityId = dto.entityId ?? existing.entityId;

    await this.relationValidation.validateForeignKeys({ userId });
    await this.relationValidation.validateUserEntity(entityType, entityId);
    await this.ensureUniqueRating(userId, entityType, entityId, id);

    const item = await super.update(id, dto);
    return createApiResponse("User rating updated successfully", item);
  }

  async deleteRating(id: string) {
    await super.findOne(id);
    const item = await this.prisma.userRating.delete({ where: { id } });
    return createApiResponse("User rating deleted successfully", item);
  }

  private async ensureUniqueRating(
    userId: string,
    entityType: UserEntityType,
    entityId: string,
    excludeId?: string,
  ) {
    const existing = await this.prisma.userRating.findFirst({
      where: {
        userId,
        entityType,
        entityId,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (existing) {
      throw new ConflictException("Rating already exists for this user and entity");
    }
  }

  private filterQueryFields(filters?: Record<string, string | number | boolean>) {
    if (!filters) return filters;
    const allowed = new Set(["userId", "entityType", "entityId", "rating"]);
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
    const allowed = new Set(["userId", "entityType", "entityId", "rating", "createdAt", "updatedAt"]);
    return allowed.has(sortBy) ? sortBy : undefined;
  }
}
