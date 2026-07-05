import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { compare, hash } from "bcrypt";
import { OtpPurpose } from "../../src/common/enums/otp-purpose.enum";
import { PrismaService } from "../../src/database/prisma/prisma.service";
import { ActivityLogsService } from "../../src/modules/activity-logs/activity-logs.service";
import { OtpVerificationsService } from "../../src/modules/otp-verifications/otp-verifications.service";
import { RefreshTokensService } from "../../src/modules/refresh-tokens/refresh-tokens.service";
import { UserSessionsService } from "../../src/modules/user-sessions/user-sessions.service";
import { AuthService } from "../../src/modules/auth/auth.service";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe("AuthService", () => {
  let service: AuthService;
  let prisma: {
    user: { findFirst: jest.Mock; update: jest.Mock };
    $transaction: jest.Mock;
    otpVerification: { delete: jest.Mock };
    refreshToken: { updateMany: jest.Mock };
    userSession: { updateMany: jest.Mock };
  };
  let jwtService: { signAsync: jest.Mock; verifyAsync: jest.Mock };
  let configService: { get: jest.Mock; getOrThrow: jest.Mock };
  let refreshTokensService: {
    storeToken: jest.Mock;
    rotateToken: jest.Mock;
    revokeByRawToken: jest.Mock;
  };
  let userSessionsService: {
    openSession: jest.Mock;
    touchActivity: jest.Mock;
    logoutSessionById: jest.Mock;
  };
  let otpVerificationsService: {
    sendPublicOtp: jest.Mock;
    verifyPublicOtp: jest.Mock;
    findVerifiedPublicOtp: jest.Mock;
  };
  let activityLogsService: { recordActivity: jest.Mock };

  const activeUser = {
    id: "user-1",
    email: "user@example.com",
    mobile: "+919876543210",
    passwordHash: "hashed-password",
    role: "USER",
    status: "ACTIVE",
    fullName: "Test User",
    emailVerified: true,
    mobileVerified: true,
    profileImage: null,
    deletedAt: null,
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(async (callback) => callback(prisma)),
      otpVerification: { delete: jest.fn() },
      refreshToken: { updateMany: jest.fn() },
      userSession: { updateMany: jest.fn() },
    };

    jwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    configService = {
      get: jest.fn((key: string) => {
        const values: Record<string, string> = {
          "auth.jwtAccessExpiresIn": "15m",
          "auth.jwtRefreshExpiresIn": "7d",
          "otp.verificationTokenExpiresIn": "10m",
        };
        return values[key];
      }),
      getOrThrow: jest.fn((key: string) => {
        const values: Record<string, string> = {
          "auth.jwtAccessSecret": "test-access-secret-minimum-32-characters",
          "auth.jwtRefreshSecret": "test-refresh-secret-minimum-32-characters",
        };
        return values[key];
      }),
    };

    refreshTokensService = {
      storeToken: jest.fn(),
      rotateToken: jest.fn(),
      revokeByRawToken: jest.fn(),
    };
    userSessionsService = {
      openSession: jest.fn(),
      touchActivity: jest.fn(),
      logoutSessionById: jest.fn(),
    };
    otpVerificationsService = {
      sendPublicOtp: jest.fn(),
      verifyPublicOtp: jest.fn(),
      findVerifiedPublicOtp: jest.fn(),
    };
    activityLogsService = { recordActivity: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: UserSessionsService, useValue: userSessionsService },
        { provide: RefreshTokensService, useValue: refreshTokensService },
        { provide: OtpVerificationsService, useValue: otpVerificationsService },
        { provide: ActivityLogsService, useValue: activityLogsService },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  it("login throws for invalid credentials", async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    await expect(
      service.login({ identifier: "user@example.com", password: "wrong" }),
    ).rejects.toThrow(new UnauthorizedException("Invalid credentials"));
  });

  it("profile throws when user is not found", async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    await expect((service as any).profile("missing-user")).rejects.toThrow(
      new UnauthorizedException("User not found"),
    );
  });

  it("sendOtp delegates to otp service", async () => {
    prisma.user.findFirst.mockResolvedValue(activeUser);
    otpVerificationsService.sendPublicOtp.mockResolvedValue({
      id: "otp-1",
      mobile: activeUser.mobile,
      purpose: OtpPurpose.LOGIN,
      expireTime: new Date("2026-07-05T13:00:00.000Z"),
    });

    const result = await service.sendOtp({
      mobile: activeUser.mobile,
      purpose: OtpPurpose.LOGIN,
    });

    expect(otpVerificationsService.sendPublicOtp).toHaveBeenCalledWith(
      activeUser.mobile,
      OtpPurpose.LOGIN,
    );
    expect(result.message).toBe("OTP sent successfully");
    expect(result.data?.expireTime).toEqual(new Date("2026-07-05T13:00:00.000Z"));
  });

  it("verifyOtp returns verificationToken", async () => {
    otpVerificationsService.verifyPublicOtp.mockResolvedValue({ id: "otp-1" });
    jwtService.signAsync.mockResolvedValue("verification-token");

    const result = await service.verifyOtp({
      mobile: activeUser.mobile,
      purpose: OtpPurpose.LOGIN,
      otp: "123456",
    });

    expect(result.data?.verificationToken).toBe("verification-token");
    expect(result.data?.expiresIn).toBe("10m");
  });

  it("forgotPassword returns generic message when user is missing", async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    const result = await service.forgotPassword({ mobile: "+919999999999" });

    expect(result.message).toBe("If the mobile number is registered, an OTP has been sent");
    expect(otpVerificationsService.sendPublicOtp).not.toHaveBeenCalled();
  });

  it("login succeeds with valid credentials", async () => {
    prisma.user.findFirst.mockResolvedValue(activeUser);
    (compare as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValueOnce("access-token").mockResolvedValueOnce("refresh-token");
    userSessionsService.openSession.mockResolvedValue({ id: "session-1" });

    const result = await service.login(
      { identifier: activeUser.email, password: "Password123!" },
      { ipAddress: "127.0.0.1", userAgent: "jest" },
    );

    expect(result.message).toBe("Login successful");
    expect(result.data?.accessToken).toBe("access-token");
    expect(userSessionsService.openSession).toHaveBeenCalled();
  });

  it("refresh rotates tokens and touches session activity", async () => {
    refreshTokensService.rotateToken.mockResolvedValue({
      user: activeUser,
      deviceInfo: "session-1",
    });
    userSessionsService.touchActivity.mockResolvedValue(undefined);
    jwtService.signAsync.mockResolvedValueOnce("access-token").mockResolvedValueOnce("refresh-token");

    const result = await service.refresh({ refreshToken: "refresh-token" });

    expect(result.message).toBe("Token refreshed");
    expect(userSessionsService.touchActivity).toHaveBeenCalledWith("session-1", prisma);
  });

  it("logout revokes refresh token and session", async () => {
    refreshTokensService.revokeByRawToken.mockResolvedValue({ deviceInfo: "session-1" });
    userSessionsService.logoutSessionById.mockResolvedValue(undefined);

    const result = await service.logout({ refreshToken: "refresh-token" });

    expect(result.message).toBe("Logout successful");
    expect(userSessionsService.logoutSessionById).toHaveBeenCalledWith("session-1", prisma);
  });

  it("profile returns active user profile", async () => {
    prisma.user.findFirst.mockResolvedValue(activeUser);

    const result = await service.profile(activeUser.id);

    expect(result.message).toBe("Profile fetched");
    expect(result.data?.id).toBe(activeUser.id);
  });

  it("sendOtp rejects register when mobile already exists", async () => {
    prisma.user.findFirst.mockResolvedValue(activeUser);

    await expect(
      service.sendOtp({ mobile: activeUser.mobile, purpose: OtpPurpose.REGISTER }),
    ).rejects.toThrow(new UnauthorizedException("Mobile number is already registered"));
  });

  it("forgotPassword sends otp when user exists", async () => {
    prisma.user.findFirst.mockResolvedValue(activeUser);
    otpVerificationsService.sendPublicOtp.mockResolvedValue({ id: "otp-1" });

    const result = await service.forgotPassword({ mobile: activeUser.mobile });

    expect(result.message).toBe("If the mobile number is registered, an OTP has been sent");
    expect(otpVerificationsService.sendPublicOtp).toHaveBeenCalled();
  });

  it("resetPassword rejects invalid verification token purpose", async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: "otp-1",
      mobile: activeUser.mobile,
      purpose: OtpPurpose.LOGIN,
      type: "otp_verification",
    });

    await expect(
      service.resetPassword({ verificationToken: "bad-token", newPassword: "NewPassword123!" }),
    ).rejects.toThrow(new UnauthorizedException("Invalid verification token purpose"));
  });

  it("resetPassword updates password and revokes sessions", async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: "otp-1",
      mobile: activeUser.mobile,
      purpose: OtpPurpose.RESET_PASSWORD,
      type: "otp_verification",
    });
    otpVerificationsService.findVerifiedPublicOtp.mockResolvedValue({ id: "otp-1" });
    prisma.user.findFirst.mockResolvedValue(activeUser);
    (hash as jest.Mock).mockResolvedValue("new-hash");

    const result = await service.resetPassword({
      verificationToken: "valid-token",
      newPassword: "NewPassword123!",
    });

    expect(result.message).toBe("Password reset successfully");
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: activeUser.id },
      data: { passwordHash: "new-hash" },
    });
    expect(prisma.otpVerification.delete).toHaveBeenCalledWith({ where: { id: "otp-1" } });
    expect(prisma.refreshToken.updateMany).toHaveBeenCalled();
    expect(prisma.userSession.updateMany).toHaveBeenCalled();
    expect(activityLogsService.recordActivity).toHaveBeenCalled();
  });
});
