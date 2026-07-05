import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { OtpVerificationsModule } from "../otp-verifications/otp-verifications.module";
import { ActivityLogsModule } from "../activity-logs/activity-logs.module";
import { RefreshTokensModule } from "../refresh-tokens/refresh-tokens.module";
import { UserSessionsModule } from "../user-sessions/user-sessions.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    UserSessionsModule,
    RefreshTokensModule,
    OtpVerificationsModule,
    ActivityLogsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
