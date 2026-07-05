import { PartialType } from "@nestjs/swagger";
import { CreateUserNotificationPreferenceDto } from "./user-notification-preference.dto";

export class UpdateUserNotificationPreferenceDto extends PartialType(
  CreateUserNotificationPreferenceDto,
) {}
