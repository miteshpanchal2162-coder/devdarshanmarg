import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateFestivalRitualDto,
  FestivalRitualQueryDto,
  FestivalRitualResponseDto,
  UpdateFestivalRitualDto,
  UpdateFestivalRitualStatusDto,
} from "./dto/festival-ritual.dto";
import { FestivalRitualsService } from "./festival-rituals.service";

@ApiTags("Festival Rituals")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("festivals/:festivalId/rituals")
export class FestivalRitualsController {
  constructor(private readonly service: FestivalRitualsService) {}

  @Get()
  @ApiOperation({ summary: "List festival rituals" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiPaginatedResponse(FestivalRitualResponseDto)
  findAll(@Param("festivalId") festivalId: string, @Query() query: FestivalRitualQueryDto) {
    return this.service.findByFestival(festivalId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get festival ritual by ID" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("festivalId") festivalId: string, @Param("id") id: string) {
    return this.service.findChildById(festivalId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create festival ritual" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiBody({ type: CreateFestivalRitualDto })
  create(
    @Param("festivalId") festivalId: string,
    @Body() dto: CreateFestivalRitualDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(festivalId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update festival ritual" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalRitualDto })
  update(
    @Param("festivalId") festivalId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFestivalRitualDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(festivalId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete festival ritual" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("festivalId") festivalId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(festivalId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore festival ritual" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("festivalId") festivalId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(festivalId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update festival ritual status" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalRitualStatusDto })
  updateStatus(
    @Param("festivalId") festivalId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFestivalRitualStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(festivalId, id, dto.status, request.user.id);
  }
}
