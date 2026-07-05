import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { MeUpdateProfileDto } from "./dto/me-body.dto";
import { MeProfileService } from "./me-profile.service";

@ApiTags("Me - Profile")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller("me")
export class MeProfileController {
  constructor(private readonly service: MeProfileService) {}

  @Get()
  @ApiOperation({ summary: "Get current user profile" })
  getProfile(@Req() request: { user: AuthUser }) {
    return this.service.getProfile(request.user.id);
  }

  @Patch()
  @ApiOperation({ summary: "Update current user profile" })
  @ApiBody({ type: MeUpdateProfileDto })
  updateProfile(@Req() request: { user: AuthUser }, @Body() dto: MeUpdateProfileDto) {
    return this.service.updateProfile(request.user.id, dto);
  }
}
