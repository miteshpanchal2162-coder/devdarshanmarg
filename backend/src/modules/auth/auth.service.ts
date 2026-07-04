import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, type JwtSignOptions } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { createHash } from "crypto";
import { PrismaService } from "../../database/prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(dto: LoginDto) {
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

    await this.prisma.user.update({
      data: { lastLoginAt: new Date() },
      where: { id: user.id },
    });

    const tokens = await this.issueTokens(user.id, user.email, user.role);

    return {
      message: "Login successful",
      data: {
        user: this.toProfile(user),
        ...tokens,
      },
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const tokenHash = this.hashToken(dto.refreshToken);
    const existing = await this.prisma.refreshToken.findUnique({
      where: { refreshToken: tokenHash },
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

    await this.prisma.refreshToken.update({
      data: { revokedAt: new Date() },
      where: { id: existing.id },
    });

    const tokens = await this.issueTokens(
      existing.user.id,
      existing.user.email,
      existing.user.role,
    );

    return {
      message: "Token refreshed",
      data: tokens,
    };
  }

  async logout(dto: RefreshTokenDto) {
    await this.prisma.refreshToken.updateMany({
      data: { revokedAt: new Date() },
      where: {
        refreshToken: this.hashToken(dto.refreshToken),
        revokedAt: null,
      },
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

  private async issueTokens(userId: string, email: string, role: string) {
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

    await this.prisma.refreshToken.create({
      data: {
        expiresAt: this.refreshExpiresAt(),
        refreshToken: this.hashToken(refreshToken),
        userId,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  private refreshExpiresAt() {
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
