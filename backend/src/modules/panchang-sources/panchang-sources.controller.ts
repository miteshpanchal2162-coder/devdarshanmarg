import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreatePanchangSourceDto,
  PanchangSourceQueryDto,
  PanchangSourceResponseDto,
  UpdatePanchangSourceDto,
  UpdatePanchangSourceStatusDto,
} from "./dto/panchang-source.dto";
import { PanchangSourcesService } from "./panchang-sources.service";

@ApiTags("Panchang Sources")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/sources")
export class PanchangSourcesController {
  constructor(private readonly service: PanchangSourcesService) {}

  @Get()
  @ApiOperation({ summary: "List panchang sources" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiPaginatedResponse(PanchangSourceResponseDto)
  findAll(@Param("panchangId") panchangId: string, @Query() query: PanchangSourceQueryDto) {
    return this.service.findByPanchang(panchangId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get panchang source by ID" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("panchangId") panchangId: string, @Param("id") id: string) {
    return this.service.findChildById(panchangId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create panchang source" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiBody({ type: CreatePanchangSourceDto })
  create(
    @Param("panchangId") panchangId: string,
    @Body() dto: CreatePanchangSourceDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(panchangId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update panchang source" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePanchangSourceDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("id") id: string,
    @Body() dto: UpdatePanchangSourceDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(panchangId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete panchang source" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("panchangId") panchangId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(panchangId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore panchang source" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("panchangId") panchangId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(panchangId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update panchang source status" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePanchangSourceStatusDto })
  updateStatus(
    @Param("panchangId") panchangId: string,
    @Param("id") id: string,
    @Body() dto: UpdatePanchangSourceStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(panchangId, id, dto.status, request.user.id);
  }
}
