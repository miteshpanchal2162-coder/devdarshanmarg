// @ts-nocheck
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { createHash } from "crypto";
import { RelationValidationService } from "../../src/common/services/relation-validation.service";
import { PrismaService } from "../../src/database/prisma/prisma.service";
import { RefreshTokensService } from "../../src/modules/refresh-tokens/refresh-tokens.service";

describe("RefreshTokensService", () => {
  let service: RefreshTokensService;
  let prisma: {
    refreshToken: {
      updateMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };
  let relationValidation: { validateForeignKeys: jest.Mock };
  let jwtService: { verifyAsync: jest.Mock };
  let configService: { get: jest.Mock; getOrThrow: jest.Mock };

  beforeEach(async () => {
    prisma = {
      refreshToken: {
        updateMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    relationValidation = { validateForeignKeys: jest.fn().mockResolvedValue(undefined) };
    jwtService = { verifyAsync: jest.fn() };
    configService = {
      get: jest.fn(() => "7d"),
      getOrThrow: jest.fn(() => "test-refresh-secret-minimum-32-characters"),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokensService,
        { provide: PrismaService, useValue: prisma },
        { provide: RelationValidationService, useValue: relationValidation },
        { provide: ConfigService, useValue: configService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(RefreshTokensService);
    jest.clearAllMocks();
  });

  it("hashToken returns sha256 hex digest", () => {
    const token = "raw-refresh-token";
    const expected = createHash("sha256").update(token).digest("hex");

    expect(service.hashToken(token)).toBe(expected);
  });

  it("revokeAllUserTokens revokes active tokens for a user", async () => {
    prisma.refreshToken.updateMany.mockResolvedValue({ count: 2 });

    const result = await service.revokeAllUserTokens("user-1");

    expect(relationValidation.validateForeignKeys).toHaveBeenCalledWith({ userId: "user-1" });
    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { userId: "user-1", revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
    expect(result).toEqual(
      expect.objectContaining({
        data: { count: 2 },
      }),
    );
  });

  it("rotateToken throws UnauthorizedException for invalid token", async () => {
    jwtService.verifyAsync.mockResolvedValue(undefined);
    prisma.refreshToken.findUnique.mockResolvedValue(null);

    await expect((service as any).rotateToken("invalid-token")).rejects.toThrow(
      new UnauthorizedException("Invalid refresh token"),
    );
  });

  it("covers token listing, storage, and revocation branches", async () => {
    prisma.refreshToken.findMany.mockResolvedValue([]);
    prisma.refreshToken.count.mockResolvedValue(0);
    await service.findAll({
      page: 1,
      limit: 10,
      search: "device",
      userId: "user-1",
      isRevoked: false,
      isExpired: false,
      filters: { userId: "user-1" },
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    jwtService.verifyAsync.mockResolvedValue({ sub: "user-1" });
    prisma.refreshToken.findUnique.mockResolvedValue({
      id: "token-1",
      userId: "user-1",
      refreshToken: service.hashToken("raw-token"),
      revokedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      user: { id: "user-1", deletedAt: null, status: "ACTIVE" },
    });
    await service.validateActiveToken("raw-token");

    prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    prisma.refreshToken.create.mockResolvedValue({ id: "token-2" });
    await service.storeToken("user-1", "raw-token", "session-1");

    prisma.refreshToken.findFirst.mockResolvedValue({
      id: "token-1",
      userId: "user-1",
      revokedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
    });
    prisma.refreshToken.update.mockResolvedValue({
      id: "token-1",
      userId: "user-1",
      revokedAt: new Date(),
    });
    await service.revokeToken("token-1");

    prisma.refreshToken.findUnique.mockResolvedValue({ id: "token-1", deviceInfo: "session-1" });
    await service.revokeByRawToken("raw-token");

    configService.get.mockReturnValueOnce("invalid");
    expect(service.refreshExpiresAt().getTime()).toBeGreaterThan(Date.now());
  });
});
