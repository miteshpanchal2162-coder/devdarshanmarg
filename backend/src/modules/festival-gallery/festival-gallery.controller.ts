import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateFestivalGalleryDto,
  FestivalGalleryQueryDto,
  FestivalGalleryResponseDto,
  UpdateFestivalGalleryDto,
  UpdateFestivalGalleryStatusDto,
} from "./dto/festival-gallery.dto";
import { FestivalGalleryService } from "./festival-gallery.service";

@ApiTags("Festival Gallery")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("festivals/:festivalId/gallery")
export class FestivalGalleryController {
  constructor(private readonly service: FestivalGalleryService) {}

  @Get()
  @ApiOperation({ summary: "List festival gallery items" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiPaginatedResponse(FestivalGalleryResponseDto)
  findAll(@Param("festivalId") festivalId: string, @Query() query: FestivalGalleryQueryDto) {
    return this.service.findByFestival(festivalId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get festival gallery item by ID" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("festivalId") festivalId: string, @Param("id") id: string) {
    return this.service.findChildById(festivalId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create festival gallery item" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiBody({ type: CreateFestivalGalleryDto })
  create(
    @Param("festivalId") festivalId: string,
    @Body() dto: CreateFestivalGalleryDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createChild(festivalId, dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update festival gallery item" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalGalleryDto })
  update(
    @Param("festivalId") festivalId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFestivalGalleryDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChild(festivalId, id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete festival gallery item" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  remove(@Param("festivalId") festivalId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteChild(festivalId, id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore festival gallery item" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  restore(@Param("festivalId") festivalId: string, @Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreChild(festivalId, id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update festival gallery item status" })
  @ApiParam({ name: "festivalId", type: String })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateFestivalGalleryStatusDto })
  updateStatus(
    @Param("festivalId") festivalId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFestivalGalleryStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateChildStatus(festivalId, id, dto.status, request.user.id);
  }
}
