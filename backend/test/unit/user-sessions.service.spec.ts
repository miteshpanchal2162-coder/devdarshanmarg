// @ts-nocheck
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { RelationValidationService } from "../../src/common/services/relation-validation.service";
import { PrismaService } from "../../src/database/prisma/prisma.service";
import { UserSessionsService } from "../../src/modules/user-sessions/user-sessions.service";

describe("UserSessionsService", () => {
  let service: UserSessionsService;
  let prisma: {
    userSession: {
      updateMany: jest.Mock;
      update: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
    refreshToken: { updateMany: jest.Mock };
    $transaction: jest.Mock;
  };
  let relationValidation: { validateForeignKeys: jest.Mock };

  beforeEach(async () => {
    prisma = {
      userSession: {
        updateMany: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
      refreshToken: { updateMany: jest.fn() },
      $transaction: jest.fn(async (callback) =>
        callback({
          userSession: prisma.userSession,
          refreshToken: prisma.refreshToken,
        }),
      ),
    };

    relationValidation = { validateForeignKeys: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSessionsService,
        { provide: PrismaService, useValue: prisma },
        { provide: RelationValidationService, useValue: relationValidation },
      ],
    }).compile();

    service = module.get(UserSessionsService);
    jest.clearAllMocks();
  });

  it("logoutAllDevices revokes sessions and refresh tokens", async () => {
    prisma.userSession.updateMany.mockResolvedValue({ count: 2 });
    prisma.refreshToken.updateMany.mockResolvedValue({ count: 3 });

    const result = await service.logoutAllDevices("user-1");

    expect(relationValidation.validateForeignKeys).toHaveBeenCalledWith({ userId: "user-1" });
    expect(prisma.userSession.updateMany).toHaveBeenCalledWith({
      where: { userId: "user-1", isActive: true },
      data: {
        isActive: false,
        logoutTime: expect.any(Date),
      },
    });
    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { userId: "user-1", revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
    expect(result.data).toEqual({ count: 2, tokenCount: 3 });
  });

  it("logoutSession throws when session is already logged out", async () => {
    prisma.userSession.findFirst.mockResolvedValue({
      id: "session-1",
      userId: "user-1",
      isActive: false,
    });

    await expect((service as any).logoutSession("session-1")).rejects.toThrow(
      new BadRequestException("Session is already logged out"),
    );
  });

  it("covers session lifecycle branches", async () => {
    prisma.userSession.findMany.mockResolvedValue([]);
    prisma.userSession.count.mockResolvedValue(0);
    await service.findAll({
      page: 1,
      limit: 10,
      search: "chrome",
      userId: "user-1",
      isActive: true,
      filters: { deviceType: "mobile" },
      sortBy: "loginTime",
      sortOrder: "desc",
    });

    prisma.userSession.findFirst.mockResolvedValue(null);
    prisma.userSession.create.mockResolvedValue({ id: "session-1", userId: "user-1", isActive: true });
    await service.openSession("user-1", { ipAddress: "127.0.0.1", userAgent: "jest" });

    prisma.userSession.findFirst.mockResolvedValue({ id: "session-1", userId: "user-1", isActive: true });
    prisma.userSession.update.mockResolvedValue({ id: "session-1", userId: "user-1", isActive: true });
    await service.openSession("user-1", { ipAddress: "127.0.0.1" });

    prisma.userSession.findFirst.mockResolvedValue({ id: "session-1", deletedAt: null, isActive: true, userId: "user-1" });
    prisma.userSession.update.mockResolvedValue({ id: "session-1", isActive: false });
    await service.touchActivity("session-1");
    await service.revokeSession("session-1");

    prisma.userSession.findUnique.mockResolvedValue({ id: "session-1", isActive: true });
    prisma.userSession.update.mockResolvedValue({ id: "session-1", isActive: false });
    await service.logoutSessionById("session-1");

    prisma.userSession.findUnique.mockResolvedValue({ id: "session-2", isActive: false });
    await service.logoutSessionById("session-2");

    prisma.userSession.findFirst.mockResolvedValue({ id: "session-3", userId: "user-1", isActive: true });
    await expect(
      service.createSession({
        userId: "user-1",
        deviceName: "phone",
        ipAddress: "127.0.0.1",
      }),
    ).rejects.toThrow("An active session already exists for this device identifier");
  });
});
