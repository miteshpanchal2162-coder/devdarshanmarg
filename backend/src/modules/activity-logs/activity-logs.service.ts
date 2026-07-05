import { Injectable } from "@nestjs/common";
import { ActivityLog, Prisma } from "@prisma/client";
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
import { CreateActivityLogDto } from "./dto/create-activity-log.dto";
import { ActivityLogQueryDto } from "./dto/activity-log-query.dto";

@Injectable()
export class ActivityLogsService extends BaseCrudService<ActivityLog> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(
      prisma.activityLog,
      ["action", "entityType", "entityId", "ipAddress"],
      ["action", "entityType", "entityId", "ipAddress", "userId", "createdAt"],
      ["userId", "action", "entityType"],
    );
  }

  async findAll(query: ActivityLogQueryDto) {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.buildWhere({
      ...buildSearchFilter(query.search, ["action", "entityType", "entityId", "ipAddress"]),
      ...buildFieldFilters(this.filterQueryFields(query.filters)),
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.action ? { action: query.action } : {}),
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...this.buildDateRangeFilter(query),
    });

    const [items, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        orderBy: buildOrderBy(this.resolveSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    return createPaginatedResponse(items, createPaginationMeta(page, limit, total));
  }

  async findById(id: string) {
    return createApiResponse("Activity log fetched successfully", await super.findOne(id));
  }

  async createLog(dto: CreateActivityLogDto) {
    if (dto.userId) {
      await this.relationValidation.validateForeignKeys({ userId: dto.userId });
    }

    const item = await super.create({
      userId: dto.userId,
      action: dto.action,
      entityType: dto.entityType,
      entityId: dto.entityId,
      details: dto.details,
      ipAddress: dto.ipAddress,
    });

    return createApiResponse("Activity log created successfully", item);
  }

  async recordActivity(input: {
    action: string;
    details?: Record<string, unknown>;
    entityId?: string;
    entityType: string;
    ipAddress?: string;
    userId?: string;
  }) {
    try {
      await this.prisma.activityLog.create({
        data: {
          userId: input.userId,
          action: input.action,
          entityType: input.entityType,
          entityId: input.entityId,
          details: input.details as Prisma.InputJsonValue | undefined,
          ipAddress: input.ipAddress,
        },
      });
    } catch {
      // Automatic logging must never break the request pipeline.
    }
  }

  private buildDateRangeFilter(query: ActivityLogQueryDto) {
    if (!query.createdFrom && !query.createdTo) {
      return {};
    }

    return {
      createdAt: {
        ...(query.createdFrom ? { gte: new Date(query.createdFrom) } : {}),
        ...(query.createdTo ? { lte: new Date(query.createdTo) } : {}),
      },
    };
  }

  private filterQueryFields(filters?: Record<string, string | number | boolean>) {
    if (!filters) return filters;
    const allowed = new Set(["userId", "action", "entityType"]);
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
      "action",
      "entityType",
      "entityId",
      "ipAddress",
      "userId",
      "createdAt",
    ]);
    return allowed.has(sortBy) ? sortBy : undefined;
  }
}
