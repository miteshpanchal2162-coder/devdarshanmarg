import { ConflictException, Injectable } from "@nestjs/common";
import { UserFavorite, UserEntityType } from "@prisma/client";
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
import { CreateUserFavoriteDto, UserFavoriteQueryDto } from "./dto/user-favorite.dto";
import { UpdateUserFavoriteDto } from "./dto/update-user-favorite.dto";

@Injectable()
export class UserFavoritesService extends BaseCrudService<UserFavorite> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(
      prisma.userFavorite,
      ["entityId"],
      ["userId", "entityType", "entityId", "createdAt"],
      ["userId", "entityType", "entityId"],
    );
  }

  async findAll(query: UserFavoriteQueryDto) {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.buildWhere({
      ...buildSearchFilter(query.search, ["entityId"]),
      ...buildFieldFilters(this.filterQueryFields(query.filters)),
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...(query.entityId ? { entityId: query.entityId } : {}),
    });

    const [items, total] = await Promise.all([
      this.prisma.userFavorite.findMany({
        where,
        orderBy: buildOrderBy(this.resolveSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
      }),
      this.prisma.userFavorite.count({ where }),
    ]);

    return createPaginatedResponse(items, createPaginationMeta(page, limit, total));
  }

  async findById(id: string) {
    return createApiResponse("User favorite fetched successfully", await super.findOne(id));
  }

  async createFavorite(dto: CreateUserFavoriteDto) {
    await this.relationValidation.validateForeignKeys({ userId: dto.userId });
    await this.relationValidation.validateUserEntity(dto.entityType, dto.entityId);
    await this.ensureUniqueFavorite(dto.userId, dto.entityType, dto.entityId);

    const item = await super.create(dto);
    return createApiResponse("User favorite created successfully", item);
  }

  async updateFavorite(id: string, dto: UpdateUserFavoriteDto) {
    const existing = await super.findOne(id);
    const userId = dto.userId ?? existing.userId;
    const entityType = dto.entityType ?? existing.entityType;
    const entityId = dto.entityId ?? existing.entityId;

    await this.relationValidation.validateForeignKeys({ userId });
    await this.relationValidation.validateUserEntity(entityType, entityId);
    await this.ensureUniqueFavorite(userId, entityType, entityId, id);

    const item = await super.update(id, dto);
    return createApiResponse("User favorite updated successfully", item);
  }

  async deleteFavorite(id: string) {
    await super.findOne(id);
    const item = await this.prisma.userFavorite.delete({ where: { id } });
    return createApiResponse("User favorite deleted successfully", item);
  }

  private async ensureUniqueFavorite(
    userId: string,
    entityType: UserEntityType,
    entityId: string,
    excludeId?: string,
  ) {
    const existing = await this.prisma.userFavorite.findFirst({
      where: {
        userId,
        entityType,
        entityId,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (existing) {
      throw new ConflictException("Favorite already exists for this user and entity");
    }
  }

  private filterQueryFields(filters?: Record<string, string | number | boolean>) {
    if (!filters) return filters;
    const allowed = new Set(["userId", "entityType", "entityId"]);
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
    const allowed = new Set(["userId", "entityType", "entityId", "createdAt"]);
    return allowed.has(sortBy) ? sortBy : undefined;
  }
}
