import { Module } from "@nestjs/common";
import { UserNotificationPreferencesController } from "./user-notification-preferences.controller";
import { UserNotificationPreferencesService } from "./user-notification-preferences.service";

@Module({
  controllers: [UserNotificationPreferencesController],
  providers: [UserNotificationPreferencesService],
  exports: [UserNotificationPreferencesService],
})
export class UserNotificationPreferencesModule {}
