import { Module } from "@nestjs/common";
import { UserSessionsByUserController } from "./user-sessions-by-user.controller";
import { UserSessionsController } from "./user-sessions.controller";
import { UserSessionsService } from "./user-sessions.service";

@Module({
  controllers: [UserSessionsController, UserSessionsByUserController],
  providers: [UserSessionsService],
  exports: [UserSessionsService],
})
export class UserSessionsModule {}
