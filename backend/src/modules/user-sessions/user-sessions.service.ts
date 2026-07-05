import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserSession, Prisma } from "@prisma/client";
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
import {
  CreateUserSessionDto,
  SessionMetadata,
  UserSessionQueryDto,
} from "./dto/user-session.dto";
import { UpdateUserSessionDto } from "./dto/update-user-session.dto";

type TransactionClient = Prisma.TransactionClient;

@Injectable()
export class UserSessionsService extends BaseCrudService<UserSession> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(
      prisma.userSession,
      ["deviceName", "deviceType", "browser", "os", "ipAddress", "userAgent"],
      [
        "deviceName",
        "deviceType",
        "browser",
        "os",
        "ipAddress",
        "loginTime",
        "lastActivity",
        "logoutTime",
        "isActive",
        "createdAt",
        "updatedAt",
      ],
      ["userId", "deviceName", "deviceType", "browser", "os", "ipAddress", "isActive"],
    );
  }

  async findAll(query: UserSessionQueryDto) {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.buildWhere({
      ...buildSearchFilter(query.search, this.searchableFields),
      ...buildFieldFilters(this.filterQueryFields(query.filters)),
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.isActive === true ? { isActive: true } : query.isActive === false ? { isActive: false } : {}),
    });

    const [items, total] = await Promise.all([
      this.prisma.userSession.findMany({
        where,
        orderBy: buildOrderBy(this.resolveSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
      }),
      this.prisma.userSession.count({ where }),
    ]);

    return createPaginatedResponse(items, createPaginationMeta(page, limit, total));
  }

  async findByUserId(userId: string, query: UserSessionQueryDto) {
    await this.relationValidation.validateForeignKeys({ userId });
    return this.findAll({ ...query, userId });
  }

  async findById(id: string) {
    return createApiResponse("User session fetched successfully", await super.findOne(id));
  }

  async createSession(dto: CreateUserSessionDto) {
    await this.relationValidation.validateForeignKeys({ userId: dto.userId });
    await this.ensureUniqueActiveSession(dto.userId, dto);

    const item = await super.create({
      ...dto,
      loginTime: new Date(),
      lastActivity: new Date(),
      isActive: true,
    });

    return createApiResponse("User session created successfully", item);
  }

  async openSession(
    userId: string,
    metadata: SessionMetadata = {},
    tx?: TransactionClient,
  ) {
    const db = tx ?? this.prisma;

    if (!tx) {
      await this.relationValidation.validateForeignKeys({ userId });
    }

    const existing = await this.findActiveSessionByDevice(userId, metadata, db);
    if (existing) {
      return db.userSession.update({
        where: { id: existing.id },
        data: {
          ...metadata,
          lastActivity: new Date(),
          loginTime: new Date(),
          logoutTime: null,
          isActive: true,
        },
      });
    }

    return db.userSession.create({
      data: {
        userId,
        deviceName: metadata.deviceName,
        deviceType: metadata.deviceType,
        browser: metadata.browser,
        os: metadata.os,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
        loginTime: new Date(),
        lastActivity: new Date(),
        isActive: true,
      },
    });
  }

  async updateSession(id: string, dto: UpdateUserSessionDto) {
    const existing = await super.findOne(id);

    if (dto.userId && dto.userId !== existing.userId) {
      await this.relationValidation.validateForeignKeys({ userId: dto.userId });
    }

    const item = await super.update(id, dto);
    return createApiResponse("User session updated successfully", item);
  }

  async deleteSession(id: string) {
    await super.findOne(id);
    const item = await this.prisma.userSession.delete({ where: { id } });
    return createApiResponse("User session deleted successfully", item);
  }

  async touchActivity(id: string, tx?: TransactionClient) {
    const db = tx ?? this.prisma;
    const item = await db.userSession.update({
      where: { id },
      data: { lastActivity: new Date() },
    });

    if (tx) {
      return item;
    }

    return createApiResponse("User session activity updated successfully", item);
  }

  async logoutSession(id: string) {
    const existing = await super.findOne(id);

    if (!existing.isActive) {
      throw new BadRequestException("Session is already logged out");
    }

    const item = await this.deactivateSession(id);
    return createApiResponse("User session logged out successfully", item);
  }

  async revokeSession(id: string) {
    await super.findOne(id);
    const item = await this.deactivateSession(id);
    return createApiResponse("User session revoked successfully", item);
  }

  async logoutAllDevices(userId: string) {
    await this.relationValidation.validateForeignKeys({ userId });

    const result = await this.prisma.$transaction(async (tx) => {
      const sessions = await tx.userSession.updateMany({
        where: { userId, isActive: true },
        data: {
          isActive: false,
          logoutTime: new Date(),
        },
      });

      const tokens = await tx.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      return { sessionCount: sessions.count, tokenCount: tokens.count };
    });

    return createApiResponse("All user sessions logged out successfully", {
      count: result.sessionCount,
      tokenCount: result.tokenCount,
    });
  }

  async logoutSessionById(sessionId: string, tx?: TransactionClient) {
    const db = tx ?? this.prisma;
    const session = await db.userSession.findUnique({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException("User session not found");
    }

    if (!session.isActive) {
      return session;
    }

    return this.deactivateSession(sessionId, db);
  }

  private async deactivateSession(id: string, db: TransactionClient | PrismaService = this.prisma) {
    return db.userSession.update({
      where: { id },
      data: {
        isActive: false,
        logoutTime: new Date(),
      },
    });
  }

  private async ensureUniqueActiveSession(userId: string, dto: CreateUserSessionDto) {
    const existing = await this.findActiveSessionByDevice(userId, dto);
    if (existing) {
      throw new ConflictException("An active session already exists for this device identifier");
    }
  }

  private async findActiveSessionByDevice(
    userId: string,
    metadata: SessionMetadata,
    db: TransactionClient | PrismaService = this.prisma,
  ) {
    const deviceName = metadata.deviceName ?? null;
    const userAgent = metadata.userAgent ?? null;
    const ipAddress = metadata.ipAddress ?? null;

    if (!deviceName && !userAgent && !ipAddress) {
      return null;
    }

    return db.userSession.findFirst({
      where: {
        userId,
        isActive: true,
        ...(deviceName ? { deviceName } : {}),
        ...(userAgent ? { userAgent } : {}),
        ...(!deviceName && !userAgent && ipAddress ? { ipAddress } : {}),
      },
    });
  }

  private filterQueryFields(filters?: Record<string, string | number | boolean>) {
    if (!filters) return filters;
    const allowed = new Set([
      "userId",
      "deviceName",
      "deviceType",
      "browser",
      "os",
      "ipAddress",
      "isActive",
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
      "deviceName",
      "deviceType",
      "browser",
      "os",
      "ipAddress",
      "loginTime",
      "lastActivity",
      "logoutTime",
      "isActive",
      "createdAt",
      "updatedAt",
    ]);
    return allowed.has(sortBy) ? sortBy : undefined;
  }
}
