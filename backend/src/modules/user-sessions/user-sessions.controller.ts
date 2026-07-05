import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CreateUserSessionDto, UserSessionQueryDto } from "./dto/user-session.dto";
import { UpdateUserSessionDto } from "./dto/update-user-session.dto";
import { UserSessionResponseDto } from "./dto/user-session-response.dto";
import { UserSessionsService } from "./user-sessions.service";

@ApiTags("User Sessions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("user-sessions")
export class UserSessionsController {
  constructor(private readonly service: UserSessionsService) {}

  @Get()
  @ApiOperation({ summary: "List user sessions" })
  @ApiPaginatedResponse(UserSessionResponseDto)
  findAll(@Query() query: UserSessionQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user session by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create user session" })
  @ApiBody({ type: CreateUserSessionDto })
  create(@Body() dto: CreateUserSessionDto) {
    return this.service.createSession(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user session" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateUserSessionDto })
  update(@Param("id") id: string, @Body() dto: UpdateUserSessionDto) {
    return this.service.updateSession(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete user session" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string) {
    return this.service.deleteSession(id);
  }

  @Patch(":id/activity")
  @ApiOperation({ summary: "Update session last activity" })
  @ApiParam({ name: "id", type: String })
  touchActivity(@Param("id") id: string) {
    return this.service.touchActivity(id);
  }

  @Patch(":id/logout")
  @ApiOperation({ summary: "Logout user session" })
  @ApiParam({ name: "id", type: String })
  logout(@Param("id") id: string) {
    return this.service.logoutSession(id);
  }

  @Patch(":id/revoke")
  @ApiOperation({ summary: "Revoke user session" })
  @ApiParam({ name: "id", type: String })
  revoke(@Param("id") id: string) {
    return this.service.revokeSession(id);
  }
}
