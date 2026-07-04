import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateFestivalMantraDto,
  FestivalMantraQueryDto,
  FestivalMantraResponseDto,
  UpdateFestivalMantraDto,
  UpdateFestivalMantraStatusDto,
} from "./dto/festival-mantra.dto";
import { FestivalMantrasService } from "./festival-mantras.service";

@ApiTags("Festival Mantras")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("festivals/:festivalId/mantras")
export class FestivalMantrasController {
  constructor(private readonly service: FestivalMantrasService) {}

  @Get()
  @ApiOperation({ summary: "List festival mantras" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiPaginatedResponse(FestivalMantraResponseDto)
  findAll(@Param("festivalId") festivalId: string, @Query() query: FestivalMantraQueryDto) {
    return this.service.findByFestival(festivalId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get festival mantra by ID" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("festivalId") festivalId: string, @Param("id") id: string) {
    return this.service.findChildById(festivalId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create festival mantra" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiBody({ type: CreateFestivalMantraDto })
  create(
    @Param("festivalId") festivalId: string,
    @Body() dto: CreateFestivalMantraDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(festivalId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update festival mantra" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalMantraDto })
  update(
    @Param("festivalId") festivalId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFestivalMantraDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(festivalId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete festival mantra" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("festivalId") festivalId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(festivalId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore festival mantra" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("festivalId") festivalId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(festivalId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update festival mantra status" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalMantraStatusDto })
  updateStatus(
    @Param("festivalId") festivalId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFestivalMantraStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(festivalId, id, dto.status, request.user.id);
  }
}
