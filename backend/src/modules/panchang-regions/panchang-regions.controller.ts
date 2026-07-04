import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreatePanchangRegionDto,
  PanchangRegionQueryDto,
  PanchangRegionResponseDto,
  UpdatePanchangRegionDto,
  UpdatePanchangRegionStatusDto,
} from "./dto/panchang-region.dto";
import { PanchangRegionsService } from "./panchang-regions.service";

@ApiTags("Panchang Regions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/regions")
export class PanchangRegionsController {
  constructor(private readonly service: PanchangRegionsService) {}

  @Get()
  @ApiOperation({ summary: "List panchang regions" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiPaginatedResponse(PanchangRegionResponseDto)
  findAll(@Param("panchangId") panchangId: string, @Query() query: PanchangRegionQueryDto) {
    return this.service.findByPanchang(panchangId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get panchang region by ID" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("panchangId") panchangId: string, @Param("id") id: string) {
    return this.service.findChildById(panchangId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create panchang region" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiBody({ type: CreatePanchangRegionDto })
  create(
    @Param("panchangId") panchangId: string,
    @Body() dto: CreatePanchangRegionDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(panchangId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update panchang region" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePanchangRegionDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("id") id: string,
    @Body() dto: UpdatePanchangRegionDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(panchangId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete panchang region" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("panchangId") panchangId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(panchangId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update panchang region status" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePanchangRegionStatusDto })
  updateStatus(
    @Param("panchangId") panchangId: string,
    @Param("id") id: string,
    @Body() dto: UpdatePanchangRegionStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(panchangId, id, dto.status, request.user.id);
  }
}
