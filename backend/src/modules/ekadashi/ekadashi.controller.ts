import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateEkadashiDto,
  EkadashiQueryDto,
  EkadashiResponseDto,
  UpdateEkadashiDto,
  UpdateEkadashiStatusDto,
} from "./dto/ekadashi.dto";
import { EkadashiService } from "./ekadashi.service";

@ApiTags("Ekadashi")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/dates/:panchangDateId/ekadashi")
export class EkadashiController {
  constructor(private readonly service: EkadashiService) {}

  @Get()
  @ApiOperation({ summary: "List ekadashi entries" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiPaginatedResponse(EkadashiResponseDto)
  findAll(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Query() query: EkadashiQueryDto,
  ) {
    return this.service.findByPanchangDate(panchangId, panchangDateId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get ekadashi by ID" })
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
  @ApiOperation({ summary: "Create ekadashi" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: CreateEkadashiDto })
  create(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: CreateEkadashiDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(panchangId, panchangDateId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update ekadashi" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateEkadashiDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Param("id") id: string,
    @Body() dto: UpdateEkadashiDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(panchangId, panchangDateId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete ekadashi" })
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

  @Patch(":id/status")
  @ApiOperation({ summary: "Update ekadashi status" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateEkadashiStatusDto })
  updateStatus(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Param("id") id: string,
    @Body() dto: UpdateEkadashiStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(panchangId, panchangDateId, id, dto.status, request.user.id);
  }
}
