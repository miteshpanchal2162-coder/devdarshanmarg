// @ts-nocheck
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { OtpPurpose } from "../../src/common/enums/otp-purpose.enum";
import { hashOtp } from "../../src/common/utils/otp-hash.util";
import { generateOtpCode } from "../../src/common/utils/otp.util";
import { PrismaService } from "../../src/database/prisma/prisma.service";
import { OtpVerificationsService } from "../../src/modules/otp-verifications/otp-verifications.service";

jest.mock("../../src/common/utils/otp.util", () => ({
  generateOtpCode: jest.fn(),
}));

describe("OtpVerificationsService", () => {
  let service: OtpVerificationsService;
  let prisma: {
    otpVerification: {
      create: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
    };
  };
  let configService: { get: jest.Mock };

  const mobile = "+919876543210";
  const purpose = OtpPurpose.LOGIN;

  beforeEach(async () => {
    prisma = {
      otpVerification: {
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        delete: jest.fn(),
      },
    };

    configService = {
      get: jest.fn((key: string) => {
        const values: Record<string, string | number> = {
          "otp.expiresIn": "5m",
          "otp.maxRetries": 5,
        };
        return values[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpVerificationsService,
        { provide: PrismaService, useValue: prisma },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get(OtpVerificationsService);
    jest.clearAllMocks();
    (generateOtpCode as jest.Mock).mockReturnValue("654321");
  });

  it("sendPublicOtp creates a hashed OTP record", async () => {
    const createdAt = new Date("2026-07-05T12:00:00.000Z");
    prisma.otpVerification.create.mockResolvedValue({
      id: "otp-1",
      mobile,
      otp: hashOtp("654321"),
      purpose,
      expireTime: new Date("2026-07-05T12:05:00.000Z"),
      retryCount: 0,
      verifiedTime: null,
      email: null,
      createdAt,
      updatedAt: createdAt,
    });

    const result = await service.sendPublicOtp(mobile, purpose);

    expect(prisma.otpVerification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        mobile,
        purpose,
        otp: hashOtp("654321"),
        retryCount: 0,
      }),
    });
    expect(result).not.toHaveProperty("otp");
    expect(result.mobile).toBe(mobile);
  });

  it("verifyPublicOtp increments retry count for invalid OTP", async () => {
    prisma.otpVerification.findFirst.mockResolvedValue({
      id: "otp-1",
      mobile,
      purpose,
      otp: hashOtp("654321"),
      expireTime: new Date("2026-07-05T13:00:00.000Z"),
      retryCount: 1,
      verifiedTime: null,
    });
    prisma.otpVerification.update.mockResolvedValue({
      id: "otp-1",
      retryCount: 2,
    });

    await expect((service as any).verifyPublicOtp(mobile, purpose, "000000")).rejects.toThrow(
      new UnauthorizedException("Invalid OTP"),
    );

    expect(prisma.otpVerification.update).toHaveBeenCalledWith({
      where: { id: "otp-1" },
      data: { retryCount: 2 },
    });
  });

  it("verifyPublicOtp marks OTP as verified on success", async () => {
    const verifiedTime = new Date("2026-07-05T12:01:00.000Z");
    prisma.otpVerification.findFirst
      .mockResolvedValueOnce({
        id: "otp-1",
        mobile,
        purpose,
        otp: hashOtp("654321"),
        expireTime: new Date("2026-07-05T13:00:00.000Z"),
        retryCount: 0,
        verifiedTime: null,
      })
      .mockResolvedValueOnce({
        id: "otp-1",
        mobile,
        purpose,
        otp: hashOtp("654321"),
        expireTime: new Date("2026-07-05T13:00:00.000Z"),
        retryCount: 0,
        verifiedTime: null,
        deletedAt: null,
      });
    prisma.otpVerification.update.mockResolvedValue({
      id: "otp-1",
      mobile,
      purpose,
      otp: hashOtp("654321"),
      expireTime: new Date("2026-07-05T13:00:00.000Z"),
      retryCount: 0,
      verifiedTime,
      email: null,
      createdAt: new Date("2026-07-05T12:00:00.000Z"),
      updatedAt: verifiedTime,
    });

    const result = await service.verifyPublicOtp(mobile, purpose, "654321");

    expect(prisma.otpVerification.update).toHaveBeenCalledWith({
      where: { id: "otp-1" },
      data: { verifiedTime: expect.any(Date) },
    });
    expect(result.verifiedTime).toEqual(verifiedTime);
    expect(result).not.toHaveProperty("otp");
  });

  it("covers admin CRUD and verification branches", async () => {
    prisma.otpVerification.findMany.mockResolvedValue([]);
    prisma.otpVerification.count.mockResolvedValue(0);
    await service.findAll({ page: 1, limit: 10, search: "999", filters: { purpose: "LOGIN" }, sortBy: "createdAt", sortOrder: "desc" });

    const otpRecord = {
      id: "otp-1",
      mobile,
      email: null,
      purpose,
      otp: hashOtp("654321"),
      expireTime: new Date("2026-07-05T13:00:00.000Z"),
      retryCount: 0,
      verifiedTime: null,
      deletedAt: null,
    };

    prisma.otpVerification.findFirst.mockResolvedValueOnce(null);
    prisma.otpVerification.create.mockResolvedValue(otpRecord);
    await service.createOtp({
      mobile,
      otp: "654321",
      purpose,
      expireTime: new Date("2026-07-05T13:00:00.000Z").toISOString(),
    });

    prisma.otpVerification.findFirst.mockResolvedValue(otpRecord);
    prisma.otpVerification.update.mockResolvedValue({ ...otpRecord, verifiedTime: new Date() });
    await service.verifyOtp("otp-1", "654321");

    prisma.otpVerification.findFirst.mockResolvedValue({ ...otpRecord, retryCount: 1 });
    prisma.otpVerification.update.mockResolvedValue({ ...otpRecord, retryCount: 2 });
    await service.incrementRetry("otp-1");

    prisma.otpVerification.findFirst.mockResolvedValue(otpRecord);
    prisma.otpVerification.delete.mockResolvedValue(otpRecord);
    await service.deleteOtp("otp-1");
  });

  it("covers public OTP error branches", async () => {
    prisma.otpVerification.findFirst.mockResolvedValue(null);
    await expect(service.verifyPublicOtp(mobile, purpose, "654321")).rejects.toThrow(
      "OTP not found or expired",
    );

    prisma.otpVerification.findFirst.mockResolvedValue({
      id: "otp-1",
      mobile,
      purpose,
      otp: hashOtp("654321"),
      expireTime: new Date("2026-07-05T13:00:00.000Z"),
      retryCount: 5,
      verifiedTime: null,
    });
    await expect(service.verifyPublicOtp(mobile, purpose, "654321")).rejects.toThrow(
      "Maximum OTP verification attempts exceeded",
    );
  });

  it("covers update and admin conflict branches", async () => {
    const otpRecord = {
      id: "otp-1",
      mobile,
      email: null,
      purpose,
      otp: hashOtp("654321"),
      expireTime: new Date("2026-07-05T13:00:00.000Z"),
      retryCount: 0,
      verifiedTime: new Date(),
      deletedAt: null,
    };
    prisma.otpVerification.findFirst.mockResolvedValue(otpRecord);
    await expect(service.updateOtp("otp-1", { mobile })).rejects.toThrow(
      "Verified OTP records cannot be updated",
    );

    prisma.otpVerification.findFirst.mockResolvedValue({ ...otpRecord, verifiedTime: null });
    prisma.otpVerification.update.mockResolvedValue({ ...otpRecord, verifiedTime: null });
    await service.updateOtp("otp-1", { otp: "123456" });
  });
});
