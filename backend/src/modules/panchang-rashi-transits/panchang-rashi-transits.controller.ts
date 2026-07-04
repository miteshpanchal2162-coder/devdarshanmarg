import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreatePanchangRashiTransitDto,
  PanchangRashiTransitQueryDto,
  PanchangRashiTransitResponseDto,
  UpdatePanchangRashiTransitDto,
} from "./dto/panchang-rashi-transit.dto";
import { PanchangRashiTransitsService } from "./panchang-rashi-transits.service";

@ApiTags("Panchang Rashi Transits")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/dates/:panchangDateId/rashi-transits")
export class PanchangRashiTransitsController {
  constructor(private readonly service: PanchangRashiTransitsService) {}

  @Get()
  @ApiOperation({ summary: "List panchang rashi transits" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiPaginatedResponse(PanchangRashiTransitResponseDto)
  findAll(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Query() query: PanchangRashiTransitQueryDto,
  ) {
    return this.service.findByPanchangDate(panchangId, panchangDateId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get panchang rashi transit by ID" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Param("id") id: string,
  ) {
    return this.service.findChildById(panchangId, panchangDateId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create panchang rashi transit" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: CreatePanchangRashiTransitDto })
  create(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: CreatePanchangRashiTransitDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(panchangId, panchangDateId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update panchang rashi transit" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdatePanchangRashiTransitDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Param("id") id: string,
    @Body() dto: UpdatePanchangRashiTransitDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(panchangId, panchangDateId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete panchang rashi transit" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Param("id") id: string,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.deleteChild(panchangId, panchangDateId, id, request.user.id);
  }
}
