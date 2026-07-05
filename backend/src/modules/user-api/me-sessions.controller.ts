import { Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { UserSessionQueryDto } from "../user-sessions/dto/user-session.dto";
import { UserSessionsService } from "../user-sessions/user-sessions.service";

@ApiTags("Me - Sessions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller("me/sessions")
export class MeSessionsController {
  constructor(private readonly sessionsService: UserSessionsService) {}

  @Get()
  @ApiOperation({ summary: "List current user sessions" })
  findAll(@Req() request: { user: AuthUser }, @Query() query: UserSessionQueryDto) {
    return this.sessionsService.findByUserId(request.user.id, query);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Logout a specific session for current user" })
  @ApiParam({ name: "id", type: String })
  remove(@Req() request: { user: AuthUser }, @Param("id") id: string) {
    return this.sessionsService.logoutSessionForUser(request.user.id, id);
  }
}

@ApiTags("Me - Account")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller("me")
export class MeAccountController {
  constructor(private readonly sessionsService: UserSessionsService) {}

  @Post("logout-all")
  @ApiOperation({ summary: "Logout all sessions for current user" })
  logoutAll(@Req() request: { user: AuthUser }) {
    return this.sessionsService.logoutAllDevices(request.user.id);
  }
}
