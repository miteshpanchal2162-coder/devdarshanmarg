import { Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { UserSessionQueryDto } from "./dto/user-session.dto";
import { UserSessionResponseDto } from "./dto/user-session-response.dto";
import { UserSessionsService } from "./user-sessions.service";

@ApiTags("User Sessions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("users/:userId/sessions")
export class UserSessionsByUserController {
  constructor(private readonly service: UserSessionsService) {}

  @Get()
  @ApiOperation({ summary: "List sessions for a user" })
  @ApiParam({ name: "userId", type: String })
  @ApiPaginatedResponse(UserSessionResponseDto)
  findByUserId(@Param("userId") userId: string, @Query() query: UserSessionQueryDto) {
    return this.service.findByUserId(userId, query);
  }

  @Patch("logout-all")
  @ApiOperation({ summary: "Logout all devices for a user" })
  @ApiParam({ name: "userId", type: String })
  logoutAll(@Param("userId") userId: string) {
    return this.service.logoutAllDevices(userId);
  }
}
