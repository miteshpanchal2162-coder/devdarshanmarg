import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Status, UserComment, UserEntityType } from "@prisma/client";
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
import {
  CreateUserCommentDto,
  UpdateUserCommentDto,
  UserCommentQueryDto,
} from "./dto/user-comment.dto";

type UserCommentResponse = Omit<UserComment, "deletedAt">;

@Injectable()
export class UserCommentsService extends BaseCrudService<UserComment> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(
      prisma.userComment,
      ["comment"],
      ["userId", "entityType", "entityId", "parentCommentId", "isEdited", "status", "createdAt", "updatedAt"],
      ["userId", "entityType", "entityId", "parentCommentId", "isEdited", "status"],
    );
  }

  async findAll(query: UserCommentQueryDto) {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.buildWhere({
      ...buildSearchFilter(query.search, ["comment"]),
      ...buildStatusFilter(query.status),
      ...buildFieldFilters(this.filterQueryFields(query.filters)),
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...(query.entityId ? { entityId: query.entityId } : {}),
      ...(query.parentCommentId ? { parentCommentId: query.parentCommentId } : {}),
      ...(query.isEdited === true ? { isEdited: true } : query.isEdited === false ? { isEdited: false } : {}),
      deletedAt: null,
    });

    const [items, total] = await Promise.all([
      this.prisma.userComment.findMany({
        where,
        orderBy: buildOrderBy(this.resolveSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
      }),
      this.prisma.userComment.count({ where }),
    ]);

    return createPaginatedResponse(
      items.map((item) => this.toResponse(item)),
      createPaginationMeta(page, limit, total),
    );
  }

  async findById(id: string) {
    return createApiResponse(
      "User comment fetched successfully",
      this.toResponse(await super.findOne(id)),
    );
  }

  async createComment(dto: CreateUserCommentDto) {
    await this.relationValidation.validateForeignKeys({ userId: dto.userId });
    await this.relationValidation.validateUserEntity(dto.entityType, dto.entityId);

    if (dto.parentCommentId) {
      await this.validateParentComment(dto.parentCommentId, dto.entityType, dto.entityId);
    }

    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      isEdited: false,
    });

    return createApiResponse("User comment created successfully", this.toResponse(item));
  }

  async updateComment(id: string, dto: UpdateUserCommentDto) {
    const existing = await super.findOne(id);
    const userId = dto.userId ?? existing.userId;
    const entityType = dto.entityType ?? existing.entityType;
    const entityId = dto.entityId ?? existing.entityId;
    const parentCommentId = dto.parentCommentId ?? existing.parentCommentId ?? undefined;

    await this.relationValidation.validateForeignKeys({ userId });
    await this.relationValidation.validateUserEntity(entityType, entityId);

    if (parentCommentId) {
      await this.validateParentComment(parentCommentId, entityType, entityId, id);
    }

    const item = await super.update(id, {
      ...dto,
      isEdited: true,
    });

    return createApiResponse("User comment updated successfully", this.toResponse(item));
  }

  async deleteComment(id: string) {
    const item = await super.delete(id);
    return createApiResponse("User comment deleted successfully", this.toResponse(item));
  }

  async restoreComment(id: string) {
    const item = await super.restore(id);
    return createApiResponse("User comment restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status) {
    const item = await super.update(id, { status });
    return createApiResponse("User comment status updated successfully", this.toResponse(item));
  }

  private async validateParentComment(
    parentCommentId: string,
    entityType: UserEntityType,
    entityId: string,
    excludeId?: string,
  ) {
    if (excludeId && parentCommentId === excludeId) {
      throw new BadRequestException("Comment cannot be its own parent");
    }

    const parent = await this.prisma.userComment.findFirst({
      where: { id: parentCommentId, deletedAt: null },
    });

    if (!parent) {
      throw new NotFoundException("Parent comment not found");
    }

    if (parent.entityType !== entityType || parent.entityId !== entityId) {
      throw new BadRequestException("Parent comment must belong to the same entity");
    }
  }

  private toResponse(item: UserComment): UserCommentResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }

  private filterQueryFields(filters?: Record<string, string | number | boolean>) {
    if (!filters) return filters;
    const allowed = new Set([
      "userId",
      "entityType",
      "entityId",
      "parentCommentId",
      "isEdited",
      "status",
    ]);
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
      "parentCommentId",
      "isEdited",
      "status",
      "createdAt",
      "updatedAt",
    ]);
    return allowed.has(sortBy) ? sortBy : undefined;
  }
}
