import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateFestivalAartiDto,
  FestivalAartiQueryDto,
  FestivalAartiResponseDto,
  UpdateFestivalAartiDto,
  UpdateFestivalAartiStatusDto,
} from "./dto/festival-aarti.dto";
import { FestivalAartisService } from "./festival-aartis.service";

@ApiTags("Festival Aartis")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("festivals/:festivalId/aartis")
export class FestivalAartisController {
  constructor(private readonly service: FestivalAartisService) {}

  @Get()
  @ApiOperation({ summary: "List festival aartis" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiPaginatedResponse(FestivalAartiResponseDto)
  findAll(@Param("festivalId") festivalId: string, @Query() query: FestivalAartiQueryDto) {
    return this.service.findByFestival(festivalId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get festival aarti by ID" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("festivalId") festivalId: string, @Param("id") id: string) {
    return this.service.findChildById(festivalId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create festival aarti" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiBody({ type: CreateFestivalAartiDto })
  create(
    @Param("festivalId") festivalId: string,
    @Body() dto: CreateFestivalAartiDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(festivalId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update festival aarti" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalAartiDto })
  update(
    @Param("festivalId") festivalId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFestivalAartiDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(festivalId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete festival aarti" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("festivalId") festivalId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(festivalId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore festival aarti" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("festivalId") festivalId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(festivalId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update festival aarti status" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalAartiStatusDto })
  updateStatus(
    @Param("festivalId") festivalId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFestivalAartiStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(festivalId, id, dto.status, request.user.id);
  }
}
