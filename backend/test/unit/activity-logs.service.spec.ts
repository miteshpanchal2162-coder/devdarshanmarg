// @ts-nocheck
import { Test, TestingModule } from "@nestjs/testing";
import { RelationValidationService } from "../../src/common/services/relation-validation.service";
import { hashOtp } from "../../src/common/utils/otp-hash.util";
import { PrismaService } from "../../src/database/prisma/prisma.service";
import { ActivityLogsService } from "../../src/modules/activity-logs/activity-logs.service";

describe("ActivityLogsService", () => {
  let service: ActivityLogsService;
  let prisma: {
    activityLog: {
      create: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
    };
  };
  let relationValidation: { validateForeignKeys: jest.Mock };

  beforeEach(async () => {
    prisma = {
      activityLog: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    relationValidation = { validateForeignKeys: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogsService,
        { provide: PrismaService, useValue: prisma },
        { provide: RelationValidationService, useValue: relationValidation },
      ],
    }).compile();

    service = module.get(ActivityLogsService);
    jest.clearAllMocks();
  });

  it("recordActivity swallows errors", async () => {
    prisma.activityLog.create.mockRejectedValue(new Error("database unavailable"));

    await expect(
      service.recordActivity({
        action: "LOGIN",
        entityType: "User",
        userId: "user-1",
      }),
    ).resolves.toBeUndefined();
  });

  it("createLog returns activity data without leaking hashed OTP values", async () => {
    const createdLog = {
      id: "log-1",
      userId: "user-1",
      action: "OTP VERIFY",
      entityType: "OtpVerification",
      entityId: "otp-1",
      details: { otpHash: hashOtp("123456") },
      ipAddress: "127.0.0.1",
      createdAt: new Date("2026-07-05T12:00:00.000Z"),
      updatedAt: new Date("2026-07-05T12:00:00.000Z"),
    };

    prisma.activityLog.create.mockResolvedValue(createdLog);

    const result = await service.createLog({
      userId: "user-1",
      action: "OTP VERIFY",
      entityType: "OtpVerification",
      entityId: "otp-1",
      details: { otpHash: hashOtp("123456") },
      ipAddress: "127.0.0.1",
    });

    expect(relationValidation.validateForeignKeys).toHaveBeenCalledWith({ userId: "user-1" });
    expect(result.message).toBe("Activity log created successfully");
    expect(result.data).toEqual(createdLog);
    expect(result.data).not.toHaveProperty("otp");
  });

  it("findAll applies filters and date ranges", async () => {
    prisma.activityLog.findMany.mockResolvedValue([]);
    prisma.activityLog.count.mockResolvedValue(0);

    await service.findAll({
      page: 1,
      limit: 10,
      search: "LOGIN",
      userId: "user-1",
      action: "LOGIN",
      entityType: "User",
      createdFrom: "2026-07-01",
      createdTo: "2026-07-05",
      filters: { action: "LOGIN", unknown: "x" },
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    expect(prisma.activityLog.findMany).toHaveBeenCalled();
  });

  it("findById returns a log entry", async () => {
    prisma.activityLog.findFirst.mockResolvedValue({
      id: "log-1",
      userId: "user-1",
      action: "LOGIN",
      entityType: "User",
      deletedAt: null,
    });
    await service.findById("log-1");
  });

  it("recordActivity persists successful logs", async () => {
    prisma.activityLog.create.mockResolvedValue({ id: "log-1" });
    await service.recordActivity({
      userId: "user-1",
      action: "LOGIN",
      entityType: "User",
      entityId: "user-1",
    });
    expect(prisma.activityLog.create).toHaveBeenCalled();
  });

  it("createLog works without userId", async () => {
    prisma.activityLog.create.mockResolvedValue({ id: "log-2", action: "SYSTEM" });
    await service.createLog({
      action: "SYSTEM",
      entityType: "System",
    });
    expect(relationValidation.validateForeignKeys).not.toHaveBeenCalled();
  });
});
