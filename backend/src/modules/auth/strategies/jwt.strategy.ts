import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../../database/prisma/prisma.service";

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("auth.jwtAccessSecret"),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findFirst({
      where: {
        deletedAt: null,
        id: payload.sub,
        status: "ACTIVE",
      },
      select: {
        email: true,
        fullName: true,
        id: true,
        mobile: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid access token");
    }

    return user;
  }
}
