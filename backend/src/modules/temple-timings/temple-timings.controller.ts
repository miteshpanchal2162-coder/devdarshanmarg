import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { CreateTempleTimingDto, TempleTimingQueryDto, TempleTimingResponseDto, UpdateTempleTimingDto, UpdateTempleTimingStatusDto } from "./dto/temple-timing.dto";
import { TempleTimingsService } from "./temple-timings.service";

@ApiTags("Temple Timings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("temples/:templeId/timings")
export class TempleTimingsController {
  constructor(private readonly service: TempleTimingsService) {}

  @Get()
  @ApiOperation({ summary: "List temple timings" })
  @ApiParam({ name: "templeId", type: String })
  @ApiPaginatedResponse(TempleTimingResponseDto)
  findAll(@Param("templeId") templeId: string, @Query() query: TempleTimingQueryDto) {
    return this.service.findByTemple(templeId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get temple timing by ID" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("templeId") templeId: string, @Param("id") id: string) {
    return this.service.findChildById(templeId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create temple timing" })
  @ApiParam({ name: "templeId", type: String })
  @ApiBody({ type: CreateTempleTimingDto })
  create(@Param("templeId") templeId: string, @Body() dto: CreateTempleTimingDto, @Req() request: { user: AuthUser }) {
    return this.service.createChild(templeId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update temple timing" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateTempleTimingDto })
  update(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleTimingDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChild(templeId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete temple timing" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(templeId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore temple timing" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("templeId") templeId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(templeId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update temple timing status" })
  @ApiParam({ name: "templeId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateTempleTimingStatusDto })
  updateStatus(@Param("templeId") templeId: string, @Param("id") id: string, @Body() dto: UpdateTempleTimingStatusDto, @Req() request: { user: AuthUser }) {
    return this.service.updateChildStatus(templeId, id, dto.status, request.user.id);
  }
}
