import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, type JwtSignOptions } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { OtpPurpose } from "../../common/enums/otp-purpose.enum";
import { buildActivityDetails } from "../../common/utils/activity-log.util";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ActivityLogsService } from "../activity-logs/activity-logs.service";
import { OtpVerificationsService } from "../otp-verifications/otp-verifications.service";
import { RefreshTokensService } from "../refresh-tokens/refresh-tokens.service";
import { SessionMetadata } from "../user-sessions/dto/user-session.dto";
import { UserSessionsService } from "../user-sessions/user-sessions.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { SendOtpDto } from "./dto/send-otp.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userSessionsService: UserSessionsService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly otpVerificationsService: OtpVerificationsService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async login(dto: LoginDto, metadata: SessionMetadata = {}) {
    const user = await this.prisma.user.findFirst({
      where: {
        deletedAt: null,
        status: "ACTIVE",
        OR: [{ email: dto.identifier }, { mobile: dto.identifier }],
      },
    });

    if (!user || !(await compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tokens = await this.signTokens(user.id, user.email, user.role);

    const session = await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        data: { lastLoginAt: new Date() },
        where: { id: user.id },
      });

      const createdSession = await this.userSessionsService.openSession(user.id, metadata, tx);
      await this.refreshTokensService.storeToken(
        user.id,
        tokens.refreshToken,
        createdSession.id,
        tx,
      );

      return createdSession;
    });

    return {
      message: "Login successful",
      data: {
        user: this.toProfile(user),
        sessionId: session.id,
        ...tokens,
      },
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const { tokens } = await this.prisma.$transaction(async (tx) => {
      const rotated = await this.refreshTokensService.rotateToken(dto.refreshToken, tx);
      const nextTokens = await this.signTokens(
        rotated.user.id,
        rotated.user.email,
        rotated.user.role,
      );

      await this.refreshTokensService.storeToken(
        rotated.user.id,
        nextTokens.refreshToken,
        rotated.deviceInfo ?? undefined,
        tx,
      );

      if (rotated.deviceInfo) {
        await this.userSessionsService.touchActivity(rotated.deviceInfo, tx);
      }

      return { tokens: nextTokens };
    });

    return {
      message: "Token refreshed",
      data: tokens,
    };
  }

  async logout(dto: RefreshTokenDto) {
    await this.prisma.$transaction(async (tx) => {
      const revoked = await this.refreshTokensService.revokeByRawToken(dto.refreshToken, tx);

      if (revoked?.deviceInfo) {
        await this.userSessionsService.logoutSessionById(revoked.deviceInfo, tx);
      }
    });

    return {
      message: "Logout successful",
      data: null,
    };
  }

  async profile(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        deletedAt: null,
        id: userId,
        status: "ACTIVE",
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return {
      message: "Profile fetched",
      data: this.toProfile(user),
    };
  }

  async sendOtp(dto: SendOtpDto) {
    await this.validateOtpPurposeContext(dto.mobile, dto.purpose);

    const otpRecord = await this.otpVerificationsService.sendPublicOtp(
      dto.mobile,
      dto.purpose,
    );

    return {
      message: "OTP sent successfully",
      data: {
        mobile: dto.mobile,
        purpose: dto.purpose,
        expireTime: otpRecord.expireTime,
      },
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const verified = await this.otpVerificationsService.verifyPublicOtp(
      dto.mobile,
      dto.purpose,
      dto.otp,
    );

    const token = await this.signVerificationToken({
      otpId: verified.id,
      mobile: dto.mobile,
      purpose: dto.purpose,
    });

    return {
      message: "OTP verified successfully",
      data: {
        mobile: dto.mobile,
        purpose: dto.purpose,
        verificationToken: token.verificationToken,
        expiresIn: token.expiresIn,
      },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.findActiveUserByMobile(dto.mobile);

    if (user) {
      await this.otpVerificationsService.sendPublicOtp(
        dto.mobile,
        OtpPurpose.RESET_PASSWORD,
      );
    }

    return {
      message: "If the mobile number is registered, an OTP has been sent",
      data: null,
    };
  }

  async resetPassword(
    dto: ResetPasswordDto,
    metadata: SessionMetadata = {},
  ) {
    const tokenPayload = await this.verifyVerificationToken(dto.verificationToken);

    if (tokenPayload.purpose !== OtpPurpose.RESET_PASSWORD) {
      throw new UnauthorizedException("Invalid verification token purpose");
    }

    await this.otpVerificationsService.findVerifiedPublicOtp(
      tokenPayload.otpId,
      tokenPayload.mobile,
      OtpPurpose.RESET_PASSWORD,
    );

    const user = await this.findActiveUserByMobile(tokenPayload.mobile);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { passwordHash: await hash(dto.newPassword, 12) },
      });

      await tx.otpVerification.delete({ where: { id: tokenPayload.otpId } });

      await tx.refreshToken.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      await tx.userSession.updateMany({
        where: { userId: user.id, isActive: true },
        data: {
          isActive: false,
          logoutTime: new Date(),
        },
      });
    });

    await this.activityLogsService.recordActivity({
      userId: user.id,
      action: "PASSWORD CHANGE",
      entityType: "User",
      entityId: user.id,
      ipAddress: metadata.ipAddress,
      details: buildActivityDetails({
        method: "POST",
        path: "/auth/reset-password",
        userAgent: metadata.userAgent,
      }),
    });

    return {
      message: "Password reset successfully",
      data: null,
    };
  }

  private async validateOtpPurposeContext(mobile: string, purpose: OtpPurpose) {
    const user = await this.findActiveUserByMobile(mobile);

    if (purpose === OtpPurpose.LOGIN && !user) {
      throw new NotFoundException("User not found");
    }

    if (purpose === OtpPurpose.REGISTER && user) {
      throw new UnauthorizedException("Mobile number is already registered");
    }

    if (purpose === OtpPurpose.RESET_PASSWORD && !user) {
      throw new NotFoundException("User not found");
    }
  }

  private async findActiveUserByMobile(mobile: string) {
    return this.prisma.user.findFirst({
      where: {
        mobile,
        deletedAt: null,
        status: "ACTIVE",
      },
    });
  }

  private async signVerificationToken(input: {
    mobile: string;
    otpId: string;
    purpose: OtpPurpose;
  }) {
    const expiresIn = this.configService.get<string>(
      "otp.verificationTokenExpiresIn",
    ) as JwtSignOptions["expiresIn"];

    const verificationToken = await this.jwtService.signAsync(
      {
        sub: input.otpId,
        mobile: input.mobile,
        purpose: input.purpose,
        type: "otp_verification",
      },
      {
        expiresIn,
        secret: this.configService.getOrThrow<string>("auth.jwtAccessSecret"),
      },
    );

    return {
      verificationToken,
      expiresIn: this.configService.get<string>("otp.verificationTokenExpiresIn") ?? "10m",
    };
  }

  private async verifyVerificationToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        mobile?: string;
        purpose?: OtpPurpose;
        sub?: string;
        type?: string;
      }>(token, {
        secret: this.configService.getOrThrow<string>("auth.jwtAccessSecret"),
      });

      if (
        payload.type !== "otp_verification" ||
        !payload.sub ||
        !payload.mobile ||
        !payload.purpose
      ) {
        throw new UnauthorizedException("Invalid verification token");
      }

      return {
        otpId: payload.sub,
        mobile: payload.mobile,
        purpose: payload.purpose,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException("Invalid or expired verification token");
    }
  }

  private async signTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessExpiresIn = this.configService.get<string>(
      "auth.jwtAccessExpiresIn",
    ) as JwtSignOptions["expiresIn"];
    const refreshExpiresIn = this.configService.get<string>(
      "auth.jwtRefreshExpiresIn",
    ) as JwtSignOptions["expiresIn"];
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: accessExpiresIn,
      secret: this.configService.getOrThrow<string>("auth.jwtAccessSecret"),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: refreshExpiresIn,
      secret: this.configService.getOrThrow<string>("auth.jwtRefreshSecret"),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private toProfile(user: {
    email: string;
    emailVerified: boolean;
    fullName: string;
    id: string;
    mobile: string;
    mobileVerified: boolean;
    profileImage: string | null;
    role: string;
    status: string;
  }) {
    return {
      email: user.email,
      emailVerified: user.emailVerified,
      fullName: user.fullName,
      id: user.id,
      mobile: user.mobile,
      mobileVerified: user.mobileVerified,
      profileImage: user.profileImage,
      role: user.role,
      status: user.status,
    };
  }
}
