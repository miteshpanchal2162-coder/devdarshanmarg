import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { CreateTempleLiveDarshanDto, TempleLiveDarshanQueryDto, TempleLiveDarshanResponseDto, UpdateTempleLiveDarshanDto, UpdateTempleLiveDarshanStatusDto } from "./dto/temple-live-darshan.dto";
import { TempleLiveDarshanService } from "./temple-live-darshan.service";

@ApiTags("Temple Live Darshan")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("temples/:templeId/live-darshan")
export class TempleLiveDarshanController {
  constructor(private readonly service: TempleLiveDarshanService) {}

  @Get()
  @ApiOperation({ summary: "List temple live darshan streams" })
  @ApiParam({ name: "templeId", type: String })
  @ApiPaginatedResponse(TempleLiveDarshanResponseDto)
  findAll(@Param("templeId") templeId: string, @Query() query: TempleLiveDarshanQueryDto) {
    return this.service.findByTemple(templeId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get temple live darshan stream by ID" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("templeId") templeId: string, @Param("id") id: string) {
    return this.service.findChildById(templeId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create temple live darshan stream" })
  @ApiParam({ name: "templeId", type: String })
  @ApiBody({ type: CreateTempleLiveDarshanDto })
  create(@Param("templeId") templeId: string, @Body() dto: CreateTempleLiveDarshanDto, @Req() request: { user: AuthUser }) {
    return this.service.createChild(templeId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update temple live darshan stream" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateTempleLiveDarshanDto })
  update(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleLiveDarshanDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChild(templeId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete temple live darshan stream" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(templeId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore temple live darshan stream" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(templeId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update temple live darshan stream status" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateTempleLiveDarshanStatusDto })
  updateStatus(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleLiveDarshanStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChildStatus(templeId, id, dto.status, request.user.id);
  }
}
