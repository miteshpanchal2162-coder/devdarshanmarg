import { Injectable } from "@nestjs/common";
import { UpdateUserNotificationPreferenceDto } from "../user-notification-preferences/dto/update-user-notification-preference.dto";
import { UserNotificationPreferencesService } from "../user-notification-preferences/user-notification-preferences.service";

@Injectable()
export class MeNotificationPreferencesService {
  constructor(private readonly preferencesService: UserNotificationPreferencesService) {}

  getPreferences(userId: string) {
    return this.preferencesService.findByUserId(userId);
  }

  updatePreferences(userId: string, dto: UpdateUserNotificationPreferenceDto) {
    return this.preferencesService.updatePreference(userId, dto);
  }
}
