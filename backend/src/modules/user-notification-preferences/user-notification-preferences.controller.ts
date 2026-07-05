import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CreateUserNotificationPreferenceDto } from "./dto/user-notification-preference.dto";
import { UpdateUserNotificationPreferenceDto } from "./dto/update-user-notification-preference.dto";
import { UserNotificationPreferenceResponseDto } from "./dto/user-notification-preference-response.dto";
import { UserNotificationPreferencesService } from "./user-notification-preferences.service";

@ApiTags("User Notification Preferences")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("users/:userId/notification-preferences")
export class UserNotificationPreferencesController {
  constructor(private readonly service: UserNotificationPreferencesService) {}

  @Get()
  @ApiOperation({ summary: "Get user notification preferences" })
  @ApiParam({ name: "userId", type: String })
  findByUserId(@Param("userId") userId: string) {
    return this.service.findByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: "Create user notification preferences" })
  @ApiParam({ name: "userId", type: String })
  @ApiBody({ type: CreateUserNotificationPreferenceDto })
  create(@Param("userId") userId: string, @Body() dto: CreateUserNotificationPreferenceDto) {
    return this.service.createPreference(userId, dto);
  }

  @Patch()
  @ApiOperation({ summary: "Update user notification preferences" })
  @ApiParam({ name: "userId", type: String })
  @ApiBody({ type: UpdateUserNotificationPreferenceDto })
  update(@Param("userId") userId: string, @Body() dto: UpdateUserNotificationPreferenceDto) {
    return this.service.updatePreference(userId, dto);
  }

  @Delete()
  @ApiOperation({ summary: "Delete user notification preferences" })
  @ApiParam({ name: "userId", type: String })
  remove(@Param("userId") userId: string) {
    return this.service.deletePreference(userId);
  }
}
