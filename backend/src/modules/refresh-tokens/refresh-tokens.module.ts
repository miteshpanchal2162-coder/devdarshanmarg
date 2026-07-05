import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { RefreshTokensByUserController } from "./refresh-tokens-by-user.controller";
import { RefreshTokensController } from "./refresh-tokens.controller";
import { RefreshTokensService } from "./refresh-tokens.service";

@Module({
  imports: [JwtModule.register({})],
  controllers: [RefreshTokensController, RefreshTokensByUserController],
  providers: [RefreshTokensService],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
