import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { MeNotificationPreferencesService } from "./me-notification-preferences.service";
import { MeUpdateNotificationPreferencesDto } from "./dto/me-body.dto";

@ApiTags("Me - Notification Preferences")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller("me/notification-preferences")
export class MeNotificationPreferencesController {
  constructor(private readonly service: MeNotificationPreferencesService) {}

  @Get()
  @ApiOperation({ summary: "Get current user notification preferences" })
  getPreferences(@Req() request: { user: AuthUser }) {
    return this.service.getPreferences(request.user.id);
  }

  @Patch()
  @ApiOperation({ summary: "Update current user notification preferences" })
  @ApiBody({ type: MeUpdateNotificationPreferencesDto })
  updatePreferences(
    @Req() request: { user: AuthUser },
    @Body() dto: MeUpdateNotificationPreferencesDto,
  ) {
    return this.service.updatePreferences(request.user.id, dto);
  }
}
