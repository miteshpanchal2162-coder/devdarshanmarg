import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Prisma, RefreshToken, User } from "@prisma/client";
import { createHash } from "crypto";
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
  CreateRefreshTokenRecordDto,
  RefreshTokenQueryDto,
} from "./dto/refresh-token.dto";
import { UpdateRefreshTokenRecordDto } from "./dto/update-refresh-token.dto";

type ValidRefreshToken = RefreshToken & { user: User };
type TransactionClient = Prisma.TransactionClient;

@Injectable()
export class RefreshTokensService extends BaseCrudService<RefreshToken> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super(
      prisma.refreshToken,
      ["deviceInfo"],
      ["expiresAt", "revokedAt", "createdAt", "updatedAt"],
      ["userId"],
    );
  }

  async findAll(query: RefreshTokenQueryDto) {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.buildWhere({
      ...buildSearchFilter(query.search, ["deviceInfo"]),
      ...buildFieldFilters(this.filterQueryFields(query.filters)),
      ...(query.userId ? { userId: query.userId } : {}),
      ...this.buildTokenFilters(query),
    });

    const [items, total] = await Promise.all([
      this.prisma.refreshToken.findMany({
        where,
        orderBy: buildOrderBy(this.resolveSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
      }),
      this.prisma.refreshToken.count({ where }),
    ]);

    return createPaginatedResponse(
      items.map((item) => this.toResponse(item)),
      createPaginationMeta(page, limit, total),
    );
  }

  async findByUserId(userId: string, query: RefreshTokenQueryDto) {
    await this.relationValidation.validateForeignKeys({ userId });
    return this.findAll({ ...query, userId });
  }

  async findById(id: string) {
    const item = await super.findOne(id);
    return createApiResponse("Refresh token fetched successfully", this.toResponse(item));
  }

  async createTokenRecord(dto: CreateRefreshTokenRecordDto) {
    await this.relationValidation.validateForeignKeys({ userId: dto.userId });
    this.validateExpiryDate(dto.expiresAt);
    await this.ensureNoDuplicateActiveToken(dto.userId, dto.deviceInfo);

    const item = await super.create({
      userId: dto.userId,
      refreshToken: this.hashToken(dto.refreshToken),
      expiresAt: new Date(dto.expiresAt),
      deviceInfo: dto.deviceInfo,
    });

    return createApiResponse("Refresh token created successfully", this.toResponse(item));
  }

  async storeToken(
    userId: string,
    rawToken: string,
    deviceInfo?: string,
    tx?: TransactionClient,
  ) {
    const db = tx ?? this.prisma;

    if (!tx) {
      await this.relationValidation.validateForeignKeys({ userId });
    }

    await this.revokeActiveTokensForDevice(userId, deviceInfo, db);

    return db.refreshToken.create({
      data: {
        userId,
        refreshToken: this.hashToken(rawToken),
        expiresAt: this.refreshExpiresAt(),
        deviceInfo,
      },
    });
  }

  async updateTokenRecord(id: string, dto: UpdateRefreshTokenRecordDto) {
    const existing = await super.findOne(id);

    if (existing.revokedAt) {
      throw new ConflictException("Revoked refresh tokens cannot be updated");
    }

    if (dto.userId && dto.userId !== existing.userId) {
      await this.relationValidation.validateForeignKeys({ userId: dto.userId });
    }

    if (dto.expiresAt) {
      this.validateExpiryDate(dto.expiresAt);
    }

    const item = await super.update(id, {
      ...dto,
      ...(dto.refreshToken ? { refreshToken: this.hashToken(dto.refreshToken) } : {}),
      ...(dto.expiresAt ? { expiresAt: new Date(dto.expiresAt) } : {}),
    });

    return createApiResponse("Refresh token updated successfully", this.toResponse(item));
  }

  async deleteTokenRecord(id: string) {
    await super.findOne(id);
    const item = await this.prisma.refreshToken.delete({ where: { id } });
    return createApiResponse("Refresh token deleted successfully", this.toResponse(item));
  }

  async verifyRefreshJwt(rawToken: string) {
    try {
      await this.jwtService.verifyAsync(rawToken, {
        secret: this.configService.getOrThrow<string>("auth.jwtRefreshSecret"),
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async validateActiveToken(rawToken: string): Promise<ValidRefreshToken> {
    await this.verifyRefreshJwt(rawToken);

    const existing = await this.prisma.refreshToken.findUnique({
      where: { refreshToken: this.hashToken(rawToken) },
      include: { user: true },
    });

    if (
      !existing ||
      existing.revokedAt ||
      existing.expiresAt <= new Date() ||
      existing.user.deletedAt ||
      existing.user.status !== "ACTIVE"
    ) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    return existing;
  }

  async rotateToken(rawToken: string, tx?: TransactionClient) {
    await this.verifyRefreshJwt(rawToken);

    const db = tx ?? this.prisma;
    const existing = await db.refreshToken.findUnique({
      where: { refreshToken: this.hashToken(rawToken) },
      include: { user: true },
    });

    if (
      !existing ||
      existing.revokedAt ||
      existing.expiresAt <= new Date() ||
      existing.user.deletedAt ||
      existing.user.status !== "ACTIVE"
    ) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const revoked = await db.refreshToken.updateMany({
      where: { id: existing.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    if (revoked.count === 0) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    return existing;
  }

  async revokeToken(id: string) {
    const existing = await super.findOne(id);

    if (existing.revokedAt) {
      throw new BadRequestException("Refresh token is already revoked");
    }

    const item = await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });

    return createApiResponse("Refresh token revoked successfully", this.toResponse(item));
  }

  async revokeByRawToken(rawToken: string, tx?: TransactionClient) {
    const db = tx ?? this.prisma;
    const tokenHash = this.hashToken(rawToken);

    const result = await db.refreshToken.updateMany({
      where: {
        refreshToken: tokenHash,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    return result.count > 0
      ? await db.refreshToken.findUnique({
          where: { refreshToken: tokenHash },
        })
      : null;
  }

  async revokeAllUserTokens(userId: string, tx?: TransactionClient) {
    if (!tx) {
      await this.relationValidation.validateForeignKeys({ userId });
    }

    const db = tx ?? this.prisma;
    const result = await db.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    if (tx) {
      return result.count;
    }

    return createApiResponse("All user refresh tokens revoked successfully", {
      count: result.count,
    });
  }

  hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  refreshExpiresAt() {
    const value = this.configService.get<string>("auth.jwtRefreshExpiresIn") ?? "7d";
    const match = value.match(/^(\d+)([dhms])$/);
    const amount = match ? Number(match[1]) : 7;
    const unit = match?.[2] ?? "d";
    const multipliers = {
      d: 24 * 60 * 60 * 1000,
      h: 60 * 60 * 1000,
      m: 60 * 1000,
      s: 1000,
    };

    return new Date(Date.now() + amount * multipliers[unit as keyof typeof multipliers]);
  }

  private async ensureNoDuplicateActiveToken(userId: string, deviceInfo?: string) {
    const existing = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
        ...(deviceInfo ? { deviceInfo } : {}),
      },
    });

    if (existing) {
      throw new ConflictException("An active refresh token already exists for this user/device");
    }
  }

  private async revokeActiveTokensForDevice(
    userId: string,
    deviceInfo?: string,
    db: TransactionClient | PrismaService = this.prisma,
  ) {
    await db.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
        ...(deviceInfo ? { deviceInfo } : {}),
      },
      data: { revokedAt: new Date() },
    });
  }

  private buildTokenFilters(query: RefreshTokenQueryDto) {
    const filters: Record<string, unknown> = {};

    if (query.isRevoked === true) {
      filters.revokedAt = { not: null };
    } else if (query.isRevoked === false) {
      filters.revokedAt = null;
    }

    if (query.isExpired === true) {
      filters.expiresAt = { lt: new Date() };
    } else if (query.isExpired === false) {
      filters.expiresAt = { gte: new Date() };
    }

    return filters;
  }

  private validateExpiryDate(expiresAt: string) {
    if (new Date(expiresAt) <= new Date()) {
      throw new BadRequestException("Token expiry must be in the future");
    }
  }

  private toResponse(item: RefreshToken) {
    return {
      ...item,
      refreshToken: "[redacted]",
    };
  }

  private filterQueryFields(filters?: Record<string, string | number | boolean>) {
    if (!filters) return filters;
    const allowed = new Set(["userId"]);
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
    const allowed = new Set(["expiresAt", "revokedAt", "createdAt", "updatedAt"]);
    return allowed.has(sortBy) ? sortBy : undefined;
  }
}
