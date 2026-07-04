import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateFestivalVideoDto,
  FestivalVideoQueryDto,
  FestivalVideoResponseDto,
  UpdateFestivalVideoDto,
  UpdateFestivalVideoStatusDto,
} from "./dto/festival-video.dto";
import { FestivalVideosService } from "./festival-videos.service";

@ApiTags("Festival Videos")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("festivals/:festivalId/videos")
export class FestivalVideosController {
  constructor(private readonly service: FestivalVideosService) {}

  @Get()
  @ApiOperation({ summary: "List festival videos" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiPaginatedResponse(FestivalVideoResponseDto)
  findAll(@Param("festivalId") festivalId: string, @Query() query: FestivalVideoQueryDto) {
    return this.service.findByFestival(festivalId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get festival video by ID" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("festivalId") festivalId: string, @Param("id") id: string) {
    return this.service.findChildById(festivalId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create festival video" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiBody({ type: CreateFestivalVideoDto })
  create(
    @Param("festivalId") festivalId: string,
    @Body() dto: CreateFestivalVideoDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(festivalId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update festival video" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalVideoDto })
  update(
    @Param("festivalId") festivalId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFestivalVideoDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(festivalId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete festival video" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("festivalId") festivalId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(festivalId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore festival video" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("festivalId") festivalId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(festivalId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update festival video status" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalVideoStatusDto })
  updateStatus(
    @Param("festivalId") festivalId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFestivalVideoStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(festivalId, id, dto.status, request.user.id);
  }
}
